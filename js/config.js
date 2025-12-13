// config.js - Configuration for system-insights

// Passcode hash (SHA-256)
const PASSCODE_HASH = 'eb97bab8357f8819ef9f14bf7cde5dab9fb0d7f08d9cda698073887d42bb882b';

// GitHub URL for data.enc
// Replace with your actual GitHub raw URL
const DATA_ENC_URL = 'https://cyberc0dex.github.io/rc-insights/data.enc';

// DEVELOPMENT: Hardcoded encrypted data (bypasses CORS issues with file://)
const DEV_ENCRYPTED_DATA = 'NLuqtxRPbyC72IxcEf/O15/2IZBH5MNxiKYLR6onzI9qSVD4eijnQiV5RMzo3kU8g+RLUJRjPcseIqwt1YEYiqACBKpLgi6hsM1Oc5iOi5OqaeJTFttyLzi4k0l+GeTMOlPVQt7dmlLiY3h0nA/kbw9uJSOQ3xCr5MPRi01IDDBn9zoCxnTj04I05XVCGeZYJKr/yi35uOcRg4COY=';

// Session duration (1 hour in milliseconds)
const SESSION_DURATION = (60 * 60 * 1000) * 1; // 1 hour

// Minimum loading screen duration (3 seconds in milliseconds)
const MIN_LOADING_DURATION = 3000; // 3 seconds

// Development mode flag
const USE_DEV_DATA = false; // Set to false for production