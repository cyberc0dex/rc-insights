// auth.js - Authentication logic for system-insights

// SHA-256 Hash function
async function sha256Hash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Validate passcode
async function validatePasscode(passcode) {
    // Hash the passcode
    const hash = await sha256Hash(passcode);

    // Compare with stored hash from config
    if (hash === PASSCODE_HASH) {
        return { valid: true, passcode: passcode };
    } else {
        return { valid: false, error: 'Sorry that is not the SECRET. Access Denied.' };
    }
}

// Check if online
function isOnline() {
    return navigator.onLine;
}