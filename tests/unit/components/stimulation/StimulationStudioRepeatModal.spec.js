import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioRepeatModal from "@/components/stimulation/StimulationStudioRepeatModal.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioRepeatModal.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When a user opens modal to edit current repeat block, Then the current number passed as props should appear in input instead of placeholder", async () => {
    const wrapper = mount(StimulationStudioRepeatModal, {
      store,
      localVue,
    });
    await wrapper.find("#input-widget-field-hertz").setValue("4");
    expect(wrapper.vm.number_of_repeats).toBe("4");
  });

  test("When a user closes repeat modal, Then button label and new repeat value should be emitted to parent component", async () => {
    const wrapper = mount(StimulationStudioRepeatModal, {
      store,
      localVue,
    });
    await wrapper.find("#input-widget-field-hertz").setValue("3");
    await wrapper.findAll(".span__button_label").at(0).trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
