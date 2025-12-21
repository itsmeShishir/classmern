// esewa HMAC-> SHA256 -> hash data 
import crypto from "crypto";

export const getEsewaSignature = (message, secret) => {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(message);

    // hash -> bash64
    const hashInBase64 = hmac.digest('base64');
    return hashInBase64
}