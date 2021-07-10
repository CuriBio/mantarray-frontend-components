export default {
  get_protocols(state) {
    return state.protocol_list;
  },
  get_next_protocol(state) {
    const letter = get_new_protocol_letter(state);
    const color = get_new_protocol_color();
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

// const hardcoded_protocols = [
//   { letter: "", color: "", label: "Create New" },
//   { letter: "A", color: "#83c0b3", label: "test_A" },
//   { letter: "B", color: "#45847b", label: "test_B" },
//   { letter: "C", color: "#df6147", label: "test_C" },
//   { letter: "D", color: "#f0a061", label: "test_D" },
//   { letter: "E", color: "#871d28", label: "" },
//   { letter: "F", color: "#24524b", label: "" },
//   { letter: "G", color: "#133836", label: "" },
//   { letter: "H", color: "#f9d78c", label: "" },
//   { letter: "I", color: "#bd3532", label: "" }
// ];

const get_new_protocol_color = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

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
