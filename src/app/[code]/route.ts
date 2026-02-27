import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> } // In Next.js 15, params is a Promise
) {
    const { code } = await params;

    if (!code) {
        return new Response("Not Found", { status: 404 });
    }

    let urlToRedirect = "";

    try {
        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!link) {
            return new Response("Short link not found", { status: 404 });
        }

        if (link.expiresAt && link.expiresAt < new Date()) {
            return new Response("This short link has expired.", { status: 410 });
        }

        // Link is valid, update clicks
        await prisma.link.update({
            where: { id: link.id },
            data: { clicks: { increment: 1 } },
        });

        urlToRedirect = link.url;
    } catch (error) {
        console.error(`Failed to process redirect for code: ${code}`, error);
        return new Response("Internal Server Error", { status: 500 });
    }

    if (urlToRedirect) {
        redirect(urlToRedirect);
    }
}
