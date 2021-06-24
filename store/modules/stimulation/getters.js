export default {
  get_protocols(state) {
    const protocols = state.protocol_list.filter((protocol) => protocol.label.length != 0);
    return protocols;
  },
  get_next_protocol(state) {
    for (let i = 0; i < state.protocol_list.length; i++) {
      if (state.protocol_list[i].label === "") return state.protocol_list[i];
    }
  },
  get_stimulation_type(state) {
    if (state.new_protocol.stimulation_type.includes("Current")) return "Current (μA)";
    if (state.new_protocol.stimulation_type.includes("Voltage")) return "Voltage (mV)";
  },
  get_time_unit(state) {
    if (state.new_protocol.time_unit.includes("milliseconds")) return "Time (ms)";
    if (state.new_protocol.time_unit.includes("seconds")) return "Time (s)";
  },
};
