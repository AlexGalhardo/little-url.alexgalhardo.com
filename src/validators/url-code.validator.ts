import { z } from "zod";

const validateUrlCode = z.object({
    code: z.string().length(5, { message: "Code must be exactly 5 characters long" }),
});

export default validateUrlCode;
