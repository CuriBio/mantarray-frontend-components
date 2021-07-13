export default {
  get_protocols(state) {
    return state.protocol_list;
  },
  get_next_protocol(state) {
    const letter = get_new_protocol_letter(state);
    const color = get_new_protocol_color(state);
    return { color, letter };
  },
  get_stimulation_type(state) {
    if (state.new_protocol.stimulation_type.includes("Current")) return "Current (A)";
    if (state.new_protocol.stimulation_type.includes("Voltage")) return "Voltage (V)";
  },
  get_time_unit(state) {
    if (state.new_protocol.time_unit.includes("milliseconds")) return "Time (ms)";
    if (state.new_protocol.time_unit.includes("seconds")) return "Time (s)";
  },
};

const get_new_protocol_color = ({ protocol_list }) => {
  let check_duplicate = false;
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  // ensures there are no duplicate colors
  protocol_list.map((protocol) => {
    if (protocol.color === color) check_duplicate = true;
  });
  if (color === "#b7b7b7" || color === "#000000" || check_duplicate) get_new_protocol_color();
  else return color;
};

// TODO Luci, handle if there are more than 26 protocols
const get_new_protocol_letter = ({ protocol_list }) => {
  const current_protocol_assignment = protocol_list[protocol_list.length - 1].letter;
  const current_alphabet_idx = alphabet.indexOf(current_protocol_assignment);
  return alphabet[current_alphabet_idx + 1];
};

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
