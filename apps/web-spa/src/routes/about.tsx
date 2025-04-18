import { createFileRoute, Link, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' });
    }
  },
  component: About,
});

function About() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p>Hello from About!</p>
      <Link className="text-blue-400 underline" to="/">
        Back
      </Link>
    </div>
  );
}
