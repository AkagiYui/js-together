import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="i1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="i2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It comes with default styles and is fully customizable.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="i3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. Uses built-in animations on expand/collapse.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
