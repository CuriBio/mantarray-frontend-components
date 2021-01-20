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
    const target_span = wrapper.find(".form-check-label > span");

    expect(target_span.text()).toStrictEqual("warm");
  });
  test("When mounted, Then it loads successfully multiple defined in props as array rendered in the sequence", () => {
    const propsData = {
      radio_buttons: ["warm", "cool", "blue/red", "purple/green"],
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.findAll(".form-check-label > span");

    expect(target_span.at(0).text()).toStrictEqual("warm");
    expect(target_span.at(1).text()).toStrictEqual("cool");
    expect(target_span.at(2).text()).toStrictEqual("blue/red");
    expect(target_span.at(3).text()).toStrictEqual("purple/green");
  });
  test("Given that the radio buttons are rendered in a sequence, When a click-select of radio button occurs, Then an event 'radio-btn-selected' with index of the radio button is emitted", async () => {
    const propsData = {
      radio_buttons: ["warm"],
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_radio_btn = wrapper.find("input");
    target_radio_btn.setChecked(true);
    target_radio_btn.trigger("change");
    // manually force Vue to update

    expect(wrapper.emitted().input).toStrictEqual([true]);
  });
});
