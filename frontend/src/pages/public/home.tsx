import CTASection from "@/landing/components/cta-section";
import FeaturesSection from "@/landing/components/features-section";
import { HeroSection } from "@/landing/components/hero-section";
import HowItWorksSection from "@/landing/components/how-it-works-section";
import TestimonialsSection from "@/landing/components/testimonials-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
