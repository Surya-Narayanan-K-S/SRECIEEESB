import { useEffect, useState, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Load testimonial photos by filename (keyed by lowercase base name)
const testimonialPhotoMap = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../assets/testimonials/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}", { eager: true })
  ).map(([path, mod]) => {
    const filename = path.split("/").pop().replace(/\.[^.]+$/, "").toLowerCase();
    return [filename, mod.default];
  })
);

// Helper: look up photo by first name (case-insensitive)
const photo = (key) => testimonialPhotoMap[key.toLowerCase()] ?? "";

const INITIAL_STUDENT_REVIEWS = [
  {
    id: "rev-1",
    name: "Nikhil Balaji",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("balaji"),
    rating: 5,
    review: "IEEE SREC SB has given me a platform to turn my technical interests into real projects and meaningful experiences.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-2",
    name: "Anusha",
    dept: "B.E. Biomedical Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("anusha"),
    rating: 5,
    review: "Being part of IEEE SREC SB helped me build confidence, leadership skills, and the courage to take on bigger challenges.",
    badge: "IEEE SREC · BME",
  },
  {
    id: "rev-3",
    name: "Dharani",
    dept: "B.E. Biomedical Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("dharani"),
    rating: 5,
    review: "The workshops and technical sessions conducted by IEEE SREC SB have helped me stay connected with emerging technologies.",
    badge: "IEEE SREC · BME",
  },
  {
    id: "rev-4",
    name: "Gethaharan",
    dept: "B.E. Biomedical Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("gathaharan"),
    rating: 5,
    review: "IEEE SREC SB is more than a student organization—it is a community where ideas become initiatives and students become leaders.",
    badge: "IEEE SREC · BME",
  },
  {
    id: "rev-5",
    name: "Preethiv",
    dept: "B.E. Biomedical Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("preethiv"),
    rating: 5,
    review: "Through IEEE SREC SB, I have had opportunities to collaborate with students from different engineering disciplines and learn from them.",
    badge: "IEEE SREC · BME",
  },
  {
    id: "rev-6",
    name: "Prithika D R",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("prithika"),
    rating: 5,
    review: "The technical events organized by IEEE SREC SB have helped me gain practical knowledge beyond what we learn in the classroom.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-7",
    name: "Ranjith Kumar R",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("ranjith"),
    rating: 5,
    review: "IEEE SREC SB gave me the opportunity to organize events, work with teams, and develop skills that I know will help me professionally.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-8",
    name: "Vishweshwaran G",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("vish"),
    rating: 5,
    review: "My journey with IEEE SREC SB has strengthened both my technical foundation and my ability to communicate ideas effectively.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-9",
    name: "Vaibhavi M",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("vaibaavi"),
    rating: 5,
    review: "The exposure I received through IEEE SREC SB motivated me to explore research, innovation, and emerging areas of engineering.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-10",
    name: "Swathi P",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("swathi"),
    rating: 5,
    review: "IEEE SREC SB creates an environment where students are encouraged to experiment, innovate, and learn without fear of failure.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-11",
    name: "Pranav",
    dept: "B.E. Electronics & Communication Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("pranav"),
    rating: 5,
    review: "From technical workshops to large-scale events, IEEE SREC SB has provided countless opportunities to learn by doing.",
    badge: "IEEE SREC · ECE",
  },
  {
    id: "rev-12",
    name: "Girish",
    dept: "B.E. Electronics & Communication Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("girish"),
    rating: 5,
    review: "Being an IEEE SREC SB member helped me connect classroom concepts with real-world engineering applications.",
    badge: "IEEE SREC · ECE",
  },
  {
    id: "rev-13",
    name: "Nithin Annamalai R",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("nithin"),
    rating: 5,
    review: "IEEE SREC SB introduced me to a professional community that expanded my perspective beyond the campus.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-14",
    name: "Subashri",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("sus"),
    rating: 5,
    review: "The leadership opportunities at IEEE SREC SB taught me how to take responsibility, manage teams, and deliver results.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-15",
    name: "Sathya M",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("sathya"),
    rating: 5,
    review: "IEEE SREC SB has helped me discover interests and opportunities that I would never have explored on my own.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-16",
    name: "Sandheya",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("sandy"),
    rating: 5,
    review: "The collaborative culture of IEEE SREC SB encourages students to share knowledge, support each other, and grow together.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-17",
    name: "Sashmithasree",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("s"),
    rating: 5,
    review: "Participating in IEEE SREC SB activities has significantly improved my confidence in presenting and communicating technical ideas.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-18",
    name: "Jayasuryan",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("newbie"),
    rating: 5,
    review: "IEEE SREC SB provides the perfect platform for students who want to transform their ideas into impactful technical initiatives.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-19",
    name: "Tharun",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("tharun"),
    rating: 5,
    review: "The experiences I gained through IEEE SREC SB have prepared me to approach engineering challenges with greater confidence.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-20",
    name: "Sushma",
    dept: "B.E. Mechanical Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("sushma"),
    rating: 5,
    review: "IEEE SREC SB helped me understand that engineering is not just about learning technology, but also about creating solutions that matter.",
    badge: "IEEE SREC · MECH",
  },
  {
    id: "rev-21",
    name: "Vishnu",
    dept: "B.E. Mechanical Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("vishnu"),
    rating: 5,
    review: "Through IEEE SREC SB, I gained valuable exposure to hackathons, technical competitions, seminars, and collaborative projects.",
    badge: "IEEE SREC · MECH",
  },
  {
    id: "rev-22",
    name: "Sabarinath",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("sabarinath"),
    rating: 5,
    review: "The people I met through IEEE SREC SB became an important part of my learning journey and professional growth.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-23",
    name: "Sricharan",
    dept: "B.E. Mechanical Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("mech"),
    rating: 5,
    review: "IEEE SREC SB gave me a space to step outside my comfort zone and discover my potential as a student leader.",
    badge: "IEEE SREC · MECH",
  },
  {
    id: "rev-24",
    name: "Mr. Sujith",
    dept: "B.E. Mechanical Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("mr.sujith"),
    rating: 5,
    review: "The technical societies and activities under IEEE SREC SB offer students diverse opportunities to explore their areas of interest.",
    badge: "IEEE SREC · MECH",
  },
  {
    id: "rev-25",
    name: "Darshan S",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("darshan"),
    rating: 5,
    review: "Every event I participated in through IEEE SREC SB gave me something new to learn, whether it was technology, teamwork, or leadership.",
    badge: "IEEE SREC · EEE",
  },
  {
    id: "rev-26",
    name: "Akshreeya T",
    dept: "B.E. Electrical & Electronics Engineering",
    year: "3rd Year",
    role: "IEEE SREC Member",
    avatar: photo("akshreeya"),
    rating: 5,
    review: "IEEE SREC SB has been instrumental in developing my professional mindset and preparing me for opportunities beyond college.",
    badge: "IEEE SREC · EEE",
  },

];

