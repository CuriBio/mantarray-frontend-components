import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/SettingsForm.vue";
import ToggleWidget from "@/components/basic_widgets/ToggleWidget.vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import { array_of_customer_ids } from "./SettingsFormCustomerData.js";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;

describe("SettingsForm.vue", () => {
  // const array_of_customer_ids_no_user_ids = [
  //   {
  //     cust_id: 0,
  //     uuid: "4vqyd62oARXqj9nRUNhtLQ",
  //     api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
  //     nickname: "Customer account -1",
  //     user_ids: []
  //   }
  // ];
  /**
   * Returns an object of DOM span id's
   * @param {Object} wrap - Component reference
   * @return {Object} buttons - An Object
   */
  function get_buttons(wrap) {
    const buttons = {
      add_customer_btn: wrap.find(".span__settingsform-customer-add-btn_txt"),
      edit_customer_btn: wrap.find(".span__settingsform-customer-edit-btn-txt"),
      // add_user_btn: wrap.find(".span__settingsform_user-input-editor"),
      // edit_user_btn: wrap.find(".span__settingsform-user-input-edit-btn-txt"),
    };
    return buttons;
  }
  // const delete_user = {
  //   user_id: 0,
  //   uuid: "2VSckkBYr2An3dqHEyfRRE",
  //   nickname: "User account -1",
  // };
  // const delete_customer = {
  //   cust_id: 0,
  //   uuid: "4vqyd62oARXqj9nRUNhtLQ",
  //   api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
  //   nickname: "Customer account -1",
  //   user_ids: []
  // };
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
  describe("Given Vuex has a valid customer account called as 'Customer account -1' but no customer index selected", () => {
    beforeEach(() => {
      // commit a deep copy of the template object to the Vuex store using JSON stringify/parse, as it may be modified during tests. https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
      store.commit("settings/set_customer_account_ids", JSON.parse(JSON.stringify(array_of_customer_ids)));
    });
    describe("Given the component is mounted", () => {
      beforeEach(() => {
        wrapper = mount(ComponentToTest, {
          store,
          localVue,
        });
      });
      // test("When the value of Customer ID is set to 'Customer account -1' by an entry into the input, Then 'Add New Customer ID' 'Edit ID'(of customer) is disabled", async () => {
      //   wrapper.find("#input-dropdown-widget-cust-").setValue("Customer account -1");
      //   const all_buttons = get_buttons(wrapper);
      //   await wrapper.vm.$nextTick(); // wait for update
      //   expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      //   expect(all_buttons.edit_customer_btn.isVisible()).toBe(true);
      //   // expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      //   // expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
      // });
      test("When the value of Customer ID is set to 'Customer account -1', Then the buttons 'Add New Customer ID', 'Edit ID'(of customer) are enabled", async () => {
        await wrapper.find("#input-dropdown-widget-cust-").setValue("Customer account -1");
        await wrapper.vm.$nextTick(); // wait for update
        // await wrapper.find("#input-dropdown-widget-user-").setValue("User account -1");
        // await wrapper.vm.$nextTick(); // wait for update
        const all_buttons = get_buttons(wrapper);
        await wrapper.vm.$nextTick(); // wait for update
        expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
        expect(all_buttons.edit_customer_btn.isVisible()).toBe(true);
        // expect(all_buttons.add_user_btn.isVisible()).toBe(true);
        // expect(all_buttons.edit_user_btn.isVisible()).toBe(true);
      });
      // test("When the value is set as focus User ID('User account -1') is deleted, Then 'Add New Customer' 'Edit ID'(of customer), 'Add New User ID' are enabled and 'Edit ID'(of user) is disabled", async () => {
      //   await wrapper.find("#input-dropdown-widget-cust-").setValue("Customer account -1");
      //   await wrapper.vm.$nextTick(); // wait for update
      //   // await wrapper.find("#input-dropdown-widget-user-").setValue("User account -1");
      //   // await wrapper.vm.$nextTick(); // wait for update
      //   const all_buttons = get_buttons(wrapper);
      //   await wrapper.vm.$nextTick(); // wait for update
      //   expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      //   expect(all_buttons.edit_customer_btn.isVisible()).toBe(true);
      //   // expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      //   // expect(all_buttons.edit_user_btn.isVisible()).toBe(true);
      //   const delete_user = {
      //     user_id: 0,
      //     uuid: "2VSckkBYr2An3dqHEyfRRE",
      //     nickname: "User account -1",
      //   };
      //   wrapper.vm.onDeleteUserId(delete_user);
      //   await wrapper.vm.$nextTick(); // wait for update
      //   expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      //   expect(all_buttons.edit_customer_btn.isVisible()).toBe(true);
      //   expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      //   expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
      // });
      //   test("When the value set as focus User ID 'User account -1' is deleted and followed by 'Customer account -1 deleted, Then 'Add New Customer ID' is enabled 'Edit ID'(of customer), 'Add New User ID' and 'Edit ID'(of user) are disabled", async () => {
      //     await wrapper.find("#input-dropdown-widget-cust-").setValue("Customer account -1");
      //     await wrapper.vm.$nextTick(); // wait for update

      //     await wrapper.find("#input-dropdown-widget-user-").setValue("User account -1");
      //     await wrapper.vm.$nextTick(); // wait for update
      //     const all_buttons = get_buttons(wrapper);
      //     await wrapper.vm.$nextTick(); // wait for update
      //     expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      //     expect(all_buttons.edit_customer_btn.isVisible()).toBe(true);
      //     expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      //     expect(all_buttons.edit_user_btn.isVisible()).toBe(true);
      //     wrapper.vm.onDeleteUserId(delete_user);
      //     await wrapper.vm.$nextTick(); // wait for update
      //     expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      //     expect(all_buttons.edit_customer_btn.isVisible()).toBe(true);
      //     expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      //     expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
      //     wrapper.vm.onDeleteCustomerId(delete_customer);
      //     await wrapper.vm.$nextTick(); // wait for update
      //     expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      //     expect(all_buttons.edit_customer_btn.isVisible()).toBe(false);
      //     expect(all_buttons.add_user_btn.isVisible()).toBe(false);
      //     expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
      //   });
    });

    test("When the component is mounted, Then 'Add New Customer ID' is enabled and 'Edit ID'(of customer) is disabled", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      await wrapper.vm.$nextTick(); // wait for update
      const all_buttons = get_buttons(wrapper);
      await wrapper.vm.$nextTick(); // wait for update
      expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      expect(all_buttons.edit_customer_btn.isVisible()).toBe(false);
      // expect(all_buttons.add_user_btn.isVisible()).toBe(false);
      // expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
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
    test("Given the SettingsForm has a valid customer account set as 'Customer account -1', When the Vuex Store data specifies a valid Customer ID, Then visually the Reset and Save Buttons are enabled", async () => {
      store.commit("settings/set_customer_index", 0);
      // store.commit("settings/set_user_index", 0);

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
      const array_of_empty_customer_ids = [];
      store.commit("settings/set_customer_account_ids", array_of_empty_customer_ids);
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const invalid_box = get_invalid_boxes(wrapper);
      expect(invalid_box.customer.isVisible()).toBe(true);
      // expect(invalid_box.user.isVisible()).toBe(true);
    });
    test("Given the SettingsForm has a valid customer account set as 'Customer account -1', When the 'Customer account -1' is in focus, Then the GREEN Box is enabled around the Customer ID", async () => {
      store.commit("settings/set_customer_index", 0);
      // store.commit("settings/set_user_index", 0);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const valid_boxes = get_valid_boxes(wrapper);
      expect(valid_boxes.customer.isVisible()).toBe(true);
      // expect(valid_boxes.user.isVisible()).toBe(true);
    });
    test("Given the SettingsForm has a valid customer account set as 'Customer account -1', When the user now modifies to non-existent customer say 'Customer account -', Then validate that Red Boxes are visible around Customer ID 'Add New Customer Button' is enabled", async () => {
      store.commit("settings/set_customer_index", 0);
      // store.commit("settings/set_user_index", 0);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      const valid_boxes = get_valid_boxes(wrapper);
      expect(valid_boxes.customer.isVisible()).toBe(true);
      // expect(valid_boxes.user.isVisible()).toBe(true);

      await wrapper.find("#input-dropdown-widget-cust-").setValue("Customer account -"); // customer with this doesn't exist.

      await wrapper.vm.$nextTick(); // wait for update

      const invalid_box = get_invalid_boxes(wrapper);
      expect(invalid_box.customer.isVisible()).toBe(true);
      // expect(invalid_box.user.isVisible()).toBe(true);
      const all_buttons = get_buttons(wrapper);
      await wrapper.vm.$nextTick(); // wait for update
      expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      expect(all_buttons.edit_customer_btn.isVisible()).toBe(false);
      // expect(all_buttons.add_user_btn.isVisible()).toBe(false);
      // expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
    });
    // test("Given the SettingsForm has a valid customer account set as 'Customer account -1' and 'User account -1', When the user now modifies to non-existant user say 'User account -', Then validate that Red Boxes are visible around User ID and based on rules relevant buttons are enabled", async () => {
    //   store.commit("settings/set_customer_index", 0);
    //   // store.commit("settings/set_user_index", 0);

    //   wrapper = mount(ComponentToTest, {
    //     store,
    //     localVue,
    //   });

    //   const valid_box = wrapper.findAll(".div__input-dropdown-controls-content-widget--valid");
    //   const Customer_ID_Input_Editor_Green_Box = valid_box.at(0);
    //   const valid_boxes = get_valid_boxes(wrapper);
    //   expect(valid_boxes.customer.isVisible()).toBe(true);
    //   // expect(valid_boxes.user.isVisible()).toBe(true);

    //   // await wrapper.find("#input-dropdown-widget-user-").setValue("User account -"); // user  doesn't exist.

    //   await wrapper.vm.$nextTick(); // wait for update

    //   const invalid_box = wrapper.findAll(".div__input-dropdown-controls-content-widget--invalid");
    //   // const User_ID_Input_Editor_Red_Box = invalid_box.at(0);

    //   expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true); // customer box is green
    //   // expect(User_ID_Input_Editor_Red_Box.isVisible()).toBe(true); // user box is red

    //   const all_buttons = get_buttons(wrapper);
    //   await wrapper.vm.$nextTick(); // wait for update
    //   expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
    //   expect(all_buttons.edit_customer_btn.isVisible()).toBe(true);
    //   expect(all_buttons.add_user_btn.isVisible()).toBe(true);
    //   expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
    // });

    test("Given the SettingsForm has a valid customer account set as 'Customer account -1', When the user sets the value on input with same default value 'Customer account -1' , Then validate that Green Box is around the input, and based on rules relevant buttons are enabled", async () => {
      store.commit("settings/set_customer_index", 0);
      // store.commit("settings/set_user_index", 0);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
        data() {
          return {
            valid_customer_focus: false,
            // valid_user_focus: false,
            disable_edit_customer: true,
            // disable_add_user: true,
            // disable_edit_user: true
          };
        },
      });

      await wrapper.vm.$nextTick(); // wait for update

      await wrapper.find("#input-dropdown-widget-cust-").setValue("Customer account -1");
      await wrapper.vm.$nextTick(); // wait for update
      // await wrapper.find("#input-dropdown-widget-user-").setValue("User account -1");
      // await wrapper.vm.$nextTick(); // wait for update

      const valid_boxes = get_valid_boxes(wrapper);
      expect(valid_boxes.customer.isVisible()).toBe(true);
      // expect(valid_boxes.user.isVisible()).toBe(true);
      const all_buttons = get_buttons(wrapper);
      await wrapper.vm.$nextTick(); // wait for update
      expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
      expect(all_buttons.edit_customer_btn.isVisible()).toBe(true);
      // expect(all_buttons.add_user_btn.isVisible()).toBe(true);
      // expect(all_buttons.edit_user_btn.isVisible()).toBe(true);
    });

    test("When the component is mounted and Customer account is/is not selected, Then the cancel button is visible and will close modal on click", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const settings_buttons = await get_settings_button_enabled(wrapper);

      expect(settings_buttons.cancel_btn.isVisible()).toBe(true);
      await settings_buttons.cancel_btn.trigger("click");

      const close_event = wrapper.emitted("close_modal");
      expect(close_event[0]).toStrictEqual([]);
    });

    test("When the component is mounted and a user toggles the auto upload and auto delete switches, Then the new state will be handled in component state", async () => {
      const toggle_spy = jest.spyOn(ComponentToTest.methods, "handle_toggle_state");
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const default_state = {
        auto_delete: false,
        auto_upload: true,
      };
      const expected_state = {
        auto_delete: true,
        auto_upload: false,
      };
      expect(wrapper.vm.auto_delete).toBe(default_state.auto_delete);
      expect(wrapper.vm.auto_upload).toBe(default_state.auto_upload);

      await wrapper.find(ToggleWidget).vm.$emit("handle_toggle_state", false, "auto_upload");
      await wrapper.find(ToggleWidget).vm.$emit("handle_toggle_state", true, "auto_delete");

      expect(toggle_spy).toHaveBeenCalledTimes(2);

      expect(wrapper.vm.auto_delete).toBe(expected_state.auto_delete);
      expect(wrapper.vm.auto_upload).toBe(expected_state.auto_upload);
    });
  });

  // test("Given the SettingsForm has partial Vuex data on only 'Customer ID', When the value Customer ID is <empty>, Then 'Add New Customer ID' is enabled 'Edit ID'(of customer), 'Add New User ID' and 'Edit ID'(of user) are disabled", async () => {
  //   store.commit("settings/set_customer_account_ids", array_of_customer_ids_no_user_ids);
  //   wrapper = mount(ComponentToTest, {
  //     store,
  //     localVue
  //   });
  //   const all_buttons = get_buttons(wrapper);
  //   await wrapper.vm.$nextTick(); // wait for update
  //   expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
  //   expect(all_buttons.edit_customer_btn.isVisible()).toBe(false);
  //   // expect(all_buttons.add_user_btn.isVisible()).toBe(false);
  //   // expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
  // });
  // test("Given Vuex data of customer account IDs is an empty array, When the component is mounted, Then 'Add New Customer ID' is enabled 'Edit ID'(of customer), 'Add New User ID' and 'Edit ID'(of user) are disabled", async () => {
  //   const array_of_customer_ids = [];
  //   store.commit("settings/set_customer_account_ids", array_of_customer_ids);
  //   wrapper = mount(ComponentToTest, {
  //     store,
  //     localVue,
  //   });
  //   const all_buttons = get_buttons(wrapper);
  //   await wrapper.vm.$nextTick(); // wait for update
  //   expect(all_buttons.add_customer_btn.isVisible()).toBe(true);
  //   expect(all_buttons.edit_customer_btn.isVisible()).toBe(false);
  //   expect(all_buttons.add_user_btn.isVisible()).toBe(false);
  //   expect(all_buttons.edit_user_btn.isVisible()).toBe(false);
  // });
});
