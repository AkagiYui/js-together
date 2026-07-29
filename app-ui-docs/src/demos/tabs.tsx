import { Card, CardContent } from "@akagiyui/ui-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card><CardContent className="p-4 text-sm">Account settings.</CardContent></Card>
      </TabsContent>
      <TabsContent value="password">
        <Card><CardContent className="p-4 text-sm">Password settings.</CardContent></Card>
      </TabsContent>
    </Tabs>
  );
}
