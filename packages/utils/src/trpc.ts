import type {
  dataTagErrorSymbol,
  dataTagSymbol,
  MutationOptions,
  QueryClient,
} from '@tanstack/react-query';
import type { TRPCQueryKey } from '@trpc/tanstack-react-query';

export function optimisticUpdate<T extends object, I, E>(
  queryClient: QueryClient,
  queryKey: TRPCQueryKey & { [dataTagSymbol]: T; [dataTagErrorSymbol]: E },
  updater: (old: T | undefined, input: I) => T,
) {
  return {
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) => updater(old, input));
      return { previous };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKey }),
  } satisfies MutationOptions<T, E, I, { previous: T | undefined }>;
}
