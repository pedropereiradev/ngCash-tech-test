import { z } from 'zod';

const loginValidationSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8).regex(/^ (?=.*? [A - Z])(?=.*? [0 - 9]).{ 8, }$/)
});

export default loginValidationSchema;