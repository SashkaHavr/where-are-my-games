import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Success<T> {
  data: T;
  error: null;
}

interface Failure<E> {
  data: null;
  error: E;
}

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  fn: Promise<T> | T,
): Promise<Result<T, E>> {
  try {
    const data = await fn;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
