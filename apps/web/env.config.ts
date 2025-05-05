import { defineConfig } from '@julr/vite-plugin-validate-env';
import { z } from 'zod';

export default defineConfig({
  validator: 'zod',
  schema: {
    VITE_API_URL: z
      .union([z.url(), z.string().regex(/^http:\/\/localhost.*/)])
      .default('http://localhost:3000'),
  },
});
