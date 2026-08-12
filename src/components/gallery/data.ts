export type Category =
  | "Workshops"
  | "Conferences"
  | "Hackathons"
  | "Technical Talks"
  | "Competitions"
  | "Industrial Visits"
  | "Community Service"
  | "IEEE Day"
  | "Awards"
  | "Student Activities";

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: Category;
  image: string;
  year: number;
}

// Import all local gallery images from both Display/images and ieee subfolders
const displayImages = import.meta.glob("../../assets/gallery/Display/images/*.{jpg,jpeg,png,JPG,JPEG}", {
  eager: true,
}) as Record<string, { default: string }>;

const ieeeImages = import.meta.glob("../../assets/gallery/ieee/*.{jpg,jpeg,png,JPG,JPEG}", {
  eager: true,
}) as Record<string, { default: string }>;

const imageModules = { ...displayImages, ...ieeeImages };

export const categories: Category[] = [
  "Workshops",
  "Conferences",
  "Hackathons",
  "Technical Talks",
  "Competitions",
  "Industrial Visits",
  "Community Service",
  "IEEE Day",
  "Awards",
  "Student Activities",
];

const metadataMap: Record<string, { title: string; date: string; description: string; category: Category; year: number }> = {
  "1.IEEE Day 2023 Event group photo.jpg": {
    title: "IEEE Day 2023 Celebration",
    date: "October 3, 2023",
    description: "Group photo of student members and officers celebrating the annual IEEE Day.",
    category: "IEEE Day",
    year: 2023
  },
  "1a.IEEE Day 2023 Photo Contest on 3rd October 2023.jpg": {
    title: "IEEE Day 2023 Photo Contest",
    date: "October 3, 2023",
    description: "Creative photography submission by students highlighting technology in daily life.",
    category: "Competitions",
    year: 2023
  },
  "2.Soft Skills for Every Engineer seminar conducted on 22.09.2023.jpg": {
    title: "Soft Skills for Every Engineer Seminar",
    date: "September 22, 2023",
    description: "Distinguished guest lecture highlighting communication, leadership, and emotional intelligence for engineering success.",
    category: "Technical Talks",
    year: 2023
  },
  "20230922_104102.jpg": {
    title: "Professional Development Seminar",
    date: "September 22, 2023",
    description: "Interactive learning session showing active student participation during the professional soft skills seminar.",
    category: "Technical Talks",
    year: 2023
  },
  "3. IEEE Student Branch Inaguration on Advancing Technology for Humanity - group photo on 01.09.2023.jpg": {
    title: "IEEE SREC Student Branch Inauguration",
    date: "September 1, 2023",
    description: "Grand launch event with distinguished guests, department heads, and core team members.",
    category: "Student Activities",
    year: 2023
  },
  "3a.IEEE SB SREC Photo 1.JPG": {
    title: "IEEE SREC Core Team Portrait",
    date: "September 1, 2023",
    description: "Official inaugural group photo of SREC IEEE Student Branch members.",
    category: "Student Activities",
    year: 2023
  },
  "4.IEEE Student Branch Drive 2024 conducted for CSE Students on 8.9.2023.jpg": {
    title: "Student Branch Drive 2024 (CSE)",
    date: "September 8, 2023",
    description: "Membership awareness drive introducing Computer Science students to IEEE opportunities and benefits.",
    category: "Student Activities",
    year: 2023
  },
  "5.Attended IEEE Region 10 Section Chapter Symposium on Dec 2023.jpg": {
    title: "IEEE Region 10 Symposium",
    date: "December 2023",
    description: "SREC delegation participating in the prestigious IEEE Region 10 Section Chapter Symposium.",
    category: "Conferences",
    year: 2023
  },
  "IEEE (2).jpg": {
    title: "IEEE Chapter Technical Session",
    date: "August 2024",
    description: "Interactive expert session focused on chapter goals and upcoming academic projects.",
    category: "Technical Talks",
    year: 2024
  },
  "IEEE Day 1.jpg": {
    title: "IEEE Day Inaugural Address",
    date: "October 3, 2023",
    description: "Opening keynote by the Student Branch counselor on the impact of IEEE global community.",
    category: "IEEE Day",
    year: 2023
  },
  "IEEE Day 2.jpg": {
    title: "IEEE Day Student Branch Panel",
    date: "October 3, 2023",
    description: "Interactive student-led panel sharing volunteer and career development insights.",
    category: "IEEE Day",
    year: 2023
  },
  "IEEE Day 3.jpg": {
    title: "IEEE Day Awards Ceremony",
    date: "October 3, 2023",
    description: "Honoring outstanding active volunteers and student branch contributors.",
    category: "IEEE Day",
    year: 2023
  },
  "IEEE Xtreme 19.0 1 - Copy.jpg": {
    title: "IEEE Xtreme 19.0 Programming Competition",
    date: "October 2025",
    description: "24-hour global hackathon where teams solve complex programming and algorithm questions.",
    category: "Hackathons",
    year: 2025
  },
  "IEEE Xtreme 19.0 1.jpg": {
    title: "IEEE Xtreme 19.0 Programming Competition",
    date: "October 2025",
    description: "24-hour global hackathon where teams solve complex programming and algorithm questions.",
    category: "Hackathons",
    year: 2025
  },
  "IEEE Xtreme 19.0 2.jpg": {
    title: "IEEE Xtreme Coders Challenge",
    date: "October 2025",
    description: "SREC team coding continuously through the night to solve global-level questions.",
    category: "Hackathons",
    year: 2025
  },
  "IEEE Xtreme 19.0 3.jpg": {
    title: "IEEE Xtreme Team Session",
    date: "October 2025",
    description: "Students collaborating on optimization algorithms during the high-stakes programming challenge.",
    category: "Hackathons",
    year: 2025
  },
  "IEEE Xtreme 19.0.jpg": {
    title: "IEEE Xtreme 19.0 Launch Event",
    date: "October 2025",
    description: "Official inaugural kickoff for SREC teams participating in the global IEEE Xtreme event.",
    category: "Hackathons",
    year: 2025
  },
  "IMG-20231201-WA0099.jpg": {
    title: "National Seminar Presentation",
    date: "December 1, 2023",
    description: "Student presentation on embedded systems and internet of things prototypes.",
    category: "Technical Talks",
    year: 2023
  },
  "IMG-20231201-WA0100.jpg": {
    title: "Madras Section Officer Summit",
    date: "December 1, 2023",
    description: "Office bearers representing SREC at the Madras Section Annual Officer Summit.",
    category: "Conferences",
    year: 2023
  },
  "IMG-20231201-WA0103.jpg": {
    title: "IEEE Core Committee Meeting",
    date: "December 1, 2023",
    description: "Strategic planning meeting to review annual milestones and student branch progress.",
    category: "Student Activities",
    year: 2023
  },
  "IMG-20231201-WA0105.jpg": {
    title: "Student Chapter Leadership Meet",
    date: "December 1, 2023",
    description: "Panel discussion with student leaders discussing future inter-college events.",
    category: "Student Activities",
    year: 2023
  },
  "IMG_1726.JPG": {
    title: "Advanced Robotics Workshop",
    date: "March 2024",
    description: "Hands-on training session on robotic path finding and sensor integration.",
    category: "Workshops",
    year: 2024
  },
  "IMG_1732.JPG": {
    title: "Circuit Prototyping Workshop",
    date: "March 2024",
    description: "Students assembling power distribution boards and testing circuit pathways.",
    category: "Workshops",
    year: 2024
  },
  "IMG_1741.JPG": {
    title: "Hands-on Microcontroller Training",
    date: "March 2024",
    description: "Coding controllers and testing peripheral inputs during the technology workshop.",
    category: "Workshops",
    year: 2024
  },
  "IMG_1750.JPG": {
    title: "Industrial Automation Lab",
    date: "March 2024",
    description: "Practical session using PLC boards and automation tools for factory simulations.",
    category: "Workshops",
    year: 2024
  },
  "IMG_1785.JPG": {
    title: "Project Design Review Session",
    date: "April 2024",
    description: "Mentors checking circuit schematics and software architecture of student groups.",
    category: "Student Activities",
    year: 2024
  },
  "IMG_1811.JPG": {
    title: "Project Expo Prototype Demo",
    date: "April 2024",
    description: "Public presentation of an automated smart farming prototype by student inventors.",
    category: "Competitions",
    year: 2024
  },
  "IMG_1836.JPG": {
    title: "Technical Symposium Inauguration",
    date: "April 2024",
    description: "Inaugural lighting of the lamp by chief guests at the national level technical symposium.",
    category: "Conferences",
    year: 2024
  },
  "IMG_1861.JPG": {
    title: "Distinguished Guest Welcoming",
    date: "April 2024",
    description: "Welcoming chief guests and keynote speakers from local technology companies.",
    category: "Student Activities",
    year: 2024
  },
  "IMG_1872.JPG": {
    title: "National Webathon Inauguration",
    date: "April 2024",
    description: "Kickoff ceremony for the 24-hour web engineering hackathon event.",
    category: "Hackathons",
    year: 2024
  },
  "IMG_1929.JPG": {
    title: "Robotics Arena Showcase",
    date: "April 2024",
    description: "Robot combat arena matches drawing huge student crowd during the tech fest.",
    category: "Competitions",
    year: 2024
  },
  "IMG_1945.JPG": {
    title: "National Coding Challenge Winners",
    date: "April 2024",
    description: "Trophy and certificate distribution ceremony for the top three winning coding teams.",
    category: "Awards",
    year: 2024
  },
  "IMG_1948.JPG": {
    title: "Valedictory Ceremony Group Photo",
    date: "April 2024",
    description: "Final day group picture of coordinators, winners, and guests of the symposium.",
    category: "Student Activities",
    year: 2024
  },
  "IMG_1955.JPG": {
    title: "Symposium Organizing Committee",
    date: "April 2024",
    description: "Dedicated group of IEEE student volunteers who organized the annual symposium.",
    category: "Student Activities",
    year: 2024
  },
  "IMG_2060.JPG": {
    title: "ECE Student Orientation Program",
    date: "June 2024",
    description: "Introduction of department labs and IEEE student chapter to incoming students.",
    category: "Student Activities",
    year: 2024
  },
  "IMG_2200.JPG": {
    title: "IEEE Day Volunteer Appreciation",
    date: "October 2024",
    description: "Felicitation of core committee members for executing IEEE Day events smoothly.",
    category: "IEEE Day",
    year: 2024
  },
  "IMG_2266.JPG": {
    title: "Industrial Automation Seminar",
    date: "August 2024",
    description: "Experts demonstrating automated manufacturing processes and robotic arm controllers.",
    category: "Technical Talks",
    year: 2024
  },
  "VISION X GROUP PHOTO 29.08.2025-ENHANCED.png": {
    title: "VISION X Symposium Group Photo",
    date: "August 29, 2025",
    description: "Official group picture capturing all student participants and chief guests during the Vision X national symposium.",
    category: "Student Activities",
    year: 2025
  },
  "IEEE DAY CELE 005.jpg": {
    title: "IEEE Day Fun Activities",
    date: "October 2024",
    description: "Joyful group interaction and team bonding activities organized during IEEE Day celebrations.",
    category: "IEEE Day",
    year: 2024
  },
  "IEEE DAY CELE.jpg": {
    title: "IEEE Day Commemoration",
    date: "October 2024",
    description: "SREC campus decorated and buzzing with excitement during the global IEEE Day celebrations.",
    category: "IEEE Day",
    year: 2024
  },
  "IEEE India Council COngress at Goa Aug 2023 with R 10 Members.jpg": {
    title: "IEEE India Council Congress (Goa)",
    date: "August 2023",
    description: "Student Branch officers representing SREC at the national level alongside Region 10 delegates.",
    category: "Conferences",
    year: 2023
  },
  "IEEE SB Drive Jan 2024.jpg": {
    title: "IEEE Membership Drive 2024",
    date: "January 2024",
    description: "Outreach program highlighting research domains, student chapters, and societies to junior students.",
    category: "Student Activities",
    year: 2024
  },
  "IEEE SB Inaugural Function 24-25.jpg": {
    title: "Inaugural Function 2024-25",
    date: "July 2024",
    description: "Official swearing-in ceremony for the newly elected office bearers for the academic year 2024-25.",
    category: "Student Activities",
    year: 2024
  },
  "IMG-20161001-WA0026.jpg": {
    title: "Legacy Student Branch Event",
    date: "October 2016",
    description: "Archival memory of our early days representing the foundation of IEEE at SREC.",
    category: "Student Activities",
    year: 2022
  },
  "IMG20251212100016.jpg": {
    title: "Annual Project Review Meeting",
    date: "December 12, 2025",
    description: "Evaluation and presentation of final year projects by senior members before the review committee.",
    category: "Competitions",
    year: 2025
  },
  "IMG20251212100452.jpg": {
    title: "National Coding Challenge Showcase",
    date: "December 12, 2025",
    description: "Interactive session showing student project prototype demonstrations during the regional expo.",
    category: "Competitions",
    year: 2025
  },
  "IMG_0649.JPG": {
    title: "IoT Systems Hands-on Workshop",
    date: "March 2025",
    description: "Students building smart sensor networks and programming microcontrollers in the lab.",
    category: "Workshops",
    year: 2025
  },
  "IMG_1393.JPG": {
    title: "AI Development HackFest",
    date: "October 2024",
    description: "Intense coding session during the SREC HackFest focusing on generative AI tools.",
    category: "Hackathons",
    year: 2024
  },
  "IMG_2121.JPG": {
    title: "Robotics Design Competition",
    date: "September 2024",
    description: "Students testing their mobile robot designs on the obstacle course prior to competition kickoff.",
    category: "Competitions",
    year: 2024
  },
  "IMG_2125.JPG": {
    title: "Technical Paper Presentation",
    date: "February 2025",
    description: "Student presenting a research paper on sustainable energy solutions to external evaluators.",
    category: "Conferences",
    year: 2025
  },
  "IMG_2243.JPG": {
    title: "Expert Panel Discussion",
    date: "July 2024",
    description: "Distinguished IEEE Fellows discussing future directions in telecommunication and 6G technologies.",
    category: "Technical Talks",
    year: 2024
  },
  "IMG_2494.JPG": {
    title: "Hardware Hackathon 2024",
    date: "October 24, 2024",
    description: "Collaborative prototyping event where teams design smart grids and power circuits.",
    category: "Hackathons",
    year: 2024
  },
  "IMG_2585.jpg": {
    title: "VLSI Architecture Seminar",
    date: "September 2023",
    description: "In-depth lecture on semiconductor design and chip architectures by an industry engineer.",
    category: "Technical Talks",
    year: 2023
  },
  "IMG_4942.jpg": {
    title: "Digital Empowerment Outreach",
    date: "June 2024",
    description: "IEEE volunteers conducting interactive tech-classes for school students in rural regions.",
    category: "Community Service",
    year: 2024
  },
  "IMG_5032.jpg": {
    title: "Clean Energy Community Drive",
    date: "November 2022",
    description: "SIGHT volunteers demonstrating solar light installations for street vendors.",
    category: "Community Service",
    year: 2022
  },
  "IMG_5335.jpg": {
    title: "Advanced Web Development Bootcamp",
    date: "November 2023",
    description: "Comprehensive weekend workshop on modern frontend frameworks and deployment platforms.",
    category: "Workshops",
    year: 2023
  },
  "IMG_9143.JPG": {
    title: "Industry Liaison Meet",
    date: "April 2024",
    description: "Networking session between SREC student branch and local tech companies for internships.",
    category: "Student Activities",
    year: 2024
  },
  "Photo web.jpg": {
    title: "Web Engineering Workshop",
    date: "March 2025",
    description: "Hands-on session on building responsive web apps using TypeScript and React.",
    category: "Workshops",
    year: 2025
  },
  "v24.jpg": {
    title: "IEEE Venture Pitching Expo",
    date: "April 2024",
    description: "Budding entrepreneurs pitching tech business ideas to local angel investors.",
    category: "Competitions",
    year: 2024
  }
};

