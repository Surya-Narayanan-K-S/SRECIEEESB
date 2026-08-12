import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Play,
  Sparkles,
  Star,
  Twitter,
  Users,
} from "lucide-react";
import { Counter } from "./Counter";
import { Lightbox } from "./Lightbox";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  achievements,
  categories,
  featuredMemories,
  galleryItems,
  stats,
  testimonials,
  timelineYears,
  videoGallery,
  type Category,
} from "./data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function Gallery() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [openYear, setOpenYear] = useState<number>(2025);
  const [tIndex, setTIndex] = useState(0);

  const { data: bucketList } = useQuery<any[]>({
    queryKey: ["gallery_bucket_images"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("gallery").list("", {
        limit: 100
      });
      if (error) {
        console.error("Storage error:", error);
        return [];
      }
      if (!data) return [];

      return data.map((file, idx) => {
        const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(file.name);
        return {
          id: `bucket-${idx}`,
          title: file.name.split(".")[0].replace(/[-_]/g, " "),
          date: "Uploaded Image",
          description: "Storage Bucket Memory",
          category: "Student Activities" as Category,
          image: publicUrl,
          year: 2026
        };
      });
    }
  });

  const displayItems = useMemo(() => {
    return galleryItems;
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? displayItems : displayItems.filter((i) => i.category === filter)),
    [filter, displayItems],
  );

  const openLightbox = (id: string) => {
    const idx = filtered.findIndex((i) => i.id === id);
    setLightboxIndex(idx);
  };

  const navLightbox = (dir: 1 | -1) => {
    setLightboxIndex((i) =>
      i === null ? null : (i + dir + filtered.length) % filtered.length,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Navbar */}
      <Navbar />

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-32 pb-24 text-slate-900 sm:pt-40 sm:pb-32 border-b border-slate-200">
        {/* Infinite Scrolling Image Marquee Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.09] flex items-center">
          <div className="flex gap-4 animate-marquee py-2 whitespace-nowrap">
            {/* Render two copies of items to create seamless loop */}
            {[...galleryItems.slice(0, 10), ...galleryItems.slice(0, 10)].map((item, idx) => (
              <div key={idx} className="w-72 h-44 shrink-0 rounded-2xl overflow-hidden border border-slate-300 shadow-md">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500/5"
              style={{
                width: 20 + (i % 4) * 20,
                height: 20 + (i % 4) * 20,
                left: `${(i * 13) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 6 + (i % 4),
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 text-xs font-semibold text-blue-800 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            IEEE Student Branch · Sri Ramakrishna Engineering College
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl text-[#0b3b8f]"
          >
            Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg"
          >
            Capturing the journey of innovation, technical excellence, leadership, and memorable
            moments at IEEE Student Branch SREC.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <a href="#stats" aria-label="Scroll down" className="animate-bounce-down text-white/80">
              <ChevronDown className="h-8 w-8" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative -mt-16 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 rounded-3xl bg-white p-6 shadow-glow sm:p-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-extrabold text-primary sm:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filters + Gallery */}
      <section id="gallery" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Moments</p>
            <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">Browse the Archive</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Filter by category and click any photo to open the immersive lightbox.
            </p>
          </motion.div>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${filter === c
                  ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                  : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div
            layout
            className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
          >
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                  className="group mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-2xl bg-white shadow-elegant"
                  onClick={() => openLightbox(item.id)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                      {item.category}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="rounded-full bg-white/90 p-4 shadow-lg">
                        <Maximize2 className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground group-hover:text-primary">{item.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
                    <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Featured Memories */}
      <section id="featured" className="bg-secondary/60 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Featured</p>
              <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">Memories to Remember</h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              The moments that defined us — swipe through some of our proudest occasions.
            </p>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6">
            {featuredMemories.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative h-96 w-80 shrink-0 snap-start overflow-hidden rounded-3xl shadow-elegant sm:w-96"
              >
                <img
                  src={m.image}
                  alt={m.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/30 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{m.year}</p>
                  <h3 className="mt-1 text-2xl font-bold">{m.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Timeline</p>
            <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">A Decade in Motion</h2>
          </div>
          <div className="relative border-l-2 border-primary/20 pl-8">
            {timelineYears.map((y) => {
              const yearEvents = galleryItems.filter((i) => i.year === y).slice(0, 4);
              const open = openYear === y;
              return (
                <div key={y} className="relative mb-8">
                  <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-primary shadow-elegant" />
                  <button
                    onClick={() => setOpenYear(open ? -1 : y)}
                    className="flex w-full items-center justify-between rounded-2xl bg-white p-6 text-left shadow-elegant transition hover:shadow-glow"
                  >
                    <div>
                      <p className="text-3xl font-extrabold text-primary">{y}</p>
                      <p className="text-sm text-muted-foreground">{yearEvents.length} highlighted events</p>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-primary transition-transform ${open ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {open && yearEvents.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {yearEvents.map((e) => (
                            <div key={e.id} className="flex gap-3 rounded-xl bg-secondary/60 p-3">
                              <img src={e.image} alt={e.title} loading="lazy" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{e.title}</p>
                                <p className="text-xs text-muted-foreground">{e.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-hero-gradient px-4 py-24 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Recognition</p>
            <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">Achievement Gallery</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-dark overflow-hidden rounded-2xl"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold">{a.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{a.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section id="videos" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Watch</p>
            <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">Video Gallery</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {videoGallery.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="overflow-hidden rounded-2xl bg-white shadow-elegant"
              >
                <div className="relative aspect-video bg-primary-dark">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Play className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold">{v.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="join" className="px-4 py-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#001a38] via-[#002a52] to-[#003764] p-10 text-center text-white shadow-glow sm:p-16"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <Users className="mx-auto mb-4 h-10 w-10" />
            <h2 className="text-4xl font-extrabold sm:text-5xl">Create Memories with IEEE SB SREC</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/85">
              Join our workshops, conferences, competitions and technical events to become part of
              our growing community.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/about"
                className="rounded-full bg-white px-6 py-3 font-semibold text-primary shadow-lg transition hover:scale-105"
              >
                Join IEEE
              </a>
              <a
                href="/activities"
                className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore Events
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />

      <Lightbox
        items={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNav={navLightbox}
      />
    </div>
  );
}
