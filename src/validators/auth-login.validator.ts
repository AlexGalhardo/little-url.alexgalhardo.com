import { z } from "zod";

const AuthLoginValidator = z.object({
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(8, "password must be at least 8 characters long")
        .refine((val) => /[A-Z]/.test(val), "password must contain at least one uppercase letter")
        .refine((val) => /[a-z]/.test(val), "password must contain at least one lowercase letter")
        .refine((val) => /[0-9]/.test(val), "password must contain at least one number")
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "password must contain at least one special character"),
});

export default AuthLoginValidator;
