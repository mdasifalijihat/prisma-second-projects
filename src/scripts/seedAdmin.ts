import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function seedAdmin() {
  try {
    const adminEmail = "admin1@admin.com";

    // 1️⃣ Check user
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log("✅ Admin already exists");
      return;
    }

    // 2️⃣ Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: "Admin",
        email: adminEmail,
        role: "ADMIN",
        emailVerified: true,
      },
    });

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 4️⃣ Create account (credentials)
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        providerId: "credentials",
        accountId: adminEmail,
        password: hashedPassword,
      },
    });

    console.log("🚀 Admin seeded successfully");
  } catch (error) {
    console.error("❌ Admin seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
