document.getElementById('questionnaire').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const data = new FormData(event.target);
    const formData = Object.fromEntries(data.entries());
    
    localStorage.setItem('questionnaireData', JSON.stringify(formData));
    alert('Your response has been saved!');

    // Request Notification Permission
    if ('Notification' in window && navigator.serviceWorker) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                scheduleNotification();
            } else {
                console.log('Notification permission denied.');
            }
        }).catch(error => {
            console.error('Notification permission request failed:', error);
        });
    }
});

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    let deferredPrompt = e;
    document.getElementById('installPrompt').style.display = 'block';
    
    document.getElementById('installPrompt').addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/AECOS/js/serviceWorker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
        window.registration = registration; // Save registration for later use
    })
    .catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}

function scheduleNotification() {
    // Ensure service worker registration is available
    if (!window.registration) {
        console.error('Service worker registration not found.');
        return;
    }

    // Schedule a notification 10 seconds after the app is first used
    setTimeout(() => {
        if ('Notification' in window && navigator.serviceWorker) {
            window.registration.showNotification('Time to check your questionnaire responses!', {
                body: 'Please review the responses you have collected.',
                icon: '/AECOS/icons/icon-192x192.png'
            }).catch(error => {
                console.error('Error showing notification:', error);
            });
        }
    }, 10000); // 10000ms = 10 seconds
}
