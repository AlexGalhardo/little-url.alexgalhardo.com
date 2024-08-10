import { z } from "zod";

const dnsUrlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

const validateUrlSchema = z.object({
    url: z
        .string()
        .url()
        .refine(
            (url) => {
                return dnsUrlRegex.test(url);
            },
            {
                message: "Invalid URL domain",
            },
        ),
});

export default validateUrlSchema;
