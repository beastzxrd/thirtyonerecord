// PWA Application Main File

// Simple status update function
function updatePWAStatus(message) {
    const el = document.getElementById('pwa-status');
    if (el) el.textContent = message;
    console.log('[PWA]', message);
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWA);
} else {
    initPWA();
}

function initPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/pwa/sw.js', { scope: '/pwa/' })
            .then(reg => {
                updatePWAStatus('PWA Service Worker: Registered ✓');
                console.log('[PWA] SW registered:', reg);
            })
            .catch(err => {
                updatePWAStatus('PWA Service Worker: Failed to register');
                console.error('[PWA] SW registration error:', err);
            });
    } else {
        updatePWAStatus('PWA Service Worker: Not supported');
    }

    // Online/offline status
    const updateOnlineStatus = () => {
        const el = document.getElementById('online-status');
        if (el) {
            el.textContent = navigator.onLine ? 'Status: Online ✓' : 'Status: Offline';
        }
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// Install prompt listener
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed');
    deferredPrompt = null;
});

// Make functions global
window.installApp = function() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
            console.log('[PWA] Install:', choice.outcome);
            deferredPrompt = null;
        });
    } else {
        alert('App is already installed or not available');
    }
};

window.toggleOffline = function() {
    alert('This app works offline! Try disabling your internet connection.');
};

console.log('[PWA] Application loaded');
