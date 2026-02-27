import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "https://dummy-url",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "dummy-token",
});

// Create a new ratelimiter, that allows 5 requests per 1 minute
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export async function proxy(request: NextRequest) {
    // Only apply rate limiting to POST requests on the root path (our Server Action for link creation)
    if (request.method === "POST" && request.nextUrl.pathname === "/") {
        // Determine the IP address of the requester
        const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

        const { success, pending, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

        // Also dispatch background analytics call
        if (pending) {
            Promise.resolve(pending).catch(console.error);
        }

        if (!success) {
            // 429 Too Many Requests
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                {
                    status: 429, headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    }
                }
            );
        }

        // Add rate limit headers for successful requests too
        const res = NextResponse.next();
        res.headers.set("X-RateLimit-Limit", limit.toString());
        res.headers.set("X-RateLimit-Remaining", remaining.toString());
        res.headers.set("X-RateLimit-Reset", reset.toString());
        return res;
    }

    return NextResponse.next();
}

// Ensure the middleware is only called for relevant paths
export const config = {
    matcher: [
        // Apply only on the root path
        "/"
    ],
};
