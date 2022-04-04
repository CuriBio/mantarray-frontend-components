export const STIM_STATUS = {
  // initial state
  CALIBRATION_NEEDED: "Calibration needed before available",

  // configuration states
  CONFIG_CHECK_NEEDED: "Start configuration check",
  CONFIG_CHECK_IN_PROGRESS: "Configuration check in progress",
  CONFIG_CHECK_COMPLETE: "Check complete. Click to run again.",

  // ready means configuration check results have been confirmed by user and no short circuit errors occured
  // will default to ready when stimulation is inactive given no other requirements currently needed.
  READY: "Start Stimulation",
  // stim play states
  STIM_ACTIVE: "Stimulation active",

  // error
  SHORT_CIRCUIT_ERR: "There was a short circuit error.",
};
