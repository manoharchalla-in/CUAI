import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | number | Date): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatYearLabel(yearKey: string): string {
  switch (yearKey?.toLowerCase()) {
    case "1st_year":
    case "1st-year":
    case "1st year":
      return "1st Year";
    case "2nd_year":
    case "2nd-year":
    case "2nd year":
      return "2nd Year";
    case "3rd_year":
    case "3rd-year":
    case "3rd year":
      return "3rd Year";
    case "4th_year":
    case "4th-year":
    case "4th year":
      return "4th Year";
    default:
      return yearKey || "Unknown Year";
  }
}

export function normalizeYearKey(yearStr: string): string {
  const clean = yearStr.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clean.includes("1st") || clean === "1") return "1st_year";
  if (clean.includes("2nd") || clean === "2") return "2nd_year";
  if (clean.includes("3rd") || clean === "3") return "3rd_year";
  if (clean.includes("4th") || clean === "4") return "4th_year";
  return yearStr;
}
