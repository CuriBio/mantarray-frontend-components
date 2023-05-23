import {
  MIN_SUBPROTOCOL_DURATION_MS,
  TIME_CONVERSION_TO_MILLIS,
  MAX_SUBPROTOCOL_DURATION_MS,
  MIN_CHARGE_MA,
  MAX_CHARGE_MA,
  MIN_PHASE_DURATION_US,
} from "@/store/modules/stimulation/enums";

const invalid_err_msg = {
  num_err: "Must be a number",
  required: "Required",
  max_pulse_duration: "Duration must be <= 50ms",
  min_pulse_duration: `Duration must be >= ${MIN_PHASE_DURATION_US}μs`,
  min_interphase_duration: `Duration must be 0ms or >= ${MIN_PHASE_DURATION_US}μs`,
  min_active_duration: "Duration must be >= 100ms",
  valid: "",
  max_min_current: `Must be within [-${MIN_CHARGE_MA}, -${MAX_CHARGE_MA}] or [${MIN_CHARGE_MA}, ${MAX_CHARGE_MA}]`,
  max_voltage: "Must be within +/- 1200",
  frequency: "Must be a non-zero value <= 100",
  num_cycles: "Must be a whole number > 0",
  min_delay_duration: `Duration must be >=${MIN_SUBPROTOCOL_DURATION_MS}ms`,
  max_delay_duration: "Duration must be <= 24hrs",
  delay_num_err: "Must be a (+) number",
  non_integer: "Must be a whole number of ms",
};

export const check_num_cycles_validity = (num_cycles) => {
  // check if value is a whole number greater than 0
  const error_msg_label =
    num_cycles === "" || !Number.isInteger(+num_cycles) || +num_cycles <= 0 ? "num_cycles" : "valid";
  return invalid_err_msg[error_msg_label];
};

export const check_pulse_charge_validity = (value_str) => {
  let error_message;
  // if empty
  if (value_str === "") {
    error_message = invalid_err_msg.required;
    // else if not a number
  } else if (isNaN(+value_str)) {
    error_message = invalid_err_msg.num_err;
    // else if it's a current controlled stim and the value is not within [+/-1, +/-100]
  } else if (Math.abs(+value_str) > MAX_CHARGE_MA || Math.abs(+value_str) < MIN_CHARGE_MA) {
    error_message = invalid_err_msg.max_min_current;
    // else valid
  } else {
    error_message = invalid_err_msg.valid;
  }

  return error_message;
};

export const check_pulse_duration_validity = (
  value_str,
  is_interphase_dur,
  max_pulse_duration_for_freq,
  total_pulse_duration
) => {
  const is_value_less_than_min = +value_str < MIN_PHASE_DURATION_US / 1000;
  let error_message;

  // if empty
  if (value_str === "") {
    error_message = invalid_err_msg.required;
    // else if value is not a valid number
  } else if (isNaN(+value_str)) {
    error_message = invalid_err_msg.num_err;
    // else if value is less than allowed minimum and no interphase interval because interphase has it's own limits
  } else if (is_value_less_than_min && !is_interphase_dur) {
    error_message = invalid_err_msg.min_pulse_duration;
    // else if it is interphase interval and value is less than min and not 0
  } else if (is_value_less_than_min && +value_str !== 0 && is_interphase_dur) {
    error_message = invalid_err_msg.min_interphase_duration;
    // else total duration of all durations is too high for the frequency input
  } else if (total_pulse_duration > max_pulse_duration_for_freq) {
    error_message = invalid_err_msg.max_pulse_duration;
    // else valid
  } else {
    error_message = invalid_err_msg.valid;
  }

  return error_message;
};

export const check_active_duration_validity = (value_str, selected_unit, total_pulse_duration) => {
  const value_in_millis = +value_str * TIME_CONVERSION_TO_MILLIS[selected_unit];
  const min_dur_allowed = Math.max(MIN_SUBPROTOCOL_DURATION_MS, total_pulse_duration || 0);
  let error_message;

  // if empty
  if (value_str === "") {
    error_message = invalid_err_msg.required;
    // else if not a valid number
  } else if (isNaN(+value_str)) {
    error_message = "Invalid number";
    // else if value is less than allowed minimum
  } else if (value_in_millis < min_dur_allowed) {
    error_message = `Must be >= ${min_dur_allowed}ms`;
    // else if value is greater than allowed maximum
  } else if (value_in_millis > MAX_SUBPROTOCOL_DURATION_MS) {
    const max_in_hrs = MAX_SUBPROTOCOL_DURATION_MS / TIME_CONVERSION_TO_MILLIS.hours;
    error_message = `Must be <= ${max_in_hrs}hrs`;
    // else valid
  } else {
    error_message = invalid_err_msg.valid;
  }

  return error_message;
};

