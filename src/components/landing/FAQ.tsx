import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const { t } = useTranslation();

  const items = t("faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-black">{t("faq.title")}</h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={`item-${i}`} className="border-2 border-border px-6">
                <AccordionTrigger className="font-display font-bold text-left hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
