var accessToken = null;

document.addEventListener("DOMContentLoaded", function (event) {
  // buttons
  var btnOptions = document.getElementById("btn-options");
  var btnLogin = document.getElementById("btn-login");
  var btnLogout = document.getElementById("btn-logout");
  var btnSignup = document.getElementById("btn-signup");
  var inputEmail = document.getElementById("email");
  var inputPassword = document.getElementById("password");
  // container divs
  var containerLoggedOut = document.getElementById("container-logged-out");
  var containerLoggedIn = document.getElementById("container-logged-in");

  // check login status
  chrome.storage.local.get(utils.accessTokenKeyName, function (result) {
    accessToken = result[utils.accessTokenKeyName];
    if (accessToken) { // if logged in // TODO: is this always gonna run whenever popup is open?
      Log("user is already logged in with accessToken: " + accessToken);
      toggleDisplays([containerLoggedOut, containerLoggedIn]);
    }
  });

  /*
   Bind Buttons
   */
  btnOptions.addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) { // new options pages (chrome 42+)
      chrome.runtime.openOptionsPage();
    }
    else { // fallback
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  btnSignup.addEventListener('click', function () {
    chrome.tabs.create({
      url: utils.serverUrl + "/signup?from=chromeextension"
    });
  });

  btnLogin.addEventListener('click', function () {
    utils.sendXhrRequest({
      method: "post",
      url: utils.serverUrl + "/api/token",
      params: "email=" + inputEmail.value + "&password=" + inputPassword.value // TODO: may have to encrypt password later
    }, function (err, response) {
      if(!err) {
        if (response[utils.accessTokenKeyName]) {
          var storageObj = {};
          storageObj[utils.accessTokenKeyName] = response[utils.accessTokenKeyName];
          chrome.storage.local.set(storageObj, function () {
            Log("user login succeeded and saved accessToken from server to local storage");
          });

          toggleDisplays([containerLoggedOut, containerLoggedIn]);
        }
      }
      else {
        Log("user login failed");
      }
    });
  });

  btnLogout.addEventListener('click', function () {
    chrome.storage.local.remove(utils.accessTokenKeyName, function () {
      Log("user logged out and accessToken removed");
      toggleDisplays([containerLoggedOut, containerLoggedIn]);
    });
  });
});

function Log(message) {
  chrome.runtime.sendMessage({action: "log", message: "[BrowserAction] " + message});
}

function toggleDisplays(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = (elements[i].style.display == "none") ? "" : "none";
  }
}
