import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/SettingsForm.vue";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  array_of_customer_ids,
  array_of_customer_ids_one,
} from "./SettingsFormCustomerData.js";

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
  describe("Given Vuex has valid customer and user accounts but no customer index or user index selected", () => {
    beforeEach(() => {
      // commit a deep copy of the template object to the Vuex store using JSON stringify/parse, as it may be modified during tests. https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
      store.commit(
        "settings/set_customer_account_ids",
        JSON.parse(JSON.stringify(array_of_customer_ids))
      );
    });
    test("When the SettingsForm is mounted, Then the dropDown of customer contains the nicknames from Vuex", () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      expect(wrapper.find("#cust-0").text()).toStrictEqual(
        "Customer account -1"
      );
      expect(wrapper.find("#cust-1").text()).toStrictEqual(
        "Customer account -2"
      );
    });
    test("Given a customer and user are selected in Vuex, When a different customer account is selected in the component, Then the dropdown choices for the User update to the users in the newly selected customer account", async () => {
      store.commit("settings/set_customer_index", 0);
      store.commit("settings/set_user_index", 0);
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      await wrapper
        .find("#input-dropdown-widget-cust-")
        .setValue("Customer account -2");
      expect(wrapper.find("#user-0").text()).toStrictEqual("Lab User  -1");
      expect(wrapper.find("#user-1").text()).toStrictEqual("Intern -1");
    });

    test("When the Component is mounted, Then the dropdown menu for the Customer Account matches the values in Vuex", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      expect(wrapper.find("#cust-0").text()).toStrictEqual(
        "Customer account -1"
      );
      expect(wrapper.find("#cust-1").text()).toStrictEqual(
        "Customer account -2"
      );
      expect(wrapper.find("#cust-2").exists()).toBe(false); // confirm only the 2 accounts in Vuex are present
    });
    test("When a customer account is selected in the textbox, Then the user account dropdown populates with the users for that customer account", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      await wrapper
        .find("#input-dropdown-widget-cust-")
        .setValue("Customer account -2");
      expect(wrapper.find("#user-0").text()).toStrictEqual("Lab User  -1");
      expect(wrapper.find("#user-1").text()).toStrictEqual("Intern -1");
    });
    test("Given a customer account is selected in the textbox, When a new customer account is selected in the textbox, Then the user account dropdown populates with the users for that newly selected customer account", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });

      await wrapper
        .find("#input-dropdown-widget-cust-")
        .setValue("Customer account -2");
      // confirm pre-condition
      expect(wrapper.find("#user-0").text()).not.toStrictEqual(
        "User account -1"
      );
      expect(wrapper.find("#user-1").text()).not.toStrictEqual(
        "User account -2"
      );

      await wrapper
        .find("#input-dropdown-widget-cust-")
        .setValue("Customer account -1");

      expect(wrapper.find("#user-0").text()).toStrictEqual("User account -1");
      expect(wrapper.find("#user-1").text()).toStrictEqual("User account -2");
    });
  });
  test("Given a customer account is selected in Vuex with no associated users, When the component is mounted, Then there are no dropdown options for the user list", () => {
    store.commit(
      "settings/set_customer_account_ids",
      array_of_customer_ids_one
    );
    store.commit("settings/set_customer_index", 1);
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    expect(wrapper.find("#user-0").exists()).toBe(false);
    expect(wrapper.find("#user-1").exists()).toBe(false);
  });
});
