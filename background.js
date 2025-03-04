let isAutoScrollEnabled = false;

chrome.runtime.onInstalled.addListener(() => {
  // Initialize the state if not already set
  chrome.storage.local.get(['isAutoScrollEnabled'], (result) => {
    if (result.isAutoScrollEnabled === undefined) {
      chrome.storage.local.set({ isAutoScrollEnabled: false });
    }
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(['isAutoScrollEnabled'], (result) => {
    isAutoScrollEnabled = !result.isAutoScrollEnabled;
    chrome.storage.local.set({ isAutoScrollEnabled });

    chrome.tabs.sendMessage(tab.id, { action: 'toggleAutoScroll', enabled: isAutoScrollEnabled }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message to tab:', chrome.runtime.lastError);
      }
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getAutoScrollState') {
    chrome.storage.local.get(['isAutoScrollEnabled'], (result) => {
      sendResponse({ isAutoScrollEnabled: result.isAutoScrollEnabled });
    });
    return true; // Indicate that we will send a response asynchronously
  } else if (message.action === 'toggleAutoScroll') {
    chrome.storage.local.get(['isAutoScrollEnabled'], (result) => {
      isAutoScrollEnabled = !result.isAutoScrollEnabled;
      chrome.storage.local.set({ isAutoScrollEnabled });

      // Ensure sender.tab is defined before sending a message
      if (sender.tab && sender.tab.id) {
        chrome.tabs.sendMessage(sender.tab.id, { action: 'toggleAutoScroll', enabled: isAutoScrollEnabled }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to tab:', chrome.runtime.lastError);
          }
        });
      }

      sendResponse({ isAutoScrollEnabled: isAutoScrollEnabled });
    });
    return true; // Indicate that we will send a response asynchronously
  }
});