import { ScrollArea } from "@akagiyui/ui-react";

const tags = Array.from({ length: 30 }).map((_, i) => `Tag ${i + 1}`);

export default function Demo() {
  return (
    <ScrollArea className="h-48 w-full max-w-sm rounded-md border p-4">
      <div className="space-y-2">
        {tags.map((t) => (
          <div key={t} className="text-sm">{t}</div>
        ))}
      </div>
    </ScrollArea>
  );
}
