document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addToTrello');
  const optionsButton = document.getElementById('openOptions');

  chrome.storage.sync.get(['trello_key', 'trello_token', 'board_id'], (data) => {
    if (!data.trello_key || !data.trello_token || !data.board_id) {
      addButton.disabled = true;
      addButton.textContent = 'Configure in Options';
    }
  });

  addButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getSelectionAndUrl
      }, (results) => {
        if (results && results[0]) {
          const { selection, url } = results[0].result;
          chrome.runtime.sendMessage({
            action: 'addToTrello',
            selection,
            url
          });
        }
      });
    });
  });

  optionsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});

function getSelectionAndUrl() {
  return {
    selection: window.getSelection().toString().trim(),
    url: window.location.href
  };
}