import { generateNonce } from "../generate-nonce/nonce";

export const cspPolicy = () => {
  const nonce = generateNonce();

  return `
    default-src 'self';
    script-src 'self' https://kit.fontawesome.com 'nonce-${nonce}';
    style-src 'self' fonts.googleapis.com https://cdn.jsdelivr.net 'nonce-${nonce}';
    img-src 'self' http://localhost:3000 data:;
    connect-src 'self' http://localhost:3000 ws://localhost:3000;
    font-src 'self' fonts.gstatic.com;
    object-src 'none';
  `;
};
