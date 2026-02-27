import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { redis } from "@/lib/redis";
import { after } from "next/server"; // Use explicitly for Next.js background execution

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;

    if (!code) {
        return new Response("Not Found", { status: 404 });
    }

    let urlToRedirect = "";

    try {
        // 1. Try Cache First
        let cachedUrl = await redis.get<string>(`link:${code}`);

        if (cachedUrl) {
            urlToRedirect = cachedUrl;

            // Background Analytics: increment DB asynchronously so we don't block the redirect
            after(async () => {
                try {
                    await prisma.link.update({
                        where: { shortCode: code },
                        data: { clicks: { increment: 1 } },
                    });
                } catch (e) {
                    console.error("Background analytics failed (cache hit):", e);
                }
            });

        } else {
            // 2. Cache Miss: Query Database
            const link = await prisma.link.findUnique({
                where: { shortCode: code },
            });

            if (!link) {
                return new Response("Short link not found", { status: 404 });
            }

            if (link.expiresAt && link.expiresAt < new Date()) {
                return new Response("This short link has expired.", { status: 410 });
            }

            urlToRedirect = link.url;

            // Cache the result for 7 days (or until expired)
            // If expiresAt exists, we can calculate seconds until expiration. Default 7 days.
            const ttl = link.expiresAt
                ? Math.max(1, Math.floor((link.expiresAt.getTime() - Date.now()) / 1000))
                : 604800;

            after(async () => {
                try {
                    // Set Cache
                    await redis.set(`link:${code}`, link.url, { ex: ttl });

                    // Increment DB Analytics
                    await prisma.link.update({
                        where: { id: link.id },
                        data: { clicks: { increment: 1 } },
                    });
                } catch (e) {
                    console.error("Background caching/analytics failed (cache miss):", e);
                }
            });
        }
    } catch (error) {
        console.error(`Failed to process redirect for code: ${code}`, error);
        return new Response("Internal Server Error", { status: 500 });
    }

    if (urlToRedirect) {
        redirect(urlToRedirect);
    }
}
