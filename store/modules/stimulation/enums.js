export const STIM_STATUS = {
  // initial state
  CALIBRATION_NEEDED: "Calibration Needed",

  // configuration states
  CONFIG_CHECK_NEEDED: "Configuration Check Needed",
  CONFIG_CHECK_IN_PROGRESS: "Configuration Check in Progress...",
  CONFIG_CHECK_COMPLETE: "Configuration Check Complete",
  NO_PROTOCOLS_ASSIGNED: "No protocols have been assigned",
  // ready means configuration check results have been confirmed by user and no short circuit errors occured
  // will default to ready when stimulation is inactive given no other requirements currently needed.
  READY: "Ready",
  // stim play states
  STIM_ACTIVE: "Stimulating...",

  // error
  SHORT_CIRCUIT_ERROR: "Short Circuit Error",
  ERROR: "Error Occurred",
};

export const MIN_SUBPROTOCOL_DURATION_MS = 100;
export const MAX_SUBPROTOCOL_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const TIME_CONVERSION_TO_MILLIS = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 60000,
  hours: 3600000,
};
