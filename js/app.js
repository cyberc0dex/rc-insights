// app.js - Main application logic

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Check if session is valid
    if (isSessionValid()) {
        // Show app screen
        showAppScreen();
        setupTabNavigation();
        loadPlayerStats();
        startSessionExpirationChecker();
    } else {
        // Show auth screen
        showAuthScreen();
        setupPasscodeForm();
        checkOnlineStatus();
        setupOnlineStatusListener();
    }
    
    registerServiceWorker();
}

// ============ AUTH SCREEN FUNCTIONS ============

function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'block';
    document.getElementById('app-screen').style.display = 'none';
}

function showAppScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
}

function checkOnlineStatus() {
    const passcodeInput = document.getElementById('passcode-input');
    const submitBtn = document.getElementById('submit-btn');
    const errorMessage = document.getElementById('error-message');

    if (!isOnline()) {
        passcodeInput.disabled = true;
        submitBtn.disabled = true;
        errorMessage.textContent = 'No internet available';
        errorMessage.style.color = 'var(--text-secondary)';
    } else {
        passcodeInput.disabled = false;
        submitBtn.disabled = false;
        errorMessage.textContent = '';
    }
}

function setupOnlineStatusListener() {
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

        errorMessage.textContent = '';

        if (!isOnline()) {
            errorMessage.textContent = 'No internet available';
            errorMessage.style.color = 'var(--text-secondary)';
            return;
        }

        const passcode = passcodeInput.value.trim();

        if (passcode.length < 16) {
            errorMessage.textContent = 'Passcode must be at least 16 characters';
            errorMessage.style.color = 'var(--error)';
            return;
        }

        const validation = await validatePasscode(passcode);

        if (!validation.valid) {
            errorMessage.textContent = validation.error;
            errorMessage.style.color = 'var(--error)';
            passcodeInput.value = '';
            return;
        }

        await fetchAndDecryptData(validation.passcode);
    });
}

async function fetchAndDecryptData(passcode) {
    const loadingScreen = document.getElementById('loading-screen');
    const errorMessage = document.getElementById('error-message');
    const passcodeInput = document.getElementById('passcode-input');

    try {
        loadingScreen.classList.add('show');

        const startTime = Date.now();

        const encryptedData = await fetchDataEnc();
        const decryptedText = await decryptText(encryptedData, passcode);
        const matchHistory = JSON.parse(decryptedText);

        setDecryptedData(matchHistory);
        setDecryptionKey(passcode);
        setSessionTimestamp();

        const elapsed = Date.now() - startTime;
        const remainingTime = MIN_LOADING_DURATION - elapsed;

        if (remainingTime > 0) {
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        loadingScreen.classList.remove('show');
        
        // Show app screen instead of redirecting
        showAppScreen();
        setupTabNavigation();
        loadPlayerStats();
        startSessionExpirationChecker();

    } catch (error) {
        console.error('invalid data source');
        
        loadingScreen.classList.remove('show');
        errorMessage.textContent = 'Failed to load data. Please try again.';
        errorMessage.style.color = 'var(--error)';
        passcodeInput.value = '';
    }
}

// ============ APP SCREEN FUNCTIONS ============

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            loadTabData(tabName);
        });
    });
}

function loadTabData(tabName) {
    switch (tabName) {
        case 'match-history':
            loadMatchHistory();
            break;
        case 'player-stats':
            loadPlayerStats();
            break;
    }
}

function startSessionExpirationChecker() {
    setInterval(() => {
        if (!isSessionValid()) {
            clearSessionData();
            showAuthScreen();
            
            // Reset form
            document.getElementById('passcode-input').value = '';
            document.getElementById('error-message').textContent = '';
        }
    }, 30000);
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}