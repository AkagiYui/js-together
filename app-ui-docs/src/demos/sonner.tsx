import { Button } from "@akagiyui/ui-react";
import { toast } from "sonner";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast("Event created")}>Show toast</Button>
      <Button variant="outline" onClick={() => toast.success("Saved successfully")}>
        Success
      </Button>
      <Button variant="destructive" onClick={() => toast.error("Something went wrong")}>
        Error
      </Button>
    </div>
  );
}
