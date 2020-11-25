import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/SettingsForm.vue";
import { SettingsForm as DistComponentToTest } from "@/dist/mantarray.common";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const array_of_userid_1 = [
    {
      user_id: 0,
      uuid: "2VSckkBYr2An3dqHEyfRRE",
      nickname: "User account -1",
    },
    {
      user_id: 1,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      nickname: "User account -2",
    },
  ];
  const array_of_userid_2 = [
    {
      user_id: 0,
      uuid: "2VSckkkkk2An3dqHEyfRRE",
      nickname: "Lab User -1",
    },
    {
      user_id: 1,
      uuid: "5FY8ghtsQaUJ2KzHJGetfE",
      nickname: "Intern -1",
    },
  ];
  const array_of_customer_ids = [
    {
      cust_id: 0,
      uuid: "4vqyd62oARXqj9nRUNhtLQ",
      api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      nickname: "Customer account -1",
      user_ids: array_of_userid_1,
    },
    {
      cust_id: 1,
      uuid: "6cBaidlJ84Ggc5JA7IYCgv",
      api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
      nickname: "Customer account -2",
      user_ids: array_of_userid_2,
    },
  ];
  const array_of_customer_ids_missing_user_ids = [
    {
      cust_id: 0,
      uuid: "4vqyd62oARXqj9nRUNhtLQ",
      api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      nickname: "Customer account -1",
    },
  ];
  const array_of_customerid_null_missing_user_ids = [
    {
      cust_id: 0,
      uuid: "4vqyd62oARXqj9nRUNhtLQ",
      api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      nickname: "",
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

  test("Given that the SettingsForm is loaded with Vuex store, When user action which generates an event 'cancel-id', Then the Vuex Store is not modified", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customer_ids);
    store.commit("settings/set_customer_index", 1);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    wrapper.vm.onCancelCustomerId();
    expect(store.getters["settings/customer_account_ids"]).toStrictEqual(
      array_of_customer_ids
    );
    expect(store.getters["settings/customer_index"]).toStrictEqual(1); // this is the real data due to savechanges function Vuex stored data of customer_index
  });
  test("Given that no data are in the Vuex store, When the component is mounted, Then verify that Input of Customer ID and User ID are <empty>", () => {
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    wrapper.vm.onCancelAddCustomerId(); // Complete Code Coverage
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");
  });
  test("Given that badly formed data with missing user_ids are in the Vuex store, When the component is mounted, Then verify that Input of Customer ID and User ID are <empty>", () => {
    store.commit(
      "settings/set_customer_account_ids",
      array_of_customer_ids_missing_user_ids
    );
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");
  });
  test("Given that badly formed data with empty customer account nickname with missing user_ids in the Vuex, When the component is mounted, Then verify that Input of Customer ID and User ID are <empty>", async () => {
    store.commit(
      "settings/set_customer_account_ids",
      array_of_customerid_null_missing_user_ids
    );
    store.commit("settings/set_customer_index", 0);
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");
  });
  test("Given that the SettingsForm is loaded with Vuex with 'Customer account -1' 'User account -1', When user decides to modify Customer ID to 'Customer account -2' 'Lab User -1', Then validate 'Save Changes' updates validate Vuex store with is updated index values", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customer_ids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -2");
    await wrapper.vm.$nextTick(); // wait for update
    await wrapper.find("#input-dropdown-widget-user-").setValue("Lab User -1");
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper.vm.$nextTick(); // wait for update

    const save_changes = wrapper.find(
      ".span__settings-tool-tip-save-btn-txt-enable"
    );
    await save_changes.trigger("click");

    await wrapper.vm.$nextTick(); // wait for update

    expect(store.getters["settings/customer_index"]).toStrictEqual(1); // this is the real data due to savechanges function Vuex stored data of customer_index
    expect(store.getters["settings/user_index"]).toStrictEqual(0); // this is the real data due to savechanges function Vuex stored data of user_index
  });
  // Eli (11/25/20): commenting out this test until we are ready to implement the feature
  // test("Given that the SettingsForm is loaded with Vuex, When the 'Key Icon' decoder is invoked, Then validate if the decoder string converts UNICODE value to key icon", async () => {
  //   store.commit("settings/set_customer_account_ids", array_of_customer_ids);
  //   store.commit("settings/set_customer_index", 0);
  //   store.commit("settings/set_user_index", 0);

  //   wrapper = mount(ComponentToTest, {
  //     store,
  //     localVue,
  //   });

  //   const predecoding_str = "&#x1F5DD; " + wrapper.vm.customers_options[0];
  //   const customerid = "&#x1F5DD; " + wrapper.vm.entrykey_customer;

  //   const postdecoding_str = wrapper.vm.decoder(predecoding_str);
  //   expect(wrapper.vm.decoder(customerid)).toStrictEqual(postdecoding_str);
  // });
});
