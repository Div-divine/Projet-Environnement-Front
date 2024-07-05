const dbPromise = new Promise((resolve, reject) => {
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

const retrieveEncryptedAdminToken = async () => {
  const db = await dbPromise;
  const transaction = db.transaction("admin-tokens", "readonly");
  const store = transaction.objectStore("admin-tokens");

  const tokenData = await new Promise((resolve, reject) => {
    const request = store.get("admin-token");

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });

  if (!tokenData) {
    throw new Error("No token data found");
  }

  const { token, userId, iv, key } = tokenData.value;

  // Convert array back to Uint8Array
  const encryptedToken = new Uint8Array(token);
  const encryptedUserId = new Uint8Array(userId);
  const ivArray = new Uint8Array(iv);

  const importedKey = await window.crypto.subtle.importKey(
    "jwk",
    key,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const decryptedTokenBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray,
    },
    importedKey,
    encryptedToken
  );

  const decryptedUserIdBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray,
    },
    importedKey,
    encryptedUserId
  );

  //db.close(); // Explicitly close the database connection

  return { token: new TextDecoder().decode(decryptedTokenBuffer), userId: new TextDecoder().decode(decryptedUserIdBuffer) };
};

export default retrieveEncryptedAdminToken;
