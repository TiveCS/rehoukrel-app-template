import { capitalize } from "@tivecs/core";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExpenseCategory } from "@/server/modules/finance/models";

export type ExpenseCategoryBadgeProps = ComponentProps<typeof Badge> & {
  category: ExpenseCategory;
};

const categoryColors: Record<ExpenseCategory, string> = {
  food: "bg-green-50 text-green-800 border-green-100",
  transportation: "bg-blue-50 text-blue-800 border-blue-100",
  entertainment: "bg-purple-50 text-purple-800 border-purple-100",
  education: "bg-yellow-50 text-yellow-800 border-yellow-100",
  health: "bg-red-50 text-red-800 border-red-100",
  household: "bg-indigo-50 text-indigo-800 border-indigo-100",
  investment: "bg-teal-50 text-teal-800 border-teal-100",
  others: "bg-gray-50 text-gray-800 border-gray-100",
  shopping: "bg-pink-50 text-pink-800 border-pink-100",
  travel: "bg-orange-50 text-orange-800 border-orange-100",
  utilities: "bg-cyan-50 text-cyan-800 border-cyan-100",
};

export function ExpenseCategoryBadge({
  category,
  className,
  ...props
}: ExpenseCategoryBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded-sm font-semibold",
        categoryColors[category],
        className,
      )}
      variant="outline"
      {...props}
    >
      {capitalize(category)}
    </Badge>
  );
}
