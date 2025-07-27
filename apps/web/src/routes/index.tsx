import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { Button } from '~/components/ui/button';

import { TwitchIcon } from '~/components/icons';
import { Meteors } from '~/components/landing/meteors';
import { TypingAnimation } from '~/components/landing/typing-animation';
import { ThemeToggle } from '~/components/theme-toggle';
import { authClient } from '~/lib/auth';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.loggedIn) {
      throw redirect({ to: '/app' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const signInMutation = useMutation({
    mutationFn: () => {
      return authClient.signIn.social({
        provider: 'twitch',
      });
    },
  });

  return (
    <div className="flex h-lvh w-full flex-col justify-center pb-20">
      <ThemeToggle className="absolute top-4 right-4 animate-show opacity-0" />
      <div className="flex min-h-80 w-64 flex-col gap-4 self-center">
        <TypingAnimation startOnView={false}>Where</TypingAnimation>
        <TypingAnimation startOnView={false} delay={700}>
          are
        </TypingAnimation>
        <TypingAnimation startOnView={false} delay={1200}>
          my
        </TypingAnimation>
        <TypingAnimation startOnView={false} delay={1600}>
          games...?
        </TypingAnimation>
      </div>
      <Button
        variant="outline"
        className="w-64 animate-show self-center opacity-0"
        onClick={() => signInMutation.mutate()}
      >
        <TwitchIcon />
        Login with Twitch
      </Button>
      <Meteors number={30} className="-z-10" />
    </div>
  );
}
