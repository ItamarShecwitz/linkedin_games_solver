document.getElementById('solve').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/content.js']
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => solve()
  });
});
