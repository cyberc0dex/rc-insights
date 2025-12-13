// app.js - Main application logic for system-insights (index.html)

document.addEventListener('DOMContentLoaded', () => {
    checkSessionAndRedirect();
    setupTabNavigation();
    registerServiceWorker();
    
    // Load Player Stats after DOM is ready
    loadPlayerStats();
    
    // Start session expiration checker
    startSessionExpirationChecker();
});

function checkSessionAndRedirect() {
    // Check if session is valid
    if (!isSessionValid()) {
        // No valid session, redirect to request.html
        window.location.href = 'request.html';
        return;
    }
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Load data for the selected tab
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

function startSessionExpirationChecker() {
    // Check every 30 seconds if session has expired
    setInterval(() => {
        if (!isSessionValid()) {
            // Session expired, clear data and redirect
            clearSessionData();
            window.location.href = 'request.html';
        }
    }, 30000); // Check every 30 seconds
}