export default {
  get_protocols(state) {
    const protocols = state.protocol_list.filter((protocol) => protocol.label.length != 0);
    return protocols;
  },
};
