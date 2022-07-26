import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioDelayModal from "@/components/stimulation/StimulationStudioDelayModal.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioDelayModal.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When a user closes delay modal, Then button label and new delay value should be emitted to parent component", async () => {
    const wrapper = mount(StimulationStudioDelayModal, {
      store,
      localVue,
    });

    await wrapper.find("#input-widget-field-delay").setValue("3");
    await wrapper.findAll(".span__button_label").at(0).trigger("click");

    expect(wrapper.emitted("delay_close")).toBeTruthy();
  });

  test.each([
    [true, ["Save", "Duplicate", "Delete", "Cancel"]],
    [false, ["Save", "Cancel"]],
  ])(
    "When a user opens the delay modal and editing is %s, Then button labels should be %s",
    async (modal_open_for_edit, expected_button_labels) => {
      const button_labels = StimulationStudioDelayModal.computed.button_labels.call({
        modal_open_for_edit,
      });
      expect(button_labels).toStrictEqual(expected_button_labels);
    }
  );

  test.each([
    [true, ["#19ac8a", "#19ac8a", "#bd4932", "#bd4932"]],
    [false, ["#19ac8a", "#bd4932"]],
  ])(
    "When a user opens the delay modal and editing is %s, Then button hover colors should be %s",
    async (modal_open_for_edit, expected_button_colors) => {
      const button_labels = StimulationStudioDelayModal.computed.button_hover_colors.call({
        modal_open_for_edit,
      });
      expect(button_labels).toStrictEqual(expected_button_colors);
    }
  );

  test("When a user adds a value to an input field, Then the correct error message will be presented upon validity checks to input", async () => {
    const wrapper = mount(StimulationStudioDelayModal, {
      store,
      localVue,
    });
    const target_input_field = wrapper.find("#input-widget-field-delay");

    await target_input_field.setValue("test");
    expect(wrapper.vm.invalid_text).toBe("Must be a (+) number");

    await target_input_field.setValue("1500");
    expect(wrapper.vm.invalid_text).toBe("");

    await target_input_field.setValue("");
    expect(wrapper.vm.invalid_text).toBe("Required");
  });

  test("When a user wants to save the delay/repeat value, Then it will only be possible once a all validation checks pass for input", async () => {
    const wrapper = mount(StimulationStudioDelayModal, {
      store,
      localVue,
      propsData: {
        modal_type: "Delay",
      },
    });
    await wrapper.find("#input-widget-field-delay").setValue("5000");
    expect(wrapper.vm.is_valid).toBe(true);

    await wrapper.find("#input-widget-field-delay").setValue("test");
    expect(wrapper.vm.is_valid).toBe(false);
  });
  test("When a user selects a different time unit from the dropdown, Then the index will be saved to state", async () => {
    const wrapper = mount(StimulationStudioDelayModal, {
      store,
      localVue,
    });

    await wrapper.find(".div__small-dropdown-controls-content-widget").trigger("click");
    await wrapper.findAll("li").at(0).trigger("click");

    expect(wrapper.vm.time_unit_idx).toBe(1);
  });
});