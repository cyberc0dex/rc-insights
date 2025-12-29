// storage.js - Memory storage functions (sessionStorage for cross-page persistence)

// Storage key
const DECRYPTED_DATA_KEY = '__decrypted_data__';

// Set decrypted data in sessionStorage
function setDecryptedData(data) {
    sessionStorage.setItem(DECRYPTED_DATA_KEY, JSON.stringify(data));
}

// Get decrypted data from sessionStorage
function getDecryptedData() {
    const data = sessionStorage.getItem(DECRYPTED_DATA_KEY);
    return data ? JSON.parse(data) : null;
}

// Clear decrypted data from sessionStorage
function clearDecryptedData() {
    sessionStorage.removeItem(DECRYPTED_DATA_KEY);
}

// Get unique match dates from decrypted data
function getMatchDates() {
    const matchHistory = getDecryptedData();
    
    if (!matchHistory) {
        return [];
    }

    const dates = [...new Set(matchHistory.map(match => match.date))];
    dates.sort((a, b) => new Date(b) - new Date(a)); // Sort newest to oldest
    return dates;
}