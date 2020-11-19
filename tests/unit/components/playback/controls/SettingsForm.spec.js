import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/SettingsForm.vue";
import InputDropDown from "@/components/playback/controls/player/InputDropDown.vue";
import { SettingsForm as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

import Vue from "vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
import { BModal } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;

beforeAll(async () => {
  // note the store will mutate across tests, so make sure to re-create it in beforeEach
  const storePath = `${process.env.buildDir}/store.js`;
  NuxtStore = await import(storePath);
});

beforeEach(async () => {
  store = await NuxtStore.createStore();
});

afterEach(() => wrapper.destroy());

describe("SettingsForm.vue", () => {
  test("When mounting SettingsForm from the build dist file, it loads successfully", () => {
    const propsData = null;
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const target_span = wrapper.find(".span__settingsform-title");

    expect(target_span.text()).toEqual("Settings");
  });
  test("When mounting SettingsForm on init, the Settings Vuex store is accessed and a list of customer_account_ids are extracted to populate the dropDown", () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(wrapper.vm.customers_options.length).toEqual(2);
    expect(wrapper.find("#cust-0").text()).toEqual("Customer account -1");
    expect(wrapper.find("#cust-1").text()).toEqual("Customer account -2");
  });
  test("When mounting SettingsForm on init, the Settings Vuex store is accessed and a Customer Account is selected, then user_ids are extracted to populate the dropDown", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 1);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -2");
    Vue.nextTick(() => {
      expect(wrapper.find("#user-0").text()).toEqual("Lab User  -1");
      expect(wrapper.find("#user-1").text()).toEqual("Intern -1");
      expect(wrapper.vm.users_options.length).toEqual(2);
    });
  });

  test("When mounting SettingsForm on init, the Settings Vuex store is accessed and a Customer Account is selected, the user initiates an 'Edit Customer' and chooses Cancel Button so an event 'cancel-id is invoked verify that nicknames are retained", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 1);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    wrapper.vm.onCancelCustomerId();
    expect(wrapper.vm.customers_options.length).toEqual(2);
  });
  test("When mounting SettingsForm on init, the Settings Vuex store is accessed and a list of customer_account_ids is null so the drop dropDown is empty", () => {
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(wrapper.vm.customers_options.length).toEqual(0);
  });
  test("When mounting SettingsForm on init, the user access the dialog of 'Add Customer' and decides to cancel by an event 'cancel-id' verify if no customer ids are added", () => {
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    wrapper.vm.onCancelAddCustomerId();
    expect(wrapper.vm.customers_options.length).toEqual(0);
  });
  test("When mounting SettingsForm on init, the Settings Vuex store is accessed and a Customer Account is selected, then user_ids is empty", () => {
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
    const array_of_customerids = [
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
        user_ids: [],
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 1);
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    expect(wrapper.vm.users_options.length).toEqual(0);
  });
  test("When mounting SettingsForm on init, the Settings Vuex store is accessed and a list of customer_account_ids are extracted to populate the dropDown, initial the user dropdown is populated first item in 'Customer account -1' on toggle to 'Customer account -2' the user dropdown is updated ", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(wrapper.vm.customers_options.length).toEqual(2);
    expect(wrapper.find("#cust-0").text()).toEqual("Customer account -1");
    expect(wrapper.find("#cust-1").text()).toEqual("Customer account -2");

    wrapper.find("#input-dropdown-widgetcust-").setValue("Customer account -2");
    Vue.nextTick(() => {
      expect(wrapper.find("#user-0").text()).toEqual("Lab User  -1");
      expect(wrapper.find("#user-1").text()).toEqual("Intern -1");
    });

    wrapper.find("#input-dropdown-widgetcust-").setValue("Customer account -1");

    Vue.nextTick(() => {
      expect(wrapper.find("#user-0").text()).toEqual("User account -1");
      expect(wrapper.find("#user-1").text()).toEqual("User account -2");
    });
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'save-id' with and object of the added customer 'Customer Account -3', validate that the focus now is 'Customer Account -3'", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer = {
      cust_id: 2,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      api_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
      nickname: "Customer account -3",
      user_ids: [],
    };
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onSaveCustomerId(add_customer);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'cancel-id' with no data of the added customer, validate its handled and dialog is closed'", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onCancelCustomerId();

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -1");
    expect(wrapper.vm.entrykey_user).toEqual("");
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'save-id' with and object of the added customer 'Customer Account -3', add a user New User-1 an event 'save-id' under Customer Account -3 and validate the addtion of 'New User-1'", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer = {
      cust_id: 2,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      api_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
      nickname: "Customer account -3",
      user_ids: [],
    };
    const add_user = {
      user_id: 0,
      uuid: "5FY8ghtsQaUJ2KzHJGetfE",
      nickname: "New User -1",
    };
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onSaveCustomerId(add_customer);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");

    wrapper.vm.onSaveUserId(add_user);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("New User -1");
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'save-id' with and object of the added customer 'Customer Account -3', add a user tries to add an new user but, due to duplicate selects Cancel Button and an event 'cancel-id' is emmited validate that no user got added", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer = {
      cust_id: 2,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      api_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
      nickname: "Customer account -3",
      user_ids: [],
    };

    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onSaveCustomerId(add_customer);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");

    wrapper.vm.onCancelAddUserId();

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");
    expect(wrapper.vm.customer_account_ids[2].user_ids.length).toBe(0);
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'delete-id' with and object of the customer 'Customer Account -1', add  validate the deletion  of 'Customer Account -1'", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer = {
      cust_id: 2,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      api_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
      nickname: "Customer account -3",
      user_ids: [],
    };
    const add_user = {
      user_id: 0,
      uuid: "5FY8ghtsQaUJ2KzHJGetfE",
      nickname: "New User -1",
    };
    const delete_customer = {
      cust_id: 0,
      uuid: "4vqyd62oARXqj9nRUNhtLQ",
      api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      nickname: "Customer account -1",
      user_ids: array_of_userid_1,
    };
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onSaveCustomerId(add_customer);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");

    wrapper.vm.onSaveUserId(add_user);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("New User -1");

    wrapper.vm.onDeleteCustomerId(delete_customer);

    expect(wrapper.vm.customer_account_ids[0].nickname).toEqual(
      "Customer account -2"
    );
    expect(wrapper.vm.customer_account_ids[1].nickname).toEqual(
      "Customer account -3"
    );
    expect(wrapper.vm.customer_account_ids.length).toEqual(2);
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'save-id' with and modified object of the customer 'Customer Account -2', with nickname 'Renamed Account -1', add  validate the updated  to 'Renamed Account -1'", async () => {
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
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer = {
      cust_id: 2,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      api_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
      nickname: "Customer account -3",
      user_ids: [],
    };
    const add_user = {
      user_id: 0,
      uuid: "5FY8ghtsQaUJ2KzHJGetfE",
      nickname: "New User -1",
    };
    const edit_customer = {
      cust_id: 1,
      uuid: "6cBaidlJ84Ggc5JA7IYCgv",
      api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
      nickname: "Renamed Account -1",
      user_ids: array_of_userid_2,
    };
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onSaveCustomerId(add_customer);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");

    wrapper.vm.onSaveUserId(add_user);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("New User -1");

    wrapper.vm.onUpdateCustomerId(edit_customer);

    expect(wrapper.vm.customer_account_ids[0].nickname).toEqual(
      "Customer account -1"
    );
    expect(wrapper.vm.customer_account_ids[1].nickname).toEqual(
      "Renamed Account -1"
    );
    expect(wrapper.vm.customer_account_ids[2].nickname).toEqual(
      "Customer account -3"
    );
    expect(wrapper.vm.customer_account_ids.length).toEqual(3);
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'delete-id' with and object of the user 'Lab User -1', add  validate the deletion  of 'Lab User -1'", async () => {
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
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer = {
      cust_id: 2,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      api_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
      nickname: "Customer account -3",
      user_ids: [],
    };
    const add_user = {
      user_id: 0,
      uuid: "5FY8ghtsQaUJ2KzHJGetfE",
      nickname: "New User -1",
    };
    const delete_user = {
      user_id: 0,
      uuid: "2VSckkkkk2An3dqHEyfRRE",
      nickname: "Lab User -1",
    };
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onSaveCustomerId(add_customer);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");

    wrapper.vm.onSaveUserId(add_user);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("New User -1");

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -2");
    Vue.nextTick(() => {
      expect(wrapper.find("#user-0").text()).toEqual("Lab User  -1");
      expect(wrapper.find("#user-1").text()).toEqual("Intern -1");
    });

    wrapper.find("#input-dropdown-widgetuser-").setValue("Lab User -1");
    wrapper.vm.onDeleteUserId(delete_user);

    expect(wrapper.vm.customer_account_ids[1].user_ids[0].nickname).toEqual(
      "Intern -1"
    );
    expect(wrapper.vm.customer_account_ids[1].user_ids.length).toEqual(1);
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'save-id' with and object of the user 'Lab User -1' modified as 'Renamed User -1', add  validate the update  of 'Renamed User -1'", async () => {
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
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer = {
      cust_id: 2,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      api_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
      nickname: "Customer account -3",
      user_ids: [],
    };
    const add_user = {
      user_id: 0,
      uuid: "5FY8ghtsQaUJ2KzHJGetfE",
      nickname: "New User -1",
    };
    const update_user = {
      user_id: 0,
      uuid: "2VSckkkkk2An3dqHEyfRRE",
      nickname: "Renamed User -1",
    };
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onSaveCustomerId(add_customer);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");

    wrapper.vm.onSaveUserId(add_user);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("New User -1");

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -2");
    Vue.nextTick(() => {
      expect(wrapper.find("#user-0").text()).toEqual("Lab User  -1");
      expect(wrapper.find("#user-1").text()).toEqual("Intern -1");
    });

    await wrapper.find("#input-dropdown-widgetuser-").setValue("Lab User -1");
    wrapper.vm.onUpdateUserId(update_user);

    expect(wrapper.vm.customer_account_ids[1].user_ids[0].nickname).toEqual(
      "Renamed User -1"
    );
    expect(wrapper.vm.customer_account_ids[1].user_ids[1].nickname).toEqual(
      "Intern -1"
    );
    expect(wrapper.vm.customer_account_ids[1].user_ids.length).toEqual(2);
  });
  test("When mounting SettingsForm on init, the Settings now recevies an event 'cancel-id' when the user was intenting to rename 'Lab User -1'  as 'Renamed User -1', add  validate that no change of nickname happend'", async () => {
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
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer = {
      cust_id: 2,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      api_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
      nickname: "Customer account -3",
      user_ids: [],
    };
    const add_user = {
      user_id: 0,
      uuid: "5FY8ghtsQaUJ2KzHJGetfE",
      nickname: "New User -1",
    };
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onSaveCustomerId(add_customer);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("");

    wrapper.vm.onSaveUserId(add_user);

    expect(wrapper.vm.entrykey_customer).toEqual("Customer account -3");
    expect(wrapper.vm.entrykey_user).toEqual("New User -1");

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -2");
    Vue.nextTick(() => {
      expect(wrapper.find("#user-0").text()).toEqual("Lab User  -1");
      expect(wrapper.find("#user-1").text()).toEqual("Intern -1");
    });

    await wrapper.find("#input-dropdown-widgetuser-").setValue("Lab User -1");
    wrapper.vm.onCancelUserId();

    expect(wrapper.vm.customer_account_ids[1].user_ids[0].nickname).toEqual(
      "Lab User -1"
    );
    expect(wrapper.vm.customer_account_ids[1].user_ids[1].nickname).toEqual(
      "Intern -1"
    );
    expect(wrapper.vm.customer_account_ids[1].user_ids.length).toEqual(2);
  });
  test("When mounting SettingsForm on init, the Settings now the 'Customer ID' value 'Customer account -1' is selected and validate the display of buttons", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    wrapper.find("#input-dropdown-widgetcust-").setValue("Customer account -1");

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    await wrapper.vm.$nextTick(); // wait for update

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(false);
  });
  test("When mounting SettingsForm on init, the Settings now has the 'Customer ID' value 'Customer account -1' and 'User ID' value 'User account -1' is selected and validate the display of buttons", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -1");
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widgetuser-")
      .setValue("User account -1");
    await wrapper.vm.$nextTick(); // wait for update

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(true);
  });

  test("When mounting SettingsForm on init, the Settings now has the 'Customer ID' value '' and 'User ID' value '' is selected and validate the display of buttons", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });
  test("When mounting SettingsForm on init, the Settings now has the 'Customer ID' value '' and 'User ID' value '' is selected and the Vuex data has Customer ID is 'Customer account -1',   User ID is empty and validate the display of buttons", async () => {
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: [],
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });
  test("When mounting SettingsForm on init, the Settings now has the 'Customer ID' value '' and 'User ID' value '' is selected and the Vuex data is empty, validate the display of buttons", async () => {
    const array_of_customerids = [];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });

  test("When mounting SettingsForm on init, the Settings now has the 'Customer ID' value 'Customer account -1' and 'User ID' value 'User account -1' now the user invokes a 'delete-id' on 'User account -1', validate the display of buttons", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -1");
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widgetuser-")
      .setValue("User account -1");
    await wrapper.vm.$nextTick(); // wait for update

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(true);

    const delete_user = {
      user_id: 0,
      uuid: "2VSckkBYr2An3dqHEyfRRE",
      nickname: "User account -1",
    };
    wrapper.vm.onDeleteUserId(delete_user);

    await wrapper.vm.$nextTick(); // wait for update

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(false);
  });

  test("When mounting SettingsForm on init, the Settings now has the 'Customer ID' value 'Customer account -1' and 'User ID' value 'User account -1' now the user invokes a 'delete-id' on 'User account -1', validate the display of buttons", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -1");
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widgetuser-")
      .setValue("User account -1");
    await wrapper.vm.$nextTick(); // wait for update

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(true);

    const delete_user = {
      user_id: 0,
      uuid: "2VSckkBYr2An3dqHEyfRRE",
      nickname: "User account -1",
    };
    wrapper.vm.onDeleteUserId(delete_user);

    await wrapper.vm.$nextTick(); // wait for update

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(false);

    const delete_customer = {
      cust_id: 0,
      uuid: "4vqyd62oARXqj9nRUNhtLQ",
      api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      nickname: "Customer account -1",
      user_ids: [],
    };
    wrapper.vm.onDeleteCustomerId(delete_customer);

    await wrapper.vm.$nextTick(); // wait for update

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });

  test("When mounting SettingsForm on init, the Settings has the value of  'Customer ID'  not assigned  and 'User ID'  not assigned validate that the 'Save Changes' and 'Reset to Default' is disabled", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Reset_Btn = wrapper.find(
      ".span__settings-tool-tip-reset-btn-txt-disable"
    );
    const Save_Btn = wrapper.find(
      ".span__settings-tool-tip-save-btn-txt-disable"
    );
    const Save_Btn_Container = wrapper.find(
      ".div__settings-tool-tip-save-btn-disable"
    );

    expect(Reset_Btn.isVisible()).toBe(true);
    expect(Save_Btn.isVisible()).toBe(true);
    expect(Save_Btn_Container.isVisible()).toBe(true);
  });
  test("When mounting SettingsForm on init, the Settings has the value of  'Customer ID' is assigned to 'Customer account -1' and 'User ID' is assigned to 'User account -1' validate that the 'Save Changes' and 'Reset to Default' is enabled", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Reset_Btn = wrapper.find(
      ".span__settings-tool-tip-reset-btn-txt-enable"
    );
    const Save_Btn = wrapper.find(
      ".span__settings-tool-tip-save-btn-txt-enable"
    );
    const Save_Btn_Container = wrapper.find(
      ".div__settings-tool-tip-save-btn-enable"
    );

    expect(Reset_Btn.isVisible()).toBe(true);
    expect(Save_Btn.isVisible()).toBe(true);
    expect(Save_Btn_Container.isVisible()).toBe(true);
  });
  test("When mounting SettingsForm on init, the Settings has the value of  'Customer ID' is not assigned and the 'User ID' is not assigned validate if the RED Box is enabled around the Customer ID and User ID", async () => {
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Boxes = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--invalid"
    );
    const Customer_ID_Input_Editor_Red_Box = Boxes.at(0);
    const User_ID_Input_Editor_Red_Box = Boxes.at(1);

    expect(Customer_ID_Input_Editor_Red_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Red_Box.isVisible()).toBe(true);
  });
  test("When mounting SettingsForm on init, the Settings has the value of  'Customer ID' is assigned to 'Customer account -1' and 'User ID' is assigned to 'User account -1' validate if the  GREEN Box is enabled around the Customer ID and User ID", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Boxes = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--valid"
    );
    const Customer_ID_Input_Editor_Green_Box = Boxes.at(0);
    const User_ID_Input_Editor_Green_Box = Boxes.at(1);

    expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
  });

  test("When mounting SettingsForm on init, the Settings has the value of  'Customer ID' is not assigned to and 'User ID' is assigned is not assigned,  Vuex sets Customer ID=>'Customer account-1' and 'User ID'=>'User account-1' validate if created() is invoked ", async () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
      data() {
        return {
          customerid: "",
          userid: "",
          valid_customer_focus: false,
          valid_user_focus: false,
          disable_edit_customer: true,
          disable_add_user: true,
          disable_edit_user: true,
        };
      },
    });

    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -1");
    await wrapper.vm.$nextTick(); // wait for update
    await wrapper
      .find("#input-dropdown-widgetuser-")
      .setValue("User account -1");
    await wrapper.vm.$nextTick(); // wait for update

    const Boxes = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--valid"
    );
    const Customer_ID_Input_Editor_Green_Box = Boxes.at(0);
    const User_ID_Input_Editor_Green_Box = Boxes.at(1);

    expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Green_Box.isVisible()).toBe(true);

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(true);
  });

  test("When mounting SettingsForm on init, the Settings now by default 'Customer account -1', 'User account -1' is set and user changes the value to 'Customer account -2', 'Lab User -1 and performs 'Save Changes' validate Vuex is updated", async () => {
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
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widgetcust-")
      .setValue("Customer account -2");
    await wrapper.vm.$nextTick(); // wait for update
    await wrapper.find("#input-dropdown-widgetuser-").setValue("Lab User -1");
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.vm.customer_focus_id).toEqual(1); // this are user selected internal indicies of customer_index
    expect(wrapper.vm.user_focus_id).toEqual(0); // this are user selected internal indicies of user_index

    wrapper.vm.savechanges();

    await wrapper.vm.$nextTick(); // wait for update

    expect(store.getters["settings/customer_index"]).toEqual(1); //this is the real data due to savechanges function Vuex stored data of customer_index
    expect(store.getters["settings/user_index"]).toEqual(0); //this is the real data due to savechanges function Vuex stored data of user_index
  });
  test("When mounting SettingsForm on init, the Settings now by default 'Customer account -1', 'User account -1' validate if the decoder string converts UNICODE value to key", async () => {
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
    const array_of_customerids = [
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const predecoding_str = "&#x1F5DD; " + wrapper.vm.customers_options[0];
    const customerid = "&#x1F5DD; " + wrapper.vm.entrykey_customer;

    const postdecoding_str = wrapper.vm.decoder(predecoding_str);
    expect(wrapper.vm.decoder(customerid)).toEqual(postdecoding_str);
  });
});
