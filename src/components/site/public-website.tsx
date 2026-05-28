"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  HandHeart,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AnimatedCounter } from "@/components/site/animated-counter";
import { JoinForm } from "@/components/site/join-form";
import { Reveal } from "@/components/site/reveal";
import type { GalleryImage, SiteSettings } from "@/lib/defaults";

type PublicWebsiteProps = {
  settings: SiteSettings;
  gallery: GalleryImage[];
};

const missionItems = [
  { title: "Loyalty", icon: ShieldCheck, text: "Stand together with honesty and commitment." },
  { title: "Respect", icon: HeartHandshake, text: "Treat every student and member with dignity." },
  { title: "Growth", icon: TrendingUp, text: "Build better habits, confidence, and ambition." },
  { title: "Helping People", icon: HandHeart, text: "Support classmates whenever they need backup." },
  { title: "No Drama, Only Unity", icon: Users, text: "Keep the circle positive, focused, and clean." },
];

const helpItems = [
  {
    title: "Study Support",
    text: "Members help each other stay prepared, organized, and focused before classwork and exams.",
    icon: BookOpen,
  },
  {
    title: "Friendship & Guidance",
    text: "A dependable circle for advice, encouragement, and stronger school friendships.",
    icon: HeartHandshake,
  },
  {
    title: "School Event Support",
    text: "Helping with school events through teamwork, responsibility, and active participation.",
    icon: CalendarCheck,
  },
  {
    title: "Motivation & Confidence",
    text: "Pushing each member to speak better, act better, and believe in their own ability.",
    icon: Sparkles,
  },
];

const rules = [
  "Respect everyone",
  "No bullying",
  "No fake attitude",
  "Support members",
  "Keep the group positive",
];

