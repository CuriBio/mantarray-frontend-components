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
    const { protocol_list, edit_mode } = JSON.parse(JSON.stringify(state));

    if (!edit_mode.status) {
      const letter = get_protocol_editor_letter(protocol_list);
      const color = COLOR_PALETTE[protocol_list.length % 26];
      state.current_assignment = { letter, color };

      return { color, letter };
    } else if (edit_mode.status) {
      return state.current_assignment;
    }
  },
  get_protocol_name({ protocol_editor }) {
    return protocol_editor.name;
  },
  get_rest_duration({ protocol_editor }) {
    return protocol_editor.rest_duration;
  },
};

export const get_protocol_editor_letter = (list) => {
  // First need to find the index of last letter incase a deletion has been made.
  // If there has been a deletion, then number of protocols won't coincide with letter index to use in the alphabet
  if (list.length === 1) return "A";

  const last_letter = list[list.length - 1].letter.split("")[0]; // handles duplicate letters
  const last_letter_idx = ALPHABET.indexOf(last_letter);
  // need to handle if end of alphabet has been reached
  const next_letter_idx = last_letter_idx === 25 ? 0 : last_letter_idx + 1;
  const letter_assignment = ALPHABET[next_letter_idx];
  const num_letters = Math.floor((list.length - 1) / 26) + 1;

  return letter_assignment.repeat(num_letters);
};
