import { useMediaQuery } from '@mantine/hooks';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpointQueries: Record<Breakpoint, string> = {
  sm: '(width >= 40rem)',
  md: '(width >= 48rem)',
  lg: '(width >= 64rem)',
  xl: '(width >= 80rem)',
  '2xl': '(width >= 96rem)',
};

export function useBreakpoint(breakpoint: Breakpoint) {
  return useMediaQuery(breakpointQueries[breakpoint]);
}
