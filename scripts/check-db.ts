import { PrismaClient } from "@prisma/client";

async function main() {
  const p = new PrismaClient();
  const [products, categories, orders] = await Promise.all([
    p.product.count(),
    p.category.count(),
    p.order.count(),
  ]);
  console.log({ products, categories, orders });
  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
