import { HoverCard, HoverCardContent, HoverCardTrigger } from "@akagiyui/ui-react";
import { Avatar, AvatarFallback, AvatarImage } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="text-sm font-medium underline-offset-4 hover:underline">@akagiyui</button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@akagiyui</h4>
            <p className="text-sm text-muted-foreground">React components library.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
