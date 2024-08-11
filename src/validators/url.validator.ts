import { ErrorsMessages } from "src/utils/errors-messages.util";
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
                message: ErrorsMessages.INVALID_URL_DOMAIN,
            },
        ),
});

export default validateUrlSchema;
