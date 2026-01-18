// Example: prepare data from current page
const pageTitle = document.title;
const pageUrl = window.location.href;

chrome.runtime.sendMessage({
  action: "prefillCard",
  data: { title: pageTitle, url: pageUrl }
});
