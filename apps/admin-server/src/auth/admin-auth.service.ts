import { prisma } from "@sportbooks/db";
import { AdminLoginInput } from "./admin-auth.schema.js";

import bcrypt from "bcrypt"
import { signAdminToken } from "./admin-auth.jwt.js";
import { AppError } from "../api/app-error.js";

const ADMIN_ROLE = 1

export async function loginAdmin(input:AdminLoginInput){
const admin = await prisma.user.findFirst({
    where:input.emailOrUsername.includes('@')?{email:input.emailOrUsername}:{username:input.emailOrUsername}
});

if (!admin || !(await bcrypt.compare(input.password, admin.password))) {
  throw new AppError(
    "Invalid username/email or password",
    401,
    "INVALID_CREDENTIALS",
  );
}

if (admin.role !== ADMIN_ROLE) {
  throw new AppError(
    "This account cannot access the admin panel",
    403,
    "ADMIN_ACCESS_REQUIRED",
  );
}

if (admin.status !== "1") {
  throw new AppError(
    "This admin account is inactive",
    403,
    "ADMIN_ACCOUNT_INACTIVE",
  );
}

  const token = signAdminToken({id:admin.id,
    email:admin.email,
    role:admin.role
  })


  await prisma.user.update({where:{id:admin.id},data:{token}});

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    },
  };
}


