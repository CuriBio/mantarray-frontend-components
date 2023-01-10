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
      const color = COLOR_PALETTE[protocol_list.length % 26];
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

const get_protocol_editor_letter = (list) => {
  const protocol_idx = list.length - 1;
  const letter_assignment = ALPHABET[protocol_idx % 26];
  const num_letters = Math.floor(protocol_idx / 26) + 1;

  return letter_assignment.repeat(num_letters);
};
