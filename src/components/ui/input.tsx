import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-32 w-full resize-none rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Input, Textarea };
