import FPVCarousel from "@/app/components/FPVCarousel";
import { LiminalSinAccessFooter } from "@/app/ls/LiminalSinAccessFooter";
import { LiminalSinHero } from "@/app/ls/LiminalSinHero";
import { LiminalSinStorySections } from "@/app/ls/LiminalSinStorySections";

export default function LiminalSinLanding() {
  return (
    <div className="min-h-screen">
      <LiminalSinHero />
      <FPVCarousel />
      <LiminalSinStorySections />
      <LiminalSinAccessFooter />
    </div>
  );
}
