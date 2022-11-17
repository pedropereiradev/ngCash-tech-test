import { z } from 'zod';

const userValidationSchema = z.object({
  username: z.string().min(3),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/),
});

export default userValidationSchema;
