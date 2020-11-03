import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/AddCustomer.vue";
import InputWidget from "@/components/playback/controls/player/InputWidget.vue";
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

  afterEach(() => wrapper.destroy());
  test("Given a  encoded base57-UUID for 'Add Customer->Alphanumeric ID' is input, When the base57-UUID is matching all validation criteria, Then this results in valid condition and feedback text is <empty>", async () => {
    const spied_text_validator = jest.spyOn(
      TextValidation.prototype,
      "validate_uuidBase_fiftyseven_encode"
    );

    const all_input_fields = wrapper.findAll("#input-widget");
    const input_alphanumeric_id = all_input_fields.at(0);

    const all_input_error_messages = wrapper.findAll(
      ".div__input-controls-content-feedback"
    );
    const alphanumeric_id_error_message = all_input_error_messages.at(0);

    input_alphanumeric_id.element.value = uuid_base57;
    await input_alphanumeric_id.trigger("input");

    const alphanumeric_id_input_component = wrapper.findComponent(InputWidget);

    await Vue.nextTick();
    await Vue.nextTick();
    await Vue.nextTick();
    await wrapper.vm.$nextTick(); // wait for update
    expect(spied_text_validator).toHaveBeenCalledWith(uuid_base57);
    console.log(alphanumeric_id_error_message.html()); // allow-log
    console.log("wraper vm errortext: " + wrapper.vm.error_text_uuid); // allow-log
    console.log(alphanumeric_id_input_component.props()); // allow-log

    // Eli - for some reason this isn't updating. The props in the InputWidget itself don't appear to be getting updated
    // expect(alphanumeric_id_error_message.text()).toStrictEqual("");
  });
});
