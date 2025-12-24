import { capitalize } from "@tivecs/core";
import type { ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseCategory } from "@/server/modules/finance/models";

const expenseCategories = Object.values(ExpenseCategory).map((category) => ({
  value: category,
  label: capitalize(category),
}));

type Props = {
  selectProps?: ComponentProps<typeof Select>;
  triggerProps?: ComponentProps<typeof SelectTrigger>;
  contentProps?: ComponentProps<typeof SelectContent>;
};

export function ExpenseCategorySelector({
  selectProps,
  contentProps,
  triggerProps,
}: Props) {
  return (
    <Select {...selectProps}>
      <SelectTrigger {...triggerProps}>
        <SelectValue placeholder="All categories" />
      </SelectTrigger>

      <SelectContent {...contentProps}>
        <SelectItem value="__all__">All categories</SelectItem>
        {expenseCategories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
