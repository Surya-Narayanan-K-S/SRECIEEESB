import { useEffect, useState, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StudentReview {
  id: string;
  name: string;
  dept: string;
  year: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
  badge: string;
}

// Load testimonial photos by filename (keyed by lowercase base name)
const testimonialPhotoMap = Object.fromEntries(
  Object.entries(
    (import.meta as unknown as Record<string, unknown> & { glob: (pattern: string, opts?: Record<string, unknown>) => Record<string, { default: string }> }).glob(
      "../assets/testimonials/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}",
      { eager: true }
    )
  ).map(([path, mod]) => {
    const filename = path.split("/").pop()!.replace(/\.[^.]+$/, "").toLowerCase();
    return [filename, (mod as { default: string }).default];
  })
);

// Helper: look up photo by first name (case-insensitive)
const photo = (key: string): string => testimonialPhotoMap[key.toLowerCase()] ?? "";

const INITIAL_STUDENT_REVIEWS: StudentReview[] = [
  { id: "rev-1", name: "Nikhil Balaji", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("balaji"), rating: 5, review: "Studying at SREC has been a great decision. The department facilities, faculty guidance, and hands-on exposure have really boosted my skills in EEE.", badge: "2nd Year · EEE" },
  { id: "rev-2", name: "Anusha", dept: "B.E. BioMedical Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("anusha"), rating: 5, review: "SREC provides access to state-of-the-art lab resources and research guidance. As a BME student, it has helped me explore the intersection of technology and healthcare.", badge: "2nd Year · BME" },
  { id: "rev-3", name: "Dharani", dept: "B.E. BioMedical Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("dharani"), rating: 5, review: "Being a student at SREC has opened many doors for me. The academic curriculum, industrial visits, and campus activities are informative and well-structured.", badge: "2nd Year · BME" },
  { id: "rev-4", name: "Gethaharan", dept: "B.E. BioMedical Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("gathaharan"), rating: 5, review: "SREC has a very welcoming and vibrant campus community. As a 2nd year BME student, I have learned so much from senior peers and experienced faculty.", badge: "2nd Year · BME" },
  { id: "rev-5", name: "Preetiv", dept: "B.E. BioMedical Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("preethiv"), rating: 5, review: "SREC provides a fantastic environment for engineering students. The active campus life and department initiatives make it easy to grow both academically and professionally.", badge: "2nd Year · BME" },
  { id: "rev-6", name: "Prithika", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("prithika"), rating: 5, review: "The practical lab sessions and technical workshops organized at SREC are excellent. My understanding of core EEE concepts has improved significantly.", badge: "2nd Year · EEE" },
  { id: "rev-7", name: "Ranjith Kumar R", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("ranjith"), rating: 5, review: "Choosing SREC for my engineering degree is one of the best decisions I have made. The exposure to real-world engineering problems and industrial projects is invaluable.", badge: "2nd Year · EEE" },
  { id: "rev-8", name: "Vishweshwaran G", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("vish"), rating: 5, review: "SREC organizes fantastic technical symposiums and events. Studying here has helped me stay updated with the latest trends and innovations in electrical engineering.", badge: "2nd Year · EEE" },
  { id: "rev-9", name: "Vaibhavi", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("vaibaavi"), rating: 5, review: "I am proud to be a student at SREC. The academic environment here is very supportive and college activities have enhanced my technical and soft skills greatly.", badge: "2nd Year · EEE" },
  { id: "rev-10", name: "Swathi", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("swathi"), rating: 5, review: "Studying at SREC has been a wonderful experience. The seminars, practical workshops, and campus opportunities have helped me grow both academically and professionally.", badge: "2nd Year · EEE" },
  { id: "rev-11", name: "Pranav", dept: "B.E. Electronics & Communication", year: "2nd Year", role: "SREC Student", avatar: photo("pranav"), rating: 5, review: "Choosing SREC was one of the best choices I made. The ECE department actively organizes technical events and project exhibitions that are highly relevant for students.", badge: "2nd Year · ECE" },
  { id: "rev-12", name: "Girish", dept: "B.E. Electronics & Communication", year: "2nd Year", role: "SREC Student", avatar: photo("girish"), rating: 5, review: "SREC has an outstanding team of dedicated faculty and motivated students. The campus activities have helped me gain practical knowledge beyond textbook theory.", badge: "2nd Year · ECE" },
  { id: "rev-13", name: "Nithin Annamalai R", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("nithin"), rating: 5, review: "Being part of SREC has been an enriching journey. The technical workshops and practical curriculum have sharpened my problem-solving and analytical skills.", badge: "2nd Year · EEE" },
  { id: "rev-14", name: "Subashri", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("sus"), rating: 5, review: "SREC provides an excellent platform for students to showcase their technical talents. I have gained confidence and leadership skills through department events.", badge: "2nd Year · EEE" },
  { id: "rev-15", name: "Sathya M", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("sathya"), rating: 5, review: "The student community at SREC is very active and engaging. It has helped me connect with like-minded peers and develop a deep passion for electrical engineering.", badge: "2nd Year · EEE" },
  { id: "rev-16", name: "Sandheya", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("sandy"), rating: 5, review: "Studying at SREC has given me access to advanced library resources, research journals, and expert mentorship that deepened my understanding of engineering.", badge: "2nd Year · EEE" },
  { id: "rev-17", name: "Sashmithasree", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("s"), rating: 5, review: "SREC is a great institution to be part of. The academic events and guidance from supportive faculty and peers have made my engineering journey exciting.", badge: "2nd Year · EEE" },
  { id: "rev-18", name: "Jayasuryan", dept: "B.E. Electrical & Electronics Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("newbie"), rating: 5, review: "Joining SREC for my B.E. in EEE has been a great decision. The technical workshops, lab facilities, and peer collaboration have really boosted my skills.", badge: "2nd Year · EEE" },
  { id: "rev-19", name: "Tharun ", dept: "B.E. Electrical & Electronics Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("tharun"), rating: 5, review: "The academic atmosphere at SREC is very active and encouraging. It has helped me connect with passionate peers and excel in Electrical & Electronics Engineering.", badge: "2nd Year · EEE" },
  { id: "rev-20", name: "Sushma", dept: "B.E. Mechanical Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("sushma"), rating: 5, review: "SREC provides great opportunities to work in advanced mechanical and CAD labs. Participating in department workshops has greatly enriched my practical skills.", badge: "2nd Year · MECH" },
  { id: "rev-21", name: "Vishnu", dept: "B.E. Mechanical Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("vishnu"), rating: 5, review: "The interdisciplinary project exposure at SREC is incredible. Working alongside peers from EEE and CSE on robotics projects opened up new horizons for me.", badge: "2nd Year · MECH" },
  { id: "rev-22", name: "Sabarinath", dept: "B.E. Electrical & Electronics", year: "2nd Year", role: "SREC Student", avatar: photo("sabarinath"), rating: 5, review: "SREC has given me great exposure to core engineering domains, practical projects, and team management skills. Proud to be an SRECian.", badge: "2nd Year · EEE" },
  { id: "rev-23", name: "Sricharan", dept: "B.E. Mechanical Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("mech"), rating: 5, review: "Being a student at SREC has provided great exposure to CAD design, mechatronics labs, and opportunities to participate in national technical symposiums.", badge: "2nd Year · MECH" },
  { id: "rev-24", name: "Mr. Sujith", dept: "B.E. Mechanical Engineering", year: "2nd Year", role: "SREC Student", avatar: photo("mr.sujith"), rating: 5, review: "SREC offers amazing practical exposure in mechanical design, manufacturing labs, and automation projects. The practical sessions are truly career-defining.", badge: "2nd Year · MECH" },
];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Fixed review IDs that are pinned at the beginning of the carousel
export const FIXED_REVIEW_IDS = ["rev-15", "rev-17", "rev-10", "rev-22"];

/**
 * Pins fixed reviews upfront in order, randomly shuffles all other remaining reviews,
 * and ensures an even total count for 2-card slide carousel layout.
 */
export const getFixedAndRandomReviews = <T extends { id: string }>(
  allReviews: T[],
  fixedIds: string[] = FIXED_REVIEW_IDS
): T[] => {
  // 1. Extract fixed reviews in the exact order of fixedIds
  const fixed = fixedIds
    .map((id) => allReviews.find((r) => r.id === id))
    .filter((r): r is T => Boolean(r));

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

const TestimonialCardItem = ({ review }: { review: StudentReview }) => (
  <div className="w-full bg-white border border-slate-200 hover:border-blue-400/60 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-row font-sans group" style={{ height: "200px" }}>

    {/* LEFT — photo */}
    <div className="relative w-[140px] shrink-0 overflow-hidden border-r border-slate-100">
      {review.avatar ? (
        <img
          src={review.avatar}
          alt={review.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-3xl font-black">
          {review.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
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
        <span className="text-slate-400 font-extrabold">SREC</span>
        <span className="text-blue-600/80 font-bold">{review.badge}</span>
      </div>
    </div>
  </div>
);



const Testimonials = () => {
  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    // Use each student's individual photo; fall back to placeholder if missing
    const reviewsWithPhotos = INITIAL_STUDENT_REVIEWS.map((rev) => ({
      ...rev,
      avatar: rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=003366&color=fff&size=128`,
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
          <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-2 max-w-xl mx-auto">
            Authentic campus reviews & academic experiences shared by engineering students at Sri Ramakrishna Engineering College.
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
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -direction * 50, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full items-stretch"
                >
                  <TestimonialCardItem review={review1} />
                  <TestimonialCardItem review={review2} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, idx) => {
              const activePage = Math.floor(currentIndex / 2);
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx * 2)}
                  aria-label={`Go to page ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${activePage === idx ? "w-8 bg-blue-600 shadow-md" : "w-2.5 bg-slate-200 hover:bg-slate-300"
                    }`}
                />
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
