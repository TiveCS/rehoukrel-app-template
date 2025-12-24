import { ResponsiveCalendarSelector } from "@/components/blocks/responsive-calendar-selector";
import { MaskInput } from "@/components/dice-ui/mask-input";
import { ExpenseCategorySelector } from "@/components/feats/expenses/expense-category-selector";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ExpenseCategory } from "@/server/modules/finance/models";
import { useForm } from "@tanstack/react-form";
import { capitalize } from "@tivecs/core";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useCreateExpense } from "../../-queries/use-create-expense";

const mutateExpenseSchema = z.object({
  amount: z.int().positive(),
  occurredAt: z.date(),
  note: z.string().max(50, "Note is 50 characters maximum").optional(),
  category: z.enum(ExpenseCategory),
});

const mutateDefaultValues: z.infer<typeof mutateExpenseSchema> = {
  amount: 0,
  occurredAt: new Date(),
  category: ExpenseCategory.Food,
};

export type MutateExpenseFormProps = {
  existingValues?: z.infer<typeof mutateExpenseSchema>;
  onSuccess?: () => void;
};

export function MutateExpenseForm({
  existingValues,
  onSuccess,
}: MutateExpenseFormProps) {
  const [openCalendar, setOpenCalendar] = useState(false);
  const createMutation = useCreateExpense();

  const form = useForm({
    validators: {
      onSubmit: mutateExpenseSchema,
    },
    defaultValues: existingValues ? existingValues : mutateDefaultValues,
    onSubmit: async ({ value }) => {
      createMutation.mutate(
        {
          amount: value.amount,
          occurredAt: value.occurredAt.toISOString().split("T")[0],
          category: value.category,
          note: value.note,
        },
        {
          onSuccess: (data) => {
            toast.success("Expense created successfully", {
              description: `Created with id ${data?.id}`,
            });
            onSuccess?.();
          },
          onError: (error) => {
            toast.error("Failed to create expense", {
              description: error.message,
            });
          },
        },
      );
    },
  });

  return (
    <form
      className="px-4 flex flex-col gap-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="amount">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {capitalize(field.name)}
              </FieldLabel>

              <MaskInput
                id={field.name}
                name={field.name}
                mask="rupiah"
                value={field.state.value?.toString()}
                onValueChange={(_, unmasked) => {
                  field.handleChange(Number(unmasked));
                }}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                invalid={isInvalid}
                placeholder="Enter expense amount"
                required
              />

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="category">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {capitalize(field.name)}
              </FieldLabel>

              <ExpenseCategorySelector
                selectProps={{
                  name: field.name,
                  value: field.state.value,
                  onValueChange: (value) =>
                    field.handleChange(value as ExpenseCategory),
                }}
              />

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="occurredAt">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field>
              <FieldLabel htmlFor={field.name}>Occurred At</FieldLabel>

              <ResponsiveCalendarSelector
                title="Select Occurrence Date"
                description="Please select the date when the expense occurred."
                open={openCalendar}
                onOpenChange={setOpenCalendar}
                calendarProps={{
                  mode: "single",
                  selected: field.state.value,
                  defaultMonth: field.state.value,
                  required: true,
                  captionLayout: "dropdown",
                  disabled: {
                    after: new Date(),
                  },
                  onSelect: (value) => {
                    field.handleChange(value ?? new Date());
                    setOpenCalendar(false);
                  },
                }}
              >
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {field.state.value
                    ? Intl.DateTimeFormat(undefined, {
                        dateStyle: "long",
                      }).format(field.state.value)
                    : "Select Occurrence Date"}
                  <CalendarIcon className="text-gray-400" />
                </Button>
              </ResponsiveCalendarSelector>

              {/*<Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal"
                  >
                    {field.state.value
                      ? Intl.DateTimeFormat(undefined, {
                          dateStyle: "long",
                        }).format(field.state.value)
                      : "Select Occurrence Date"}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <Calendar
                    id={field.name}
                    mode="single"
                    selected={field.state.value}
                    onSelect={(value) =>
                      field.handleChange(value ?? new Date())
                    }
                  />
                </PopoverContent>
              </Popover>*/}

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="note">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {capitalize(field.name)}{" "}
                <span className="text-gray-500">(optional)</span>
              </FieldLabel>

              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(
                    e.currentTarget.value.length > 0
                      ? e.currentTarget.value
                      : undefined,
                  )
                }
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                placeholder="e.g. Lunch at cafe"
                maxLength={50}
              />

              <FieldDescription className="flex justify-end">
                {field.state.value?.length ?? 0} / 50
              </FieldDescription>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending && <Spinner className="mr-2" />}
        Submit
      </Button>
    </form>
  );
}
