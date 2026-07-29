import { Input } from "@akagiyui/ui-react";
import { Label } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  );
}
