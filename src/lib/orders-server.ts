import { prisma } from "@/lib/prisma";
import type { AdminOrder, AdminOrderStatus } from "@/lib/admin-store";

class OrdersDbError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "OrdersDbError";
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

function wrap(action: string, err: unknown): never {
  console.error(`Orders DB ${action} failed:`, err);
  throw new OrdersDbError(
    `Could not ${action}: Postgres is required (set DATABASE_URL).`,
    { cause: err }
  );
}

function toAdminOrder(row: {
  orderCode: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  createdAt: Date;
  notes: string | null;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string | null;
  }[];
}): AdminOrder {
  return {
    id: row.orderCode,
    customerName: row.customerName || "Customer",
    customerEmail: row.customerEmail || "",
    phone: row.phone,
    address: row.address,
    total: row.total,
    status: row.status as AdminOrderStatus,
    createdAt: row.createdAt.toISOString(),
    notes: row.notes || undefined,
    items: row.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      image: i.image || undefined,
    })),
  };
}

async function ensureCustomerUser(order: AdminOrder): Promise<string | null> {
  const emailRaw = order.customerEmail?.trim().toLowerCase();
  const phone = order.phone?.trim();
  const email =
    emailRaw ||
    (phone ? `guest-${phone.replace(/\D/g, "")}@orders.rnsareehandlooms.com` : "");
  if (!email) return null;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: order.customerName || existing.name,
        phone: phone || existing.phone,
      },
    });
    return existing.id;
  }

  const created = await prisma.user.create({
    data: {
      name: order.customerName || "Customer",
      email,
      password: `guest:${crypto.randomUUID()}`,
      phone: phone || null,
      role: "customer",
    },
  });
  return created.id;
}

export async function listOrders(): Promise<AdminOrder[]> {
  try {
    const rows = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toAdminOrder);
  } catch (err) {
    wrap("list orders", err);
  }
}

export async function getOrderByCode(
  orderCode: string
): Promise<AdminOrder | null> {
  try {
    const row = await prisma.order.findUnique({
      where: { orderCode },
      include: { items: true },
    });
    return row ? toAdminOrder(row) : null;
  } catch (err) {
    wrap("look up order", err);
  }
}

export async function upsertOrderDb(order: AdminOrder): Promise<AdminOrder> {
  try {
    const userId = await ensureCustomerUser(order);
    const existing = await prisma.order.findUnique({
      where: { orderCode: order.id },
      include: { items: true },
    });

    if (existing) {
      await prisma.orderItem.deleteMany({ where: { orderId: existing.id } });
      const updated = await prisma.order.update({
        where: { id: existing.id },
        data: {
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          phone: order.phone,
          address: order.address,
          total: order.total,
          status: order.status,
          notes: order.notes || null,
          userId,
          items: {
            create: order.items.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price,
              image: i.image || null,
            })),
          },
        },
        include: { items: true },
      });
      return toAdminOrder(updated);
    }

    const created = await prisma.order.create({
      data: {
        orderCode: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        phone: order.phone,
        address: order.address,
        total: order.total,
        status: order.status,
        notes: order.notes || null,
        userId,
        createdAt: order.createdAt ? new Date(order.createdAt) : undefined,
        items: {
          create: order.items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            image: i.image || null,
          })),
        },
      },
      include: { items: true },
    });
    return toAdminOrder(created);
  } catch (err) {
    wrap("save order", err);
  }
}

export async function updateOrderStatusDb(
  orderCode: string,
  status: AdminOrderStatus
): Promise<AdminOrder | null> {
  try {
    const existing = await prisma.order.findUnique({
      where: { orderCode },
    });
    if (!existing) return null;
    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: { status },
      include: { items: true },
    });
    return toAdminOrder(updated);
  } catch (err) {
    wrap("update order status", err);
  }
}

export type AdminCustomer = {
  key: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  lastOrder: string;
};

export async function listCustomers(): Promise<AdminCustomer[]> {
  try {
    const [users, orders] = await Promise.all([
      prisma.user.findMany({
        where: { role: "customer" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const map = new Map<string, AdminCustomer>();

    for (const o of orders) {
      const key = (
        o.customerEmail ||
        o.phone ||
        o.orderCode
      ).toLowerCase();
      const existing = map.get(key);
      const spentAdd = o.status === "cancelled" ? 0 : o.total;
      if (existing) {
        existing.orders += 1;
        existing.spent += spentAdd;
        if (new Date(o.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = o.createdAt.toISOString();
          existing.phone = o.phone || existing.phone;
          existing.name = o.customerName || existing.name;
        }
      } else {
        map.set(key, {
          key,
          name: o.customerName || "Customer",
          email: o.customerEmail || "",
          phone: o.phone,
          orders: 1,
          spent: spentAdd,
          lastOrder: o.createdAt.toISOString(),
        });
      }
    }

    for (const u of users) {
      const key = u.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.name = u.name || existing.name;
        existing.phone = u.phone || existing.phone;
        existing.email = u.email;
      } else {
        map.set(key, {
          key,
          name: u.name,
          email: u.email,
          phone: u.phone || "—",
          orders: 0,
          spent: 0,
          lastOrder: "—",
        });
      }
    }

    return [...map.values()].sort((a, b) => b.spent - a.spent);
  } catch (err) {
    wrap("list customers", err);
  }
}
