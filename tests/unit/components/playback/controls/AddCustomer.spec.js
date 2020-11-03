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
    ],
    [
      "abcdFEG",
      "too short of input",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
    [
      "abc!",
      "input contains invalid character",
      "alphanumeric-id",
      "validate_uuidBase_fiftyseven_encode",
    ],
  ])(
    "When the text %s (%s) is entered into the field found with the selector ID %s, Then the correct text validation function (%s) is called and the error message from the validation function is rendered below the input in the DOM",
    async (
      entry,
      test_description,
      selector_id_suffix,
      text_validation_type
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

      expect(target_error_message.text()).toStrictEqual(
        spied_text_validator.mock.results[0].value
      );
    }
  );
});
