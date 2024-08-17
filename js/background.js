chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      "id": 1,
      "priority": 1,
      "action": { "type": "block" },
      "condition": {
        "urlFilter": "tracker",
        "resourceTypes": ["script", "image", "xmlhttprequest"]
      }
    }],
    removeRuleIds: [1]
  });
  