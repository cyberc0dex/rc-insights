// auth.js - Authentication logic

// SHA-256 Hash function
async function sha256Hash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Validate passcode
async function validatePasscode(passcode) {

    // Convert passcode to lowercase before hashing
    const passcodeLower = passcode.toLowerCase();

    // Hash the passcode
    const hash = await sha256Hash(passcodeLower);

    // Compare with stored hash from config
    if (hash === PASSCODE_HASH) {
        return { valid: true, passcode: passcodeLower };
    } else {
        return { valid: false, error: 'Sorry that is not the SECRET. Access Denied.' };
    }
}

// Check if online
function isOnline() {
    return navigator.onLine;
}