document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let score = calculatePrivacyScore(tabs[0].url);
    setPrivacyScore(score);
  });
});

function setPrivacyScore(score) {
  // Set the score text
  const scoreElem = document.getElementById('privacy-score');
  if (scoreElem) scoreElem.textContent = score;

  // Animate the circle progress
  const circle = document.querySelector('.circle-bar');
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - percent / 100);
  if (circle) {
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = offset;
  }
}
  
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
  