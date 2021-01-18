import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/RadioButtonWidget.vue";
import { RadioButtonWidget as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

let NuxtStore;
let store;

describe("RadioButtonWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting from the built dist file, Then it loads successfully and the props defined radio button text is rendered", () => {
    const propsData = {
      radio_buttons: ["warm"],
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".div__radio_selected");

    expect(target_span.text()).toStrictEqual("warm");
  });
  test("When mounting from the built dist file, Then it loads successfully and the props has multiple defined radio button text is rendered in the sequence", () => {
    const propsData = {
      radio_buttons: ["warm", "cool", "blue/red", "purple/green"],
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.findAll(".div__radio_selected");

    expect(target_span.at(0).text()).toStrictEqual("warm");
    expect(target_span.at(1).text()).toStrictEqual("cool");
    expect(target_span.at(2).text()).toStrictEqual("blue/red");
    expect(target_span.at(3).text()).toStrictEqual("purple/green");
  });
});
