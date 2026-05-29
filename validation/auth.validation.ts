import type { TFunction } from "i18next";
import { z } from "zod";
import { createPasswordFieldSchema, createUserIdFieldSchema } from "@/validation/shared.validation";

export function createRegisterFormSchema(t: TFunction) {
  return z.object({
    password: createPasswordFieldSchema(t),
  });
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>;

export function createLoginFormSchema(t: TFunction) {
  return z.object({
    password: createPasswordFieldSchema(t),
    userId: createUserIdFieldSchema(t),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;
