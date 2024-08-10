export default class PasswordValidator {
    static isEqual(firstPassword: string, secondPassword: string): boolean {
        return firstPassword === secondPassword;
    }

    static validate(plainTextPasswordToCheck: string): boolean {
        if (plainTextPasswordToCheck.length < 12) {
            return false;
        }

        const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
        const uppercaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;

        return (
            specialCharRegex.test(plainTextPasswordToCheck) &&
            uppercaseRegex.test(plainTextPasswordToCheck) &&
            numberRegex.test(plainTextPasswordToCheck)
        );
    }

    static generate(): string {
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
        const numbers = "0123456789";

        const randomUppercase = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

        const remainingLength = 9;
        const allChars = uppercaseChars + lowercaseChars + specialChars + numbers;
        let password: string | string[] = randomUppercase + randomSpecialChar + randomNumber;

        for (let i = 0; i < remainingLength; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            password += allChars.charAt(randomIndex);
        }

        password = password.split("");
        for (let i = password.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [password[i], password[j]] = [password[j], password[i]];
        }

        return password.join("");
    }
}
