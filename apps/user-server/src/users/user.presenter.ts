import type { Prisma } from "@sportbooks/db";

type UserWithCurrency = Prisma.UserGetPayload<{
  include: { currency: true };
}>;

export function toUserResponse(user: UserWithCurrency) {
  return {
    _id: user.id,
    email: user.email,
    role: user.role,
    emailVerify: user.emailVerify,
    username: user.username,
    name: user.name,
    birthdate: user.birthdate,
    clientShare: user.clientShare,
    creditReference: Number(user.creditReference),
    balance: Number(user.balance),
    system_ip: user.systemIp,
    browser_ip: user.browserIp,
    status: user.status,
    betAllow: user.betAllow,
    exposure: Number(user.exposure),
    currency: user.currency
      ? {
          id: user.currency.id,
          name: user.currency.name,
          code: user.currency.code,
        }
      : null,
  };
}
