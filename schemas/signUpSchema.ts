import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters.")
  .max(20, "Username must be no more than 20 characters.")
  .regex(/^[A-Za-z0-9]+$/, "Username must not contain any special characters.");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be atleast 6 characters."),
});
