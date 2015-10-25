// executes when HTML-Document is loaded and DOM is ready (compared to $(window).load() which loads all objects/frames/images/etc.)
$(document).ready(function () {
  chrome.storage.sync.get(null, function (items) {
    options = items;
  });

  document.addEventListener("mouseup", function (event) {
    if (isTriggered(event)) {
      var textSelection = getTextSelection();
      if (textSelection) {
        // exact format would be chrome.runtime.sendMessage(chrome,runtime.id, {message}, responseCallback)
        chrome.runtime.sendMessage({action: "add", word: textSelection, sentence: ""});
      }
    }
  });
});

function getTextSelection() {
  return String(document.getSelection().toString().trim());
}

function isTriggered(event) {
  if (options) {
    switch (options.triggerKey) {
      case 'none':
        return true;
      case 'ctrl':
        return event.ctrlKey;
      case 'alt':
        return event.altKey;
      case 'cmd':
        return event.metaKey;
      case 'alt+cmd':
        return event.altKey && event.metaKey;
      default:
        return false;
    }
  }
}
