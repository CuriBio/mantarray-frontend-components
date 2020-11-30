import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/SettingsForm.vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  array_of_customer_ids,
  array_of_user_ids_1,
  array_of_user_ids_2,
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
  describe("Given Vuex has valid customer and user accounts but no customer index or user index selected", () => {
    beforeEach(() => {
      // commit a deep copy of the template object to the Vuex store using JSON stringify/parse, as it may be modified during tests. https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
      store.commit(
        "settings/set_customer_account_ids",
        JSON.parse(JSON.stringify(array_of_customer_ids))
      );
    });

    describe("Given the component is mounted", () => {
      beforeEach(() => {
        wrapper = mount(ComponentToTest, {
          store,
          localVue,
        });
      });
      describe("Given that the SettingsForm has been populated with a new Customer account through invoking the methods handling the 'save-id' event for Add Customer", () => {
        beforeEach(async () => {
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
          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(
            wrapper.find("#input-dropdown-widget-cust-").element.value
          ).toStrictEqual("Customer account -3");
          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(
            wrapper.find("#input-dropdown-widget-user-").element.value
          ).toStrictEqual("");

          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(wrapper.find("#cust-0").text()).toStrictEqual(
            "Customer account -1"
          );
          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(wrapper.find("#cust-1").text()).toStrictEqual(
            "Customer account -2"
          );
          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(wrapper.find("#cust-2").text()).toStrictEqual(
            "Customer account -3"
          );
        });
        test("When the method is invoked that handles the user 'save-id' event with a new user account, Then the User ID input is updated with nickname value of 'New User -1'", async () => {
          const add_user = {
            user_id: 0,
            uuid: "5FY8ghtsQaUJ2KzHJGetfE",
            nickname: "New User -1",
          };
          /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
          /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
          wrapper.vm.onSaveUserId(add_user);
          await wrapper.vm.$nextTick();
          expect(
            wrapper.find("#input-dropdown-widget-cust-").element.value
          ).toStrictEqual("Customer account -3");
          expect(
            wrapper.find("#input-dropdown-widget-user-").element.value
          ).toStrictEqual("New User -1");
        });

        describe("Given that the SettingsForm has been populated with a new User account through invoking the methods handling the 'save-id' events for Add User", () => {
          beforeEach(async () => {
            const add_user = {
              user_id: 0,
              uuid: "5FY8ghtsQaUJ2KzHJGetfE",
              nickname: "New User -1",
            };

            wrapper.vm.onSaveUserId(add_user);

            await wrapper.vm.$nextTick();
            // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
            // eslint-disable-next-line jest/no-standalone-expect
            expect(
              wrapper.find("#input-dropdown-widget-user-").element.value
            ).toStrictEqual("New User -1");
          });

          test("When the method handling the 'save-id' event for the Edit Customer button is invoked with an existing not-selected user to change the nickname, Then the Customer ID dropdown list gets updated to change to the new nickname", async () => {
            const edit_customer = {
              cust_id: 1,
              uuid: "6cBaidlJ84Ggc5JA7IYCgv",
              api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
              nickname: "Renamed Account -1",
              user_ids: array_of_user_ids_2,
            };
            wrapper.vm.onUpdateCustomerId(edit_customer);

            await wrapper.vm.$nextTick();
            expect(wrapper.find("#cust-0").text()).toStrictEqual(
              "Customer account -1"
            );
            expect(wrapper.find("#cust-1").text()).toStrictEqual(
              "Renamed Account -1"
            );
            expect(wrapper.find("#cust-2").text()).toStrictEqual(
              "Customer account -3"
            );
          });
          test("When the method handling the customer event 'delete-id' is invoked with a customer not currently selected, Then the deleted customer account is removed from the Customer ID dropdown", async () => {
            const delete_customer = {
              cust_id: 0,
              uuid: "4vqyd62oARXqj9nRUNhtLQ",
              api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
              nickname: "Customer account -1",
              user_ids: array_of_user_ids_1,
            };

            wrapper.vm.onDeleteCustomerId(delete_customer);
            await wrapper.vm.$nextTick();

            expect(wrapper.find("#cust-0").text()).toStrictEqual(
              "Customer account -2"
            );
            expect(wrapper.find("#cust-1").text()).toStrictEqual(
              "Customer account -3"
            );
          });
        });
      });

      test("When the SettingsForm method that handles receiving the add customer 'save-id' event is invoked with a new customer account, Then the Customer ID text input is updated with nickname value of the newly added account and the User ID text input is blank", async () => {
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
      test("Given that the method handling the customer 'save-id' event is invoked with a new Customer account, When the method handling the user 'cancel-id' event is invoked, Then the Customer ID text input is not modified", async () => {
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
    });
    describe("Given a valid customer is selected in Vuex and the component is mounted", () => {
      beforeEach(() => {
        store.commit("settings/set_customer_index", 0);
        wrapper = mount(ComponentToTest, {
          store,
          localVue,
        });
      });
      test("When the SettingsForm method that handles receiving the 'cancel-id' event is invoked, Then the Customer ID text input and User ID input do not change", async () => {
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
    });
  });

  test("Given that the SettingsForm receives an event 'delete-id', When the user decided to delete the entry of User UD with nickname 'Lab User -1', Then validate that the User ID dropdown does not contain nickname 'Lab User -1'", async () => {
    const array_of_user_ids_1 = [
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
    const array_of_user_ids_2 = [
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
        user_ids: array_of_user_ids_1,
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_user_ids_2,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customer_ids);

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
    const array_of_user_ids_1 = [
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
    const array_of_user_ids_2 = [
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
        user_ids: array_of_user_ids_1,
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_user_ids_2,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customer_ids);

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
    const array_of_user_ids_1 = [
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
    const array_of_user_ids_2 = [
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
        user_ids: array_of_user_ids_1,
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_user_ids_2,
      },
    ];
    store.commit("settings/set_customer_account_ids", array_of_customer_ids);

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
