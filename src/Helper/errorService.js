import errorMessages from "./errorMessages";

export const getErrorMessage = (errorCode) => {
    return errorMessages[errorCode] || "Bilinmeyen bir hata oluştu! Tekrar Deneyin.";
};