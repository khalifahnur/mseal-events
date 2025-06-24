import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function maskExceptLastFour(value: string | null | undefined): string {
  if (value === null || value === undefined) return "*";
  if (value.length <= 4) return value;
  const lastFour = value.slice(-4);
  const maskedPart = "****";
  return maskedPart + lastFour;
}
