import * as React from "react";

import { Button } from "./button";
import { useCounter } from "../../hooks/use-counter";
import { cn } from "../../lib/utils";

function CardCounter({
  className,
  title = "Counter",
  initialValue = 0,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string;
  initialValue?: number;
}) {
  const { count, increment, decrement, reset } = useCounter(initialValue);

  return (
    <div
      data-slot="card-counter"
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold leading-none">{title}</h3>
        <span className="rounded-md bg-primary px-2.5 py-0.5 text-sm font-medium text-primary-foreground">
          {count}
        </span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={decrement}>
          -1
        </Button>
        <Button size="sm" variant="outline" onClick={reset}>
          Reset
        </Button>
        <Button size="sm" onClick={increment}>
          +1
        </Button>
      </div>
    </div>
  );
}

export { CardCounter };
