document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("btn").addEventListener('click', function() {
        chrome.runtime.sendMessage({action: "test"}, function(response) {
            console.log("got response within browser_action: ");
            console.dir(response);
        });
    });
    document.getElementById("btn-options").addEventListener('click', function() {
        if(chrome.runtime.openOptionsPage) { // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        }
        else { // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
});
