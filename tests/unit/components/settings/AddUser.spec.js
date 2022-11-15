import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/AddUser.vue";
import { AddUser as DistComponentToTest } from "@/dist/mantarray.common";

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

describe("AddUser", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  describe("AddUser.vue", () => {
    test("When mounting AddUser from the build dist file, Then it loads successfully and the `Add Customer` defined title text is rendered", () => {
      wrapper = mount(DistComponentToTest, {
        store,
        localVue,
      });
      const target_span = wrapper.find(".span__AddUser-form-controls-content-title");
      expect(target_span.text()).toStrictEqual("Add New User");
    });
    test("Given there is a stored customer ID, When mounting AddUser, Then the customer ID input is automatically populated with that value and validated", () => {
      const stored_customer_id = "test_id";
      store.commit("settings/set_stored_accounts", { customer_id: stored_customer_id, usernames: [] });

      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
      const target_input = wrapper.find("#input-widget-field-customer-id");
      expect(target_input.element.value).toStrictEqual(stored_customer_id);
      const error_text = wrapper.find("#input-widget-feedback-customer-id");
      expect(error_text.text()).toStrictEqual("");
    });
  });

  describe("AddUser.enter_uuidbase57", () => {
    beforeEach(async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
    });
    afterEach(() => {
      wrapper.destroy();
      jest.restoreAllMocks();
    });

    test.each([
      ["06ad547f-fe02-477b-9473-f7977e4d5e14k", "ID", "customer-id", "validate_user_account_input"],
      ["Cat lab;", "ID", "customer-id", "validate_user_account_input"],
      ["Experiment anemia -1", "ID", "customer-id", "validate_user_account_input"],
      ["Cat * lab", "passkey", "passkey-id", "validate_user_account_input"],
      ["Valid", "passkey", "passkey-id", "validate_user_account_input"],
      ["Cat lab", "passkey", "passkey-id", "validate_user_account_input"],
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
      ["Experiment anemia alpha cells -1", "user_name", "validate_user_account_input"],
      ["C", "user_name", "validate_user_account_input"],
    ])(
      "When the text %s (%s) is entered into the field found with the selector ID username, Then the correct text validation function (%s) is called and the error message from the validation function is rendered below the input in the DOM",
      async (entry, test_id, text_validation_type) => {
        const spied_text_validator = jest.spyOn(TextValidation.prototype, text_validation_type);
        const target_input_field = wrapper.find("#input-dropdown-widget-username");
        const target_error_message = wrapper.find("#input-dropdown-widget-feedback-username");

        target_input_field.setValue(entry);
        await Vue.nextTick();

        expect(spied_text_validator).toHaveBeenCalledWith(entry, test_id);
        expect(target_error_message.text()).toStrictEqual(spied_text_validator.mock.results[0].value);
      }
    );

    test.each([
      ["customer-id", "This field is required"],
      ["passkey-id", "This field is required"],
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

    test("Given some nonsense value in the input dropdown widget with the DOM Id suffix username, When the input field is updated to be a blank value, Then the error message below the text in the DOM matches what the business logic dictates 'This field is required'", async () => {
      const selector_id_suffix_user_name = "username";
      const target_input_field = wrapper.find("#input-dropdown-widget-" + selector_id_suffix_user_name);
      const target_error_message = wrapper.find(
        "#input-dropdown-widget-feedback-" + selector_id_suffix_user_name
      );
      await target_input_field.setValue("blah");
      await Vue.nextTick();

      // confirm that the pre-condition is different
      expect(target_error_message.text()).not.toStrictEqual("This field is required");

      await target_input_field.setValue("");
      await Vue.nextTick();

      expect(target_error_message.text()).toStrictEqual("This field is required");
    });
  });

  describe("AddUser.enable_save_button", () => {
    beforeEach(async () => {
      wrapper = mount(ComponentToTest, {
        store,
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
      "Given an UUID (%s), pass Key (%s), user_name (%s) for 'Add Customer' as input, When the input contains based on valid the critera or failure, Then display of Label 'Save ID' is visible or greyed (%s)",
      async (uuid, passkey, user_name, save_btn_css) => {
        const selector_id_suffix_alphanumeric_id = "customer-id";
        const selector_id_suffix_passkey_id = "passkey-id";
        const selector_id_suffix_user_name = "username";

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

        const target_input_field_user_name = wrapper.find(
          "#input-dropdown-widget-" + selector_id_suffix_user_name
        );
        target_input_field_user_name.setValue(user_name);
        await Vue.nextTick();

        const target_button_label_btn = wrapper.findAll(".span__button_label");
        const cancel_btn = target_button_label_btn.at(0);
        expect(cancel_btn.attributes().style).toContain("color: rgb(255, 255, 255);");
        const save_btn = target_button_label_btn.at(1);
        expect(save_btn.attributes().style).toContain(save_btn_css);
      }
    );
  });

  describe("AddUser.clicked_button", () => {
    beforeEach(async () => {
      wrapper = mount(ComponentToTest, {
        store,
        localVue,
      });
    });
    afterEach(() => wrapper.destroy());

    test.each([["5FY8KwTsQa", "06ad547f", "Experiment anemia -1", "", "", "", "color: rgb(255, 255, 255);"]])(
      "Given an UUID(%s) , pass Key(%s), user_name(%s) for 'Add Customer' as input, When the input contains based on valid the critera or failure %s %s %s, Then display of Label 'Save ID' is visible %s, click on Cancel, an event 'cancel-id' is emmited to the parent and click on Save an event 'save-id' is emmited to parent with object containing uuid,passkey and user_name",
      async (
        uuid_test,
        passkey_test,
        user_name_test,
        invalid_passkey,
        invalid_uuid,
        invalid_user_name,
        save_btn_css
      ) => {
        const selector_id_suffix_alphanumeric_id = "customer-id";
        const selector_id_suffix_passkey_id = "passkey-id";
        const selector_id_suffix_user_name = "username";

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
        const target_input_field_user_name = wrapper.find(
          "#input-dropdown-widget-" + selector_id_suffix_user_name
        );
        const target_error_message_user_name = wrapper.find(
          "#input-dropdown-widget-feedback-" + selector_id_suffix_user_name
        );
        target_input_field_user_name.setValue(user_name_test);
        await Vue.nextTick();
        expect(target_error_message_user_name.text()).toStrictEqual(invalid_user_name);
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
            user_password: passkey_test,
            user_name: user_name_test,
            customer_id: uuid_test,
          },
        ]);
      }
    );
  });
});
