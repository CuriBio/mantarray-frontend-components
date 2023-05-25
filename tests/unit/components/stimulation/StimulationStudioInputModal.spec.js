import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioInputModal from "@/components/stimulation/StimulationStudioInputModal.vue";
import { MIN_SUBPROTOCOL_DURATION_MS, MAX_SUBPROTOCOL_DURATION_MS } from "@/store/modules/stimulation/enums";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioInputModal.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When a user closes delay modal, Then button label and new delay value should be emitted to parent component", async () => {
    const wrapper = mount(StimulationStudioInputModal, {
      store,
      localVue,
      propsData: {
        current_color: "hsla(50, 100%, 50%, 1)",
      },
    });

    await wrapper.find("#input-widget-field-stim-input").setValue(MIN_SUBPROTOCOL_DURATION_MS.toString());
    await wrapper.findAll(".span__button-label").at(1).trigger("click");

    expect(wrapper.emitted("input-close")).toBeTruthy();
  });

  test.each([
    [true, ["Save", "Duplicate", "Delete", "Cancel"]],
    [false, ["Save", "Cancel"]],
  ])(
    "When a user opens the delay modal and editing is %s, Then button labels should be %s",
    async (modal_open_for_edit, expected_button_labels) => {
      const button_labels = StimulationStudioInputModal.computed.button_labels.call({
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
      const button_labels = StimulationStudioInputModal.computed.button_hover_colors.call({
        modal_open_for_edit,
      });
      expect(button_labels).toStrictEqual(expected_button_colors);
    }
  );

  test("When a user adds a value to an input field, Then the correct error message will be presented upon validity checks to input", async () => {
    const wrapper = mount(StimulationStudioInputModal, {
      store,
      localVue,
      propsData: {
        current_color: "hsla(50, 100%, 50%, 1)",
      },
    });
    const target_input_field = wrapper.find("#input-widget-field-stim-input");

    // invalid
    await target_input_field.setValue("");
    expect(wrapper.vm.invalid_text).toBe("Required");

    await target_input_field.setValue("test");
    expect(wrapper.vm.invalid_text).toBe("Must be a (+) number");

    await target_input_field.setValue(`${MIN_SUBPROTOCOL_DURATION_MS - 1}`);
    expect(wrapper.vm.invalid_text).toBe(`Duration must be >=${MIN_SUBPROTOCOL_DURATION_MS}ms`);

    await target_input_field.setValue(`${MAX_SUBPROTOCOL_DURATION_MS + 1}`);
    expect(wrapper.vm.invalid_text).toBe("Duration must be <= 24hrs");

    await target_input_field.setValue(`${MIN_SUBPROTOCOL_DURATION_MS + 0.1}`);
    expect(wrapper.vm.invalid_text).toBe("Must be a whole number of ms");

    // valid
    await target_input_field.setValue(`${MIN_SUBPROTOCOL_DURATION_MS}`);
    expect(wrapper.vm.invalid_text).toBe("");

    await target_input_field.setValue(`${MAX_SUBPROTOCOL_DURATION_MS}`);
    expect(wrapper.vm.invalid_text).toBe("");
  });

  test("When a user wants to save the delay/repeat value, Then it will only be possible once a all validation checks pass for input", async () => {
    const wrapper = mount(StimulationStudioInputModal, {
      store,
      localVue,
      propsData: {
        modal_type: "Delay",
        current_color: "hsla(50, 100%, 50%, 1)",
      },
    });
    await wrapper.find("#input-widget-field-stim-input").setValue("5000");
    expect(wrapper.vm.is_valid).toBe(true);

    await wrapper.find("#input-widget-field-stim-input").setValue("test");
    expect(wrapper.vm.is_valid).toBe(false);
  });
  test("When a user selects a different time unit from the dropdown, Then the index will be saved to state", async () => {
    const wrapper = mount(StimulationStudioInputModal, {
      store,
      localVue,
      propsData: {
        current_color: "hsla(50, 100%, 50%, 1)",
      },
    });

    await wrapper.find(".div__small-dropdown-controls-content-widget").trigger("click");
    await wrapper.findAll("li").at(0).trigger("click");

    expect(wrapper.vm.time_unit_idx).toBe(1);
  });

  test("When a user clicks on a new color for delay block, Then the color will be set to state to be emitted to parent component", async () => {
    const wrapper = mount(StimulationStudioInputModal, {
      store,
      localVue,
      propsData: {
        current_color: "hsla(50, 100%, 50%, 1)",
      },
    });

    await wrapper.find(".div__color-label").trigger("click");

    await wrapper.findAll(".individual_color_block").at(0).trigger("click");

    expect(wrapper.vm.selected_color).toBe("hsla(0, 100%, 50%, 1)");
  });
});
