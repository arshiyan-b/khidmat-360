import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma/client";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@khidmat360.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.SEED_ADMIN_NAME ?? "Masjid Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email} — skipping.`);
    return;
  }

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: "ADMIN" },
  });

  console.log(`Created admin user.\n  Email: ${email}\n  Password: ${password}`);
  console.log("Change this password after your first sign-in.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());