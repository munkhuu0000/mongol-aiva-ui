import type * as React from "react";

import { cn } from "../../lib/utils";

/**
 * Card бол нэг компонент биш, хэсгүүдийн багц. Ингэснээр
 * дарааллыг нь хүссэнээрээ өөрчилж, хэрэггүйг нь орхиж болно:
 *
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Сүхбаатарын талбай</CardTitle>
 *       <CardDescription>cam-sukhbaatar</CardDescription>
 *     </CardHeader>
 *     <CardContent>...</CardContent>
 *   </Card>
 */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col rounded-lg border border-line bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-0.5 border-b border-line px-4 py-3", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-semibold text-ink", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-xs text-ink-muted", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex items-center gap-2 border-t border-line px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}
