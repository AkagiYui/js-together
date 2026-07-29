import { Label } from "@akagiyui/ui-react";
import { Switch } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="airplane" defaultChecked />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  );
}
