// request.js - Request page logic for system-insights (request.html)

document.addEventListener('DOMContentLoaded', () => {
    checkOnlineStatus();
    setupPasscodeForm();
    setupOnlineStatusListener();
});

function checkOnlineStatus() {
    const passcodeInput = document.getElementById('passcode-input');
    const submitBtn = document.getElementById('submit-btn');
    const errorMessage = document.getElementById('error-message');

    if (!isOnline()) {
        // Offline - disable form
        passcodeInput.disabled = true;
        submitBtn.disabled = true;
        errorMessage.textContent = 'No internet available';
        errorMessage.style.color = 'var(--text-secondary)';
    } else {
        // Online - enable form
        passcodeInput.disabled = false;
        submitBtn.disabled = false;
        errorMessage.textContent = '';
    }
}

function setupOnlineStatusListener() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
        checkOnlineStatus();
    });

    window.addEventListener('offline', () => {
        checkOnlineStatus();
    });
}

function setupPasscodeForm() {
    const form = document.getElementById('passcode-form');
    const passcodeInput = document.getElementById('passcode-input');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        errorMessage.textContent = '';

        // Check online status
        if (!isOnline()) {
            errorMessage.textContent = 'No internet available';
            errorMessage.style.color = 'var(--text-secondary)';
            return;
        }

        const passcode = passcodeInput.value.trim();

        // Validate passcode length
        if (passcode.length < 16) {
            errorMessage.textContent = 'Passcode must be at least 16 characters';
            errorMessage.style.color = 'var(--error)';
            return;
        }

        // Validate passcode hash
        const validation = await validatePasscode(passcode);

        if (!validation.valid) {
            errorMessage.textContent = validation.error;
            errorMessage.style.color = 'var(--error)';
            passcodeInput.value = '';
            return;
        }

        // Passcode is valid, proceed to fetch and decrypt
        await fetchAndDecryptData(passcode);
    });
}

async function fetchAndDecryptData(passcode) {
    const loadingScreen = document.getElementById('loading-screen');
    const errorMessage = document.getElementById('error-message');
    const passcodeInput = document.getElementById('passcode-input');

    try {
        // Show loading screen
        loadingScreen.classList.add('show');

        // Record start time for minimum loading duration
        const startTime = Date.now();

        // Fetch data.enc from GitHub
        const encryptedData = await fetchDataEnc();

        // Decrypt the data
        const decryptedText = await decryptText(encryptedData, passcode);

        // Parse JSON
        const matchHistory = JSON.parse(decryptedText);

        // Store decrypted data in memory
        setDecryptedData(matchHistory);

        // Store decryption key in memory
        setDecryptionKey(passcode);

        // Set session timestamp
        setSessionTimestamp();

        // Calculate elapsed time
        const elapsed = Date.now() - startTime;
        const remainingTime = MIN_LOADING_DURATION - elapsed;

        // Wait for minimum loading duration if needed
        if (remainingTime > 0) {
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        // Redirect to index.html
        window.location.href = 'index.html';

    } catch (error) {
        console.error('invalid data source');
        
        // Hide loading screen
        loadingScreen.classList.remove('show');

        // Show generic error to user
        errorMessage.textContent = 'Failed to load data. Please try again.';
        errorMessage.style.color = 'var(--error)';
        passcodeInput.value = '';
    }
}