export const galleryItems: GalleryItem[] = Object.entries(imageModules).map(([path, module]: [string, any], index) => {
  const fileName = path.split("/").pop() || "";
  const meta = metadataMap[fileName] || {
    title: fileName.split(".")[0].replace(/[-_]/g, " "),
    date: "Recent Activity",
    description: "IEEE SREC Event memory.",
    category: "Student Activities" as Category,
    year: 2024
  };

  return {
    id: `local-${index}`,
    title: meta.title,
    date: meta.date,
    description: meta.description,
    category: meta.category,
    image: module.default,
    year: meta.year
  };
});

export const featuredMemories = [
  { title: "IEEE Day Celebration", image: (imageModules["../../assets/gallery/Display/images/1.IEEE Day 2023 Event group photo.jpg"] || {}).default || "", year: "2023" },
  { title: "Professional Development Seminar", image: (imageModules["../../assets/gallery/Display/images/2.Soft Skills for Every Engineer seminar conducted on 22.09.2023.jpg"] || {}).default || "", year: "2023" },
  { title: "IEEE SREC Student Branch Inauguration", image: (imageModules["../../assets/gallery/Display/images/3. IEEE Student Branch Inaguration on Advancing Technology for Humanity - group photo on 01.09.2023.jpg"] || {}).default || "", year: "2023" },
  { title: "IEEE Region 10 Symposium", image: (imageModules["../../assets/gallery/Display/images/5.Attended IEEE Region 10 Section Chapter Symposium on Dec 2023.jpg"] || {}).default || "", year: "2023" },
  { title: "National Coding Challenge Showcase", image: (imageModules["../../assets/gallery/Display/images/IMG20251212100452.jpg"] || {}).default || "", year: "2025" },
  { title: "Hardware Hackathon 2024", image: (imageModules["../../assets/gallery/Display/images/IMG_2494.JPG"] || {}).default || "", year: "2024" },
];

