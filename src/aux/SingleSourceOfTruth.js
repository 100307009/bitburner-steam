export var settings = {
    "autobuyServers": false,
    "hackexplore": true,
    "batcherTarget": "n00dles",
    "serverList": [],
    "isKillallDisabled": false,
    "killallTrigger": false
}

// UI state variables
export var needsUpdate = true;
export var showTooltip = false;
export var isExpanded = false;

export function setSettings(newSettings) {
  settings = newSettings;
}

export function setNeedsUpdate(value) {
  needsUpdate = value;
}

export function setShowTooltip(value) {
  showTooltip = value;
}

export function setIsExpanded(value) {
  isExpanded = value;
}