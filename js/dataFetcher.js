// dataFetcher.js - Fetch data.enc from GitHub

async function fetchDataEnc() {
    try {
        // DEVELOPMENT: Use hardcoded data if in dev mode
        if (typeof USE_DEV_DATA !== 'undefined' && USE_DEV_DATA && typeof DEV_ENCRYPTED_DATA !== 'undefined') {
            console.log('Using hardcoded development data');
            return DEV_ENCRYPTED_DATA;
        }

        // Check if online
        if (!navigator.onLine) {
            throw new Error('No internet connection');
        }

        // PRODUCTION: GitHub fetch with cache-busting
        const timestamp = new Date().getTime();
        const url = `${DATA_ENC_URL}?t=${timestamp}`;

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data.enc: ${response.status}`);
        }

        const encryptedText = await response.text();
        return encryptedText;

    } catch (error) {
        console.error('Error fetching data.enc:', error);
        throw error;
    }
}