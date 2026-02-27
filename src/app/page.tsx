import CreateLinkForm from "@/components/CreateLinkForm";
import RecentLinks from "@/components/RecentLinks";
import { LinkIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050511] text-white selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10 flex flex-col items-center">
        {/* Header / Hero Section */}
        <header className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto mt-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 border border-white/10">
            <LinkIcon size={32} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent pb-2">
            Shorten URLs.<br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Expand Reach.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto font-light">
            A lightning-fast, production-ready link shortener built with Next.js App Router, Tailwind CSS, and Prisma.
          </p>
        </header>

        {/* Form Section */}
        <CreateLinkForm />

        {/* Recent Links Section */}
        <RecentLinks />
      </div>
    </main>
  );
}
