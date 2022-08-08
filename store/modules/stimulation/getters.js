import { generate_random_color } from "@/js_utils/waveform_data_formatter";

// eslint-disable-next-line require-jsdoc
export function get_default_protocol_editor_state() {
  return {
    name: "",
    stop_setting: "Stimulate Until Stopped",
    stimulation_type: "C",
    rest_duration: 0,
    time_unit: "milliseconds",
    pulses: [],
    detailed_pulses: [],
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
      const color = get_protocol_editor_color(protocol_list);
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

const get_protocol_editor_color = (list) => {
  const color = generate_random_color(false);
  const duplicate_color = list.filter((protocol) => protocol.color === color).length > 0;

  return duplicate_color ? get_protocol_editor_color(list) : color;
};

// TODO Luci, handle if there are more than 26 protocols
const get_protocol_editor_letter = (list) => {
  const current_protocol_assignment = list[list.length - 1].letter;
  const current_alphabet_idx = alphabet.indexOf(current_protocol_assignment);
  return alphabet[current_alphabet_idx + 1];
};

const alphabet = Array.from(Array(26).keys()).map((i) => String.fromCharCode(65 + i));
