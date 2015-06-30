// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
var counter = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  	if(request.action === "test") {
        chrome.browserAction.setBadgeText({text: String(++counter)});
        sendResponse({result: "ok"});
    }
    else if(request.action === "log") {
        console.log(request.message);
    }
});


// Fired when a browser action icon is clicked.
// This event will not fire if the browser action has a popup.
chrome.browserAction.onClicked.addListener(function(tab) {
    //chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response){
    //    sendServiceRequest(response.data);
    //});
});
