import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/PopInput.vue";
import { PopInput as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import uuid from "@tofandel/uuid-base62";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.use(uuid);

let NuxtStore;
let store;

describe("popinput.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting popinput from the build dist file, Then it loads successfully and the props defined title is rendered", () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__popinput-content-label");

    expect(target_span.text()).toStrictEqual("Enter  Alphanumeric  ID"); // the value of &nbsp<wbr> is '\u00a0'
  });
  test("When mounting popinput from the build dist file, Then it loads successfully and the props defined placeholder is rendered on input field", () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      key_placeholder: "place holder",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_input = wrapper.find("#input-widget");
    expect(target_input.attributes().placeholder).toStrictEqual("place holder");
  });
  test("When mounting popinput, Then the user enters few charters in the input validate if this emits an event", async () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      key_placeholder: "place holder",
      user_key: "",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const uuidBase62 = "2VSckkBYH2An3dqHEyfRRE"; // proper uuidcode sent
    const input_widget = wrapper.find("#input-widget");
    input_widget.element.value = uuidBase62;
    await input_widget.trigger("input");
    const parent_id_events = wrapper.emitted("update:user_key");
    expect(parent_id_events).toHaveLength(2);
    expect(parent_id_events).toStrictEqual([[""], ["2VSckkBYH2An3dqHEyfRRE"]]);
    expect(wrapper.vm.inputenterykeyState).toStrictEqual(true);
  });
});
