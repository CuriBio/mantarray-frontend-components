import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/settings/EditUser.vue";
import { EditUser as DistComponentToTest } from "@/dist/mantarray.common";

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

describe("EditUser", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  describe("EditUser.vue", () => {
    const editcustomer = {
      uuid: "",
      passkey: "",
      user_name: "",
    };
    const propsData = {
      dialogdata: editcustomer,
    };
    beforeEach(async () => {
      wrapper = mount(ComponentToTest, {
        store,
        propsData,
        localVue,
      });
    });
    afterEach(() => wrapper.destroy());
    test("When mounting EditUser from the build dist file, Then it loads successfully and the `Edit Customer` defined title text is rendered", () => {
      wrapper = mount(DistComponentToTest, {
        store,
        propsData,
        localVue,
      });
      const target_span = wrapper.find(".span__edituser-form-controls-content-title");
      expect(target_span.text()).toStrictEqual("Edit User Credentials");
    });
  });

  describe("EditUser.invalid_creds", () => {
    const propsData = {
      open_for_invalid_creds: true,
      dialogdata: {
        customer_id: "test_id",
        passkey: "test_pass",
        user_name: "test_user_name",
      },
    };
    beforeEach(async () => {
      wrapper = mount(ComponentToTest, {
        store,
        propsData,
        localVue,
      });
    });
    afterEach(() => wrapper.destroy());
    test("When mounting EditUser with invalid credentials, Then it loads with 'Invalid Customer ID, Username, or Password' text", () => {
      const id_error_message = wrapper.find("#input-widget-feedback-customer-id");
      const pass_error_message = wrapper.find("#input-widget-feedback-passkey-id");
      const user_name_error_message = wrapper.find("#input-widget-feedback-username");

      const invalid_text = "Invalid Customer ID, Username, or Password";

      expect(id_error_message.text()).toStrictEqual(invalid_text);
      expect(pass_error_message.text()).toStrictEqual(invalid_text);
      expect(user_name_error_message.text()).toStrictEqual(invalid_text);
    });
    test.each(["passkey-id", "customer-id", "username"])(
      "When EditUser has invalid credentials, Then both ID and passkey will mount with invalid text and will both become become valid with any change to %s",
      async (selector_id_suffix) => {
        const id_error_message = wrapper.find("#input-widget-feedback-customer-id");
        const pass_error_message = wrapper.find("#input-widget-feedback-passkey-id");
        const user_name_error_message = wrapper.find("#input-widget-feedback-username");
        const invalid_text = "Invalid Customer ID, Username, or Password";

        expect(id_error_message.text()).toStrictEqual(invalid_text);
        expect(pass_error_message.text()).toStrictEqual(invalid_text);
        expect(user_name_error_message.text()).toStrictEqual(invalid_text);

        const target_input_field = wrapper.find("#input-widget-field-" + selector_id_suffix);
        await target_input_field.setValue("new entry");
        await wrapper.vm.$nextTick(); // wait for update

        expect(id_error_message.text()).toStrictEqual("");
        expect(pass_error_message.text()).toStrictEqual("");
        expect(user_name_error_message.text()).toStrictEqual("");
      }
    );
  });
  describe("EditUser.enter_uuidbase57", () => {
    const editcustomer = {
      uuid: "",
      passkey: "",
      user_name: "",
    };
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
      ["Experiment anemia alpha cells -1", "user_name", "username", "validate_user_account_input"],
      ["C", "user_name", "username", "validate_user_account_input"],
      ["", "user_name", "username", "validate_user_account_input"],
    ])(
      "When the text %s (%s) is entered into the field found with the selector ID %s, Then the correct text validation function (%s) is called and the error message from the validation function is rendered below the input in the DOM",
      async (entry, text_id, selector_id_suffix, text_validation_type) => {
        if (selector_id_suffix === "customer-id") {
          editcustomer.customer_id = entry;
        }
        if (selector_id_suffix === "passkey-id") {
          editcustomer.passkey = entry;
        }
        if (selector_id_suffix === "username") {
          editcustomer.user_name = entry;
        }

        const propsData = {
          dialogdata: editcustomer,
        };
        wrapper = mount(ComponentToTest, {
          store,
          propsData,
          localVue,
        });

        const spied_text_validator = jest.spyOn(TextValidation.prototype, text_validation_type);

        const target_input_field = wrapper.find("#input-widget-field-" + selector_id_suffix);

        const target_error_message = wrapper.find("#input-widget-feedback-" + selector_id_suffix);

        target_input_field.setValue(entry);

        await wrapper.vm.$nextTick();
        expect(spied_text_validator).toHaveBeenCalledWith(entry, text_id);

        expect(target_error_message.text()).toStrictEqual(spied_text_validator.mock.results[0].value);
      }
    );

    test.each([
      ["customer-id", "This field is required"],
      ["passkey-id", "This field is required"],
      ["username", "This field is required"],
    ])(
      "Given some nonsense value in the input field with the DOM Id suffix %s, When the input field is updated to be a blank value, Then the error message below the text in the DOM matches what the business logic dictates (%s)",
      async (selector_id_suffix, expected_message) => {
        const propsData = {
          dialogdata: editcustomer,
        };
        wrapper = mount(ComponentToTest, {
          store,
          propsData,
          localVue,
        });

        const target_input_field = wrapper.find("#input-widget-field-" + selector_id_suffix);
        const target_error_message = wrapper.find("#input-widget-feedback-" + selector_id_suffix);
        target_input_field.setValue("blah");
        await wrapper.vm.$nextTick();
        // confirm that the pre-condition is different
        expect(target_error_message.text()).not.toStrictEqual(expected_message);

        target_input_field.setValue("");
        await wrapper.vm.$nextTick();

        expect(target_error_message.text()).toStrictEqual(expected_message);
      }
    );
  });

  describe("EditUser.enable_save_button", () => {
    const editcustomer = {
      uuid: "",
      passkey: "",
      user_name: "",
    };
    afterEach(() => wrapper.destroy());
    test.each([
      ["0VSckkBYH2An3dqHEyfRRE", "06ad547f", "Experiment anemia -1", "color: rgb(255, 255, 255);"],
      [
        "5FY8KwTsQaU-J2KzHJGetfE4k2DOd0233l-DlflkakCmfk-dq13",
        "06ad547f",
        "Experiment anemia -1",
        "color: rgb(63, 63, 63);",
      ],
      ["5FY8Kw#$%^*JGetfE", "06ad547f", "Cat * lab", "color: rgb(63, 63, 63);"],
      ["fasd44", "06ad54", "Experiment anemia -1", "color: rgb(255, 255, 255);"],
      ["", "", "Experiment anemia -1", "color: rgb(63, 63, 63);"],
    ])(
      "Given an UUID (%s), pass Key (%s), user_name (%s) for 'Edit Customer' as input, When the input contains based on valid the critera or failure, Then display of Label 'Save ID' is visible or greyed (%s)",
      async (uuid, passkey, user_name, save_btn_css) => {
        const selector_id_suffix_alphanumeric_id = "customer-id";
        const selector_id_suffix_passkey_id = "passkey-id";
        const selector_id_suffix_user_name = "username";

        editcustomer.uuid = uuid;
        editcustomer.passkey = passkey;
        editcustomer.user_name = user_name;

        const propsData = {
          dialogdata: editcustomer,
        };
        wrapper = mount(ComponentToTest, {
          store,
          propsData,
          localVue,
        });

        const target_input_field_uuid = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_alphanumeric_id
        );
        target_input_field_uuid.setValue(uuid);
        await wrapper.vm.$nextTick();
        const target_input_field_passkey = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_passkey_id
        );
        target_input_field_passkey.setValue(passkey);
        await wrapper.vm.$nextTick();

        const target_input_field_user_name = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_user_name
        );
        target_input_field_user_name.setValue(user_name);
        await wrapper.vm.$nextTick();

        const target_button_label_btn = wrapper.findAll(".span__button_label");
        const cancel_btn = target_button_label_btn.at(0);
        expect(cancel_btn.attributes().style).toContain("color: rgb(255, 255, 255);");
        const delete_btn = target_button_label_btn.at(1);
        expect(delete_btn.attributes().style).toContain("color: rgb(255, 255, 255);");
        const save_btn = target_button_label_btn.at(2);
        expect(save_btn.attributes().style).toContain(save_btn_css);
      }
    );
  });

  describe("EditUser.clicked_button", () => {
    const editcustomer = {
      customer_id: "",
      passkey: "",
      user_name: "",
    };
    afterEach(() => wrapper.destroy());
    test.each([
      [
        "5FY8KwTsQaUJ2KzHJ",
        "06ad547f-fe02",
        "Experiment anemia -1",
        "",
        "",
        "",
        "color: rgb(255, 255, 255);",
      ],
    ])(
      "Given an UUID(%s) , pass Key(%s), user_name(%s) for 'Edit Customer' as input, When the input contains based on valid the critera or failure %s %s %s, Then display of Label 'Save ID' is visible %s, click on Cancel, an event 'cancel-id' is emmited to the parent, click on Delete an event 'delete-id' is emmited to the parent, and click on Save an event 'save-id' is emmited to parent",
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

        editcustomer.customer_id = uuid_test;
        editcustomer.passkey = passkey_test;
        editcustomer.user_name = user_name_test;

        const propsData = {
          dialogdata: editcustomer,
        };
        wrapper = mount(ComponentToTest, {
          store,
          propsData,
          localVue,
        });

        const target_input_field_uuid = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_alphanumeric_id
        );
        const target_error_message_uuid = wrapper.find(
          "#input-widget-feedback-" + selector_id_suffix_alphanumeric_id
        );
        target_input_field_uuid.setValue(uuid_test);
        await wrapper.vm.$nextTick();

        expect(target_error_message_uuid.text()).toStrictEqual(invalid_uuid);

        const target_input_field_passkey = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_passkey_id
        );
        const target_error_message_passkey = wrapper.find(
          "#input-widget-feedback-" + selector_id_suffix_passkey_id
        );
        target_input_field_passkey.setValue(passkey_test);
        await wrapper.vm.$nextTick();

        expect(target_error_message_passkey.text()).toStrictEqual(invalid_passkey);

        const target_input_field_user_name = wrapper.find(
          "#input-widget-field-" + selector_id_suffix_user_name
        );
        const target_error_message_user_name = wrapper.find(
          "#input-widget-feedback-" + selector_id_suffix_user_name
        );
        target_input_field_user_name.setValue(user_name_test);
        await wrapper.vm.$nextTick();

        expect(target_error_message_user_name.text()).toStrictEqual(invalid_user_name);

        const target_button_label_btn = wrapper.findAll(".span__button_label");
        const cancel_btn = target_button_label_btn.at(0);
        expect(cancel_btn.attributes().style).toContain("color: rgb(255, 255, 255);");
        const delete_btn = target_button_label_btn.at(1);
        expect(delete_btn.attributes().style).toContain("color: rgb(255, 255, 255);");
        const save_btn = target_button_label_btn.at(2);
        expect(save_btn.attributes().style).toContain(save_btn_css);

        await cancel_btn.trigger("click");
        await wrapper.vm.$nextTick();
        const cancel_id_events = wrapper.emitted("cancel-id");
        expect(cancel_id_events).toHaveLength(1);
        expect(cancel_id_events[0]).toStrictEqual([]);

        await delete_btn.trigger("click");
        await wrapper.vm.$nextTick();

        const delete_id_events = wrapper.emitted("delete-id");
        expect(delete_id_events).toHaveLength(1);

        await save_btn.trigger("click");
        await wrapper.vm.$nextTick();

        const save_id_events = wrapper.emitted("save-id");
        expect(save_id_events).toHaveLength(1);
        expect(save_id_events[0]).toStrictEqual([
          {
            customer_id: uuid_test,
            user_password: passkey_test,
            user_name: user_name_test,
          },
        ]);
      }
    );
  });
});
