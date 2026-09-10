import { useDocumentTitle } from "../lib/route";
import { Hero } from "../components/hero/Hero";
import { ProductShowcase } from "../components/showcase/ProductShowcase";
import { FeatureGrid } from "../components/features/FeatureGrid";
import { HowItWorks } from "../components/sections/HowItWorks";
import { InstallSection } from "../components/sections/InstallSection";
import { TrialFlow } from "../components/sections/TrialFlow";
import { TrialAccess } from "../components/sections/TrialAccess";
import { PricingSection } from "../components/sections/PricingSection";
import { CreatorSection } from "../components/sections/CreatorSection";
import { FinalCta } from "../components/sections/FinalCta";

export function Home() {
  useDocumentTitle("ICODE — AI Coding Agent");

  return (
    <>
      <Hero />
      <ProductShowcase />
      <FeatureGrid />
      <HowItWorks />
      <InstallSection />
      <TrialFlow />
      <TrialAccess />
      <PricingSection />
      <CreatorSection />
      <FinalCta />
    </>
  );
}