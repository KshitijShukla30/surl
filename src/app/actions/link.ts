"use server";

import prisma from "@/lib/prisma";
import { generateShortCode, isValidUrl } from "@/lib/utils";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function createShortLink(prevState: any, formData: FormData) {
    const url = formData.get("url") as string;

    if (!url) {
        return { error: "URL is required" };
    }

    if (!isValidUrl(url)) {
        return { error: "Please enter a valid URL (e.g., https://example.com)" };
    }

    try {
        let shortCode = "";
        let isUnique = false;

        // Retry loop for unique code generation
        for (let i = 0; i < 5; i++) {
            shortCode = generateShortCode();
            const existing = await prisma.link.findUnique({
                where: { shortCode },
            });

            if (!existing) {
                isUnique = true;
                break;
            }
        }

        if (!isUnique) {
            return { error: "Failed to generate a unique short code. Please try again." };
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const newLink = await prisma.link.create({
            data: {
                url,
                shortCode,
                expiresAt,
            },
        });

        revalidatePath("/"); // Update the analytics dashboard
        return { success: true, link: newLink };
    } catch (error) {
        console.error("Failed to create short link:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function getRecentLinks() {
    noStore();
    try {
        return await prisma.link.findMany({
            orderBy: { createdAt: "desc" },
            take: 10, // Show the 10 most recent links
        });
    } catch (error) {
        console.error("Failed to fetch recent links:", error);
        return [];
    }
}
