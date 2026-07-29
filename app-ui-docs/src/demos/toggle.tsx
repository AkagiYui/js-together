import { BoldIcon } from "lucide-react";
import { Toggle } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex gap-2">
      <Toggle aria-label="toggle bold"><BoldIcon /></Toggle>
      <Toggle variant="outline" defaultPressed aria-label="toggle bold"><BoldIcon /></Toggle>
    </div>
  );
}
