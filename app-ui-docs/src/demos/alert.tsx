import { Alert, AlertDescription, AlertTitle, TerminalIcon } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <TerminalIcon />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <TerminalIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
      </Alert>
    </div>
  );
}
