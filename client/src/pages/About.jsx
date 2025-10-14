import React from "react";
import ComingSoonScene from "../components/ComingSoonScene.jsx";

// Placeholder About page with R3F animated scene
const About = () => {
  return (
    <main className="relative w-full h-full min-h-screen flex flex-col">
      <header className="pt-24 pb-4 text-center z-10 pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-white to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(99,102,241,0.35)]">
          About Us
        </h1>
      </header>
      <section className="flex-1 -mt-20">
        <ComingSoonScene />
      </section>
    </main>
  );
};

export default About;
