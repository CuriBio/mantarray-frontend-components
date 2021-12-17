import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/SettingsForm.vue";
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
  describe("Given Vuex has valid customer but no customer index", () => {
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
      describe("Given that the SettingsForm has been populated with a new Customer account through invoking the methods handling the 'save-id' event for Add Customer", () => {
        beforeEach(async () => {
          const add_customer = {
            cust_idx: 2,
            cust_id: "5FY8KwTsQaUJ2KzHJGetfE",
            pass_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
            user_account_id: "Customer account -3",
            user_ids: [],
          };

          /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
          /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
          wrapper.vm.onSaveCustomerId(add_customer);

          await wrapper.vm.$nextTick();
          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(wrapper.find("#input-dropdown-widget-cust-").element.value).toStrictEqual(
            "Customer account -3"
          );
          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          // expect(wrapper.find("#input-dropdown-widget-user-").element.value).toStrictEqual("");

          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -1");
          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(wrapper.find("#cust-1").text()).toStrictEqual("Customer account -2");
          // Eli (11/30/20): This beforeEach block of code will always get executed, and these expect statements help confirm the pre-condition to the test is set up correctly
          // eslint-disable-next-line jest/no-standalone-expect
          expect(wrapper.find("#cust-2").text()).toStrictEqual("Customer account -3");
        });
        test("When the method handling the 'save-id' event for the Edit Customer button is invoked to change the user_account_id, Then the Customer ID dropdown list gets updated to change to the new user_account_id", async () => {
          const edit_customer = {
            cust_idx: 1,
            cust_id: "6cBaidlJ84Ggc5JA7IYCgv",
            pass_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
            user_account_id: "Renamed Account -1",
            user_ids: array_of_user_ids_2,
          };
          wrapper.vm.onUpdateCustomerId(edit_customer);

          await wrapper.vm.$nextTick();
          expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -1");
          expect(wrapper.find("#cust-1").text()).toStrictEqual("Renamed Account -1");
          expect(wrapper.find("#cust-2").text()).toStrictEqual("Customer account -3");
        });
        test("When the method handling the customer event 'delete-id' is invoked with a customer not currently selected, Then the deleted customer account is removed from the Customer ID dropdown", async () => {
          const delete_customer = {
            cust_idx: 0,
            cust_id: "4vqyd62oARXqj9nRUNhtLQ",
            pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
            user_account_id: "Customer account -1",
            user_ids: array_of_user_ids_1,
          };

          wrapper.vm.onDeleteCustomerId(delete_customer);
          await wrapper.vm.$nextTick();

          expect(wrapper.find("#cust-0").text()).toStrictEqual("Customer account -2");
          expect(wrapper.find("#cust-1").text()).toStrictEqual("Customer account -3");
        });
      });
      // });

      test("When the SettingsForm method that handles receiving the add customer 'save-id' event is invoked with a new customer account, Then the Customer ID text input is updated with user_account_id value of the newly added account", async () => {
        const add_customer = {
          cust_idx: 2,
          cust_id: "5FY8KwTsQaUJ2KzHJGetfE",
          pass_key: "ba86b8f0-6fdf-4944-87a0-8a491a19490e",
          user_account_id: "Customer account -3",
          user_ids: [],
        };
        /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
        /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
        wrapper.vm.onSaveCustomerId(add_customer);

        await wrapper.vm.$nextTick();
        expect(wrapper.find("#input-dropdown-widget-cust-").element.value).toStrictEqual(
          "Customer account -3"
        );
        // expect(wrapper.find("#input-dropdown-widget-user-").element.value).toStrictEqual("");
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
      test("When the SettingsForm method that handles receiving the 'cancel-id' event is invoked, Then the Customer ID text input does not change", async () => {
        expect(wrapper.find("#input-dropdown-widget-cust-").element.value).toStrictEqual(
          "Customer account -1"
        );
        /* This testing is based on the inspiration provided by the documentation handbook mentioned in the link below */
        /* https://lmiller1990.github.io/vue-testing-handbook/testing-emitted-events.html#write-a-component-and-test   */
        wrapper.vm.onCancelCustomerId();

        expect(wrapper.find("#input-dropdown-widget-cust-").element.value).toStrictEqual(
          "Customer account -1"
        );
      });
    });
  });
});
