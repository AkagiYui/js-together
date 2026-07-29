import { Button } from "@akagiyui/ui-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}
