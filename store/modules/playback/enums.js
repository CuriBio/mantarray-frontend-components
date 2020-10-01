export const ENUMS = {
  PLAYBACK_STATES: {
    CALIBRATED: "calibrated", // desktop
    CALIBRATING: "calibrating", // desktop only
    STOPPED: "calibrated", // cloud
    BUFFERING: "buffering", // desktop only - transition between calibrated and live view active
    RECORDING: "recording", // desktop only
    LIVE_VIEW_ACTIVE: "live view active", // desktop
    PLAYING: "live view active", // cloud
    NEEDS_CALIBRATION: "needs calibration", // desktop
    CALIBRATION_NEEDED: "needs calibration", // desktop
    NOT_CONNECTED_TO_INSTRUMENT: "not connected", // desktop
    FILE_NOT_LOADED: "not connected", // cloud
    PAUSED: "paused", // cloud only (no desktop equivalent)
  },
};
