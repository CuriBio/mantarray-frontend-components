import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/EditUser.vue";
import { EditUser as DistComponentToTest } from "@/dist/mantarray.common";

import Vue from "vue";

import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import uuid from "@tofandel/uuid-base62";
import { TextValidation } from "@/js_utils/text_validation.js";
let wrapper = null;

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(uuid);

describe("EditUser.vue", () => {
  const edituser = {
    uuid: "",
    nickname: "",
  };
  beforeEach(async () => {
    const propsData = {
      dialogdata: edituser,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
  });
  test("When mounting EditUser from the build dist file, Then it loads successfully and the `Edit User` defined title text is rendered", () => {
    const propsData = {
      dialogdata: edituser,
      dataindex: 0,
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      // store,
      localVue,
    });

    const target_span = wrapper.find(
      ".span__edituser-form-controls-content-title"
    );
    expect(target_span.text()).toStrictEqual("Edit User ID");
  });
});

describe("EditUser.enter_uuidbase57", () => {
  const uuid_base57 = "2VSckkBYr2An3dqHEyfRRE";
  const edituser = {
    uuid: "",
    nickname: "",
  };
  afterEach(() => {
    wrapper.destroy();
    jest.restoreAllMocks();
  });
  test.each([
    [
      uuid_base57,
      "valid input",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "0VSckkBYH2An3dqHEyfRRE",
      "contains zero (0)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "2VSckkBY2An3dqHEyfRRE",
      "is less than 22 characters",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "2VSckkBY2An3dqHEyfRREab",
      "23 characters",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "2VSckkBY12An3dqHEyfRRE",
      "contains  (1)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "2VSIkkBYH2An3dqHEyfRRE",
      "contains capital (I)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "2VSskkBYH2An3dqHElfRRE",
      "contains  (l)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "2VSskkBYH2An3dqHEyfRRO",
      "contains  (O)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "4vqyd62oARXqj9nRUNhtLQ",
      "error in encoding",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "2VSckkBY-2An3dqHEyfRRE",
      "contains hypen (-)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "2VSckkBYº2An3dqHEyfRRE",
      "contains symbols (º)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    ["Experiment anemia -1", "valid input", "nickname-id", "validate_nickname"],
    ["Cat * lab", "contains asterisk *", "nickname-id", "validate_nickname"],
    ["Cat lab`", "contains left quote `", "nickname-id", "validate_nickname"],
    ["Cat lab;", "contains semi-colon ;", "nickname-id", "validate_nickname"],
    [
      "Experiment anemia alpha cells -1",
      "more than 20 characters",
      "nickname-id",
      "validate_nickname",
    ],
    ["C", "minimum one character C", "nickname-id", "validate_nickname", ""],
  ])(
    "When the text %s (%s) is entered into the field found with the selector ID %s, Then the correct text validation function (%s) is called and the error message from the validation function is rendered below the input in the DOM",
    async (
      entry,
      test_description,
      selector_id_suffix,
      text_validation_type
    ) => {
      if (text_validation_type === "validate_uuidBase_fiftyseven_encode") {
        edituser.uuid = entry;
      }
      if (text_validation_type === "validate_nickname") {
        edituser.nickname = entry;
      }

      const propsData = {
        dialogdata: edituser,
        dataindex: 0,
      };
      wrapper = mount(ComponentToTest, {
        propsData,
        localVue,
      });

      const spied_text_validator = jest.spyOn(
        TextValidation.prototype,
        text_validation_type
      );

      const target_input_field = wrapper.find(
        "#input-widget-field-" + selector_id_suffix
      );

      const target_error_message = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix
      );

      target_input_field.setValue(entry);

      await Vue.nextTick();
      expect(spied_text_validator).toHaveBeenCalledWith(entry);

      expect(target_error_message.text()).toStrictEqual(
        spied_text_validator.mock.results[0].value
      );
    }
  );
  test.each([
    ["alphanumeric-id", "This field is required"],
    ["nickname-id", "This field is required"],
  ])(
    "Given some nonsense value in the input field with the DOM Id suffix %s, When the input field is updated to be a blank value, Then the error message below the text in the DOM matches what the business logic dictates (%s)",
    async (selector_id_suffix, expected_message) => {
      const propsData = {
        dialogdata: edituser,
        dataindex: 0,
      };
      wrapper = mount(ComponentToTest, {
        propsData,
        localVue,
      });

      const target_input_field = wrapper.find(
        "#input-widget-field-" + selector_id_suffix
      );
      const target_error_message = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix
      );
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

describe("EditUser.enable_save_button", () => {
  afterEach(() => wrapper.destroy());
  test.each([
    [
      "0VSckkBYH2An3dqHEyfRRE",
      "Experiment anemia -1",
      "color: rgb(63, 63, 63);",
    ],
    ["5FY8KwTsQaUJ2KzHJGetfE", "Cat * lab", "color: rgb(63, 63, 63);"],
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "Experiment anemia -1",
      "color: rgb(255, 255, 255);",
    ],
  ])(
    "Given an UUID (%s), Nickname (%s) for 'Edit User' as input, When the input contains based on valid the critera or failure, Then display of Label 'Save ID' is visible or greyed (%s)",
    async (uuid, nickname, save_btn_css) => {
      const selector_id_suffix_alphanumeric_id = "alphanumeric-id";
      const selector_id_suffix_nickname_id = "nickname-id";

      const edituser = {
        uuid: "",
        nickname: "",
      };

      edituser.uuid = uuid;
      edituser.nickname = nickname;

      const propsData = {
        dialogdata: edituser,
        dataindex: 0,
      };
      wrapper = mount(ComponentToTest, {
        propsData,
        localVue,
      });
      const target_input_field_uuid = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_alphanumeric_id
      );
      target_input_field_uuid.setValue(uuid);
      await Vue.nextTick();
      const target_input_field_nickname = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_nickname_id
      );
      target_input_field_nickname.setValue(nickname);
      await Vue.nextTick();

      const target_button_label_btn = wrapper.findAll(".span__button_label");
      const cancel_btn = target_button_label_btn.at(0);
      expect(cancel_btn.attributes().style).toContain(
        "color: rgb(255, 255, 255);"
      );
      const delete_btn = target_button_label_btn.at(1);
      expect(delete_btn.attributes().style).toContain(
        "color: rgb(255, 255, 255);"
      );
      const save_btn = target_button_label_btn.at(2);
      expect(save_btn.attributes().style).toContain(save_btn_css);
    }
  );
});

