import { redisClient } from "../redis/client.js";
import { keys } from "../redis/keys.js";

type QuotaStatus = {
  remaining: number | null;
  used: number | null;
  resetAt: string | null;
};

function toNullableNumber(value: string | null) {
  return value === null ? null : Number(value);
}

export async function getQuotaStatus(): Promise<QuotaStatus> {
  const [remaining, used, resetAt] = await Promise.all([
    redisClient.get(keys.quota.remaining),
    redisClient.get(keys.quota.used),
    redisClient.get(keys.quota.resetAt),
  ]);

  return {
    remaining: toNullableNumber(remaining),
    used: toNullableNumber(used),
    resetAt,
  };
}
