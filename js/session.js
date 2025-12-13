// session.js - Session management for system-insights

// Session storage keys (in-memory only, not localStorage)
const SESSION_KEY = '__session_key__';
const SESSION_TIMESTAMP = '__session_timestamp__';

// Set session timestamp
function setSessionTimestamp() {
    sessionStorage.setItem(SESSION_TIMESTAMP, Date.now().toString());
}

// Get session timestamp
function getSessionTimestamp() {
    const timestamp = sessionStorage.getItem(SESSION_TIMESTAMP);
    return timestamp ? parseInt(timestamp) : null;
}

// Set decryption key in session
function setDecryptionKey(key) {
    sessionStorage.setItem(SESSION_KEY, key);
}

// Get decryption key from session
function getDecryptionKey() {
    return sessionStorage.getItem(SESSION_KEY);
}

// Check if session is valid
function isSessionValid() {
    const key = getDecryptionKey();
    const timestamp = getSessionTimestamp();

    if (!key || !timestamp) {
        return false;
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - timestamp;

    // Check if session has expired (1 hour)
    if (elapsedTime > SESSION_DURATION) {
        return false;
    }
    
    return true;
}

// Clear session data
function clearSessionData() {
    // Clear decryption key
    sessionStorage.removeItem(SESSION_KEY);
    
    // Clear session timestamp
    sessionStorage.removeItem(SESSION_TIMESTAMP);
    
    // Clear decrypted data
    clearDecryptedData();
}