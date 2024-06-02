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
            } else {
                console.log('Notification permission denied.');
            }
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
    navigator.serviceWorker.register('/js/serviceWorker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);

        // Handle push notifications
        document.getElementById('questionnaire').addEventListener('submit', function() {
            scheduleNotification(registration);
        });
    })
    .catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}

function scheduleNotification(registration) {
    // Schedule a notification 10 seconds after the app is first used
    setTimeout(() => {
        if ('Notification' in window && navigator.serviceWorker) {
            registration.showNotification('Time to check your questionnaire responses!', {
                body: 'Please review the responses you have collected.',
                icon: '/icons/icon-192x192.png'
            }).catch(error => {
                console.error('Error showing notification:', error);
            });
        }
    }, 10000); // 10000ms = 10 seconds

    // Alternatively, schedule a notification at a fixed time
    const fixedTime = new Date('2024-06-03T10:30:00');
    const now = new Date();
    const timeUntilNotification = fixedTime - now;

    if (timeUntilNotification > 0) {
        setTimeout(() => {
            if ('Notification' in window && navigator.serviceWorker) {
                registration.showNotification('Time to check your questionnaire responses!', {
                    body: 'Please review the responses you have collected.',
                    icon: '/icons/icon-192x192.png'
                }).catch(error => {
                    console.error('Error showing notification:', error);
                });
            }
        }, timeUntilNotification);
    }
}
