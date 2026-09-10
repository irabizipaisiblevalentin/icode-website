import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../animations/Reveal";
import { PricingCard } from "../pricing/PricingCard";

export function PricingSection() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Pricing & access"
          title="Simple, honest access"
          description="ICODE starts with a free trial. After it ends, continued access is available through a simple payment and passcode process."
        />

        <div className="mx-auto max-w-md">
          <PricingCard />
        </div>

        <Reveal
          variant="fade"
          className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-faint"
        >
          ICODE starts with a 3-week trial. After the trial period, continued access
          requires an administrator-provided access passcode after the required payment
          process. Payment verification is handled by the administrator, not by the
          ICODE website.
        </Reveal>
      </div>
    </section>
  );
}