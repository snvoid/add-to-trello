document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save');
  const status = document.getElementById('status');
  const keyInput = document.getElementById('trello_key');
  const tokenInput = document.getElementById('trello_token');
  const boardInput = document.getElementById('board_id');

  chrome.storage.sync.get(['trello_key', 'trello_token', 'board_id'], (data) => {
    keyInput.value = data.trello_key || '';
    tokenInput.value = data.trello_token || '';
    boardInput.value = data.board_id || '';
  });

  saveButton.addEventListener('click', () => {
    const data = {
      trello_key: keyInput.value.trim(),
      trello_token: tokenInput.value.trim(),
      board_id: boardInput.value.trim()
    };

    chrome.storage.sync.set(data, () => {
      status.textContent = 'Settings saved!';
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  });
});