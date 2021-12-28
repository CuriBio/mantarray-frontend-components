import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/AddCustomer.vue";
import { AddCustomer as DistComponentToTest } from "@/dist/mantarray.common";

import Vue from "vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import uuid from "@tofandel/uuid-base62";
import { TextValidation } from "@/js_utils/text_validation.js";
let wrapper = null;

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(uuid);
localVue.use(Vuex);
let NuxtStore;
let store;

describe("AddCustomer", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  describe("AddCustomer.vue", () => {
    beforeEach(async () => {
      const propsData = {
        dialogdata: null,
        dataindex: 0,
      };
      wrapper = mount(ComponentToTest, {
        store,
        propsData,
        localVue,
      });
    });
    afterEach(() => wrapper.destroy());
    test("When mounting AddCustomer from the build dist file, Then it loads successfully and the `Add Customer` defined title text is rendered", () => {
      const propsData = {
        dialogdata: null,
        dataindex: 0,
      };
      wrapper = mount(DistComponentToTest, {
        store,
        propsData,
        localVue,
      });
      const target_span = wrapper.find(".span__addcustomer-form-controls-content-title");
      expect(target_span.text()).toStrictEqual("Add New Customer Account ID");
    });
  });

  describe("AddCustomer.enter_uuidbase57", () => {
    beforeEach(async () => {
      const propsData = {
        dialogdata: null,
        dataindex: 0,
      };
      wrapper = mount(ComponentToTest, {
        store,
        propsData,
        localVue,
      });
    });
    afterEach(() => {
      wrapper.destroy();
      jest.restoreAllMocks();
    });

    test.each([
      ["06ad547f-fe02-477b-9473-f7977e4d5e14k", "ID", "alphanumeric-id", "validate_customer_account_input"],
      ["Cat lab;", "ID", "alphanumeric-id", "validate_customer_account_input"],
      ["Experiment anemia -1", "ID", "alphanumeric-id", "validate_customer_account_input"],
      ["Cat * lab", "passkey", "passkey-id", "validate_customer_account_input"],
      ["Valid", "passkey", "passkey-id", "validate_customer_account_input"],
      ["Cat lab", "passkey", "passkey-id", "validate_customer_account_input"],
      [
        "Experiment anemia alpha cells -1",
        "user_account_id",
        "user-account-id",
        "validate_customer_account_input",
      ],
      ["C", "user_account_id", "user-account-id", "validate_customer_account_input"],
      ["", "user_account_id", "user-account-id", "validate_customer_account_input"],
    ])(
      "When the text %s (%s) is entered into the field found with the selector ID %s, Then the correct text validation function (%s) is called and the error message from the validation function is rendered below the input in the DOM",
      async (entry, test_id, selector_id_suffix, text_validation_type) => {
        const spied_text_validator = jest.spyOn(TextValidation.prototype, text_validation_type);
        const target_input_field = wrapper.find("#input-widget-field-" + selector_id_suffix);
        const target_error_message = wrapper.find("#input-widget-feedback-" + selector_id_suffix);
        target_input_field.setValue(entry);
        await Vue.nextTick();
        expect(spied_text_validator).toHaveBeenCalledWith(entry, test_id);
        expect(target_error_message.text()).toStrictEqual(spied_text_validator.mock.results[0].value);
      }
    );
    test.each([
      ["alphanumeric-id", "This field is required"],
      ["passkey-id", "This field is required"],
      ["user-account-id", "This field is required"],
    ])(
      "Given some nonsense value in the input field with the DOM Id suffix %s, When the input field is updated to be a blank value, Then the error message below the text in the DOM matches what the business logic dictates (%s)",
      async (selector_id_suffix, expected_message) => {
        const target_input_field = wrapper.find("#input-widget-field-" + selector_id_suffix);
        const target_error_message = wrapper.find("#input-widget-feedback-" + selector_id_suffix);
        target_input_field.setValue("blah");
        await Vue.nextTick();
        // confirm that the pre-condition is different
        expect(target_error_message.text()).not.toStrictEqual(expected_message);

        target_input_field.setValue("");
        await Vue.nextTick();
        expect(target_error_message.text()).toStrictEqual(expected_message);
      }
    );
  });

  describe("AddCustomer.enable_save_button", () => {
    beforeEach(async () => {
      const propsData = {
        dialogdata: null,
        dataindex: 0,
      };
      wrapper = mount(ComponentToTest, {
        store,
        propsData,
        localVue,
      });
    });
    afterEach(() => wrapper.destroy());
    test.each([
      ["0VSckkBYH2An3dqHEyfRRE", "06ad547f", "Experiment anemia -1", "color: rgb(255, 255, 255);"],
      [
        "5FY8KwTsQaUJ2KzHJGetfE123456asdfghDDDedsD74r",
        "06ad547f",
        "Experiment anemia -1 ",
        "color: rgb(63, 63, 63);",
      ],
      ["5FY8KwTsQaUJ2KzH*%#@JGetfE", "06ad547f", "Cat * lab", "color: rgb(63, 63, 63);"],
      ["fasd44", "06ad54", "Experiment anemia -1", "color: rgb(255, 255, 255);"],
      ["", "", "Experiment anemia -1", "color: rgb(63, 63, 63);"],
    ])(
      "Given an UUID (%s), pass Key (%s), user_account_id (%s) for 'Add Customer' as input, When the input contains based on valid the critera or failure, Then display of Label 'Save ID' is visible or greyed (%s)",
      async (uuid, passkey, user_account_id, save_btn_css) => {
        const selector_id_suffix_alphanumeric_id = "alphanumeric-id";
        const selector_id_suffix_passkey_id = "passkey-id";
        const selector_id_suffix_user_account_id = "user-account-id";

        const target_input_field_uuid = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_alphanumeric_id
        );
        target_input_field_uuid.setValue(uuid);
        await Vue.nextTick();

        const target_input_field_passkey = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_passkey_id
        );
        target_input_field_passkey.setValue(passkey);
        await Vue.nextTick();

        const target_input_field_user_account_id = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_user_account_id
        );
        target_input_field_user_account_id.setValue(user_account_id);
        await Vue.nextTick();

        const target_button_label_btn = wrapper.findAll(".span__button_label");
        const cancel_btn = target_button_label_btn.at(0);
        expect(cancel_btn.attributes().style).toContain("color: rgb(255, 255, 255);");
        const save_btn = target_button_label_btn.at(1);
        expect(save_btn.attributes().style).toContain(save_btn_css);
      }
    );
  });

  describe("AddCustomer.clicked_button", () => {
    beforeEach(async () => {
      const propsData = {
        dialogdata: null,
        dataindex: 0,
      };
      wrapper = mount(ComponentToTest, {
        store,
        propsData,
        localVue,
      });
    });
    afterEach(() => wrapper.destroy());
    test.each([["5FY8KwTsQa", "06ad547f", "Experiment anemia -1", "", "", "", "color: rgb(255, 255, 255);"]])(
      "Given an UUID(%s) , pass Key(%s), user_account_id(%s) for 'Add Customer' as input, When the input contains based on valid the critera or failure %s %s %s, Then display of Label 'Save ID' is visible %s, click on Cancel, an event 'cancel-id' is emmited to the parent and click on Save an event 'save-id' is emmited to parent with object containing uuid,passkey and user_account_id",
      async (
        uuid_test,
        passkey_test,
        user_account_id_test,
        invalid_passkey,
        invalid_uuid,
        invalid_user_account_id,
        save_btn_css
      ) => {
        const selector_id_suffix_alphanumeric_id = "alphanumeric-id";
        const selector_id_suffix_passkey_id = "passkey-id";
        const selector_id_suffix_user_account_id = "user-account-id";

        const target_input_field_uuid = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_alphanumeric_id
        );
        const target_error_message_uuid = wrapper.find(
          "#input-widget-feedback-" + selector_id_suffix_alphanumeric_id
        );
        target_input_field_uuid.setValue(uuid_test);
        await Vue.nextTick();
        expect(target_error_message_uuid.text()).toStrictEqual(invalid_uuid);
        const target_input_field_passkey = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_passkey_id
        );
        const target_error_message_passkey = wrapper.find(
          "#input-widget-feedback-" + selector_id_suffix_passkey_id
        );
        target_input_field_passkey.setValue(passkey_test);
        await Vue.nextTick();
        expect(target_error_message_passkey.text()).toStrictEqual(invalid_passkey);
        const target_input_field_user_account_id = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_user_account_id
        );
        const target_error_message_user_account_id = wrapper.find(
          "#input-widget-feedback-" + selector_id_suffix_user_account_id
        );
        target_input_field_user_account_id.setValue(user_account_id_test);
        await Vue.nextTick();
        expect(target_error_message_user_account_id.text()).toStrictEqual(invalid_user_account_id);
        const target_button_label_btn = wrapper.findAll(".span__button_label");
        const cancel_btn = target_button_label_btn.at(0);
        expect(cancel_btn.attributes().style).toContain("color: rgb(255, 255, 255);");
        const save_btn = target_button_label_btn.at(1);
        expect(save_btn.attributes().style).toContain(save_btn_css);
        await cancel_btn.trigger("click");
        await Vue.nextTick();
        const cancel_id_events = wrapper.emitted("cancel-id");
        expect(cancel_id_events).toHaveLength(1);
        expect(cancel_id_events[0]).toStrictEqual([]);
        await save_btn.trigger("click");
        await Vue.nextTick();
        const save_id_events = wrapper.emitted("save-id");
        expect(save_id_events).toHaveLength(1);
        expect(save_id_events[0]).toStrictEqual([
          {
            pass_key: passkey_test,
            cust_idx: 0,
            user_account_id: user_account_id_test,
            user_ids: [],
            cust_id: uuid_test,
          },
        ]);
      }
    );
  });
});
