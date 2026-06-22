import { env } from "../config/index.js";
import { redisClient } from "../redis/client.js";
import { keys } from "../redis/keys.js";

export async function updateQuota(remaining: number, used: number) {
  await Promise.all([
    redisClient.set(keys.quota.remaining, String(remaining)),
    redisClient.set(keys.quota.used, String(used)),
  ]);
}

export class QuotaPausedError extends Error {
    constructor(message= "Quota limit reached. Ingestion paused until reset.") {
        super(message);
        this.name = "QuotaPausedError";
    }
}

export async function getQuotaStatus(){
    const [remaining,used] = await Promise.all([
        redisClient.get(keys.quota.remaining),
        redisClient.get(keys.quota.used)
    ])

    return {
        remaining:remaining === null ? null : Number(remaining),
        used:used=== null ? null :Number(used)
    }
}

export async function checkQuota() {
    const { remaining } = await getQuotaStatus();
    if (remaining !== null && remaining <= env.QUOTA_HALT_THRESHOLD) {
        throw new QuotaPausedError("Quota limit reached. Ingestion paused until reset.");
    }
    
}