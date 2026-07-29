import { Kbd, KbdGroup } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex items-center gap-3">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <KbdGroup className="ml-4">
        <Kbd>Shift</Kbd>
        <Kbd>Tab</Kbd>
      </KbdGroup>
    </div>
  );
}
