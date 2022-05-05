import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/SettingsForm.vue";
import ToggleWidget from "@/components/basic_widgets/ToggleWidget.vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import { array_of_user_accounts } from "./SettingsFormUserData.js";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;

describe("SettingsForm.vue", () => {
  /**
   * Returns an object of DOM span id's
   * @param {Object} wrap - Component reference
   * @return {Object} buttons - An Object
   */
  function get_buttons(wrap) {
    const buttons = {
      add_user_btn: wrap.find(".span__settingsform-user-add-btn_txt"),
      edit_user_btn: wrap.find(".span__settingsform-user-edit-btn-txt"),
    };
    return buttons;
  }
  /**
   * Returns an object of DOM span id's
   * @param {Object} wrap - Component reference
   * @return {Object} valid_buttons - An Object
   */
  function get_settings_button_enabled(wrap) {
    const valid_buttons = {
      reset_btn: wrap.find(".span__settings-tool-tip-reset-btn-txt-enable"),
      save_btn: wrap.find(".span__settings-tool-tip-save-btn-txt-enable"),
      save_btn_container: wrap.find(".div__settings-tool-tip-save-btn-enable"),
      cancel_btn: wrap.find(".div__settings-tool-tip-cancel-btn"),
    };
    return valid_buttons;
  }
  /**
   * Returns an object of DOM span id's
   * @param {Object} wrap - Component reference
   * @return {Object} valid_buttons - An Object
   */
  function get_settings_button_disable(wrap) {
    const valid_buttons = {
      reset_btn: wrap.find(".span__settings-tool-tip-reset-btn-txt-disable"),
      save_btn: wrap.find(".span__settings-tool-tip-save-btn-txt-disable"),
      save_btn_container: wrap.find(".div__settings-tool-tip-save-btn-disable"),
    };
    return valid_buttons;
  }
  /**
   * Returns an object of DOM div id's
   * @param {Object} wrap - Component reference
   * @return {Object} invalid_boxes - An Object
   */
  function get_invalid_boxes(wrap) {
    const boxes = wrap.findAll(".div__input-dropdown-controls-content-widget--invalid");
    const invalid_boxes = {
      customer: boxes.at(0),
      // user: boxes.at(1),
    };
    return invalid_boxes;
  }
  /**
   * Returns an object of DOM div id's
   * @param {Object} wrap - Component reference
   * @return {Object} valid_boxes - An Object
   */
  function get_valid_boxes(wrap) {
    const boxes = wrapper.findAll(".div__input-dropdown-controls-content-widget--valid");
    const valid_boxes = {
      customer: boxes.at(0),
      // user: boxes.at(1),
    };
    return valid_boxes;
  }
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });
  describe("Given Vuex has a valid user account of 'User account -1' but no user index selected", () => {
    beforeEach(() => {
      // commit a deep copy of the template object to the Vuex store using JSON stringify/parse, as it may be modified during tests. https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
      store.commit("settings/set_user_accounts", JSON.parse(JSON.stringify(array_of_user_accounts)));
    });
    describe("Given the component is mounted", () => {
      beforeEach(() => {
        wrapper = mount(ComponentToTest, {
          store,
          localVue,
        });
      });

      test("When the value of User is set to 'User account -1', Then the buttons 'Add New User', 'Edit ID' are enabled", async () => {
        await wrapper.find("#input-dropdown-widget-user-account-").setValue("User account -1");
        await wrapper.vm.$nextTick(); // wait for update

        const all_buttons = get_buttons(wrapper);
        await wrapper.vm.$nextTick(); // wait for update
        expect(all_buttons.add_user_btn.isVisible()).toBe(true);
        expect(all_buttons.edit_user_btn.isVisible()).toBe(true);
      });
    });

    test("When the component is mounted, Then 'Add New User' is enabled and 'Edit ID' is disabled", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      await wrapper.vm.$nextTick(); // wait for update
      const all_buttons = get_buttons(wrapper);
      await wrapper.vm.$nextTick(); // wait for update
      expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
    });
    test("When the component is mounted, Then visually the Reset and Save Buttons are disabled", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      const settings_buttons = get_settings_button_disable(wrapper);
      expect(settings_buttons.reset_btn.isVisible()).toBe(true);
      expect(settings_buttons.save_btn.isVisible()).toBe(true);
      expect(settings_buttons.save_btn_container.isVisible()).toBe(true);
    });
    test("Given the SettingsForm has a valid customer account set as 'User account -1', When the Vuex Store data specifies a valid Customer ID, Then visually the Reset and Save Buttons are enabled", async () => {
      store.commit("settings/set_active_user_index", 0);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const settings_buttons = get_settings_button_enabled(wrapper);
      expect(settings_buttons.reset_btn.isVisible()).toBe(true);
      expect(settings_buttons.save_btn.isVisible()).toBe(true);
      expect(settings_buttons.save_btn_container.isVisible()).toBe(true);
    });
    test("Given the SettingsForm has Vuex data is an empty array, When the value Customer ID is <empty>, Then visually the RED Box is enabled around the Customer ID", async () => {
      const array_of_empty_user_accounts = [];
      store.commit("settings/set_user_accounts", array_of_empty_user_accounts);
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const invalid_box = get_invalid_boxes(wrapper);
      expect(invalid_box.customer.isVisible()).toBe(true);
    });
    test("Given the SettingsForm has a valid customer account set as 'User account -1', When the 'User account -1' is in focus, Then the GREEN Box is enabled around the Customer ID", async () => {
      store.commit("settings/set_active_user_index", 0);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const valid_boxes = get_valid_boxes(wrapper);
      expect(valid_boxes.customer.isVisible()).toBe(true);
    });
    test("Given the SettingsForm has a valid customer account set as 'User account -1', When the user now modifies to non-existent customer say 'User account -', Then validate that Red Boxes are visible around Customer ID 'Add New Customer Button' is enabled", async () => {
      store.commit("settings/set_active_user_index", 0);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      const valid_boxes = get_valid_boxes(wrapper);
      expect(valid_boxes.customer.isVisible()).toBe(true);

      await wrapper.find("#input-dropdown-widget-user-account-").setValue("User account -"); // customer with this doesn't exist.

      await wrapper.vm.$nextTick(); // wait for update

      const invalid_box = get_invalid_boxes(wrapper);
      expect(invalid_box.customer.isVisible()).toBe(true);
      const all_buttons = get_buttons(wrapper);
      await wrapper.vm.$nextTick(); // wait for update
      expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
    });

    test("Given the SettingsForm has a valid customer account set as 'User account -1', When the user sets the value on input with same default value 'User account -1' , Then validate that Green Box is around the input, and based on rules relevant buttons are enabled", async () => {
      store.commit("settings/set_active_user_index", 0);
      // store.commit("settings/set_active_user_index", 0);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
        data() {
          return {
            disable_edit_user: true,
          };
        },
      });

      await wrapper.vm.$nextTick(); // wait for update

      await wrapper.find("#input-dropdown-widget-user-account-").setValue("User account -1");
      await wrapper.vm.$nextTick(); // wait for update

      const valid_boxes = get_valid_boxes(wrapper);
      expect(valid_boxes.customer.isVisible()).toBe(true);
      const all_buttons = get_buttons(wrapper);
      await wrapper.vm.$nextTick(); // wait for update
      expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      expect(all_buttons.edit_user_btn.isVisible()).toBe(true);
    });

    test("When the component is mounted and User account is/is not selected, Then the cancel button is visible and will close modal on click", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const settings_buttons = await get_settings_button_enabled(wrapper);

      expect(settings_buttons.cancel_btn.isVisible()).toBe(true);
      await settings_buttons.cancel_btn.trigger("click");

      const close_event = wrapper.emitted("close_modal");
      expect(close_event[0]).toStrictEqual([false]);
    });

    test("When the component is mounted and User account is/is not selected, Then clicking the save button will be disabled", async () => {
      const commit_spy = jest.spyOn(store, "commit");
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const settings_buttons = await get_settings_button_disable(wrapper);

      expect(settings_buttons.save_btn.isVisible()).toBe(true);
      await settings_buttons.save_btn.trigger("click");

      expect(commit_spy).toHaveBeenCalledTimes(0);
    });

    test("When the component is mounted and a user toggles the auto upload and auto delete switches, Then the new state will be handled in component state", async () => {
      const toggle_spy = jest.spyOn(ComponentToTest.methods, "handle_toggle_state");
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const default_state = {
        auto_delete: false,
        auto_upload: false,
      };
      const expected_state = {
        auto_delete: true,
        auto_upload: true,
      };
      expect(wrapper.vm.auto_delete).toBe(default_state.auto_delete);
      expect(wrapper.vm.auto_upload).toBe(default_state.auto_upload);

      await wrapper.find(ToggleWidget).vm.$emit("handle_toggle_state", true, "auto_upload");
      await wrapper.find(ToggleWidget).vm.$emit("handle_toggle_state", true, "auto_delete");

      expect(toggle_spy).toHaveBeenCalledTimes(2);

      expect(wrapper.vm.auto_delete).toBe(expected_state.auto_delete);
      expect(wrapper.vm.auto_upload).toBe(expected_state.auto_upload);
    });
  });
});
