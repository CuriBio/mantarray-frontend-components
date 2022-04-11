export const STIM_STATUS = {
  // initial state
  CALIBRATION_NEEDED: "Calibration Needed Before Available",

  // configuration states
  CONFIG_CHECK_NEEDED: "Configuration Check Needed",
  CONFIG_CHECK_IN_PROGRESS: "Configuration Check in Progress...",
  CONFIG_CHECK_COMPLETE: "Configuration Check Complete",

  // ready means configuration check results have been confirmed by user and no short circuit errors occured
  // will default to ready when stimulation is inactive given no other requirements currently needed.
  READY: "Ready",
  // stim play states
  STIM_ACTIVE: "Stimulating...",

  // error
  SHORT_CIRCUIT_ERROR: "Short Circuit Error",
  ERROR: "Error Occurred",
};
