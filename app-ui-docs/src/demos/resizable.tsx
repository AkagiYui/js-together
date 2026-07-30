import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="max-w-md rounded-lg border">
      <ResizablePanel defaultSize="50">
        <div className="flex h-32 items-center justify-center p-4 text-sm">One</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50">
        <div className="flex h-32 items-center justify-center p-4 text-sm">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
