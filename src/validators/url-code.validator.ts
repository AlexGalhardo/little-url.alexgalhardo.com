import { z } from "zod";

const validateUrlCodeSchema = z.object({
    code: z.string().length(5, { message: "Code must be exactly 5 characters long" }),
});

export default validateUrlCodeSchema;
