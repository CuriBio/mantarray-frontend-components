import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/AddCustomer.vue";
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
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.use(uuid);

let NuxtStore;
let store;

describe("AddCustomer.vue", () => {
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
  });
  test("When mounting AddCustomer from the build dist file, Then it loads successfully and the `Add Customer` defined title text is rendered", () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const target_span = wrapper.find(
      ".span__addcustomer-form-controls-content-title"
    );

    expect(target_span.text()).toStrictEqual("Add New Customer Account ID");
  });
});

describe("AddCustomer.enter_uuidbase57", () => {
  const uuid_base57 = "2VSckkBYr2An3dqHEyfRRE";
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    store = await NuxtStore.createStore();
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

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
      "",
    ],
    [
      "0VSckkBYH2An3dqHEyfRRE",
      "contains zero (0)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "The entered ID has an invalid character 0,",
    ],
    [
      "2VSckkBY2An3dqHEyfRRE",
      "is less than 22 characters",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "The entered ID is 21 characters. All valid IDs are exactly 22 characters.",
    ],
    [
      "2VSckkBY2An3dqHEyfRREab",
      "23 characters",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "The entered ID is 23 characters. All valid IDs are exactly 22 characters.",
    ],
    [
      "2VSckkBY12An3dqHEyfRRE",
      "contains  (1)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "The entered ID has an invalid character 1,",
    ],
    [
      "2VSIkkBYH2An3dqHEyfRRE",
      "contains capital (I)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "The entered ID has an invalid character I,",
    ],
    [
      "2VSskkBYH2An3dqHElfRRE",
      "contains  (l)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "The entered ID has an invalid character l,",
    ],
    [
      "2VSskkBYH2An3dqHEyfRRO",
      "contains  (O)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "The entered ID has an invalid character O,",
    ],
    [
      "4vqyd62oARXqj9nRUNhtLQ",
      "error in encoding",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "This combination of 22 characters is invalid encoded id",
    ],
    [
      "2VSckkBY-2An3dqHEyfRRE",
      "contains hypen (-)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "Entry permitted for Alphanumeric only",
    ],
    [
      "2VSckkBYº2An3dqHEyfRRE",
      "contains symbols (º)",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
      "Entry permitted for Alphanumeric only",
    ],
    [
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "valid input",
      "apikey-id",
      "validate_alphanumeric",
      "",
    ],
    [
      "06ad547f fe02-477b-9473-f7977e4d5e17",
      "missing hypen",
      "apikey-id",
      "validate_alphanumeric",
      "Wrong Format of API Key",
    ],
    [
      "06ad547f-fe02-477b-9473-f7977e4d5e1",
      "less than 36",
      "apikey-id",
      "validate_alphanumeric",
      "Wrong Format of API Key",
    ],
    [
      "06ad547f-fe02-477b-9473-f7977e4d5e14k",
      "more than 36",
      "apikey-id",
      "validate_alphanumeric",
      "Wrong Format of API Key",
    ],
    [
      "Experiment anemia -1",
      "valid input",
      "nickname-id",
      "validate_nickname",
      "",
    ],
    [
      "Cat * lab",
      "contains asterisk *",
      "nickname-id",
      "validate_nickname",
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /",
    ],
    [
      "Cat lab`",
      "contains left quote `",
      "nickname-id",
      "validate_nickname",
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /",
    ],
    [
      "Cat lab;",
      "contains semi-colon ;",
      "nickname-id",
      "validate_nickname",
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /",
    ],
    [
      "Experiment anemia alpha cells -1",
      "more than 20 characters",
      "nickname-id",
      "validate_nickname",
      "Invalid as its more than 20 charcters",
    ],
    ["C", "minimum one character C", "nickname-id", "validate_nickname", ""],
  ])(
    "When the text %s (%s) is entered into the field found with the selector ID %s, Then the correct text validation function (%s) is called and the error message from the validation function is rendered below the input in the DOM",
    async (
      entry,
      test_description,
      selector_id_suffix,
      text_validation_type,
      response_text
    ) => {
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

      expect(target_error_message.text()).toStrictEqual(response_text);
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
      propsData,
      store,
      localVue,
    });
    store = await NuxtStore.createStore();
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  afterEach(() => wrapper.destroy());

  test.each([
    [
      "0VSckkBYH2An3dqHEyfRRE",
      "The entered ID has an invalid character 0,",
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "",
      "Experiment anemia -1",
      "",
      "color: rgb(63, 63, 63); width: 250px; left: 250px;",
    ],
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "",
      "06ad547f fe02-477b-9473-f7977e4d5e17",
      "Wrong Format of API Key",
      "Experiment anemia -1",
      "",
      "color: rgb(63, 63, 63); width: 250px; left: 250px;",
    ],
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "",
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "",
      "Cat * lab",
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /",
      "color: rgb(63, 63, 63); width: 250px; left: 250px;",
    ],
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "",
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "",
      "Experiment anemia -1",
      "",
      "color: rgb(255, 255, 255); width: 250px; left: 250px;",
    ],
  ])(
    "Given an UUID, API Key, Nickname for 'Add Customer' as input, When the input contains based on valid the critera or failure, Then display of Label 'Save ID' is visible or greyed",
    async (
      uuid,
      invalid_uuid,
      apikey,
      invalid_apikey,
      nickname,
      invalid_nickname,
      save_btn_css
    ) => {
      const selector_id_suffix_alphanumeric_id = "alphanumeric-id";
      const selector_id_suffix_apikey_id = "apikey-id";
      const selector_id_suffix_nickname_id = "nickname-id";

      const spied_text_validator_uuid = jest.spyOn(
        TextValidation.prototype,
        "validate_uuidBase_fiftyseven_encode"
      );

      const spied_text_validator_api = jest.spyOn(
        TextValidation.prototype,
        "validate_alphanumeric"
      );

      const spied_text_validator_nickname = jest.spyOn(
        TextValidation.prototype,
        "validate_nickname"
      );

      const target_input_field_uuid = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_alphanumeric_id
      );
      const target_error_message_uuid = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix_alphanumeric_id
      );
      target_input_field_uuid.setValue(uuid);
      await Vue.nextTick();
      expect(spied_text_validator_uuid).toHaveBeenCalledWith(uuid);
      expect(target_error_message_uuid.text()).toStrictEqual(invalid_uuid);

      const target_input_field_apikey = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_apikey_id
      );
      const target_error_message_apikey = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix_apikey_id
      );
      target_input_field_apikey.setValue(apikey);
      await Vue.nextTick();
      expect(spied_text_validator_api).toHaveBeenCalledWith(apikey);
      expect(target_error_message_apikey.text()).toStrictEqual(invalid_apikey);

      const target_input_field_nickname = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_nickname_id
      );
      const target_error_message_nickname = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix_nickname_id
      );
      target_input_field_nickname.setValue(nickname);
      await Vue.nextTick();
      expect(spied_text_validator_nickname).toHaveBeenCalledWith(nickname);
      expect(target_error_message_nickname.text()).toStrictEqual(
        invalid_nickname
      );

      const target_button_label_btn = wrapper.findAll(".span__button_label");
      const cancel_btn = target_button_label_btn.at(0);
      expect(cancel_btn.attributes().style).toBe(
        "color: rgb(255, 255, 255); width: 250px; left: 0px;"
      );
      const save_btn = target_button_label_btn.at(1);
      expect(save_btn.attributes().style).toBe(save_btn_css);
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
      propsData,
      store,
      localVue,
    });
    store = await NuxtStore.createStore();
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  afterEach(() => wrapper.destroy());

  test.each([
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "",
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "",
      "Experiment anemia -1",
      "",
      "color: rgb(255, 255, 255); width: 250px; left: 250px;",
      1,
    ],
  ])(
    "Given an UUID, API Key, Nickname for 'Add Customer' as input, When the input contains based on valid the critera or failure, Then display of Label 'Save ID' is visible, click on Cancel, emitted event (value 0) and click on Save emitted event (value 1)",
    async (
      uuid,
      invalid_uuid,
      apikey,
      invalid_apikey,
      nickname,
      invalid_nickname,
      save_btn_css,
      label
    ) => {
      const selector_id_suffix_alphanumeric_id = "alphanumeric-id";
      const selector_id_suffix_apikey_id = "apikey-id";
      const selector_id_suffix_nickname_id = "nickname-id";

      const spied_text_validator_uuid = jest.spyOn(
        TextValidation.prototype,
        "validate_uuidBase_fiftyseven_encode"
      );

      const spied_text_validator_api = jest.spyOn(
        TextValidation.prototype,
        "validate_alphanumeric"
      );

      const spied_text_validator_nickname = jest.spyOn(
        TextValidation.prototype,
        "validate_nickname"
      );

      const spied_button_function = jest.spyOn(wrapper.vm, "clicked_button");

      const target_input_field_uuid = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_alphanumeric_id
      );
      const target_error_message_uuid = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix_alphanumeric_id
      );
      target_input_field_uuid.setValue(uuid);
      await Vue.nextTick();
      expect(spied_text_validator_uuid).toHaveBeenCalledWith(uuid);
      expect(target_error_message_uuid.text()).toStrictEqual(invalid_uuid);

      const target_input_field_apikey = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_apikey_id
      );
      const target_error_message_apikey = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix_apikey_id
      );
      target_input_field_apikey.setValue(apikey);
      await Vue.nextTick();
      expect(spied_text_validator_api).toHaveBeenCalledWith(apikey);
      expect(target_error_message_apikey.text()).toStrictEqual(invalid_apikey);

      const target_input_field_nickname = wrapper.find(
        "#input-widget-field-" + selector_id_suffix_nickname_id
      );
      const target_error_message_nickname = wrapper.find(
        "#input-widget-feedback-" + selector_id_suffix_nickname_id
      );
      target_input_field_nickname.setValue(nickname);
      await Vue.nextTick();
      expect(spied_text_validator_nickname).toHaveBeenCalledWith(nickname);
      expect(target_error_message_nickname.text()).toStrictEqual(
        invalid_nickname
      );

      const target_button_label_btn = wrapper.findAll(".span__button_label");
      const cancel_btn = target_button_label_btn.at(0);
      expect(cancel_btn.attributes().style).toBe(
        "color: rgb(255, 255, 255); width: 250px; left: 0px;"
      );
      const save_btn = target_button_label_btn.at(1);
      expect(save_btn.attributes().style).toBe(save_btn_css);

      await cancel_btn.trigger("click");
      await Vue.nextTick();
      expect(spied_button_function).toHaveBeenCalledWith(0);

      await save_btn.trigger("click");
      await Vue.nextTick();
      expect(spied_button_function).toHaveBeenCalledWith(label);

      const save_id_events = wrapper.emitted("save-id");
      expect(save_id_events).toHaveLength(1);
      expect(save_id_events[0]).toStrictEqual([
        {
          api_key: "06ad547f-fe02-477b-9473-f7977e4d5e17",
          cust_id: 0,
          nickname: "Experiment anemia -1",
          user_ids: [],
          uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        },
      ]);
    }
  );
});
