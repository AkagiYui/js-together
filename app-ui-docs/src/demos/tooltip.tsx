import { Button } from "@akagiyui/ui-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Useful hint</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