describe("EditUser.clicked_button", () => {
  afterEach(() => wrapper.destroy());
  test.each([
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "Experiment anemia -1",
      "",
      "",
      "color: rgb(255, 255, 255);",
      2,
    ],
  ])(
    "Given an UUID(%s) ,  Nickname(%s) for 'Edit User' as input, When the input contains based on valid the critera or failure %s %s, Then display of Label 'Save ID' is visible %s, click on Cancel, an event 'cancel-id' is emmited to the parent, click on Delete an event 'delete-id' is emmited to the parent, and click on Save an event 'save-id' is emmited to parent",
    async (
      uuid_test,
      nickname_test,
      invalid_uuid,
      invalid_nickname,
      save_btn_css
    ) => {
      const selector_id_suffix_alphanumeric_id = "alphanumeric-id";
      const selector_id_suffix_nickname_id = "nickname-id";

      const edituser = {
        uuid: "",
        nickname: "",
      };

      edituser.uuid = uuid_test;
      edituser.nickname = nickname_test;

      const propsData = {
        dialogdata: edituser,
        dataindex: 0,
      };
      wrapper = mount(ComponentToTest, {
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
      await Vue.nextTick();

      expect(target_error_message_uuid.text()).toStrictEqual(invalid_uuid);

      const target_input_field_nickname = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_nickname_id
      );
      const target_error_message_nickname = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix_nickname_id
      );
      target_input_field_nickname.setValue(nickname_test);
      await Vue.nextTick();

      expect(target_error_message_nickname.text()).toStrictEqual(
        invalid_nickname
      );

      const target_button_label_btn = wrapper.findAll(".span__button_label");
      const cancel_btn = target_button_label_btn.at(0);
      expect(cancel_btn.attributes().style).toContain(
        "color: rgb(255, 255, 255);"
      );
      const delete_btn = target_button_label_btn.at(1);
      expect(delete_btn.attributes().style).toContain(
        "color: rgb(255, 255, 255);"
      );
      const save_btn = target_button_label_btn.at(2);
      expect(save_btn.attributes().style).toContain(save_btn_css);

      await cancel_btn.trigger("click");
      await Vue.nextTick();
      const cancel_id_events = wrapper.emitted("cancel-id");
      expect(cancel_id_events).toHaveLength(1);
      expect(cancel_id_events[0]).toStrictEqual([]);

      await delete_btn.trigger("click");
      await Vue.nextTick();
      const delete_id_events = wrapper.emitted("delete-id");
      expect(delete_id_events).toHaveLength(1);
      expect(delete_id_events[0]).toStrictEqual([
        {
          user_id: 0,
          uuid: uuid_test,
          nickname: nickname_test,
        },
      ]);

      await save_btn.trigger("click");
      await Vue.nextTick();

      const save_id_events = wrapper.emitted("save-id");
      expect(save_id_events).toHaveLength(1);
      expect(save_id_events[0]).toStrictEqual([
        {
          user_id: 0,
          uuid: uuid_test,
          nickname: nickname_test,
        },
      ]);
    }
  );
});
