import { Container } from "@/components/layout/container";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { hosting } from "@/lib/site-config";

export function HostingFaq() {
  return (
    <section id="faq" className="py-24 md:py-32">
      <Container className="max-w-3xl">
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
          FAQ
        </span>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Honest answers, plainly put.
        </h2>

        <Accordion type="single" collapsible className="mt-10">
          {hosting.faq.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
