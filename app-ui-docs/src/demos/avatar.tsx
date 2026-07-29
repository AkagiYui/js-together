import { Avatar, AvatarFallback, AvatarImage } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>YK</AvatarFallback>
      </Avatar>
    </div>
  );
}