// Fixed review IDs that are pinned at the beginning of the carousel (Constant Slides)
export const FIXED_REVIEW_IDS = ["rev-25", "rev-26", "rev-15", "rev-17", "rev-10", "rev-22"];

/**
 * Pins fixed reviews upfront in order, randomly shuffles all other remaining reviews,
 * and ensures an even total count for 2-card slide carousel layout.
 */
export const getFixedAndRandomReviews = (allReviews, fixedIds = FIXED_REVIEW_IDS) => {
  // 1. Extract fixed reviews in the exact order of fixedIds
  const fixed = fixedIds
    .map((id) => allReviews.find((r) => r.id === id))
    .filter((r) => Boolean(r));

  // 2. Filter out fixed reviews to get remaining items
  const remaining = allReviews.filter((r) => !fixedIds.includes(r.id));

  // 3. Fisher-Yates shuffle on remaining items
  const shuffled = [...remaining];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 4. Combine: fixed first, followed by randomized remaining items
  const combined = [...fixed, ...shuffled];

  // 5. Trim to even length so 2-card carousel pagination is seamless
  return combined.length % 2 === 0 ? combined : combined.slice(0, -1);
};

const TestimonialCardItem = ({ review }) => (
  <div
    className="w-full bg-white border border-slate-200 hover:border-blue-400/60 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-row font-sans group"
    style={{ height: "200px" }}
  >
    {/* LEFT — photo */}
    <div className="relative w-[130px] sm:w-[140px] shrink-0 overflow-hidden border-r border-slate-100 bg-slate-50">
      {review.avatar ? (
        <img
          src={review.avatar}
          alt={review.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-3xl font-black">
          {review.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
      )}
    </div>

    {/* RIGHT — info + review */}
    <div className="flex flex-col justify-between flex-1 px-4 py-3 relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/20">
      <Quote className="absolute top-2 right-2 text-slate-200/80 w-9 h-9 rotate-180 pointer-events-none group-hover:text-blue-200/60 transition-colors" />

      <div className="relative z-10">
        <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
          {review.name}
        </h3>
        <p className="text-blue-600 text-[11px] font-bold mt-0.5 leading-tight truncate">{review.dept}</p>
        <div className="flex items-center gap-0.5 mt-1">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed mt-2 border-l-2 border-blue-500 pl-2.5 line-clamp-4">
          "{review.review}"
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] uppercase font-bold tracking-wider">
        <span className="text-slate-400 font-extrabold">IEEE SREC</span>
        <span className="text-blue-600/80 font-bold">{review.badge}</span>
      </div>
    </div>
  </div>
);

export const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    // Use each student's individual photo; fall back to placeholder if missing
    const reviewsWithPhotos = INITIAL_STUDENT_REVIEWS.map((rev) => ({
      ...rev,
      avatar:
        rev.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=003366&color=fff&size=128`,
    }));

    const ordered = getFixedAndRandomReviews(reviewsWithPhotos);
    setReviews(ordered);
    setCurrentIndex(0);
  }, []);

  const handleNext = useCallback(() => {
    if (reviews.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 2) % reviews.length);
  }, [reviews.length]);

  const handlePrev = useCallback(() => {
    if (reviews.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 2 + reviews.length) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, handleNext, reviews.length]);

  if (reviews.length === 0) return null;

  const review1 = reviews[currentIndex];
  const review2 = reviews[(currentIndex + 1) % reviews.length];

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-900 relative overflow-hidden font-sans border-t border-slate-200">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/40 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs tracking-wider uppercase mb-3 shadow-sm">
            <GraduationCap size={15} className="text-blue-600 animate-pulse" />
            <span>Voices of SREC</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            What SREC Students <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-heading">Say</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Authentic reflections, technical exposure, leadership journeys, and career growth shared by members of IEEE Student Branch SREC.
          </p>
        </div>

        {/* Carousel Slider Wrapper */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Cards & Arrows Container */}
          <div className="relative">
            {/* Navigation Arrow Left */}
            <button
              onClick={handlePrev}
              aria-label="Previous Student Reviews"
              className="absolute -left-2 sm:-left-6 md:-left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white border border-slate-200 shadow-xl hover:shadow-2xl hover:bg-blue-600 hover:text-white text-slate-700 flex items-center justify-center transition-all duration-300 active:scale-90"
            >
              <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
            </button>

            {/* Navigation Arrow Right */}
            <button
              onClick={handleNext}
              aria-label="Next Student Reviews"
              className="absolute -right-2 sm:-right-6 md:-right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white border border-slate-200 shadow-xl hover:shadow-2xl hover:bg-blue-600 hover:text-white text-slate-700 flex items-center justify-center transition-all duration-300 active:scale-90"
            >
              <ChevronRight size={22} className="sm:w-6 sm:h-6" />
            </button>

            {/* Active Review Pair (2 in 1 column on mobile, 2 in row on desktop) */}
            <div className="overflow-hidden px-3 sm:px-8 py-1">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                >
                  {review1 && <TestimonialCardItem review={review1} />}
                  {review2 && <TestimonialCardItem review={review2} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 mt-8">
            {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx * 2 > currentIndex ? 1 : -1);
                  setCurrentIndex(idx * 2);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${Math.floor(currentIndex / 2) === idx
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
