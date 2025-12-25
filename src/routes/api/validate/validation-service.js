'use server'
import { validation_rules } from "./validation-rules"

export class FormDataValidator {
    static normalizeWhitespace(input) {
        return typeof input === "string"
            ? input.trim().replace(/\s+/g, " ")
            : input;
    }

    static coerce(value, expectedType) {
        if (value === null || value === undefined)
            return { isValid: false, value: null };

        switch (expectedType) {
            case "string":
                return { isValid: true, value: String(value) };
            case "boolean":
                if (typeof value === "boolean") return { isValid: true, value };
                if (value === "true" || value === "1" || value === 'on') return { isValid: true, value: true };
                if (value === "false" || value === "0") return { isValid: true, value: false };

                return { isValid: false, value: null };
            default:
                return { isValid: false, value: null };
        }
    }

    static validateField(fieldName, rawValue) {
        const rules = validation_rules[fieldName];
        const localName = rules['local_name']
        if (!rules) return { ok: true, rawValue };
        const { isValid, value } = this.coerce(rawValue, rules.type);
        if (!isValid) return { field: fieldName, message: `${localName} მოითხოვს სწორ ტიპის მონაცემს.`, ok: false };

        if (rules.type === 'boolean') return { ok: true, value }

        const val = this.normalizeWhitespace(value);

        if (rules.required && (!val || !val.length)) return {
            ok: false,
            message: `${localName} სავალდებულოა.`,
            field: fieldName
        };

        if (rules.exactLength && val.length !== rules.exactLength) return {
            ok: false,
            field: fieldName,
            message: `${localName} უნდა იყოს ზუსტად ${rules.exactLength} სიმბოლო.`
        };

        if (rules.minLength && val.length < rules.minLength) return {
            ok: false,
            field: fieldName,
            message: `${localName} უნდა შედგებოდეს მინიმუმ ${rules.minLength} სიმბოლოსგან.`
        };

        if (rules.maxLength && val.length > rules.maxLength) return {
            ok: false,
            field: fieldName,
            message: `${localName} არ უნდა აღემატებოდეს ${rules.maxLength} სიმბოლოს.`
        };

        if (rules.pattern && !rules.pattern.test(val)) return {
            ok: false,
            field: fieldName,
            message: `${localName} ფორმატი არასწორია.`
        };

        return { ok: true, value: val };
    }


    static validateInput(formData) {
        if (!(formData instanceof FormData)) return {
            message: 'არასწორი მონაცემების ფორმატი.',
            field: 'global',
            ok: false,
        };

        const validatedData = {};

        for (const [field, value] of formData) {
            const result = this.validateField(field, value);
            if (!result.ok) return result
            validatedData[field] = result.value;
        }

        return {
            ok: true,
            data: validatedData,
        };
    }
}