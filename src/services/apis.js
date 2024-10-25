
const BASE_URL = import.meta.env.VITE_APP_BASE_URL
// const BASE_URL = "http://localhost:4000/api/v1"

export const categories = {
    CATEGORIES_API: BASE_URL + "/course/showAllCategories"
}

// Auth end point
export const authEndPoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password/:id",
}

// contact us endpoint
export const contactusEndpoint = {
    CONTACT_US_API: BASE_URL + "/contact/submit-form"
}