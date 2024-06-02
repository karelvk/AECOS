// Schedule a notification 10 minutes after the app is first used
setTimeout(() => {
    if ('Notification' in window && navigator.serviceWorker) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                navigator.serviceWorker.getRegistration().then(reg => {
                    reg.showNotification('Time to check your questionnaire responses!', {
                        body: 'Please review the responses you have collected.',
                        icon: '/path/to/icon.png'
                    });
                });
            }
        });
    }
}, 10000); // 600000ms = 10 minutes

// Alternatively, schedule a notification at a fixed time
const fixedTime = new Date('2024-06-03T10:30:00');
const now = new Date();
const timeUntilNotification = fixedTime - now;

if (timeUntilNotification > 0) {
    setTimeout(() => {
        if ('Notification' in window && navigator.serviceWorker) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    navigator.serviceWorker.getRegistration().then(reg => {
                        reg.showNotification('Time to check your questionnaire responses!', {
                            body: 'Please review the responses you have collected.',
                            icon: '/path/to/icon.png'
                        });
                    });
                }
            });
        }
    }, timeUntilNotification);
}
