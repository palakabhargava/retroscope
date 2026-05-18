import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function ambientForAtmosphere(atm: string) {
  switch (atm) {
    case 'horror': return 'ambient-red';
    case 'romance': return 'ambient-amber';
    case 'sci-fi': return 'ambient-cool';
    case 'comedy': return 'ambient-amber';
    case 'thriller': return 'ambient-red';
    case 'classic':
    case 'drama':
    default: return 'ambient-warm';
  }
}
