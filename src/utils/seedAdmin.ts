import bcrypt from "bcryptjs";

import config from "../config/index.js";
import { prisma } from "../lib/prisma.js";

export async function seedSuperAdmin() {
  try {
    const isAdminExist = await prisma.user.findUnique({
      where: {
        email: config.default_admin_email,
      },
    });

    if (isAdminExist) {
      console.log("Super admin Exist!!");
      return;
    }

    const hashPass = bcrypt.hashSync(
      config.default_admin_password as string,
      10,
    );

    await prisma.user.create({
      data: {
        name: "admin",
        email: config.default_admin_email as string,
        password: hashPass,
        role: "ADMIN",
      },
    });
    console.log("Super admin created successful.");
  } catch (error) {
    console.error(error);
  }
}
