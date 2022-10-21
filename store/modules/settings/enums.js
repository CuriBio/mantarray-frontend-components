export const ERRORS = {
  InstrumentCreateConnectionError: "Unable to establish a connection to the instrument",
  InstrumentConnectionLostError: "The instrument failed to respond to one or more commands",
  InstrumentBadDataError: "Malformed data received from the instrument",
  InstrumentFirmwareError: "An error occurred in the instrument's firmware",
  FirmwareAndSoftwareNotCompatibleError:
    "The instrument's firmware is not compatible with this version of the Mantarray Controller",
};
