document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let score = calculatePrivacyScore(tabs[0].url);
      document.getElementById('score').textContent = score;
    });
  });
  
  function calculatePrivacyScore(url) {
    // Basic example of scoring logic
    let score = 100; // Start with a full score
    // Deduct points based on various factors
    if (url.includes('tracker')) {
      score -= 20;
    }
    // Implement more scoring rules here
    return score;
  }
  