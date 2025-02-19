export default function providerRegistration(registrationData) {
    const errors = {};

    // Validation rules
    const rules = {
        firstName: { type: 'string', required: true, noSpaces: true },
        lastName: { type: 'string', required: true, noSpaces: true },
        phoneNumber: { type: 'number', required: true, numbersOnly: true },
        yearsOfExperience: { type: 'number', required: true },
        email: { type: 'string', required: true, isEmail: true },
        password: { type: 'string', required: true, minLength: 8, strongPassword: true },
        serviceType: { type: 'string', required: true },
        description: { type: 'string', required: true, minWords: 30 },
        address: { type: 'string', required: true },
    };

    // Loop through each field and validate
    for (const field in rules) {
        const { type, required, isEmail, minLength, noSpaces, numbersOnly, minWords, strongPassword } = rules[field];
        const value = registrationData[field];

        if (required && (value === undefined || value === null || value === '')) {
            errors[field] = `${field} is required.`;
            continue;
        }

        if (value !== undefined && value !== null) {
            if (type === 'number' && isNaN(value)) {
                errors[field] = `${field} must be a number.`;
                continue;
            }

            if (type === 'string' && typeof value !== 'string') {
                errors[field] = `${field} must be a string.`;
                continue;
            }

            if (noSpaces && /\s/.test(value)) {
                errors[field] = `${field} should not contain spaces.`;
            }

            if (numbersOnly && /\D/.test(value)) {
                errors[field] = `${field} should contain only numbers.`;
            }

            if (isEmail && !/^\S+@\S+\.\S+$/.test(value)) {
                errors[field] = 'Enter a valid email address.';
            }

            if (minLength && value.length < minLength) {
                errors[field] = `${field} must be at least ${minLength} characters.`;
            }

            if (minWords && value.split(/\s+/).length < minWords) {
                errors[field] = `${field} must contain at least ${minWords} words.`;
            }

            if (strongPassword && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
                errors[field] = `${field} must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`;
            }
        }
    }

    return errors;
}

