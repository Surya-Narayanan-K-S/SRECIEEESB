import React from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PdfEmbedViewer } from "@/components/ui/PdfEmbedViewer";
import { ArrowLeft, FileText, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const PdfViewerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract params or use defaults
  const fileUrl = searchParams.get("file") || searchParams.get("url") || "/ieee-srec-sb.pdf";
  const title = searchParams.get("title") || "IEEE SREC Student Branch Handbook & Overview";
  const subtitle = searchParams.get("subtitle") || "IEEE Student Branch STB32131 · Sri Ramakrishna Engineering College";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Document link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Navigation & Header Breadcrumbs */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer font-bold text-xs"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#002855]/10 text-[#002855] text-[10px] font-black uppercase tracking-wider">
                  In-App PDF Reader
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-500 text-xs font-medium">No External Downloads</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share Link</span>
            </button>
          </div>
        </div>

        {/* Embedded Viewer Container */}
        <div className="w-full">
          <PdfEmbedViewer
            fileUrl={fileUrl}
            title={title}
            subtitle={subtitle}
            height="h-[80vh]"
            downloadFileName={`${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PdfViewerPage;
