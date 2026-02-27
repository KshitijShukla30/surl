"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createShortLink } from "@/app/actions/link";
import { Copy, Link2, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CreateLinkForm() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setShortUrl(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await createShortLink(null, formData);

            if (result?.error) {
                toast.error(result.error);
                return;
            }

            if (result?.success && result.link) {
                const fullShortUrl = `${window.location.origin}/${result.link.shortCode}`;
                setShortUrl(fullShortUrl);
                toast.success("URL shortened successfully!");
                setUrl("");
            }
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Failed to connect to the server. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (shortUrl) {
            navigator.clipboard.writeText(shortUrl);
            toast.success("Copied to clipboard!");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-10">
            <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                onSubmit={handleSubmit}
                className="relative group flex items-center bg-white/5 border border-white/10 p-2 rounded-2xl shadow-xl backdrop-blur-md transition-all hover:border-white/20"
            >
                <div className="pl-4 pr-2 text-blue-400">
                    <Link2 className="text-white/40 group-focus-within:text-blue-400 transition-colors" size={24} />
                </div>
                <input
                    type="url"
                    name="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your long URL here... https://example.com"
                    required
                    className="w-full bg-transparent border-none text-white focus:outline-none placeholder:text-white/30 text-lg px-2"
                />
                <button
                    type="submit"
                    disabled={isLoading || !url}
                    className={cn(
                        "ml-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300",
                        "hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            Shorten
                            <ArrowRight size={18} className="translate-y-[1px]" />
                        </>
                    )}
                </button>
            </motion.form>

            {shortUrl && (
                <motion.div
                    initial={{ y: -10, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    className="mt-6 p-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                >
                    <div className="bg-black/60 rounded-xl p-4 flex items-center justify-between backdrop-blur-xl border border-white/5">
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm text-white/50 mb-1">Your shortened link:</span>
                            <a
                                href={shortUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 text-lg font-medium hover:underline truncate"
                            >
                                {shortUrl}
                            </a>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="ml-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all active:scale-95 flex-shrink-0"
                            title="Copy to clipboard"
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
