import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Yui</TableCell>
            <TableCell>100</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ken</TableCell>
            <TableCell>200</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
