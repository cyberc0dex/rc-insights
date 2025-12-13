// auth.js - Authentication logic for system-insights

// SHA-256 Hash function
async function sha256Hash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // console.log(await encryptText("secret_text", "xOgdPlbsM0yvQpet1yowHDjBCB761HusA0nEj2Q72lLQ4uh74z"));

    return hashHex;
}

// Validate passcode
async function validatePasscode(passcode) {
    // Check minimum length
    if (passcode.length < 16) {
        return { valid: false, error: 'Passcode must be at least 16 characters' };
    }

    // Hash the passcode
    const hash = await sha256Hash(passcode);

    // Compare with stored hash from config
    if (hash === PASSCODE_HASH) {
        return { valid: true, passcode: passcode };
    } else {
        return { valid: false, error: 'Sorry that not the PASSCODE. Access Denied.' };
    }
}

// Check if online
function isOnline() {
    return navigator.onLine;
}