import { v4 as uuidv4 } from 'uuid';

export function generateNonce() {
  // Generate a UUID (version 4) and return it
  return uuidv4();
}
