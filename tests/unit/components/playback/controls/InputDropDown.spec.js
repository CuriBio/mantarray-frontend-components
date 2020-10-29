import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/InputDropDown.vue";
import { InputDropDown as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;

describe("InputDropDown.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting InputDropDown from the build dist file, Then it loads successfully and the props defined title is rendered", () => {
    const nicknames = [
      "Customer Account 1",
      "Customer Account 2",
      "Customer Account 3",
    ];
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__input-dropdown-content-label");

    expect(target_span.text()).toStrictEqual("Customer ID");
  });
  test("When the PopInput is mounted, Then it loads successfully and the props defined placeholder is rendered on input field", () => {
    const nicknames = [
      "Customer Account 1",
      "Customer Account 2",
      "Customer Account 3",
    ];
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
      placeholder: "Select Customer ID",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_input = wrapper.find("#input-dropdown-widget");
    expect(target_input.attributes().placeholder).toStrictEqual(
      "Select Customer ID"
    );
  });
});
