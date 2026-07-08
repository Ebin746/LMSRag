"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Course {
  name: string;
  price: number;
  duration: string;
  level: string;
  tag?: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  accent: string;
  description: string;
  courses: Course[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories: Category[] = [
  {
    id: "data-science",
    label: "Data Science & AI",
    icon: "🤖",
    color: "bg-violet-50 border-violet-200",
    accent: "bg-violet-600",
    description:
      "Master the tools that power modern AI and data analytics — from Python to Power BI, tailored for industry readiness.",
    courses: [
      { name: "Python / Django", price: 3500, duration: "3 Months", level: "Beginner", tag: "Popular" },
      { name: "Machine Learning", price: 4000, duration: "4 Months", level: "Intermediate", tag: "Hot" },
      { name: "Data Science Training", price: 4000, duration: "4 Months", level: "Intermediate", tag: "Hot" },
      { name: "Tableau Training", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "Microsoft Power BI", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "R Programming", price: 2000, duration: "2 Months", level: "Beginner" },
      { name: "Business Analytics", price: 3000, duration: "3 Months", level: "Intermediate" },
      { name: "IoT Training", price: 3500, duration: "3 Months", level: "Intermediate" },
      { name: "Embedded Systems", price: 3000, duration: "3 Months", level: "Intermediate" },
    ],
  },
  {
    id: "web-dev",
    label: "Web Development",
    icon: "🌐",
    color: "bg-blue-50 border-blue-200",
    accent: "bg-blue-600",
    description:
      "Expert-led web development training in Angular, Node, PHP, Laravel, Django, ASP.NET and more — online and offline in Kochi.",
    courses: [
      { name: "Angular JS", price: 3000, duration: "2 Months", level: "Intermediate", tag: "Popular" },
      { name: "Node JS", price: 3000, duration: "2 Months", level: "Intermediate" },
      { name: "Java Course", price: 3500, duration: "3 Months", level: "Beginner" },
      { name: "Java Spring", price: 3500, duration: "3 Months", level: "Intermediate" },
      { name: "PHP & MySQL", price: 2500, duration: "2 Months", level: "Beginner", tag: "Popular" },
      { name: "Laravel Training", price: 2500, duration: "2 Months", level: "Intermediate" },
      { name: "Codeigniter", price: 2000, duration: "6 Weeks", level: "Beginner" },
      { name: "MEAN Stack", price: 4000, duration: "4 Months", level: "Intermediate", tag: "Hot" },
      { name: "WordPress Training", price: 2000, duration: "6 Weeks", level: "Beginner" },
      { name: "ASP.NET MVC", price: 3500, duration: "3 Months", level: "Intermediate" },
      { name: "UI/UX Training", price: 3000, duration: "2 Months", level: "Beginner" },
      { name: "Framer Training", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "Webflow Training", price: 2500, duration: "6 Weeks", level: "Beginner" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile App Dev",
    icon: "📱",
    color: "bg-emerald-50 border-emerald-200",
    accent: "bg-emerald-600",
    description:
      "Industry-expert mobile development training in Flutter, Android, and iOS — with internship and certification in Kochi since 2007.",
    courses: [
      { name: "Flutter Training", price: 3500, duration: "3 Months", level: "Intermediate", tag: "Hot" },
      { name: "Android Development", price: 3500, duration: "3 Months", level: "Intermediate", tag: "Popular" },
      { name: "iPhone (iOS) Training", price: 4000, duration: "3 Months", level: "Intermediate" },
    ],
  },
  {
    id: "digital-marketing",
    label: "AI Digital Marketing",
    icon: "📣",
    color: "bg-orange-50 border-orange-200",
    accent: "bg-orange-500",
    description:
      "AI-powered digital marketing courses in Kochi covering SEO, Google Ads, Facebook, YouTube, ChatGPT, and more — with live projects.",
    courses: [
      { name: "AI Digital Marketing", price: 3500, duration: "3 Months", level: "Beginner", tag: "New" },
      { name: "Google SEO Certification", price: 3000, duration: "2 Months", level: "Beginner", tag: "Popular" },
      { name: "On-Page SEO Training", price: 2000, duration: "6 Weeks", level: "Beginner" },
      { name: "SEO Training", price: 2500, duration: "2 Months", level: "Beginner" },
      { name: "Search Engine Marketing (SEM)", price: 2500, duration: "2 Months", level: "Beginner" },
      { name: "Facebook Marketing", price: 2000, duration: "6 Weeks", level: "Beginner" },
      { name: "YouTube Marketing", price: 2000, duration: "6 Weeks", level: "Beginner" },
      { name: "Social Media Marketing", price: 2500, duration: "2 Months", level: "Beginner" },
      { name: "Email Marketing (MailChimp)", price: 2000, duration: "4 Weeks", level: "Beginner" },
      { name: "Content Writing Course", price: 2000, duration: "6 Weeks", level: "Beginner" },
    ],
  },
  {
    id: "networking",
    label: "Networking & Security",
    icon: "🔒",
    color: "bg-red-50 border-red-200",
    accent: "bg-red-600",
    description:
      "Top networking & cyber security courses in Kochi — CCNA, AWS, Azure, Ethical Hacking, Firewall and more with job placement support.",
    courses: [
      { name: "AWS Training", price: 4000, duration: "3 Months", level: "Intermediate", tag: "Hot" },
      { name: "Ethical Hacking", price: 4000, duration: "3 Months", level: "Intermediate", tag: "Popular" },
      { name: "CCNA Training", price: 3500, duration: "3 Months", level: "Intermediate" },
      { name: "CCNP Training", price: 4000, duration: "4 Months", level: "Advanced" },
      { name: "Cyber Security", price: 4000, duration: "3 Months", level: "Intermediate" },
      { name: "MCSE Training", price: 3500, duration: "3 Months", level: "Intermediate" },
      { name: "MCSA Training", price: 3000, duration: "2 Months", level: "Intermediate" },
      { name: "VMware – Vsphere", price: 3500, duration: "2 Months", level: "Advanced" },
      { name: "Fortigate Firewall", price: 3000, duration: "2 Months", level: "Intermediate" },
      { name: "CCNA Security", price: 3500, duration: "2 Months", level: "Intermediate" },
      { name: "System Administrator", price: 3000, duration: "3 Months", level: "Intermediate" },
      { name: "Hardware Courses", price: 2500, duration: "2 Months", level: "Beginner" },
      { name: "Networking Courses", price: 2500, duration: "2 Months", level: "Beginner" },
      { name: "Software Testing", price: 3000, duration: "3 Months", level: "Beginner" },
    ],
  },
  {
    id: "design",
    label: "Design & Creative",
    icon: "🎨",
    color: "bg-pink-50 border-pink-200",
    accent: "bg-pink-500",
    description:
      "Creative design courses covering graphic design, video editing, motion graphics, UI/UX, and 3D — from industry professionals.",
    courses: [
      { name: "Figma Training", price: 2500, duration: "6 Weeks", level: "Beginner", tag: "Popular" },
      { name: "Adobe Photoshop", price: 2000, duration: "6 Weeks", level: "Beginner" },
      { name: "Adobe Illustrator", price: 2000, duration: "6 Weeks", level: "Beginner" },
      { name: "Adobe Premiere Pro", price: 2500, duration: "2 Months", level: "Beginner" },
      { name: "Adobe After Effects", price: 3000, duration: "2 Months", level: "Intermediate" },
      { name: "Adobe InDesign", price: 2000, duration: "6 Weeks", level: "Beginner" },
      { name: "Final Cut Pro", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "DaVinci Resolve", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "Blender Training", price: 3000, duration: "3 Months", level: "Intermediate" },
      { name: "Toon Boom Training", price: 3000, duration: "2 Months", level: "Intermediate" },
      { name: "Adobe XD Training", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "Canva Training", price: 2000, duration: "4 Weeks", level: "Beginner" },
      { name: "Sketch Training", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "Web Design Training", price: 2500, duration: "2 Months", level: "Beginner" },
    ],
  },
  {
    id: "erp",
    label: "ERP & Business Tools",
    icon: "📊",
    color: "bg-teal-50 border-teal-200",
    accent: "bg-teal-600",
    description:
      "ERP training in Kochi by industry experts — Odoo, Power BI, Tableau, Salesforce, Azure, DevOps, Zoho Books and more with certification.",
    courses: [
      { name: "Microsoft Azure", price: 4000, duration: "3 Months", level: "Intermediate", tag: "Hot" },
      { name: "DevOps Training", price: 4000, duration: "3 Months", level: "Intermediate", tag: "Popular" },
      { name: "Salesforce Training", price: 3500, duration: "3 Months", level: "Intermediate" },
      { name: "Odoo Training", price: 3000, duration: "2 Months", level: "Intermediate" },
      { name: "Microsoft Dynamics 365", price: 3500, duration: "3 Months", level: "Intermediate" },
      { name: "Oracle ERP", price: 4000, duration: "4 Months", level: "Advanced" },
      { name: "Microsoft Excel", price: 2000, duration: "4 Weeks", level: "Beginner" },
      { name: "Shopify Training", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "Zoho Books Training", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "Hubspot CRM", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "QuickBooks Training", price: 2500, duration: "6 Weeks", level: "Beginner" },
      { name: "Microsoft SharePoint", price: 3000, duration: "2 Months", level: "Intermediate" },
      { name: "Game Design & Dev", price: 3500, duration: "4 Months", level: "Intermediate", tag: "New" },
      { name: "CockroachDB Training", price: 3000, duration: "2 Months", level: "Intermediate" },
      { name: "Technical Writing", price: 2000, duration: "4 Weeks", level: "Beginner" },
    ],
  },
];

const levelColor: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-purple-100 text-purple-700",
};

const tagColor: Record<string, string> = {
  Hot: "bg-red-500",
  Popular: "bg-blue-500",
  New: "bg-green-500",
};

const stats = [
  { value: "18+", label: "Years of Excellence" },
  { value: "10,000+", label: "Students Trained" },
  { value: "80+", label: "Courses Available" },
  { value: "95%", label: "Placement Rate" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const coursesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter logic
  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      courses: cat.courses.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => {
      if (activeCategory !== "all" && cat.id !== activeCategory) return false;
      return cat.courses.length > 0;
    });

  const totalCourses = categories.reduce((a, c) => a + c.courses.length, 0);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ─── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md border-b border-gray-100"
            : "bg-white/95 backdrop-blur"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-sm tracking-tight">NS</span>
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-blue-600 text-lg tracking-tight leading-none">Nestsoft</div>
              <div className="text-[10px] text-gray-400 font-medium tracking-wider uppercase leading-none">TechnoMaster</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <button onClick={scrollToCourses} className="hover:text-blue-600 transition-colors">Courses</button>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#why-us" className="hover:text-blue-600 transition-colors">Why Us</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition-all"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-3 shadow-lg">
            <button onClick={() => { scrollToCourses(); setIsMenuOpen(false); }} className="block w-full text-left text-sm font-medium text-gray-700 py-2 hover:text-blue-600">Courses</button>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2 hover:text-blue-600">About</a>
            <a href="#why-us" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2 hover:text-blue-600">Why Us</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2 hover:text-blue-600">Contact</a>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 text-center text-sm font-semibold border border-gray-200 text-gray-700 py-2 rounded-lg">Login</Link>
              <Link href="/signup" className="flex-1 text-center text-sm font-semibold bg-blue-600 text-white py-2 rounded-lg">Enroll Now</Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-5 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40 -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px] opacity-30 -z-0 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6 border border-blue-200 uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            Kochi's Most Trusted IT Training Institute Since 2007
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight max-w-4xl mx-auto mb-5">
            Launch Your Career with{" "}
            <span className="text-blue-600">Expert-Led</span>{" "}
            Tech Courses
          </h1>

          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join <span className="font-semibold text-gray-700">Nestsoft TechnoMaster</span> — Kochi's leading IT training institute offering {totalCourses}+ professional courses in Web Development, AI, Data Science, Mobile Apps, Networking, Design, and more. Online &amp; Offline batches available.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <button
              onClick={scrollToCourses}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-base shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all"
            >
              Explore Courses
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl text-base border border-gray-200 shadow-sm transition-all"
            >
              Contact Us
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-extrabold text-blue-600">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ──────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
                About Nestsoft
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
                Empowering Careers Since <span className="text-blue-600">2007</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                <strong className="text-gray-800">Nestsoft TechnoMaster</strong> is a premier IT training and software development institute based in Kochi, Kerala. Since our founding in 2007, we have trained over <strong className="text-gray-800">10,000+ students</strong> with industry-relevant skills that lead to real careers.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                We offer expert-led courses in Web Development, Data Science, AI, Mobile Apps, Digital Marketing, Networking, ERP, and Design — with both online and offline batches, internship programs, live projects, and job placement assistance.
              </p>
              <div className="flex flex-wrap gap-3">
                {["ISO Certified", "Industry Experts", "Live Projects", "Internship Support", "Job Placement", "Online & Offline"].map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🎓", title: "Certified Training", desc: "Industry-recognized certificates upon course completion" },
                { icon: "💼", title: "Internship Program", desc: "Hands-on experience with real-world live projects" },
                { icon: "👨‍💻", title: "Expert Mentors", desc: "Learn from working professionals with 10+ years of experience" },
                { icon: "🌐", title: "Flexible Learning", desc: "Online & offline batches to fit your schedule" },
              ].map((f) => (
                <div key={f.title} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY US ─────────────────────────────────────────────────────────── */}
      <section id="why-us" className="py-16 px-5 bg-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Why Choose Nestsoft?</h2>
          <p className="text-blue-200 mb-10 max-w-xl mx-auto text-sm">We don't just teach — we build careers. Here's what sets us apart.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "🏆", label: "18+ Years Experience" },
              { icon: "📜", label: "Certified Courses" },
              { icon: "🔬", label: "Live Project Training" },
              { icon: "🤝", label: "Job Placement" },
              { icon: "💡", label: "Small Batch Size" },
              { icon: "🕐", label: "Flexible Timings" },
            ].map((w) => (
              <div key={w.label} className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-5 text-center transition-all">
                <div className="text-3xl mb-2">{w.icon}</div>
                <p className="text-white text-xs font-semibold">{w.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COURSES SECTION ────────────────────────────────────────────────── */}
      <section ref={coursesRef} id="courses" className="py-20 px-5 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3">
              All Courses
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              {totalCourses}+ Professional Courses
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Explore our comprehensive course library across 7 domains. All courses include certification, live project training, and placement support.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-lg mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg leading-none">&times;</button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              All Domains
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Course categories */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-medium">No courses found for "<span className="text-gray-600">{searchQuery}</span>"</p>
            </div>
          ) : (
            <div className="space-y-14">
              {filteredCategories.map((cat) => (
                <div key={cat.id}>
                  {/* Category header */}
                  <div className={`rounded-2xl border p-6 mb-6 ${cat.color}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-4xl">{cat.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-extrabold text-gray-900 mb-1">{cat.label}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{cat.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-sm font-semibold text-gray-500 bg-white/80 px-3 py-1.5 rounded-full border border-white/50">
                        {cat.courses.length} Courses
                      </div>
                    </div>
                  </div>

                  {/* Course grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cat.courses.map((course) => (
                      <div
                        key={course.name}
                        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all flex flex-col relative overflow-hidden group"
                      >
                        {/* Tag badge */}
                        {course.tag && (
                          <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full ${tagColor[course.tag]}`}>
                            {course.tag}
                          </span>
                        )}

                        {/* Course icon placeholder */}
                        <div className={`w-10 h-10 rounded-xl ${cat.accent} flex items-center justify-center mb-3 flex-shrink-0`}>
                          <span className="text-white text-lg">{cat.icon}</span>
                        </div>

                        {/* Course name */}
                        <h4 className="font-bold text-gray-900 text-sm mb-1 leading-snug pr-8">{course.name}</h4>

                        {/* Duration + Level */}
                        <div className="flex items-center gap-2 mt-1 mb-auto">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {course.duration}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${levelColor[course.level]}`}>
                            {course.level}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-3" />

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-400 font-medium">Starts from</span>
                            <div className="text-lg font-extrabold text-blue-600">
                              ₹{course.price.toLocaleString("en-IN")}
                            </div>
                          </div>
                          <Link
                            href="/signup"
                            className={`text-xs font-bold text-white px-3 py-2 rounded-lg ${cat.accent} hover:opacity-90 transition-all shadow-sm`}
                          >
                            Enroll
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

      {/* ─── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 shadow-xl shadow-blue-100">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to Start Your Career?</h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto text-sm">
              Join thousands of students who have transformed their careers with Nestsoft. Enroll today and get access to expert mentors, live projects, and placement support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-sm"
              >
                Enroll Now — Get Started
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl text-sm border border-blue-400 transition-all"
              >
                Talk to an Advisor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-5 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3">
              Get In Touch
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Contact Nestsoft</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Have questions about a course? Our advisors are here to help you choose the right path.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: "📍", title: "Location", info: "Kochi, Kerala, India", sub: "Offline & Online Batches" },
              { icon: "📞", title: "Phone", info: "+91 95393 03386", sub: "Mon–Sat, 9 AM–6 PM" },
              { icon: "✉️", title: "Email", info: "info@nestsoft.com", sub: "We reply within 24 hours" },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{c.title}</h4>
                <p className="text-blue-600 font-semibold text-sm">{c.info}</p>
                <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">NS</span>
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-tight">Nestsoft TechnoMaster</div>
                <div className="text-xs text-gray-500">Trusted IT Training Since 2007</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <button onClick={scrollToCourses} className="hover:text-white transition-colors">Courses</button>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <p>© {new Date().getFullYear()} Nestsoft TechnoMaster. All rights reserved.</p>
            <p>Web Development · Data Science · AI · Mobile Apps · Networking · Design · ERP</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
