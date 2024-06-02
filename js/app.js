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
    navigator.serviceWorker.register('/AECOS/js/serviceWorker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}