export function PublicWebsite({ settings, gallery }: PublicWebsiteProps) {
  const stats = [
    { label: "Members Count", value: settings.members_count },
    { label: "People Helped", value: settings.people_helped_count },
    { label: "Events Done", value: settings.events_done_count },
    { label: "Active Supporters", value: settings.active_supporters_count },
  ];

  return (
    <main className="overflow-hidden bg-white text-[#12070a]">
      <Header />
      <section
        id="home"
        className="crimson-grid relative flex min-h-screen items-center border-b border-[#f0e8e9] pt-28"
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white to-white/60" />
        <div className="section-shell relative py-16 text-center sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-lg border border-[#f3d8dd] bg-white p-3 card-shadow sm:h-40 sm:w-40"
          >
            <Image
              src="/crimson-dominators-logo.svg"
              alt="Crimson Dominators logo"
              width={240}
              height={240}
              priority
              className="h-full w-full object-contain"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-xs font-black uppercase tracking-[0.36em] text-[#b00020]"
          >
            School Brotherhood
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-5xl text-balance text-5xl font-black leading-[0.95] tracking-normal text-[#111111] sm:text-7xl lg:text-8xl"
          >
            {settings.website_title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mx-auto mt-6 max-w-2xl text-balance text-lg font-semibold leading-8 text-[#5f5f66] sm:text-xl"
          >
            {settings.website_subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <a
              href="#join"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#b00020] px-6 text-sm font-black text-white shadow-[0_18px_40px_rgba(176,0,32,0.22)] transition hover:bg-[#790015]"
            >
              Join the Brotherhood
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a
              href="#mission"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[#1f1f1f] bg-white px-6 text-sm font-black text-[#111111] transition hover:bg-[#111111] hover:text-white"
            >
              View Our Mission
            </a>
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-24 sm:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#b00020]">About</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight text-[#111111] sm:text-5xl">
              Built on character before anything else.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-lg border border-[#f0e8e9] bg-white p-7 card-shadow">
              <p className="text-xl font-bold leading-9 text-[#2a2022]">{settings.about_text}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="stats" className="border-y border-[#f0e8e9] bg-[#fffafa] py-20">
        <div className="section-shell">
          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[#f0e8e9] bg-white p-6 text-center card-shadow"
              >
                <p className="text-5xl font-black text-[#b00020]">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-[#5f5f66]">
                  {stat.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="mission" className="py-24 sm:py-28">
        <div className="section-shell">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#b00020]">Mission</p>
            <h2 className="mt-4 text-balance text-4xl font-black leading-tight text-[#111111] sm:text-5xl">
              Discipline, loyalty, and respect in action.
            </h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-[#5f5f66]">
              {settings.mission_text}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {missionItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <div className="h-full rounded-lg border border-[#f0e8e9] bg-white p-5 card-shadow">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#b00020] text-white">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-black text-[#111111]">{item.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-[#5f5f66]">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="help" className="bg-[#111111] py-24 text-white sm:py-28">
        <div className="section-shell">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#ffccd5]">
              Help People
            </p>
            <h2 className="mt-4 text-balance text-4xl font-black leading-tight sm:text-5xl">
              The group becomes stronger by making others stronger.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {helpItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.06}>
                  <div className="h-full rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#b00020]">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-2xl font-black">{item.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-white/70">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-24 sm:py-28">
        <div className="section-shell">
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#b00020]">Gallery</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-[#111111] sm:text-5xl">
                Moments ready for the spotlight.
              </h2>
            </div>
            <p className="max-w-sm text-sm font-bold leading-6 text-[#5f5f66]">
              The best moments from school days, support work, and group memories will live here.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05}>
                <div className="group overflow-hidden rounded-lg border border-[#f0e8e9] bg-white card-shadow">
                  <div className="relative aspect-[4/3] bg-[#fff5f6]">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.alt_text}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                        <Image
                          src="/crimson-dominators-logo.svg"
                          alt=""
                          width={96}
                          height={96}
                          className="h-20 w-20 object-contain opacity-35"
                        />
                        <span className="text-xs font-black uppercase tracking-[0.28em] text-[#b00020]">
                          Photo Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-black text-[#111111]">{item.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="rules" className="border-y border-[#f0e8e9] bg-[#fffafa] py-24 sm:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#b00020]">Rules</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#111111] sm:text-5xl">
              A strong group needs a clean standard.
            </h2>
          </Reveal>
          <div className="grid gap-3">
            {rules.map((rule, index) => (
              <Reveal key={rule} delay={index * 0.05}>
                <div className="flex items-center gap-4 rounded-lg border border-[#f0e8e9] bg-white p-4 card-shadow">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#111111] text-white">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </div>
                  <p className="text-base font-black text-[#111111]">{rule}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="py-24 sm:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#b00020]">
              Contact / Join
            </p>
            <h2 className="mt-4 text-balance text-4xl font-black leading-tight text-[#111111] sm:text-5xl">
              Ready to stand with Crimson Dominators?
            </h2>
            <div className="mt-8 rounded-lg border border-[#f0e8e9] bg-[#fffafa] p-6">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#b00020] text-white">
                  <Target size={22} aria-hidden="true" />
                </div>
                <p className="text-sm font-bold leading-6 text-[#5f5f66]">
                  Share your details and a short message so the group can know you better.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-lg border border-[#f0e8e9] bg-white p-6 card-shadow sm:p-8">
              <JoinForm />
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-[#f0e8e9] py-8">
        <div className="section-shell flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <Link href="#home" className="flex items-center gap-3">
            <Image
              src="/crimson-dominators-logo.svg"
              alt="Crimson Dominators logo"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#111111]">
              Crimson Dominators
            </span>
          </Link>
          <p className="text-sm font-bold text-[#5f5f66]">
            Loyalty. Respect. Growth. Unity.
          </p>
        </div>
      </footer>
    </main>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#f0e8e9] bg-white/92 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <a href="#home" className="flex min-w-0 items-center gap-3">
          <Image
            src="/crimson-dominators-logo.svg"
            alt="Crimson Dominators logo"
            width={54}
            height={54}
            className="h-12 w-12 shrink-0 object-contain"
          />
          <span className="truncate text-sm font-black uppercase tracking-[0.18em] text-[#111111] sm:text-base">
            Crimson Dominators
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-xs font-black uppercase tracking-[0.18em] text-[#5f5f66] lg:flex">
          <a className="transition hover:text-[#b00020]" href="#about">
            About
          </a>
          <a className="transition hover:text-[#b00020]" href="#mission">
            Mission
          </a>
          <a className="transition hover:text-[#b00020]" href="#gallery">
            Gallery
          </a>
          <a className="transition hover:text-[#b00020]" href="#rules">
            Rules
          </a>
        </nav>
        <a
          href="#join"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#111111] px-4 text-xs font-black text-white transition hover:bg-[#b00020]"
        >
          Join
        </a>
      </div>
    </header>
  );
}
