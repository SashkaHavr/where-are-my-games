import type {
  dataTagErrorSymbol,
  dataTagSymbol,
  MutationOptions,
} from '@tanstack/react-query';
import type { TRPCQueryKey } from '@trpc/tanstack-react-query';
import { useQueryClient } from '@tanstack/react-query';

export function useOptimisticUpdate<T extends object, I, E>(
  queryKey: TRPCQueryKey & { [dataTagSymbol]: T; [dataTagErrorSymbol]: E },
  updater: (old: T | undefined, input: I) => T,
) {
  const queryClient = useQueryClient();
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
