// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
var counter = 0;

var serverUrl = "http://localhost:3000";
var accessTokenKeyName = "accessToken";
var accessToken = null;
var notificationID = null;

// if not logged in
if(!accessToken) {
    chrome.storage.local.get(accessTokenKeyName, function (result) {
        accessToken = result[accessTokenKeyName];
        console.log("retrieved accessToken: " + accessToken);
    });
}
else {
    console.log("no accessToken saved.");
}

// TODO: maybe should try setting popup.html inside background.js based on whether token exists
//chrome.browserAction.setPopup({
//    tabId: tabId,
//    popup: 'popup.html'
//});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    console.log(request);
  	if(request.action === "test") {
        chrome.browserAction.setBadgeText({text: String(++counter)});
        sendResponse({result: "ok"});
    }
    else if(request.action === "add") {
        addWord(request.message);
    }
    else if(request.action === "log") {
        console.dir(request.message);
    }
});

//chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
//    if(request.action === "notify") {
//        showNotification(request.message);
//    }
//    //if (sender.url == blacklistedWebsite)
//    //    return;  // don't allow this web page access
//});

// Fired when a browser action icon is clicked.
// This event will not fire if the browser action has a popup.
chrome.browserAction.onClicked.addListener(function(tab) {
    //chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response){
    //    sendServiceRequest(response.data);
    //});
});

function addWord(wordToAdd) {
    if(accessToken) {
        sendXhrRequest({method: "post", url: serverUrl+"/api/add", params: "word="+wordToAdd+"&access_token="+accessToken},
            function (err, response) {
                if (!err) {
                    console.log("Add '" + wordToAdd + "' success");
                    showNotification(wordToAdd);
                }
            }
        );
    }
}

// options =>  {method: "", url: "", params: ""}
function sendXhrRequest(options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {  // &&
            if(xhr.status == 200) {
                var resp = JSON.parse(xhr.responseText); // {message: "", accessToken: ""}
                console.log("xhr response: " + resp);
                callback(null, resp);
            }
            else {
                callback(true, xhr);
            }
        }
        else {
            console.log("dismissing xhr.readyState: " + xhr.readyState);
        }
    };
    xhr.send(options.params);
}

function showNotification(word) {
    chrome.notifications.create("", {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon128.png'),
        title: 'Add Success',
        message: "The word '" + word +"' has been added successfully!",
        priority: 0,
        buttons: [{
            title: 'Check on website'
        }, {
            title: 'Undo action'
        }]
    }, function(id) {
        notificationID = id;
    });
}

chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === notificationID) {
        if (btnIdx === 0) {
            chrome.tabs.create({
                url: serverUrl
            });
        } else if (btnIdx === 1) {
            //var category = charityKeyword || 'hunger';
            //var xhr = new XMLHttpRequest();
            //xhr.open("GET", "https://mylk.herokuapp.com/get-charity-recommendation?category="+category, true);
            //xhr.onreadystatechange = function() {
            //    if (xhr.readyState == 4) {
            //        var resp = JSON.parse(xhr.responseText);
            //        chrome.tabs.create({
            //            url: resp.url
            //        });
            //    }
            //};
            //xhr.send();
        }
    }
});
