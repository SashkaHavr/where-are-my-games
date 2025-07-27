export class TwitchError extends Error {
  constructor({ message, cause }: { message: string; cause?: Error }) {
    super(message);
    this.cause = cause;
    this.name = 'TwitchError';
  }
}

interface Success<T> {
  data: T;
  error: undefined;
}

interface Failure<E> {
  data: undefined;
  error: E;
}

type Result<T, E = Error> = Success<T> | Failure<E>;

function ok<T>(data: T) {
  return { data, error: undefined };
}

function err<E>(error: E) {
  return { data: undefined, error };
}

export function tryCatchSync<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    const data = fn();
    return ok(data);
  } catch (error) {
    return err(error as E);
  }
}

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return ok(data);
  } catch (error) {
    return err(error as E);
  }
}
