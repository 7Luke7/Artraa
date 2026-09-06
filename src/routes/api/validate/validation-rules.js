export const validation_rules = {
    given_name: {
        required: true,
        minLength: 2,
        type: 'string',
        maxLength: 50,
        local_name: 'სახელი',
        pattern: /^\p{L}+$/u,
    },
    family_name: {
        required: true,
        type: 'string',
        local_name: 'გვარი',
        minLength: 2,
        maxLength: 50,
        pattern: /^\p{L}+$/u,
    },
    name: {
        required: true,
        type: 'string',
        local_name: 'სახელი',
        minLength: 2,
        maxLength: 100,
    },
    email: {
        required: true,
        local_name: 'მეილი',
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 254,
        // Folded to lower case before it is stored or looked up - see
        // FormDataValidator.normalizeEmail for why that is not optional.
        normalize: 'email',
    },
    subject: {
        required: true,
        local_name: 'თემა',
        type: 'string',
        options: [
            "ტექნიკური პრობლემა",
            "გადახდასთან დაკავშირებული კითხვა",
            "კურსის შინაარსი",
            "ანგარიშის საკითხი",
            "ინსტრუქტორობა",
            "პარტნიორობა",
            "სხვა"
        ]
    },
    message: {
        required: true,
        local_name: 'შეტყობინება',
        type: 'string',
        maxLength: 1000,
        minLength: 50
    },
    password: {
        required: true,
        local_name: 'პაროლი',
        type: 'string',
        minLength: 8,
        pattern: /^[\S]+$/,
        maxLength: 128,
    },
    new_password: {
        required: true,
        local_name: 'ახალი პაროლი',
        type: 'string',
        minLength: 8,
        pattern: /^[\S]+$/,
        maxLength: 128,
    },
    current_password: {
        required: true,
        local_name: 'ამჟამინდელი პაროლი',
        type: 'string',
        minLength: 8,
        pattern: /^[\S]+$/,
        maxLength: 128,
    },
    confirm_password: {
        required: true,
        local_name: 'დაადასტურე პაროლი',
        type: 'string',
        minLength: 8,
        pattern: /^[\S]+$/,
        maxLength: 128,
    },
    remember_me: {
        type: 'boolean',
        local_name: 'დამიმახსოვრე'
    },
    'one-time-code': {
        required: true,
        type: 'string',
        exactLength: 6,
        local_name: 'კოდი',
        pattern: /^\d{6}$/,
    },
    vid: {
        required: true,
        type: 'string',
        local_name: 'ID',
        exactLength: 64,
        pattern: /^[0-9a-f]{64}$/i,
    },
    token: {
        required: true,
        type: 'string',
        local_name: 'ტოკენი',
        exactLength: 96,
        pattern: /^[0-9a-f]{96}$/i,
    }
};