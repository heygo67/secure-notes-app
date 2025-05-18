import CryptoJS from "crypto-js";

const SECRET_KEY = "somethingsecret";

export function encryptNote(note) {
    return CryptoJS.AES.encrypt(note, SECRET_KEY).toString();
}

export function decryptNote(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
