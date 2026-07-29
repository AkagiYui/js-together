import { Button } from "@akagiyui/ui-react";
import { Input } from "@akagiyui/ui-react";
import { Label } from "@akagiyui/ui-react";
import { Popover, PopoverContent, PopoverTrigger } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-2">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="100%" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
