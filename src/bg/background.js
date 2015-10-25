var accessToken = null;
var notificationID = null;

// retrieve access token
chrome.storage.local.get(utils.accessTokenKeyName, function (result) {
  accessToken = result[utils.accessTokenKeyName];
  console.log("pulled accessToken from local storage: " + accessToken);
});

// TODO: maybe should try setting popup.html inside background.js based on whether token exists
//chrome.browserAction.setPopup({
//    tabId: tabId,
//    popup: 'popup.html'
//});

chrome.runtime.onMessage.addListener(function (request, sender, responseCallback) {
  if (request.action === "add") {
    var word = request.word;
    var url = sender.tab.url; // existence of sender.tab indicates message was from contentScript, else from extension itself
    var params = "word=" + word + + "&sentence=" + request.sentence + "&url=" + url + "&access_token=" + accessToken;
    requestToServer(params, "add", function (err, response) {
      if (!err) {
        showNotification("Save Success", "The word '" + word + "' was added successfully!", true);
      } {
        showNotification("Save Failed", "Sorry, we couldn't send the request to the server.", false);
      }
    });
  }
  else if (request.action === "log") {
    console.log(request.message);
  }
});

function requestToServer(params, action, callback) {
  console.log("params: " + params);
  if (accessToken) {
    utils.sendXhrRequest({
        method: "post",
        url: utils.serverUrl + "/api/" + action,
        params: params
      }, callback
    );
  }
  else {
    showNotification("Save Failed", "You aren't logged in! Try again after logging in from the extension.", false);
  }
}

function showNotification(title, message, showButtons) {
  var buttons = showButtons ? [{
      title: 'Check on website'
    }, {
      title: 'Undo action'
    }] : null;

  chrome.notifications.create("", {
    type: 'basic',
    iconUrl: chrome.runtime.getURL(utils.iconUrl),
    title: title,
    message: message,
    priority: 0,
    buttons: buttons
  }, function (id) {
    notificationID = id;
  });
}

chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
  if (notifId === notificationID) {
    if (btnIdx === 0) {
      chrome.tabs.create({
        url: utils.serverUrl
      });
    } else if (btnIdx === 1) {
      // TODO: add undo functionality
      //requestToServer(word, "add", url, function (err, response) {
      //  if (!err) {
      //    showNotification("Save Success", "The word '" + word + "' was added successfully!", true);
      //  } {
      //    showNotification("Save Fail", "Sorry, we couldn't send the request to the server.", false);
      //  }
      //});
    }
  }
});
