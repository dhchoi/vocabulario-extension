var triggerKeySelectionId = "trigger-key";
var saveBtnId = "save";
var statusId = "status";

// restores select box and checkbox state using the preferences stored in chrome.storage
document.addEventListener('DOMContentLoaded', function () {
    // Using default values
    chrome.storage.sync.get({
        triggerKey: 'none'
    }, function(items) {
        document.getElementById(triggerKeySelectionId).value = items.triggerKey;
    });
});

// saves options to chrome.storage.sync
document.getElementById(saveBtnId).addEventListener('click', function () {
    chrome.storage.sync.set({
        triggerKey: document.getElementById(triggerKeySelectionId).value
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById(statusId);
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
});
