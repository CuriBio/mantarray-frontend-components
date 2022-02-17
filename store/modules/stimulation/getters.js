import { generate_random_color } from "@/js_utils/waveform_data_formatter";
export default {
  get_protocols({ protocol_list }) {
    return protocol_list;
  },
  get_next_protocol(state) {
    const { protocol_list } = state;

    if (!state.edit_mode.status) {
      const letter = get_protocol_editor_letter(protocol_list);
      let color;

      // for e2e testing
      if (letter === "A") color = "#4ca0af";
      else if (letter === "B") color = "#578844";
      else color = get_protocol_editor_color(protocol_list);

      state.current_assignment = { letter, color };
      return { color, letter };
    } else if (state.edit_mode.status) {
      return state.current_assignment;
    }
  },
  get_stimulation_type({ protocol_editor }) {
    if (protocol_editor.stimulation_type === "C") return "Current";
    if (protocol_editor.stimulation_type === "V") return "Voltage";
  },

  get_protocol_name({ protocol_editor }) {
    return protocol_editor.name;
  },
  get_rest_duration({ protocol_editor }) {
    return protocol_editor.rest_duration;
  },
};

const get_protocol_editor_color = (list) => {
  const color = generate_random_color();
  const duplicate_color = list.filter((protocol) => protocol.color === color).length > 0;

  if (duplicate_color) get_protocol_editor_color(list);
  else return color;
};

// TODO Luci, handle if there are more than 26 protocols
const get_protocol_editor_letter = (list) => {
  const current_protocol_assignment = list[list.length - 1].letter;
  const current_alphabet_idx = alphabet.indexOf(current_protocol_assignment);
  return alphabet[current_alphabet_idx + 1];
};

const alphabet = Array.from(Array(26).keys()).map((i) => String.fromCharCode(65 + i));
