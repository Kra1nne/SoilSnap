import crypto from "crypto";

const secretKey = "pFZj-1zGSeDUxu1D63FfyXoMMSu6S2nkgF49cqZ8tbY=";
const algorithm = "aes-256-cbc";

// Derive a 32-byte key from your secret (or use Buffer.from if it's already base64)
const key = Buffer.from(secretKey, "base64"); // must be 32 bytes
const ivLength = 16; // AES block size

// Encrypt function
export const encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength); // random initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return IV + encrypted data together (hex)
  return iv.toString("hex") + ":" + encrypted;
};

// Decrypt function
export const decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
