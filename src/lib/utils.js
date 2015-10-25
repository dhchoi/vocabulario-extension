var utils = {
  iconUrl: "icons/vocabulario-logo-144.png",
  serverUrl: "http://localhost:3000",
  accessTokenKeyName: "vocabulario-accessToken",

  sendXhrRequest: function (options, callback) { // options = {method: "", url: "", params: ""}
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText); // {message: "", accessToken: ""}
          callback(null, resp);
        }
        else {
          callback(xhr);
        }
      }
    };
    xhr.send(options.params);
  }
};
