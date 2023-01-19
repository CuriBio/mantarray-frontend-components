import { mount } from "@vue/test-utils";
import NewTreatmentWidget from "@/components/plate_based_widgets/mapeditor/NewTreatmentWidget.vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("NewTreatmentWidget.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting NewTreatmentWidget, Then the apply button should be disabled", async () => {
    const wrapper = mount(NewTreatmentWidget, {
      store,
      localVue,
    });
    const header = wrapper.find(".div__platemap-newtreatment-header");
    expect(header.isVisible()).toBe(true);
  });

  test("When entering an already used name into input, Then error message will display that it's not allowed", async () => {
    const wrapper = mount(NewTreatmentWidget, {
      store,
      localVue,
    });

    await store.commit("platemap/set_new_well_treatment", "duplicate_name");
    const error_msg = wrapper.find("#input-widget-feedback-treatment-name");
    expect(error_msg.text()).toBe("Required");

    await wrapper.find("#input-widget-field-treatment-name").setValue("duplicate_name");
    expect(error_msg.text()).toBe("This name is already taken");
    expect(wrapper.vm.is_enabled).toStrictEqual([true, false]);

    await wrapper.find("#input-widget-field-treatment-name").setValue("new_name");
    expect(error_msg.text()).toBe("");
    expect(wrapper.vm.is_enabled).toStrictEqual([true, true]);

    await wrapper.find("#input-widget-field-treatment-name").setValue("");
    expect(error_msg.text()).toBe("Required");
    expect(wrapper.vm.is_enabled).toStrictEqual([true, false]);
  });

  test("When valid input has been added, Then selecting 'Save' will commit name to state", async () => {
    const store_spy = jest.spyOn(store, "commit");

    const wrapper = mount(NewTreatmentWidget, {
      store,
      localVue,
    });

    await wrapper.find("#input-widget-field-treatment-name").setValue("new_name");
    await wrapper.findAll(".span__button_label").at(1).trigger("click");

    expect(store_spy).toHaveBeenCalledWith("platemap/set_new_well_treatment", "new_name");
  });

  test.each([0, 1])(
    "When valid input has been added, Then selecting either button will close the modal and reset input value",
    async (button_idx) => {
      const wrapper = mount(NewTreatmentWidget, {
        store,
        localVue,
      });

      await wrapper.find("#input-widget-field-treatment-name").setValue("new_name");
      await wrapper.findAll(".span__button_label").at(button_idx).trigger("click");

      expect(wrapper.emitted("close_modal")).toHaveLength(1);
      expect(wrapper.vm.initial_value).toBe("");
    }
  );
});
