import { Label } from "@akagiyui/ui-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="fruit">Fruit</Label>
      <Select defaultValue="apple">
        <SelectTrigger id="fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="grape">Grape</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
