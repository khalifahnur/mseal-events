import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function maskExceptLastFour(value: string | null | undefined): string {
  if (value === null || value === undefined) return "*";
  if (value.length <= 4) return value;
  const lastFour = value.slice(-4);
  const maskedPart = "****";
  return maskedPart + lastFour;
}

const formatMonthYear = (date: string | null | undefined): string => {
  if (!date) return "Invalid date";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";

  const year = String(d.getFullYear());
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${month}/${year}`;
};

export default formatMonthYear

