let autoScrollInterval;

// Request the current state of autoscroll from the background service worker
chrome.runtime.sendMessage({ action: 'getAutoScrollState' }, (response) => {
  if (response && response.isAutoScrollEnabled !== undefined) {
    if (response.isAutoScrollEnabled) {
      startAutoScroll();
    }
  } else {
    console.error('Failed to get autoscroll state:', response);
  }
});

function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    window.scrollBy(0, window.innerHeight);
  }, 2000); // Adjust the interval as needed
}

function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleAutoScroll') {
    if (message.enabled) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  }
});