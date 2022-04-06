export const STIM_STATUS = {
  // initial state
  CALIBRATION_NEEDED: "Calibration needed before available",

  // configuration states
  CONFIG_CHECK_NEEDED: "Configuration check needed",
  CONFIG_CHECK_IN_PROGRESS: "Configuration check in progress...",
  CONFIG_CHECK_COMPLETE: "Configuration check complete",

  // ready means configuration check results have been confirmed by user and no short circuit errors occured
  // will default to ready when stimulation is inactive given no other requirements currently needed.
  READY: "Ready",
  // stim play states
  STIM_ACTIVE: "Stimulating...",

  // error
  SHORT_CIRCUIT_ERR: "Short circuit error",
};