export const check_pulse_frequency_validity = (value_str, max_pulse_dur_for_freq) => {
  let error_message;
  // if empty
  if (value_str === "") {
    error_message = invalid_err_msg.required;
    // else if not a number or is less than the minimum or greater than the maximum
  } else if (isNaN(+value_str) || +value_str <= 0 || +value_str > 100) {
    error_message = invalid_err_msg.frequency;
    // else valid and set max pulse duration error message if needed
  } else {
    error_message = invalid_err_msg.valid;
    invalid_err_msg.max_pulse_duration = `Duration must be <= ${max_pulse_dur_for_freq}ms`;
  }
  return error_message;
};

export const check_delay_pulse_validity = (value_str, selected_unit) => {
  const value_in_millis = +value_str * TIME_CONVERSION_TO_MILLIS[selected_unit];
  let error_message;

  if (value_str === "") {
    error_message = invalid_err_msg.required;
  } else if (isNaN(+value_str)) {
    error_message = invalid_err_msg.delay_num_err;
  } else if (value_in_millis < MIN_SUBPROTOCOL_DURATION_MS) {
    error_message = invalid_err_msg.min_delay_duration;
  } else if (value_in_millis > MAX_SUBPROTOCOL_DURATION_MS) {
    error_message = invalid_err_msg.max_delay_duration;
  } else if (!Number.isInteger(value_in_millis)) {
    error_message = invalid_err_msg.non_integer;
  } else {
    error_message = invalid_err_msg.valid;
  }

  return error_message;
};

export const get_max_pulse_duration_for_freq = (freq) => {
  return Math.min(50, Math.trunc((1000 / freq) * 0.8));
};

export const get_total_active_duration = (type, protocol) => {
  return type === "Monophasic"
    ? +protocol.phase_one_duration
    : +protocol.phase_one_duration + +protocol.phase_two_duration + +protocol.interphase_interval;
};

export const are_valid_pulses = (input) => {
  return input.some((proto) => {
    if (proto.type === "loop") return are_valid_pulses(proto.subprotocols);
    else return proto.type === "Delay" ? _is_valid_delay_pulse(proto) : _is_valid_single_pulse(proto);
  });
};

export const _is_valid_single_pulse = (protocol) => {
  const { duration, unit } = protocol.total_active_duration;
  const is_monophasic = protocol.type === "Monophasic";
  const charges_to_check = is_monophasic ? ["phase_one_charge"] : ["phase_one_charge", "phase_two_charge"];
  const durations_to_check = is_monophasic
    ? ["phase_one_duration"]
    : ["phase_one_duration", "phase_two_duration", "interphase_interval"];

  const max_pulse_duration_for_freq = get_max_pulse_duration_for_freq(protocol.frequency);
  const total_active_duration = get_total_active_duration(protocol.type, protocol);

  // first check all durations are within max and min bounds
  const durations_are_valid =
    durations_to_check.filter(
      (duration) =>
        check_pulse_duration_validity(
          protocol[duration],
          duration === "interphase_interval",
          max_pulse_duration_for_freq,
          total_active_duration
        ) !== ""
    ).length === 0;

  // check if charges are within max and min bounds
  const charges_are_valid =
    charges_to_check.filter((charge) => check_pulse_charge_validity(protocol[charge]) !== "").length === 0;

  const complete_pulse_validity =
    check_pulse_frequency_validity(protocol.frequency, max_pulse_duration_for_freq) === "" &&
    check_active_duration_validity(duration, unit, total_active_duration) === "" &&
    check_num_cycles_validity(protocol.num_cycles) === "";

  return durations_are_valid && charges_are_valid && complete_pulse_validity;
};

export const _is_valid_delay_pulse = (protocol) => {
  const { duration, unit } = protocol;
  return check_delay_pulse_validity(duration, unit) === "";
};

/*
  BIPHASIC
  ^^^^^^^^
  frequency
  interphase_interval
  num_cycles
  phase_one_charge
  phase_one_duration
  phase_two_charge
  phase_two_duration
  postphase_interval
  total_active_duration
    duration
    unit
  type
*/

/*
  MONOPHASIC
  ^^^^^^^^^^
  frequency
  num_cycles
  phase_one_charge
  phase_one_duration
  postphase_interval
  total_active_duration
    duration
    unit
  type
*/

/*
  DELAY
  ^^^^^
  duration
  type
  unit
*/

/*
    LOOP
    ^^^^^
    num_iterations: int
    type
    subprotocols: []
  */
