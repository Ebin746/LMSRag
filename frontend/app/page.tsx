"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ChatOverlay from "@/components/chat-overlay";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Course {
  name: string;
  price: number;
  duration: string;
  level: string;
  tag?: string;
  logo: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
  courses: Course[];
}

// ─── CDN helpers ──────────────────────────────────────────────────────────────
const di = (name: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;
const si = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories: Category[] = [
  {
    id: "data-science",
    label: "Data Science & AI",
    icon: "🤖",
    description: "Master AI and data analytics — from Python to Power BI, tailored for industry readiness.",
    courses: [
      { name: "Python / Django",       price: 3500, duration: "3 Months", level: "Beginner",     tag: "Popular", logo: di("python") },
      { name: "Machine Learning",      price: 4000, duration: "4 Months", level: "Intermediate", tag: "Hot",     logo: di("tensorflow", "original") },
      { name: "Data Science Training", price: 4000, duration: "4 Months", level: "Intermediate", tag: "Hot",     logo: di("jupyter", "original-wordmark") },
      { name: "Tableau Training",      price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("tableau") },
      { name: "Microsoft Power BI",    price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("powerbi") },
      { name: "R Programming",         price: 2000, duration: "2 Months", level: "Beginner",                     logo: di("r", "original") },
      { name: "Business Analytics",    price: 3000, duration: "3 Months", level: "Intermediate",                 logo: si("googleanalytics") },
      { name: "IoT Training",          price: 3500, duration: "3 Months", level: "Intermediate",                 logo: si("arduino") },
      { name: "Embedded Systems",      price: 3000, duration: "3 Months", level: "Intermediate",                 logo: si("raspberrypi") },
    ],
  },
  {
    id: "web-dev",
    label: "Web Development",
    icon: "🌐",
    description: "Expert-led training in Angular, Node, PHP, Laravel, Django, ASP.NET and more — in Kochi.",
    courses: [
      { name: "Angular JS",       price: 3000, duration: "2 Months", level: "Intermediate", tag: "Popular", logo: di("angularjs", "original") },
      { name: "Node JS",          price: 3000, duration: "2 Months", level: "Intermediate",                  logo: di("nodejs", "original") },
      { name: "Java Course",      price: 3500, duration: "3 Months", level: "Beginner",                      logo: di("java", "original") },
      { name: "Java Spring",      price: 3500, duration: "3 Months", level: "Intermediate",                  logo: di("spring", "original") },
      { name: "PHP & MySQL",      price: 2500, duration: "2 Months", level: "Beginner",      tag: "Popular", logo: di("php", "original") },
      { name: "Laravel Training", price: 2500, duration: "2 Months", level: "Intermediate",                  logo: di("laravel", "original") },
      { name: "Codeigniter",      price: 2000, duration: "6 Weeks",  level: "Beginner",                      logo: di("codeigniter", "plain") },
      { name: "MEAN Stack",       price: 4000, duration: "4 Months", level: "Intermediate",  tag: "Hot",     logo: di("mongodb", "original") },
      { name: "WordPress",        price: 2000, duration: "6 Weeks",  level: "Beginner",                      logo: di("wordpress", "original") },
      { name: "ASP.NET MVC",      price: 3500, duration: "3 Months", level: "Intermediate",                  logo: di("dot-net", "original") },
      { name: "UI/UX Training",   price: 3000, duration: "2 Months", level: "Beginner",                      logo: di("figma", "original") },
      { name: "Framer Training",  price: 2500, duration: "6 Weeks",  level: "Beginner",                      logo: si("framer") },
      { name: "Webflow Training", price: 2500, duration: "6 Weeks",  level: "Beginner",                      logo: si("webflow") },
    ],
  },
  {
    id: "mobile",
    label: "Mobile App Dev",
    icon: "📱",
    description: "Flutter, Android, and iOS training — with internship and certification in Kochi since 2007.",
    courses: [
      { name: "Flutter Training",      price: 3500, duration: "3 Months", level: "Intermediate", tag: "Hot",     logo: di("flutter", "original") },
      { name: "Android Development",   price: 3500, duration: "3 Months", level: "Intermediate", tag: "Popular", logo: di("android", "original") },
      { name: "iPhone (iOS) Training", price: 4000, duration: "3 Months", level: "Intermediate",                 logo: di("apple", "original") },
    ],
  },
  {
    id: "digital-marketing",
    label: "AI Digital Marketing",
    icon: "📣",
    description: "AI-powered marketing courses covering SEO, Google Ads, Facebook, YouTube, ChatGPT & more.",
    courses: [
      { name: "AI Digital Marketing",          price: 3500, duration: "3 Months", level: "Beginner",     tag: "New",     logo: si("openai") },
      { name: "Google SEO Certification",      price: 3000, duration: "2 Months", level: "Beginner",     tag: "Popular", logo: di("google", "original") },
      { name: "On-Page SEO Training",          price: 2000, duration: "6 Weeks",  level: "Beginner",                     logo: si("googlesearchconsole") },
      { name: "SEO Training",                  price: 2500, duration: "2 Months", level: "Beginner",                     logo: si("semrush") },
      { name: "Search Engine Marketing (SEM)", price: 2500, duration: "2 Months", level: "Beginner",                     logo: si("googleads") },
      { name: "Facebook Marketing",            price: 2000, duration: "6 Weeks",  level: "Beginner",                     logo: si("facebook") },
      { name: "YouTube Marketing",             price: 2000, duration: "6 Weeks",  level: "Beginner",                     logo: si("youtube") },
      { name: "Social Media Marketing (SMM)",  price: 2500, duration: "2 Months", level: "Beginner",                     logo: si("instagram") },
      { name: "Email Marketing (MailChimp)",   price: 2000, duration: "4 Weeks",  level: "Beginner",                     logo: si("mailchimp") },
      { name: "Content Writing Course",        price: 2000, duration: "6 Weeks",  level: "Beginner",                     logo: si("medium") },
    ],
  },
  {
    id: "networking",
    label: "Networking & Security",
    icon: "🔒",
    description: "CCNA, AWS, Azure, Ethical Hacking, Firewall courses in Kochi with job placement support.",
    courses: [
      { name: "AWS Training",         price: 4000, duration: "3 Months", level: "Intermediate", tag: "Hot",     logo: si("amazonwebservices") },
      { name: "Ethical Hacking",      price: 4000, duration: "3 Months", level: "Intermediate", tag: "Popular", logo: si("kalilinux") },
      { name: "CCNA Training",        price: 3500, duration: "3 Months", level: "Intermediate",                 logo: si("cisco") },
      { name: "CCNP Training",        price: 4000, duration: "4 Months", level: "Advanced",                     logo: si("cisco") },
      { name: "Cyber Security",       price: 4000, duration: "3 Months", level: "Intermediate",                 logo: si("paloaltonetworks") },
      { name: "MCSE Training",        price: 3500, duration: "3 Months", level: "Intermediate",                 logo: si("microsoft") },
      { name: "MCSA Training",        price: 3000, duration: "2 Months", level: "Intermediate",                 logo: si("microsoft") },
      { name: "VMware – Vsphere",     price: 3500, duration: "2 Months", level: "Advanced",                     logo: si("vmware") },
      { name: "Fortigate Firewall",   price: 3000, duration: "2 Months", level: "Intermediate",                 logo: si("fortinet") },
      { name: "CCNA Security",        price: 3500, duration: "2 Months", level: "Intermediate",                 logo: si("cisco") },
      { name: "System Administrator", price: 3000, duration: "3 Months", level: "Intermediate",                 logo: si("linux") },
      { name: "Hardware Courses",     price: 2500, duration: "2 Months", level: "Beginner",                     logo: si("raspberrypi") },
      { name: "Networking Courses",   price: 2500, duration: "2 Months", level: "Beginner",                     logo: si("wireshark") },
      { name: "Software Testing",     price: 3000, duration: "3 Months", level: "Beginner",                     logo: si("selenium") },
    ],
  },
  {
    id: "design",
    label: "Design & Creative",
    icon: "🎨",
    description: "Graphic design, video editing, motion graphics, UI/UX and 3D — from industry professionals.",
    courses: [
      { name: "Figma Training",      price: 2500, duration: "6 Weeks",  level: "Beginner",     tag: "Popular", logo: di("figma", "original") },
      { name: "Adobe Photoshop",     price: 2000, duration: "6 Weeks",  level: "Beginner",                     logo: si("adobephotoshop") },
      { name: "Adobe Illustrator",   price: 2000, duration: "6 Weeks",  level: "Beginner",                     logo: si("adobeillustrator") },
      { name: "Adobe Premiere Pro",  price: 2500, duration: "2 Months", level: "Beginner",                     logo: si("adobepremierepro") },
      { name: "Adobe After Effects", price: 3000, duration: "2 Months", level: "Intermediate",                 logo: si("adobeaftereffects") },
      { name: "Adobe InDesign",      price: 2000, duration: "6 Weeks",  level: "Beginner",                     logo: si("adobeindesign") },
      { name: "Final Cut Pro",       price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("finalcutpro") },
      { name: "DaVinci Resolve",     price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("davinciresolve") },
      { name: "Blender Training",    price: 3000, duration: "3 Months", level: "Intermediate",                 logo: di("blender", "original") },
      { name: "Toon Boom Training",  price: 3000, duration: "2 Months", level: "Intermediate",                 logo: si("toonboom") },
      { name: "Adobe XD Training",   price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("adobexd") },
      { name: "Canva Training",      price: 2000, duration: "4 Weeks",  level: "Beginner",                     logo: si("canva") },
      { name: "Sketch Training",     price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("sketch") },
      { name: "Web Design Training", price: 2500, duration: "2 Months", level: "Beginner",                     logo: di("html5", "original") },
    ],
  },
  {
    id: "erp",
    label: "ERP & Business Tools",
    icon: "📊",
    description: "Odoo, Power BI, Salesforce, Azure, DevOps, Zoho Books training in Kochi with certification.",
    courses: [
      { name: "Microsoft Azure",        price: 4000, duration: "3 Months", level: "Intermediate", tag: "Hot",     logo: di("azure", "original") },
      { name: "DevOps Training",        price: 4000, duration: "3 Months", level: "Intermediate", tag: "Popular", logo: di("docker", "original") },
      { name: "Salesforce Training",    price: 3500, duration: "3 Months", level: "Intermediate",                 logo: si("salesforce") },
      { name: "Odoo Training",          price: 3000, duration: "2 Months", level: "Intermediate",                 logo: si("odoo") },
      { name: "Microsoft Dynamics 365", price: 3500, duration: "3 Months", level: "Intermediate",                 logo: si("microsoft") },
      { name: "Oracle ERP",             price: 4000, duration: "4 Months", level: "Advanced",                     logo: di("oracle", "original") },
      { name: "Microsoft Excel",        price: 2000, duration: "4 Weeks",  level: "Beginner",                     logo: si("microsoftexcel") },
      { name: "Shopify Training",       price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("shopify") },
      { name: "Zoho Books Training",    price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("zoho") },
      { name: "Hubspot CRM",            price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("hubspot") },
      { name: "QuickBooks Training",    price: 2500, duration: "6 Weeks",  level: "Beginner",                     logo: si("quickbooks") },
      { name: "Microsoft SharePoint",   price: 3000, duration: "2 Months", level: "Intermediate",                 logo: si("microsoftsharepoint") },
      { name: "Game Design & Dev",      price: 3500, duration: "4 Months", level: "Intermediate", tag: "New",     logo: si("unity") },
      { name: "CockroachDB Training",   price: 3000, duration: "2 Months", level: "Intermediate",                 logo: si("cockroachlabs") },
      { name: "Technical Writing",      price: 2000, duration: "4 Weeks",  level: "Beginner",                     logo: si("googledocs") },
    ],
  },
];

// ─── Design tokens ────────────────────────────────────────────────────────────
const levelBadge: Record<string, string> = {
  Beginner:     "bg-blue-50 text-blue-700 border border-blue-200",
  Intermediate: "bg-gray-100 text-gray-700 border border-gray-200",
  Advanced:     "bg-red-50 text-red-700 border border-red-200",
};

const tagStyle: Record<string, string> = {
  Hot:     "bg-red-600 text-white",
  Popular: "bg-blue-600 text-white",
  New:     "bg-gray-900 text-white",
};

const stats = [
  { value: "18+",     label: "Years of Excellence" },
  { value: "10,000+", label: "Students Trained" },
  { value: "80+",     label: "Courses Available" },
  { value: "95%",     label: "Placement Rate" },
];

// ─── Tech Logo Component ──────────────────────────────────────────────────────
function CourseLogo({ src, name, fallback }: { src: string; name: string; fallback: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
        {fallback}
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center p-2 flex-shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="w-full h-full object-contain" onError={() => setErr(true)} loading="lazy" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery]       = useState("");
  const [isMenuOpen, setIsMenuOpen]         = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const coursesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToCourses = () => coursesRef.current?.scrollIntoView({ behavior: "smooth" });

  const filteredCategories = categories
    .map((cat) => ({ ...cat, courses: cat.courses.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())) }))
    .filter((cat) => (activeCategory === "all" || cat.id === activeCategory) && cat.courses.length > 0);

  const totalCourses = categories.reduce((a, c) => a + c.courses.length, 0);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">

      {/* ════════════════════════════════════════════════════════════
          NAVBAR  —  Black background, white text, blue CTA
      ════════════════════════════════════════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md border-b border-gray-200" : "bg-white border-b border-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center transition-colors">
              <span className="text-white font-extrabold text-sm tracking-tight">NS</span>
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-blue-600 text-lg tracking-tight leading-none">Nestsoft</div>
              <div className="text-[10px] text-gray-400 font-medium tracking-widest uppercase leading-none">TechnoMaster</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <button onClick={scrollToCourses} className="hover:text-blue-600 transition-colors">Courses</button>
            <a href="#about"   className="hover:text-blue-600 transition-colors">About</a>
            <a href="#why-us"  className="hover:text-blue-600 transition-colors">Why Us</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login"  className="text-sm font-semibold text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors">Login</Link>
            <Link href="/signup" className="text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm shadow-blue-200 transition-all">
              Enroll Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-3 shadow-lg">
            <button onClick={() => { scrollToCourses(); setIsMenuOpen(false); }} className="block w-full text-left text-sm font-medium text-gray-700 py-2 hover:text-blue-600">Courses</button>
            <a href="#about"   onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2 hover:text-blue-600">About</a>
            <a href="#why-us"  onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2 hover:text-blue-600">Why Us</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2 hover:text-blue-600">Contact</a>
            <div className="flex gap-3 pt-2">
              <Link href="/login"  className="flex-1 text-center text-sm font-semibold border border-gray-200 text-gray-700 py-2.5 rounded-lg">Login</Link>
              <Link href="/signup" className="flex-1 text-center text-sm font-bold bg-blue-600 text-white py-2.5 rounded-lg">Enroll Now</Link>
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════════════════════════
          HERO  —  Black background, white headline, blue accent, red badge
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 pt-28 pb-24 px-6 relative overflow-hidden">
        {/* Subtle blue glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-red-700/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Kochi&apos;s #1 IT Training Institute Since 2007
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-6">
              Launch Your Career<br />
              with{" "}
              <span className="text-blue-500">Expert-Led</span>{" "}
              <span className="text-white">Tech Courses</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mb-10">
              Join <span className="text-white font-semibold">Nestsoft TechnoMaster</span> — offering{" "}
              <span className="text-blue-400 font-semibold">{totalCourses}+ professional courses</span>{" "}
              in Web Dev, AI, Data Science, Mobile Apps, Networking, Design & ERP.
              Online &amp; Offline batches in Kochi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToCourses}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base shadow-xl shadow-blue-900/50 transition-all"
              >
                Explore All Courses
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-xl text-base border border-gray-700 transition-all"
              >
                Talk to Advisor
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-16 border-t border-gray-800">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-blue-400">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ABOUT  —  White background, black text
      ════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-5">
                About Nestsoft
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                Empowering Careers<br />Since <span className="text-blue-600">2007</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong className="text-gray-900">Nestsoft TechnoMaster</strong> is Kochi's premier IT training institute. Since 2007, we've trained over <strong className="text-gray-900">10,000+ students</strong> with industry-relevant skills that lead to real careers.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Expert-led courses across Web Development, Data Science, AI, Mobile Apps, Digital Marketing, Networking, ERP and Design — with online &amp; offline batches, live projects, internship programs, and job placement support.
              </p>
              <div className="flex flex-wrap gap-2">
                {["ISO Certified", "Industry Experts", "Live Projects", "Internship Support", "Job Placement", "Online & Offline"].map((t) => (
                  <span key={t} className="text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-full">✓ {t}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🎓", title: "Certified Training",  desc: "Industry-recognized certificates upon course completion" },
                { icon: "💼", title: "Internship Program",  desc: "Real-world live project experience with top companies" },
                { icon: "👨‍💻", title: "Expert Mentors",     desc: "Learn from professionals with 10+ years of industry work" },
                { icon: "🌐", title: "Flexible Learning",   desc: "Online & offline batches, morning & evening timings" },
              ].map((f) => (
                <div key={f.title} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg transition-all group">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">{f.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WHY US  —  Blue background (accent section)
      ════════════════════════════════════════════════════════════ */}
      <section id="why-us" className="py-20 px-6 bg-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-200 bg-blue-700/50 border border-blue-500 px-3 py-1.5 rounded-full mb-5">
            Why Nestsoft
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Why 10,000+ Students Choose Us</h2>
          <p className="text-blue-200 mb-12 max-w-xl mx-auto text-sm">We don&apos;t just teach technology — we build careers.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "🏆", label: "18+ Years Experience" },
              { icon: "📜", label: "Certified Courses" },
              { icon: "🔬", label: "Live Project Training" },
              { icon: "🤝", label: "Job Placement" },
              { icon: "💡", label: "Small Batch Size" },
              { icon: "🕐", label: "Flexible Timings" },
            ].map((w) => (
              <div key={w.label} className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-5 text-center transition-all cursor-default">
                <div className="text-3xl mb-2">{w.icon}</div>
                <p className="text-white text-xs font-semibold leading-tight">{w.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          COURSES  —  Light gray bg, white cards, black text
      ════════════════════════════════════════════════════════════ */}
      <section ref={coursesRef} id="courses" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          {/* Section heading */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-4">
              All Courses
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">{totalCourses}+ Professional Courses</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              All courses include certification, live project training, and placement support. Online &amp; Offline available in Kochi.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-lg mx-auto mb-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search any course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${activeCategory === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"}`}
            >
              All Domains
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all flex items-center gap-1.5 ${activeCategory === cat.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-600 hover:text-blue-600"}`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Results */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-semibold text-gray-500">No courses found for &quot;<span className="text-gray-900">{searchQuery}</span>&quot;</p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredCategories.map((cat) => (
                <div key={cat.id}>

                  {/* Category header — solid black with blue accent line */}
                  <div className="bg-gray-900 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-5 border-l-4 border-blue-500">
                    <div className="text-5xl">{cat.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold text-white mb-1">{cat.label}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{cat.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                        {cat.courses.length} Courses
                      </span>
                    </div>
                  </div>

                  {/* Course grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {cat.courses.map((course) => (
                      <div
                        key={course.name}
                        className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 flex flex-col relative overflow-hidden group"
                      >
                        {/* Top accent line on hover */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                        {/* Tag */}
                        {course.tag && (
                          <span className={`absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${tagStyle[course.tag]}`}>
                            {course.tag}
                          </span>
                        )}

                        {/* Logo */}
                        <div className="mb-4">
                          <CourseLogo src={course.logo} name={course.name} fallback={cat.icon} />
                        </div>

                        {/* Name */}
                        <h4 className="font-bold text-gray-900 text-[15px] leading-snug mb-2 pr-12">{course.name}</h4>

                        {/* Duration + Level */}
                        <div className="flex items-center gap-2 mb-auto flex-wrap">
                          <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelBadge[course.level]}`}>
                            {course.level}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t-2 border-gray-50 my-4" />

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 font-medium block">Starts from</span>
                            <span className="text-xl font-extrabold text-gray-900">
                              ₹{course.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <Link
                            href="/signup"
                            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                          >
                            Enroll →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA BANNER  —  Black with blue button, red accent line
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-950 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl border border-gray-800">
            {/* Red top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600/20 border border-blue-600/40 rounded-2xl mb-6 text-3xl">🚀</div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Ready to Start Your Career?</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Join thousands of students who transformed their careers with Nestsoft. Enroll today for expert mentors, live projects, and placement support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-blue-900/50 transition-all">
                  Enroll Now — Free Consultation
                </Link>
                <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all">
                  Talk to an Advisor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CONTACT  —  Light gray bg, white cards
      ════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-20 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-4">
              Contact Us
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Get In Touch with Nestsoft</h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">Our advisors are ready to help you choose the right course and kickstart your career.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { icon: "📍", title: "Location",  info: "Kochi, Kerala, India",  sub: "Offline & Online Batches",  color: "border-blue-200 hover:border-blue-400" },
              { icon: "📞", title: "Phone",     info: "+91 95393 03386",        sub: "Mon–Sat, 9 AM–6 PM",       color: "border-red-200 hover:border-red-400" },
              { icon: "✉️", title: "Email",     info: "info@nestsoft.com",      sub: "Reply within 24 hours",    color: "border-blue-200 hover:border-blue-400" },
            ].map((c) => (
              <div key={c.title} className={`bg-white border-2 ${c.color} rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all`}>
                <div className="text-3xl mb-3">{c.icon}</div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{c.title}</h4>
                <p className="text-blue-600 font-bold text-sm">{c.info}</p>
                <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER  —  Black background
      ════════════════════════════════════════════════════════════ */}
      <footer className="bg-gray-950 text-gray-400 py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Red separator line */}
          <div className="h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent mb-10" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">NS</span>
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-tight">Nestsoft TechnoMaster</div>
                <div className="text-xs text-gray-500">Trusted IT Training Since 2007 · Kochi, Kerala</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <button onClick={scrollToCourses} className="hover:text-white transition-colors">Courses</button>
              <a href="#about"   className="hover:text-white transition-colors">About</a>
              <a href="#why-us"  className="hover:text-white transition-colors">Why Us</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <Link href="/login"  className="hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Enroll</Link>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} Nestsoft TechnoMaster. All rights reserved.</p>
            <p>Web Dev · Data Science · AI · Mobile · Networking · Design · ERP</p>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING CHAT ───────────────────────────────────────────────────── */}
      <ChatOverlay />
    </div>
  );
}
