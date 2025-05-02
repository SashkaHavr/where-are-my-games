interface Success<T> {
  data: T;
  error: undefined;
}

interface Failure<E> {
  data: undefined;
  error: E;
}

type Result<T, E = Error> = Success<T> | Failure<E>;

export function tryCatch<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    const data = fn();
    return ok(data);
  } catch (error) {
    return err(error as E);
  }
}

export async function tryCatchPromise<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return ok(data);
  } catch (error) {
    return err(error as E);
  }
}

export function ok<T>(data: T) {
  return { data, error: undefined };
}

export function err<E>(error: E) {
  return { data: undefined, error };
}
