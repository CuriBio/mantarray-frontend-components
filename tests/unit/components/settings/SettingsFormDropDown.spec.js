import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/SettingsForm.vue";

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
  describe("Given Vuex has valid customer and user accounts but no customer index or user index selected", () => {
    beforeEach(() => {
      // commit a deep copy of the template object to the Vuex store using JSON stringify/parse, as it may be modified during tests. https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
      store.commit("settings/set_user_accounts", JSON.parse(JSON.stringify(array_of_user_accounts)));
    });
    test("When the SettingsForm is mounted, Then the dropDown of customer contains the user_namess from Vuex", () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      expect(wrapper.find("#user-account-0").text()).toStrictEqual("User account -1");
      expect(wrapper.find("#user-account-1").text()).toStrictEqual("User account -2");
    });

    test("When the Component is mounted, Then the dropdown menu for the Customer Account matches the values in Vuex", async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      expect(wrapper.find("#user-account-0").text()).toStrictEqual("User account -1");
      expect(wrapper.find("#user-account-1").text()).toStrictEqual("User account -2");
      expect(wrapper.find("#user-account-2").exists()).toBe(false); // confirm only the 2 accounts in Vuex are present
    });
  });
});
