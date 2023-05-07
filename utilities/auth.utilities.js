// This regular expression check that the email is of a valid format
export const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// This regular expression checks password for special characters and minimum length
export const validPasswordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
