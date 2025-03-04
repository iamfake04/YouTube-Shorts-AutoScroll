document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
  
    // Get the current state of autoscroll from the background service worker
    chrome.runtime.sendMessage({ action: 'getAutoScrollState' }, (response) => {
      if (response && response.isAutoScrollEnabled !== undefined) {
        if (response.isAutoScrollEnabled) {
          toggleButton.textContent = 'Disable Autoscroll';
        } else {
          toggleButton.textContent = 'Enable Autoscroll';
        }
      } else {
        console.error('Failed to get autoscroll state:', response);
      }
    });
  
    toggleButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'toggleAutoScroll' }, (response) => {
        if (response && response.isAutoScrollEnabled !== undefined) {
          if (response.isAutoScrollEnabled) {
            toggleButton.textContent = 'Disable Autoscroll';
          } else {
            toggleButton.textContent = 'Enable Autoscroll';
          }
        } else {
          console.error('Failed to toggle autoscroll:', response);
        }
      });
    });
  });