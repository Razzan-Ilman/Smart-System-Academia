export type PaymentMethodType = {
    id: string;
    name: string;
    category: "Instant Payment" | "Virtual Account" | "Other";
    logo: string;
};

export const paymentMethods: PaymentMethodType[] = [
    {
        id: "qris",
        name: "QRIS",
        category: "Instant Payment",
        logo: "https://images.seeklogo.com/logo-png/39/2/quick-response-code-indonesia-standard-qris-logo-png_seeklogo-391791.png",
    },
    {
        id: "permata",
        name: "Permata Bank",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/62/2/permata-bank-logo-png_seeklogo-621707.png",
    },
    {
        id: "bca",
        name: "BCA",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/1/2/bank-central-asia-logo-png_seeklogo-16269.png",
    },
    {
        id: "bsi",
        name: "Bank Syariah Indonesia",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/40/2/bank-syariah-indonesia-logo-png_seeklogo-400984.png",
    },
    {
        id: "bri",
        name: "BRI",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/30/2/bank-bri-bank-rakyat-logo-png_seeklogo-304232.png",
    },
    {
        id: "mandiri",
        name: "Bank Mandiri",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/1/2/bank-mandiri-logo-png_seeklogo-16290.png",
    },
    {
        id: "bni",
        name: "BNI",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/1/2/bank-negara-indonesia-logo-png_seeklogo-16298.png",
    },
    {
        id: "mandiri_va",
        name: "Mandiri Virtual Account",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/1/2/bank-mandiri-logo-png_seeklogo-16290.png",
    },
    {
        id: "muamalat",
        name: "Bank Muamalat",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/1/2/bank-muamalat-logo-png_seeklogo-16296.png",
    },
    {
        id: "cimb",
        name: "CIMB Niaga",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/3/2/cimb-bank-logo-png_seeklogo-30387.png",
    },
    {
        id: "sinarmas",
        name: "Bank Sinarmas",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/34/2/sinarmas-sekuritas-logo-png_seeklogo-347098.png",
    },
    {
        id: "bnc",
        name: "Bank Neo Commerce",
        category: "Virtual Account",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Bank_Neo_Commerce.png/250px-Bank_Neo_Commerce.png",
    },
    {
        id: "maybank",
        name: "Maybank",
        category: "Virtual Account",
        logo: "https://images.seeklogo.com/logo-png/42/2/maybank-logo-png_seeklogo-429135.png",
    },
    {
        id: "indomaret",
        name: "Indomaret",
        category: "Other",
        logo: "https://images.seeklogo.com/logo-png/33/1/indomaret-logo-png_seeklogo-339890.png",
    },
    {
        id: "alfamart",
        name: "Alfamart",
        category: "Other",
        logo: "https://images.seeklogo.com/logo-png/33/2/alfamart-logo-png_seeklogo-339891.png",
    },
];
