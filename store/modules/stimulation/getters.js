import { COLOR_PALETTE, ALPHABET } from "./enums";
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
      let num_of_loops = 0;
      let num = 26;
      while (num < protocol_list.length) {
        num += 26;
        num_of_loops += 1;
      }

      const offset = 26 * num_of_loops + 1;
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

  const current_alphabet_idx = ALPHABET.indexOf(current_protocol_assignment);
  let letter_assignment = ALPHABET[current_alphabet_idx + 1];

  if (current_alphabet_idx === 25) {
    letter_assignment = ALPHABET[0];
  }
  // add double/triple/etc letters based on number of protocols so it doesn't assign same single letter to protocols
  let num_of_loops = 0;
  let num = 26;
  while (num < list.length) {
    num += 26;
    num_of_loops += 1;
  }
  // append as many rounds of duplicate letters, unlikely
  let assign = letter_assignment;
  Array(num_of_loops)
    .fill()
    .map(() => (assign += letter_assignment));

  return assign;
};
