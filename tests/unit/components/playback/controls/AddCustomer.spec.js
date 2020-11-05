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
