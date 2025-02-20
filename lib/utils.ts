import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const END_OF_TERM_QUESTIONS = [
  "awareness of a range of issues associated with professional practice",
  "professional and personal skills",
  "practical skills and theoretical knowledge into an IT industry context",
  "understanding of business processes and organisational structures",
  "professional contacts and networks within the IT industry",
] as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEndOfTermScoreDesc(score: number) {
  switch (score) {
    case 1:
      return "I like to have help on this";
    case 2:
      return "I want to learn more about this";
    case 3:
      return "I’m happy with what I know";
    case 4:
      return "I know more than enough";
    case 5:
      return "I can teach and share this to my colleagues";
    default:
      return "";
  }
}
