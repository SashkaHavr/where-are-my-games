import { createFileRoute } from '@tanstack/react-router';

// function get_rand() {
//   return Math.random() > 0.5 ? 1 : undefined;
// }

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  // if (get_rand()) {
  //   return 'Works!';
  // }

  return 'Works!';
}
