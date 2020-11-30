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

  test("When the SettingsForm has two Customer ID in the Vuex, Then validate that dropDown of customer contains the nicknames 'Customer account -1' and 'Customer account -2'", () => {
    store.commit("settings/set_customer_account_ids", array_of_customer_ids);
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -1");
    expect(wrapper.find("#cust-1").text()).toStrictEqual("Customer account -2");
  });
  test("When the SettingsForm has two Customer ID and two User ID per Customer ID in the Vuex, Then validate that dropDown of user contains the nicknames 'Lab User  -1' and 'Intern -1'", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customer_ids);
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
  test("When the SettingsForm has two Customer ID and one User ID for first Customer ID and no User ID for second Customer ID in the Vuex, Then validate that the User ID for second Customer ID does not exist", () => {
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
  test("When the SettingsForm has two Customer ID and two User ID per Customer ID in the Vuex, Then validate that dropDown of user is update with relevant values when we toggle between 'Customer account -1' to 'Customer account -2", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customer_ids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(wrapper.vm.customers_options).toHaveLength(2);
    expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -1");
    expect(wrapper.find("#cust-1").text()).toStrictEqual("Customer account -2");

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -2");
    expect(wrapper.find("#user-0").text()).toStrictEqual("Lab User  -1");
    expect(wrapper.find("#user-1").text()).toStrictEqual("Intern -1");

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -1");

    expect(wrapper.find("#user-0").text()).toStrictEqual("User account -1");
    expect(wrapper.find("#user-1").text()).toStrictEqual("User account -2");
  });
});
