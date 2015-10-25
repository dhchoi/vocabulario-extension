var serverUrl = "http://localhost:3000";
var accessTokenKeyName = "vocabulario-accessToken";
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
  chrome.storage.local.get(accessTokenKeyName, function (result) {
    accessToken = result[accessTokenKeyName];
    if (accessToken) { // if logged in // TODO: is this always gonna run whenever popup is open?
      Log(accessToken);
      toggleDisplays([containerLoggedOut, containerLoggedIn]);
    }
  });

  /*
   Bind Buttons
   */
  btnOptions.addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) { // New way to open options pages, if supported (Chrome 42+).
      chrome.runtime.openOptionsPage();
    }
    else { // Reasonable fallback.
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  btnSignup.addEventListener('click', function () {
    chrome.tabs.create({
      url: serverUrl + "/signup?from=chromeextension"
    });
  });

  btnLogin.addEventListener('click', function () {
    var email = inputEmail.value;
    var password = inputPassword.value;
    var params = "email=" + email + "&password=" + password;
    Log(params);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", serverUrl + "/api/token", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {  // && xhr.status == 200
        var resp = JSON.parse(xhr.responseText); // {message: "", accessToken: ""}
        Log(resp);
        if (resp[accessTokenKeyName]) {
          var storageObj = {};
          storageObj[accessTokenKeyName] = resp[accessTokenKeyName];
          chrome.storage.local.set(storageObj, function () {
            Log("accessToken saved");
          });

          toggleDisplays([containerLoggedOut, containerLoggedIn]);
        }
      }
    };
    xhr.send(params);
  });

  btnLogout.addEventListener('click', function () {
    chrome.storage.local.remove(accessTokenKeyName, function () {
      Log("accessToken removed");
      toggleDisplays([containerLoggedOut, containerLoggedIn]);
    });
  });
});

function Log(message) {
  chrome.runtime.sendMessage({action: "log", message: message}, function (response) {
    // console.log("got response within browser_action: ");
    // console.dir(response);
  });
}

function toggleDisplays(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = (elements[i].style.display == "none") ? "" : "none";
  }
}
