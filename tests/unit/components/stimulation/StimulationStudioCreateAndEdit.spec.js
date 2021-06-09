import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioCreateAndEdit from "@/components/stimulation/StimulationStudioCreateAndEdit.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioCreateAndEdit.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting StimulationStudioCreateAndEdit from the component file, Then the correct number of protocols from state should appear in the drop down selection", () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    const labeled_protocols = store.state.stimulation.protocol_list.filter(
      (protocol) => protocol.label.length != 0
    ).length;
    const target_span = wrapper.findAll("li");
    expect(target_span).toHaveLength(labeled_protocols);
  });

  test("When a user clicks on apply selection, Then selected protocol should be applied to all wells in selected wells state and added to protocol assignments", async () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    await store.commit("stimulation/handle_selected_wells", [false, true, false, true]);
    const options = wrapper.findAll("li");
    await options.at(1).trigger("click");
    console.log(wrapper.vm.selected_protocol_idx);
    await wrapper.vm.handle_click(0);
    const expected_value = store.state.stimulation.protocol_list[wrapper.vm.selected_protocol_idx];
    store.state.stimulation.selected_wells.map((well) => {
      expect(store.state.stimulation.protocol_assignments[well]).toBe(expected_value);
    });
  });

  test("When a user clicks on clear selection, Then selected protocol should be removed from protocol assignments", async () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    await store.commit("stimulation/handle_selected_wells", [false, true, false, true]);
    const options = wrapper.findAll("li");
    await options.at(1).trigger("click");
    await wrapper.vm.handle_click(0);
    expect(store.state.stimulation.protocol_assignments[1]).toBeTruthy();
    await wrapper.vm.handle_click(1);
    expect(store.state.stimulation.protocol_assignments[1]).toBeFalsy();
  });
});
