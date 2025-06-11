import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'PORT debe ser un número positivo válido',
    }),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CORS_ORIGIN: z
    .string()
    .default('*')
    .transform((val) => val.split(',')),
});

// Usar safeParse para mejor manejo de errores
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Error en las variables de entorno:');
  console.error(result.error.format());
  process.exit(1);
}

export const envs = result.data;

// Opcional: Tipo inferido automáticamente
export type EnvConfig = z.infer<typeof envSchema>;