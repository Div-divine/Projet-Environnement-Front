const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("my-db", 1);
  
      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("admin-tokens")) {
          db.createObjectStore("admin-tokens", { keyPath: "key" });
        }
      };
  
      request.onsuccess = event => {
        resolve(event.target.result);
      };
  
      request.onerror = event => {
        reject(event.target.error);
      };
    });
  };
  
  const storeEncryptedAdminToken = async (token, userId) => {
    const db = await openDatabase();
  
    // Ensure the object store exists before using it
    if (!db.objectStoreNames.contains("admin-tokens")) {
      throw new Error("Object store 'admin-tokens' does not exist.");
    }
  
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const tokenArrayBuffer = new TextEncoder().encode(token);
    const userIdArrayBuffer = new TextEncoder().encode(userId);
    const encryptedToken = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      tokenArrayBuffer
    );
    const encryptedUserId = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      userIdArrayBuffer
    );
  
    const keyJWK = await window.crypto.subtle.exportKey("jwk", key);
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("admin-tokens", "readwrite");
      const store = transaction.objectStore("admin-tokens");
  
      const request = store.put({
        key: "admin-token",
        value: {
          token: Array.from(new Uint8Array(encryptedToken)),
          userId: Array.from(new Uint8Array(encryptedUserId)),
          iv: Array.from(new Uint8Array(iv)),
          key: keyJWK,
        },
      });
  
      request.onsuccess = () => {
        transaction.oncomplete = () => {
          console.log("Access token and userId stored in IndexedDB");
          //db.close(); // Explicitly close the database connection
          resolve();
        };
      };
  
      request.onerror = (event) => {
        transaction.onerror = () => {
          reject(event.target.error);
        };
      };
    });
  };
  
  export default storeEncryptedAdminToken;
  