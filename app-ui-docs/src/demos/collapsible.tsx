import {
  Button,
  ChevronDownIcon,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <Collapsible className="w-full max-w-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">3 items</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon"><ChevronDownIcon /></Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">Item 1</div>
        <div className="rounded-md border px-4 py-2 text-sm">Item 2</div>
        <div className="rounded-md border px-4 py-2 text-sm">Item 3</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
