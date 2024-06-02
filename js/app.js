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
    } else {
        console.log('Notifications are not supported by this browser.');
    }
});

function scheduleNotification() {
    if (!window.registration) {
        console.error('Service worker registration not found.');
        return;
    }

    setTimeout(() => {
        if ('Notification' in window && navigator.serviceWorker) {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification('Time to check your questionnaire responses!', {
                    body: 'Please review the responses you have collected.',
                    icon: '/AECOS/icons/icon-192x192.png'
                }).catch(error => {
                    console.error('Error showing notification:', error);
                });
            }).catch(error => {
                console.error('Service worker not ready:', error);
            });
        }
    }, 10000); // 10000ms = 10 seconds
}
