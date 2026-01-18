// background.js — MV3 compliant service worker

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-to-trello",
    title: "Add to Trello",
    contexts: ["page", "selection", "link"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add-to-trello") {
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
      await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ["contentScript.js"]
      });
    } catch (err) {
      console.error("Error running content script:", err);
    }
  }
});

// Listen for messages (e.g., from popup or content script)
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "createTrelloCard") {
    const { title, description, apiKey, token } = message;
    try {
      const response = await fetch(
        `https://api.trello.com/1/cards?key=${apiKey}&token=${token}&name=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}`, 
        { method: "POST" }
      );
      const data = await response.json();
      sendResponse({ success: true, data });
    } catch (error) {
      sendResponse({ success: false, error });
    }
    return true; // keeps the message channel open for async response
  }
});
