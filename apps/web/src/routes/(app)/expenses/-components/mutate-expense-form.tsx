import { api } from "@/api";
import { MaskInput } from "@/components/dice-ui/mask-input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ExpenseCategory } from "@/server/modules/finance/models";
import { useForm } from "@tanstack/react-form";
import {
  capitalize,
  getErrorCodeTitle,
  isFailureResponseStruct,
  isFailureResult,
} from "@tivecs/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";

const mutateExpenseSchema = z.object({
  amount: z.int().positive(),
  occurredAt: z.date(),
  note: z.string().max(50, "Note is 50 characters maximum").optional(),
  category: z.enum(ExpenseCategory).nonoptional(),
});

const mutateDefaultValues: z.infer<typeof mutateExpenseSchema> = {
  amount: 0,
  occurredAt: new Date(),
  category: ExpenseCategory.Food,
};

export function MutateExpenseForm() {
  const form = useForm({
    validators: {
      onSubmit: mutateExpenseSchema,
    },
    defaultValues: mutateDefaultValues,
    onSubmit: async ({ value }) => {
      const newExpensePromise = api.expenses.post({
        amount: value.amount,
        occurredAt: value.occurredAt.toISOString().split("T")[0],
        category: value.category,
        note: value.note,
      });

      toast.promise(newExpensePromise, {
        loading: "Creating new expense record...",
        success: ({ data }) => {
          if (!data)
            return {
              message: "Could not determine expense created or failed",
            };

          if (isFailureResult(data)) {
            return {
              message: `${getErrorCodeTitle(data.code)}`,
              description: data.description,
            };
          }

          if (isFailureResponseStruct(data)) {
            return {
              message: `${getErrorCodeTitle(data.code)}`,
              description: data.description,
            };
          }

          return {
            message: `Expense created successfully`,
            description: `Created with id ${data.id}`,
          };
        },
        error: (data) => {
          console.log(data);
          return "Failed to create expense record";
        },
      });

      const { response, data, error } = await api.expenses.post({
        amount: value.amount,
        occurredAt: value.occurredAt.toISOString().split("T")[0],
        category: value.category,
        note: value.note,
      });

      if (!response.ok && error && isFailureResponseStruct(error.value)) {
        toast.error(error.value.code, { description: error.value.description });
        return;
      }

      if (!data || isFailureResult(data)) return;

      toast.success(`Expense created with id ${data.id}`);
    },
  });

  const [amount, setAmount] = useState("");

  useEffect(() => {
    console.log(amount);
  }, [amount]);

  return (
    <form
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
                  console.log(unmasked);
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
    </form>
  );
}
