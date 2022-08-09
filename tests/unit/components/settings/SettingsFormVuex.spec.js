import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/SettingsForm.vue";
import { SettingsForm as DistComponentToTest } from "@/dist/mantarray.common";

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
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());

  // TODO figure out what these are actually trying to test
  const array_of_user_accounts_missing_user_ids = [
    {
      customer_id: "4vqyd62oARXqj9nRUNhtLQ",
      user_password: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      user_name: "User account -1",
    },
  ];
  const array_of_customerid_null_missing_user_ids = [
    {
      customer_id: "4vqyd62oARXqj9nRUNhtLQ",
      user_password: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      user_name: "",
    },
  ];

  test("When mounting SettingsForm from the build dist file, Then verify that it loads successfully", () => {
    const propsData = null;
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const target_span = wrapper.find(".span__settingsform-title");

    expect(target_span.text()).toStrictEqual("Settings");
  });

  describe("Given Vuex has valid customer and user accounts but no customer index or user index selected", () => {
    beforeEach(() => {
      // commit a deep copy of the template object to the Vuex store using JSON stringify/parse, as it may be modified during tests. https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
      store.commit("settings/set_user_accounts", JSON.parse(JSON.stringify(array_of_user_accounts)));
    });
    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    test("When the component is mounted, a User account is selected, and a user clicks reset, Then modal will default to no customer selected and will reset in Vuex", async () => {
      const commit_spy = jest.spyOn(store, "commit");
      store.commit("settings/set_active_user_index", 0);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      const expected_state = {
        entrykey_user: "",
        auto_delete: false,
        auto_upload: false,
      };

      await wrapper.find("#input-dropdown-widget-user-account-").setValue("User account -2");

      const reset_btn = wrapper.find(".span__settings-tool-tip-reset-btn-txt-enable");
      expect(reset_btn.isVisible()).toBe(true);
      await reset_btn.trigger("click");

      expect(wrapper.vm.entrykey_user).toBe(expected_state.entrykey_user);
      expect(wrapper.vm.auto_delete).toBe(expected_state.auto_delete);
      expect(wrapper.vm.auto_upload).toBe(expected_state.auto_upload);

      expect(commit_spy).toHaveBeenCalledTimes(2);
    });
    test("Given that a customer account is selected in Vuex, When the method handling the 'cancel-id' customer event is invoked, Then the Vuex Store account data or selected customer account index is not modified", async () => {
      await store.commit("settings/set_active_user_index", 1);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      wrapper.vm.cancel_user_update();
      expect(store.state.settings.user_accounts).toStrictEqual(array_of_user_accounts);
      expect(store.state.settings.active_user_index).toStrictEqual(1); // this is the real data due to savechanges function Vuex stored data of active_user_index
    });

    test("When a user wants to save customer credentials and there is an error sending request, Then the modal will not not close and the modal will reset to make user re-input creds", async () => {
      await store.commit("settings/set_active_user_index", 1);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      jest.spyOn(store, "dispatch").mockImplementation(() => {
        return {
          status: 401,
        };
      });
      const edit_cust_modal = wrapper.find(".div__edituser-form-controls");
      const save_changes = wrapper.find(".span__settings-tool-tip-save-btn-txt-enable");
      await save_changes.trigger("click");

      expect(wrapper.vm.open_for_invalid_creds).toBe(true);
      expect(edit_cust_modal).toBeTruthy();
    });
    test("When a user wants to save customer credentials and the request is returned with invalid credentials, Then the the edit-user modal will open with open_for_invalid_creds set to true", async () => {
      await store.commit("settings/set_active_user_index", 1);
      const reset_spy = jest.spyOn(ComponentToTest.methods, "reset_changes");

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      jest.spyOn(store, "dispatch").mockImplementation(() => {
        return {
          status: 400,
        };
      });

      const save_changes = wrapper.find(".span__settings-tool-tip-save-btn-txt-enable");
      await save_changes.trigger("click");

      expect(reset_spy).toHaveBeenCalledTimes(1);
    });
    test("When a user wants to save customer credentials and there is no error sending request, Then the modal will close", async () => {
      await store.commit("settings/set_active_user_index", 1);

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      jest.spyOn(store, "dispatch").mockImplementation(() => {
        return {
          status: 200,
        };
      });

      const save_changes = wrapper.find(".span__settings-tool-tip-save-btn-txt-enable");
      await save_changes.trigger("click");
      const close_event = wrapper.emitted("close_modal");
      expect(close_event[0]).toStrictEqual([true]);

      // expect(emit_close).toBeTruthy();
    });

    test("Given a customer and user account selected in Vuex and the textbox for Customer Account is changed to an account different than the one in Vuex and a user account is selected in thet textbox, When the Save Changes button is clicked, Then the selected indices in Vuex for Customer and User accounts are updated to reflect the chosen options in the textboxes", async () => {
      store.commit("settings/set_active_user_index", 0);
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      await wrapper.find("#input-dropdown-widget-user-account-").setValue("User account -2");
      await wrapper.vm.$nextTick(); // wait for update

      const save_changes = wrapper.find(".span__settings-tool-tip-save-btn-txt-enable");
      await save_changes.trigger("click");

      expect(store.state.settings.active_user_index).toStrictEqual(1); // this is the real data due to savechanges function Vuex stored data of active_user_index
    });
  });
  test("Given that no data are in the Vuex store, When the component is mounted, Then verify that Input of Customer ID and User ID are <empty>", () => {
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(wrapper.find("#input-dropdown-widget-user-account-").element.value).toStrictEqual("");
  });
  test("Given that badly formed data with missing user_ids are in the Vuex store, When the component is mounted, Then verify that Input of Customer ID and User ID are <empty>", () => {
    store.commit("settings/set_user_accounts", array_of_user_accounts_missing_user_ids);
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(wrapper.find("#input-dropdown-widget-user-account-").element.value).toStrictEqual("");
  });
  test("Given that badly formed data with empty customer account user_name with missing user_ids in the Vuex, When the component is mounted, Then verify that Input of Customer ID and User ID are <empty>", async () => {
    store.commit("settings/set_user_accounts", array_of_customerid_null_missing_user_ids);
    store.commit("settings/set_active_user_index", 0);
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    expect(wrapper.find("#input-dropdown-widget-user-account-").element.value).toStrictEqual("");
  });
});
