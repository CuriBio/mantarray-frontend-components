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

export const COLOR_PALETTE = [
  "#3b77aa",
  "#45438d",
  "#6eb394",
  "#408444",
  "#e5eb94",
  "#f9d78c",
  "#f0a061",
  "#df6147",
  "#bd3532",
  "#801d38",
  "#632467",
  "#735d9e",
  "#7986b5",
  "#92afce",
  "#26542e",
  "#7db76d",
  "#283578",
  "#ed8943",
  "#a92d6c",
  "#e1abce",
  "#fffce4",
  "#00bcd4",
  "#3b77aa",
  "#ae96c0",
  "#ffeb3b",
  "#581623",
];

export const ALPHABET = Array.from(Array(26).keys()).map((i) => String.fromCharCode(65 + i));
