document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    const range = window.getSelection().getRangeAt(0);
    const span = document.createElement('span');
    span.className = 'trello-highlight';
    span.textContent = selection;
    range.deleteContents();
    range.insertNode(span);

    const button = document.createElement('button');
    button.textContent = 'Add to Trello';
    button.className = 'trello-button';
    button.onclick = () => {
      chrome.runtime.sendMessage({
        action: 'addToTrello',
        selection,
        url: window.location.href
      });
    };
    span.appendChild(button);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clearHighlights') {
    document.querySelectorAll('.trello-highlight').forEach(el => el.remove());
  }
});