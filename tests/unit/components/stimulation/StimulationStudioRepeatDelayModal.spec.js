import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioRepeatDelayModal from "@/components/stimulation/StimulationStudioRepeatDelayModal.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioRepeatDelayModal.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When a user opens modal to edit current repeat block, Then the current number passed as props should appear in input instead of placeholder", async () => {
    const wrapper = mount(StimulationStudioRepeatDelayModal, {
      store,
      localVue,
      propsData: {
        modal_type: "Repeat",
        current_repeat_delay_input: "4",
      },
    });

    expect(wrapper.vm.input_value).toBe("4");
  });

  test("When a user closes repeat modal, Then button label and new repeat value should be emitted to parent component", async () => {
    const wrapper = mount(StimulationStudioRepeatDelayModal, {
      store,
      localVue,
      propsData: {
        modal_type: "Repeat",
      },
    });
    await wrapper.find("#input-widget-field-repeat_delay").setValue("3");
    await wrapper.findAll(".span__button_label").at(0).trigger("click");

    expect(wrapper.emitted("repeat_close")).toBeTruthy();
  });

  test("When a user closes delay modal, Then button label and new delay value should be emitted to parent component", async () => {
    const wrapper = mount(StimulationStudioRepeatDelayModal, {
      store,
      localVue,
      propsData: {
        modal_type: "Delay",
      },
    });

    await wrapper.find("#input-widget-field-repeat_delay").setValue("3");
    await wrapper.findAll(".span__button_label").at(0).trigger("click");

    expect(wrapper.emitted("delay_close")).toBeTruthy();
  });

  test("When a user opens the delay modal to edit existing values, Then button labels should include ability to delete delay", async () => {
    const get_button_array = StimulationStudioRepeatDelayModal.computed.get_button_array.call({
      modal_type: "Delay",
      delay_open_for_edit: true,
    });
    expect(get_button_array).toStrictEqual(["Save", "Delete", "Cancel"]);
  });

  test("When a user adds a value to an input field, Then the correct error message will be presented upon validity checks to input", async () => {
    const wrapper = mount(StimulationStudioRepeatDelayModal, {
      store,
      localVue,
      propsData: {
        modal_type: "Delay",
      },
    });
    const target_input_field = wrapper.find("#input-widget-field-repeat_delay");

    await target_input_field.setValue("test");
    expect(wrapper.vm.invalid_text).toBe("Must be a (+) number");

    await target_input_field.setValue("1500");
    expect(wrapper.vm.invalid_text).toBe("");

    await target_input_field.setValue("");
    expect(wrapper.vm.invalid_text).toBe("Required");
  });

  test("When a user wants to save the delay/repeat value, Then it will only be possible once a all validation checks pass for input", async () => {
    const wrapper = mount(StimulationStudioRepeatDelayModal, {
      store,
      localVue,
      propsData: {
        modal_type: "Delay",
      },
    });
    await wrapper.find("#input-widget-field-repeat_delay").setValue("5000");
    expect(wrapper.vm.is_valid).toBe(true);

    await wrapper.find("#input-widget-field-repeat_delay").setValue("test");
    expect(wrapper.vm.is_valid).toBe(false);
  });
});
