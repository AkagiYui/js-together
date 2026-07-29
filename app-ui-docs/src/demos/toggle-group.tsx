import { ItalicIcon, UnderlineIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="bold">B</ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="italic"><ItalicIcon /></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="underline"><UnderlineIcon /></ToggleGroupItem>
    </ToggleGroup>
  );
}
