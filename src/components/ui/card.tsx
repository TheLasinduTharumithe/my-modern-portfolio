import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "premium-card rounded-[20px]",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
