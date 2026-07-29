import { Checkbox } from "@akagiyui/ui-react";
import { Label } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="use-email" defaultChecked />
        <Label htmlFor="use-email">Use email</Label>
      </div>
      <Label htmlFor="bio">Bio</Label>
    </div>
  );
}
