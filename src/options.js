document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  const token = document.getElementById("token").value.trim();
  await chrome.storage.sync.set({ apiKey, token });
  alert("✅ Trello credentials saved!");
});

// Prefill stored data
chrome.storage.sync.get(["apiKey", "token"], (data) => {
  if (data.apiKey) document.getElementById("apiKey").value = data.apiKey;
  if (data.token) document.getElementById("token").value = data.token;
});
