"use client";

import useSWR from "swr";
import { ExternalLink, MousePointerClick, Clock } from "lucide-react";
import { Link } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RecentLinks() {
    const { data, error, isLoading } = useSWR<{ links: Link[] }>('/api/links', fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true,
    });

    const links = data?.links || [];

    if (isLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-12 text-center text-white/40 animate-pulse">
                Loading recent links...
            </div>
        );
    }

    if (error || links.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-12 text-center text-white/40">
                No links have been shortened yet. Be the first!
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-16 pb-20">
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-semibold text-white/90">Recent Links</h2>
                <span className="text-sm px-3 py-1 bg-green-500/10 rounded-full text-green-400 border border-green-500/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Live Updates
                </span>
            </div>

            <div className="grid gap-4">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 gap-4"
                    >
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <span className="text-sm text-white/40 truncate flex items-center gap-2">
                                <Clock size={14} className="flex-shrink-0" />
                                {new Intl.DateTimeFormat("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }).format(new Date(link.createdAt))}

                                {link.expiresAt && (
                                    <span className="text-red-400/80 text-xs ml-2">
                                        (Expires: {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(link.expiresAt))})
                                    </span>
                                )}
                            </span>
                            <a
                                href={`/${link.shortCode}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 font-medium text-lg hover:underline truncate flex items-center gap-2"
                            >
                                {typeof window !== "undefined" ? window.location.host : "surl.vercel.app"}/{link.shortCode}
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <span className="text-sm text-white/60 truncate" title={link.url}>
                                {link.url}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5 flex-shrink-0 self-start sm:self-auto transition-all group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20">
                            <MousePointerClick size={16} className="text-indigo-400" />
                            <span className="text-white font-medium flex items-baseline gap-1">
                                <span className="text-xl">{link.clicks}</span>
                                <span className="text-white/40 font-normal text-sm">clicks</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
