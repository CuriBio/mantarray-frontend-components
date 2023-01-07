import { COLOR_PALETTE } from "./enums";
const alphabet = Array.from(Array(26).keys()).map((i) => String.fromCharCode(65 + i));
// eslint-disable-next-line require-jsdoc
export function get_default_protocol_editor_state() {
  return {
    name: "",
    run_until_stopped: true,
    stimulation_type: "C",
    rest_duration: 0,
    time_unit: "milliseconds",
    subprotocols: [],
    detailed_subprotocols: [],
  };
}
export default {
  get_protocols({ protocol_list }) {
    return protocol_list;
  },
  get_next_protocol(state) {
    const { protocol_list } = state;

    if (!state.edit_mode.status) {
      const letter = get_protocol_editor_letter(protocol_list);
      // loop through again once protocol list becomes greater than 24
      const offset = protocol_list.length > 26 ? 26 * Math.floor(protocol_list.length / 26) + 1 : 1;
      const color = COLOR_PALETTE[protocol_list.length - offset];
      state.current_assignment = { letter, color };
      return { color, letter };
    } else if (state.edit_mode.status) {
      return state.current_assignment;
    }
  },
  get_stimulation_type({ protocol_editor }) {
    return protocol_editor.stimulation_type === "C" ? "Current" : "Voltage";
  },

  get_protocol_name({ protocol_editor }) {
    return protocol_editor.name;
  },
  get_rest_duration({ protocol_editor }) {
    return protocol_editor.rest_duration;
  },
};

// TODO Luci, handle if there are more than 26 protocols
const get_protocol_editor_letter = (list) => {
  // grab just the first letter in case of AA BB CCC DDDD, unlikely but just in case.
  const current_protocol_assignment = list[list.length - 1].letter[0];

  const current_alphabet_idx = alphabet.indexOf(current_protocol_assignment);
  let letter_assignment = alphabet[current_alphabet_idx + 1];

  if (current_alphabet_idx === 25) {
    letter_assignment = alphabet[0];
  }
  // add double/triple/etc letters based on number of protocols so it doesn't assign same single letter to protocols
  const num_of_loops = Math.floor(list.length / 27);
  Array(num_of_loops)
    .fill()
    .map(() => (letter_assignment += letter_assignment));

  return letter_assignment;
};