export const stats = [
  { label: "Events", value: 250, suffix: "+" },
  { label: "Participants", value: 5000, suffix: "+" },
  { label: "Workshops", value: 100, suffix: "+" },
  { label: "Years of Excellence", value: 10, suffix: "+" },
];

export const timelineYears = [2022, 2023, 2024, 2025, 2026];

export const achievements = [
  { title: "Best Student Branch", subtitle: "IEEE Madras Section 2024", image: (imageModules["../../assets/gallery/Display/images/v24.jpg"] || {}).default || "" },
  { title: "50+ Certificates", subtitle: "Awarded in 2024 alone", image: (imageModules["../../assets/gallery/Display/images/IEEE SB Inaugural Function 24-25.jpg"] || {}).default || "" },
  { title: "Winning Teams", subtitle: "12 national-level wins", image: (imageModules["../../assets/gallery/Display/images/IMG_2121.JPG"] || {}).default || "" },
  { title: "Volunteers", subtitle: "150+ active this year", image: (imageModules["../../assets/gallery/Display/images/3a.IEEE SB SREC Photo 1.JPG"] || {}).default || "" },
  { title: "Distinguished Speakers", subtitle: "20+ IEEE Fellows hosted", image: (imageModules["../../assets/gallery/Display/images/IMG_2243.JPG"] || {}).default || "" },
  { title: "Organizing Committee", subtitle: "The people behind the scenes", image: (imageModules["../../assets/gallery/Display/images/IEEE SB Drive Jan 2024.jpg"] || {}).default || "" },
];

export const videoGallery = [
  { title: "IEEE Day Highlights", id: "" },
  { title: "Workshop Highlights", id: "" },
  { title: "Conference Recap", id: "" },
  { title: "Student Testimonials", id: "" },
];

export const testimonials = [
  { name: "Nithin Annamalai", dept: "EEE, Second Year", quote: "IEEE SB SREC gave me the confidence to speak at my first international conference. The community is unmatched.", rating: 5, avatar: "" },
  { name: "Rahul Venkatesh", dept: "CSE, Third Year", quote: "From my first workshop to leading a hackathon team — every milestone happened here.", rating: 5, avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Divya Suresh", dept: "EEE, Alumni '23", quote: "The industrial visits and mentorship shaped the engineer I am today. Grateful forever.", rating: 5, avatar: "https://i.pravatar.cc/150?img=32" },
  { name: "Karthik Rajan", dept: "IT, Second Year", quote: "A branch that treats every idea seriously. Best decision I made in college.", rating: 5, avatar: "https://i.pravatar.cc/150?img=15" },
];
