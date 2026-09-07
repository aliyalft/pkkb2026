import Navbar from "@/components/pkkb/Navbar";
import Hero from "@/components/pkkb/Hero";
import Countdown from "@/components/pkkb/Countdown";
import About from "@/components/pkkb/About";
import Program from "@/components/pkkb/Program";
import Schedule from "@/components/pkkb/Schedule";
import Talent from "@/components/pkkb/Talent";
import Venue from "@/components/pkkb/Venue";
import Gallery from "@/components/pkkb/Gallery";
import Partners from "@/components/pkkb/partners";
import FinalCTA from "@/components/pkkb/FinalCTA";
import Footer from "@/components/pkkb/Footer";
import Popolah from "@/components/pkkb/Popolah";

export default function Home() {
  return (
    <main className="pkkb-site">
      <Navbar />

      <Hero />

      <Countdown />

      <About />

      <Popolah />

      <Program />

      <Schedule />

      <Talent />

      <Venue />

      <Gallery />

      <Partners />

      <FinalCTA />

      <Footer />
    </main>
  );
}