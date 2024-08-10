import { PrismaClient } from "@prisma/client";
import DateTime from "../src/utils/date-time.util";
import { Bcrypt } from "../src/utils/bcrypt.util";
import GenerateRandomToken from "../src/utils/generate-random-token.util";

const prisma = new PrismaClient({
	errorFormat: "pretty",
});

const seedDatabase = async () => {
	await prisma.users.deleteMany({});
	await prisma.urls.deleteMany({});

	await prisma.users.createMany({
		data: [
			{
				name: "Default",
				email: "default@gmail.com",
				jwt_token: null,
				password: await Bcrypt.hash("defaultQWE!123"),
				created_at: String(new Date()),
				updated_at: null
			}
		],
		skipDuplicates: true,
	});
};

seedDatabase();
