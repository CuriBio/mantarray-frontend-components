import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/SettingsForm.vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  array_of_customerids,
  array_of_userid_1,
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

  afterEach(() => {
    wrapper.destroy();
  });
  test("Given that the SettingsForm receives an event 'save-id', When the object of the newly added customer nickname 'Customer Account -3', Then validate that the Customer ID input is updated with nickname value of  'Customer Account -3'", async () => {
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

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");
  });
  test("Given that the SettingsForm receives an event 'cancel-id', When the user decided to cancel the entry of Customer, Then validate that the Customer ID input is retained with old nickname value of  'Customer Account -1'", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -1");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");
    /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
    /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
    wrapper.vm.onCancelCustomerId();

    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -1");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");
  });
  test("Given that the SettingsForm receives an event 'save-id', When the object of the newly added customer nickname 'Customer Account -3' and newly added user nickname 'New User -1, Then validate that the Customer ID input is updated with nickname value of  'Customer Account -3' and User ID input is updated with nickname value of 'New User -1' respectively", async () => {
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
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");

    wrapper.vm.onSaveUserId(add_user);
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("New User -1");
  });

  test("Given that the SettingsForm receives an event 'cancel-id', When the user decided to cancel the entry of User, Then validate that the Customer ID input is retained with old nickname value of  'Customer Account -3'", async () => {
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
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");

    wrapper.vm.onCancelAddUserId();
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");
  });
  test("Given that the SettingsForm receives an event 'delete-id', When the user decided to delete the entry of Customer with nickname 'Customer account -1', Then validate that the Customer ID dropdown does not contain 'Customer Account -1'", async () => {
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
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");

    wrapper.vm.onSaveUserId(add_user);
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("New User -1");
    expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -1");
    expect(wrapper.find("#cust-1").text()).toStrictEqual("Customer account -2");
    expect(wrapper.find("#cust-2").text()).toStrictEqual("Customer account -3");

    wrapper.vm.onDeleteCustomerId(delete_customer);
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -2");
    expect(wrapper.find("#cust-1").text()).toStrictEqual("Customer account -3");
  });
  test("Given that the SettingsForm receives an event 'save-id', When the user decided to update the entry of Customer with nickname 'Customer account -2', Then validate that the Customer ID dropdown does renamed nickname 'Renamed Account -1'", async () => {
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

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");

    wrapper.vm.onSaveUserId(add_user);

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("New User -1");
    expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -1");
    expect(wrapper.find("#cust-1").text()).toStrictEqual("Customer account -2");
    expect(wrapper.find("#cust-2").text()).toStrictEqual("Customer account -3");

    wrapper.vm.onUpdateCustomerId(edit_customer);

    await wrapper.vm.$nextTick();
    expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -1");
    expect(wrapper.find("#cust-1").text()).toStrictEqual("Renamed Account -1");
    expect(wrapper.find("#cust-2").text()).toStrictEqual("Customer account -3");
  });
  test("Given that the SettingsForm receives an event 'delete-id', When the user decided to delete the entry of User UD with nickname 'Lab User -1', Then validate that the User ID dropdown does not contain nickname 'Lab User -1'", async () => {
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

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");

    wrapper.vm.onSaveUserId(add_user);

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("New User -1");

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -2");
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#user-0").text()).toStrictEqual("Lab User -1");
    expect(wrapper.find("#user-1").text()).toStrictEqual("Intern -1");

    wrapper.find("#input-dropdown-widget-user-").setValue("Lab User -1");
    wrapper.vm.onDeleteUserId(delete_user);

    await wrapper.vm.$nextTick();
    expect(wrapper.find("#user-0").text()).toStrictEqual("Intern -1");
  });

  test("Given that the SettingsForm receives an event 'save-id', When the user decided to update the entry of User ID with nickname 'Lab User -1', Then validate that the User ID dropdown does renamed nickname 'Renamed User -1'", async () => {
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

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");

    wrapper.vm.onSaveUserId(add_user);

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("New User -1");

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -2");
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#user-0").text()).toStrictEqual("Lab User -1");
    expect(wrapper.find("#user-1").text()).toStrictEqual("Intern -1");

    await wrapper.find("#input-dropdown-widget-user-").setValue("Lab User -1");
    wrapper.vm.onUpdateUserId(update_user);

    await wrapper.vm.$nextTick();
    expect(wrapper.find("#user-0").text()).toStrictEqual("Renamed User -1");
    expect(wrapper.find("#user-1").text()).toStrictEqual("Intern -1");
  });
  test("Given that the SettingsForm receives an event 'cancel-id', When the user decided to cancel the entry of User ID, Then validate that the User ID input dropdown retains the same list as it was before cancel event", async () => {
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

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("");

    wrapper.vm.onSaveUserId(add_user);

    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("#input-dropdown-widget-cust-").element.value
    ).toStrictEqual("Customer account -3");
    expect(
      wrapper.find("#input-dropdown-widget-user-").element.value
    ).toStrictEqual("New User -1");

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -2");
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#user-0").text()).toStrictEqual("Lab User -1");
    expect(wrapper.find("#user-1").text()).toStrictEqual("Intern -1");

    await wrapper.find("#input-dropdown-widget-user-").setValue("Lab User -1");
    wrapper.vm.onCancelUserId();

    await wrapper.vm.$nextTick();
    expect(wrapper.find("#user-0").text()).toStrictEqual("Lab User -1");
    expect(wrapper.find("#user-1").text()).toStrictEqual("Intern -1");
  });
});
