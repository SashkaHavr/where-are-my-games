import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';

import { Meteors } from '../components/landing/Meteors';
import { TypingAnimation } from '../components/landing/TypingAnimation';
import { Button } from '../components/ui/button';
import { authClient } from '../lib/auth';
import { TwitchIcon } from '../lib/icons';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: '/app' });
    }
  },
  component: Index,
});

function Index() {
  const router = useRouter();

  return (
    <div className="flex h-lvh w-full flex-col justify-center pb-20">
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
        onClick={() => {
          void authClient.signIn
            .social({
              provider: 'twitch',
              callbackURL: window.location.href,
            })
            .then(() => router.invalidate());
        }}
      >
        <TwitchIcon />
        Login with Twitch
      </Button>
      <Meteors number={30} className="-z-10" />
    </div>
  );
}
