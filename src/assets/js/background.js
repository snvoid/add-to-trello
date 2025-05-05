chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-to-trello",
    title: "Add to Trello",
    contexts: ["selection", "link", "image", "page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-to-trello") {
    chrome.storage.sync.get(['trello_key', 'trello_token', 'board_id'], (data) => {
      if (!data.trello_key || !data.trello_token || !data.board_id) {
        chrome.runtime.openOptionsPage();
        return;
      }

      let cardData = {
        name: tab.title,
        desc: info.selectionText || tab.url,
        urlSource: info.linkUrl || info.srcUrl || tab.url,
        pos: "bottom",
        idList: data.board_id
      };

      fetch(`https://api.trello.com/1/cards?key=${data.trello_key}&token=${data.trello_token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.id) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Card Added',
            message: 'Successfully added card to Trello!'
          });
        } else {
          throw new Error('Failed to add card');
        }
      })
      .catch(error => {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/icon48.png',
          title: 'Error',
          message: 'Failed to add card to Trello. Check your settings.'
        });
      });
    });
  }
});