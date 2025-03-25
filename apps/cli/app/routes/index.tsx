import { api } from '@/apiClient';
import { createFileRoute } from '@tanstack/react-router';

// function get_rand() {
//   return Math.random() > 0.5 ? 1 : undefined;
// }

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => (await api.hello.$get()).text(),
});

function Home() {
  // if (get_rand()) {
  //   return 'Works!';
  // }

  const state = Route.useLoaderData();
  return (
    <div>
      <p>Works!</p>
      <p>{state}</p>
    </div>
  );
}
