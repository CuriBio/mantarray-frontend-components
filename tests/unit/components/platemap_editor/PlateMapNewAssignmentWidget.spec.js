import { mount } from "@vue/test-utils";
import PlateMapNewAssignmentWidget from "@/components/plate_based_widgets/mapeditor/PlateMapNewAssignmentWidget.vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateMapNewAssignmentWidget.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting PlateMapNewAssignmentWidget, Then the header will be present", async () => {
    const wrapper = mount(PlateMapNewAssignmentWidget, {
      store,
      localVue,
    });
    const header = wrapper.find(".div__platemap-newlabel-header");
    expect(header.isVisible()).toBe(true);
  });

  test("When entering an already used name into input, Then error message will display that it's not allowed", async () => {
    const wrapper = mount(PlateMapNewAssignmentWidget, {
      store,
      localVue,
    });

    await store.commit("platemap/set_new_label", "duplicate_name");
    const error_msg = wrapper.find("#input-widget-feedback-assignment-name");
    expect(error_msg.text()).toBe("Required");

    await wrapper.find("#input-widget-field-assignment-name").setValue("duplicate_name");
    expect(error_msg.text()).toBe("This name is already taken");
    expect(wrapper.vm.is_enabled).toStrictEqual([true, false]);

    await wrapper.find("#input-widget-field-assignment-name").setValue("new_name");
    expect(error_msg.text()).toBe("");
    expect(wrapper.vm.is_enabled).toStrictEqual([true, true]);

    await wrapper.find("#input-widget-field-assignment-name").setValue("");
    expect(error_msg.text()).toBe("Required");
    expect(wrapper.vm.is_enabled).toStrictEqual([true, false]);
  });

  test("When valid input has been added, Then selecting 'Save' will commit name to state", async () => {
    const store_spy = jest.spyOn(store, "commit");

    const wrapper = mount(PlateMapNewAssignmentWidget, {
      store,
      localVue,
    });

    await wrapper.find("#input-widget-field-assignment-name").setValue("new_name");
    await wrapper.findAll(".span__button-label").at(1).trigger("click");

    expect(store_spy).toHaveBeenCalledWith("platemap/set_new_label", "new_name", undefined);
  });

  test("When original name gets passed as props for editing, Then the name will auto populate the input", async () => {
    const wrapper = mount(PlateMapNewAssignmentWidget, {
      store,
      localVue,
    });
    await wrapper.setProps({ editable_name: "name_to_edit" });

    expect(wrapper.vm.initial_value).toBe("name_to_edit");
    expect(wrapper.vm.invalid_text).toBe("");
    expect(wrapper.vm.is_enabled).toStrictEqual([true, true]);
  });

  test("When edited name gets saved, Then the new and old name will be passed in commit to change state", async () => {
    const store_spy = jest.spyOn(store, "commit");

    const wrapper = mount(PlateMapNewAssignmentWidget, {
      store,
      localVue,
      propsData: {
        editable_name: "name_to_edit",
      },
    });

    await wrapper.find("#input-widget-field-assignment-name").setValue("new_name");

    await wrapper.findAll(".span__button-label").at(1).trigger("click");

    expect(store_spy).toHaveBeenCalledWith(
      "platemap/change_existing_name",
      { new_name: "new_name", old_name: "name_to_edit" },
      undefined
    );
  });

  test.each([0, 1])(
    "When valid input has been added, Then selecting either button will close the modal and reset input value",
    async (button_idx) => {
      const wrapper = mount(PlateMapNewAssignmentWidget, {
        store,
        localVue,
      });

      await wrapper.find("#input-widget-field-assignment-name").setValue("new_name");
      await wrapper.findAll(".span__button-label").at(button_idx).trigger("click");

      expect(wrapper.emitted("close_modal")).toHaveLength(1);
      expect(wrapper.vm.initial_value).toBe("");
    }
  );
});
