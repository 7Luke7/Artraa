"use server"
export const validation_rules = {
    სახელი: {
        required: true,
        minLength: 2,
        type: 'string',
        maxLength: 50,
        pattern: /^[a-zA-Z\u10D0-\u10F0\s'-]+$/,
    },
    გვარი: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\u10D0-\u10F0\s'-]+$/,
    },
    მეილი: {
        required: true,
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 255,
    },
    პაროლი: {
        required: true,
        type: 'string',
        minLength: 8,
        pattern: /^(?=.*[\p{L}])(?=.*\d)[\p{L}\d!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]+$/u,
        maxLength: 128,
    },
    დაადასტურე_პაროლი: {
        required: true,
        type: 'string',
        minLength: 8,
        pattern: /^(?=.*[\p{L}])(?=.*\d)[\p{L}\d!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]+$/u,
        maxLength: 128,
    },
    დამიმახსოვრე: {
        type: 'boolean',
    },
    კოდი: {
        required: true,
        type: 'string',
        exactLength: 6,
        pattern: /\d/,
    },
    vid: {
        required: true,
        type: 'string',
        exactLength: 36,
        pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    },
    token: {
        required: true,
        type: 'string',
        exactLength: 96,
        pattern: /^[0-9a-f]{96}$/i,
    }
};