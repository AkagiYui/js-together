import { Label } from "@akagiyui/ui-react";
import { Textarea } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  );
}
