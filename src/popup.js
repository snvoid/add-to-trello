// popup.js
document.getElementById("create").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const status = document.getElementById("status");

  if (!title) {
    status.textContent = "Please enter a title.";
    return;
  }

  // Retrieve Trello API credentials from storage
  const { apiKey, token } = await chrome.storage.sync.get(["apiKey", "token"]);
  if (!apiKey || !token) {
    status.textContent = "Missing Trello API key or token. Open options to add.";
    return;
  }

  chrome.runtime.sendMessage(
    { action: "createTrelloCard", title, description: desc, apiKey, token },
    (response) => {
      if (response?.success) {
        status.textContent = "✅ Card added!";
        document.getElementById("title").value = "";
        document.getElementById("desc").value = "";
      } else {
        status.textContent = "⚠️ Failed to add card.";
        console.error(response?.error);
      }
    }
  );
});
