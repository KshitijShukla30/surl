export const dynamic = 'force-dynamic';

import { getRecentLinks } from "@/app/actions/link";

export async function GET() {
    try {
        const links = await getRecentLinks();
        return Response.json({ links });
    } catch (error) {
        return Response.json({ error: "Failed to fetch top links" }, { status: 500 });
    }
}
