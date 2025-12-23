import { type ComponentProps, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export type NumberInputProps = Omit<
  ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
> & {
  valueNumber?: number;
  onValueChange?: ({
    maskedValue,
    unmaskedValue,
  }: {
    maskedValue: string | undefined;
    unmaskedValue: number | undefined;
  }) => void;
  thousandsSeparator?: string;
  decimalSeparator?: string;
  allowNegative?: boolean;
  decimalScale?: number;
};

// Format number with thousands separator
function formatNumber(
  value: number | undefined,
  thousandsSeparator: string = ".",
  decimalSeparator: string = ",",
  decimalScale?: number,
): string {
  if (value === undefined || Number.isNaN(value)) return "";

  let numStr = value.toString();
  const isNegative = numStr.startsWith("-");
  if (isNegative) numStr = numStr.slice(1);

  let [integerPart, decimalPart] = numStr.split(".");

  // Add thousands separator
  integerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator,
  );

  // Handle decimal part
  if (decimalPart !== undefined) {
    if (decimalScale !== undefined) {
      decimalPart = decimalPart.slice(0, decimalScale);
    }
    return `${isNegative ? "-" : ""}${integerPart}${decimalSeparator}${decimalPart}`;
  }

  return `${isNegative ? "-" : ""}${integerPart}`;
}

// Parse formatted string to number
function parseNumber(
  value: string,
  thousandsSeparator: string = ".",
  decimalSeparator: string = ",",
): number | undefined {
  if (!value) return undefined;

  // Remove thousands separators and replace decimal separator with dot
  const cleanValue = value
    .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
    .replace(decimalSeparator, ".");

  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? undefined : parsed;
}

export function NumberInput({
  className,
  valueNumber,
  onValueChange,
  thousandsSeparator = ".",
  decimalSeparator = ",",
  allowNegative = true,
  decimalScale,
  ...props
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState<string>("");

  // Update display value when valueNumber changes
  useEffect(() => {
    if (valueNumber !== undefined) {
      setDisplayValue(
        formatNumber(
          valueNumber,
          thousandsSeparator,
          decimalSeparator,
          decimalScale,
        ),
      );
    } else {
      setDisplayValue("");
    }
  }, [valueNumber, thousandsSeparator, decimalSeparator, decimalScale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === "") {
      setDisplayValue("");
      onValueChange?.({
        maskedValue: "",
        unmaskedValue: undefined,
      });
      return;
    }

    // Build regex pattern for valid input
    const escapedThousands = thousandsSeparator.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    const escapedDecimal = decimalSeparator.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    const negativePattern = allowNegative ? "-?" : "";
    const pattern = new RegExp(
      `^${negativePattern}\\d{1,3}(${escapedThousands}\\d{3})*(${escapedDecimal}\\d*)?$|^${negativePattern}\\d+(${escapedDecimal}\\d*)?$`,
    );

    // Also allow typing in progress (e.g., just "-" or partial numbers)
    const typingPattern = new RegExp(
      `^${negativePattern}[\\d${escapedThousands}${escapedDecimal}]*$`,
    );

    if (!typingPattern.test(inputValue)) {
      return; // Invalid input, don't update
    }

    setDisplayValue(inputValue);

    // Parse and notify parent
    const unmasked = parseNumber(
      inputValue,
      thousandsSeparator,
      decimalSeparator,
    );
    onValueChange?.({
      maskedValue: inputValue,
      unmaskedValue: unmasked,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Format the value on blur
    const unmasked = parseNumber(
      displayValue,
      thousandsSeparator,
      decimalSeparator,
    );
    if (unmasked !== undefined) {
      const formatted = formatNumber(
        unmasked,
        thousandsSeparator,
        decimalSeparator,
        decimalScale,
      );
      setDisplayValue(formatted);
      onValueChange?.({
        maskedValue: formatted,
        unmaskedValue: unmasked,
      });
    }

    // Call original onBlur if provided
    props.onBlur?.(e);
  };

  return (
    <Input
      type="text"
      className={cn(className)}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
}
