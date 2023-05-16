import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/SettingsForm.vue";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";

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
    store.commit("settings/set_stored_accounts", {
      customer_id: "test-uuid",
      usernames: ["User account -1", "User account -2"],
    });
  });

  afterEach(() => wrapper.destroy());
  describe("Given Vuex has valid customer and user accounts but no customer index or user index selected", () => {
    test("When the SettingsForm is mounted, Then the dropDown of customer contains the user_namess from Vuex", () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      expect(wrapper.find("#user-account-0").text()).toStrictEqual("User account -1");
      expect(wrapper.find("#user-account-1").text()).toStrictEqual("User account -2");
    });
  });
});
