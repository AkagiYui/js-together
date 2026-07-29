import { Checkbox } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" defaultChecked />
        <label htmlFor="terms" className="text-sm">Accept terms</label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox disabled />
        <span className="text-sm text-muted-foreground">Disabled</span>
      </div>
    </div>
  );
}
