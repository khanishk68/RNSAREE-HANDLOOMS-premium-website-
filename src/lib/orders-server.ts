import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import type { AdminOrder, AdminOrderStatus } from "@/lib/admin-store";

const ordersPath = path.join(process.cwd(), "data", "orders.json");

type OrdersFile = {
  orders: AdminOrder[];
  updatedAt: string | null;
};

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

async function readOrdersFile(): Promise<OrdersFile> {
  try {
    const raw = await fs.readFile(ordersPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<OrdersFile>;
    return {
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return { orders: [], updatedAt: null };
  }
}

async function writeOrdersFile(orders: AdminOrder[]): Promise<OrdersFile> {
  const next: OrdersFile = {
    orders,
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(ordersPath), { recursive: true });
  await fs.writeFile(ordersPath, JSON.stringify(next, null, 2), "utf8");
  return next;
}

async function listOrdersDb(): Promise<AdminOrder[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toAdminOrder);
}

async function getOrderByCodeDb(orderCode: string): Promise<AdminOrder | null> {
  const row = await prisma.order.findUnique({
    where: { orderCode },
    include: { items: true },
  });
  return row ? toAdminOrder(row) : null;
}

async function upsertOrderDbOnly(order: AdminOrder): Promise<AdminOrder> {
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
}

async function updateOrderStatusDbOnly(
  orderCode: string,
  status: AdminOrderStatus
): Promise<AdminOrder | null> {
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
}

/** Prefer Postgres; fall back to data/orders.json when DB is unreachable. */
export async function listOrders(): Promise<AdminOrder[]> {
  try {
    return await listOrdersDb();
  } catch (err) {
    console.warn("Orders DB unavailable, using file store:", err);
    const file = await readOrdersFile();
    return [...file.orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export async function getOrderByCode(
  orderCode: string
): Promise<AdminOrder | null> {
  try {
    const fromDb = await getOrderByCodeDb(orderCode);
    if (fromDb) return fromDb;
  } catch (err) {
    console.warn("Orders DB unavailable for lookup, using file store:", err);
  }

  const file = await readOrdersFile();
  return (
    file.orders.find(
      (o) => o.id.toLowerCase() === orderCode.toLowerCase()
    ) ?? null
  );
}

export async function upsertOrderDb(order: AdminOrder): Promise<AdminOrder> {
  try {
    return await upsertOrderDbOnly(order);
  } catch (err) {
    console.warn("Orders DB save failed, writing to file store:", err);
    const file = await readOrdersFile();
    const idx = file.orders.findIndex((o) => o.id === order.id);
    const next = [...file.orders];
    if (idx >= 0) next[idx] = order;
    else next.unshift(order);
    await writeOrdersFile(next);
    return order;
  }
}

export async function updateOrderStatusDb(
  orderCode: string,
  status: AdminOrderStatus
): Promise<AdminOrder | null> {
  try {
    const updated = await updateOrderStatusDbOnly(orderCode, status);
    if (updated) return updated;
  } catch (err) {
    console.warn("Orders DB status update failed, using file store:", err);
  }

  const file = await readOrdersFile();
  const idx = file.orders.findIndex(
    (o) => o.id.toLowerCase() === orderCode.toLowerCase()
  );
  if (idx < 0) return null;
  const updated = { ...file.orders[idx], status };
  const next = [...file.orders];
  next[idx] = updated;
  await writeOrdersFile(next);
  return updated;
}
