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
  test("Given that the radio buttons are rendered in a sequence, When a click-select of radio button occurs, Then an event 'radio-btn-selected' with index and name of the radio button is emitted", async () => {
    const propsData = {
      radio_buttons: ["warm", "cold"],
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_radio_btn = wrapper.findAll("input[type='radio']");
    target_radio_btn.at(1).setChecked(true);
    await target_radio_btn.at(1).trigger("change");
    // manually force Vue to update
    const parent_id_events = wrapper.emitted("radio-btn-selected");
    expect(parent_id_events).toHaveLength(1);
    expect(parent_id_events).toStrictEqual([
      [
        {
          index: 1,
          name: "cold",
        },
      ],
    ]);
  });
  test("Given that there is a pre-selected radio button, When the RadioButtonWidget is mounted, Then the state of the pre-selected radio button is `selected`", async () => {
    const propsData = {
      radio_buttons: ["warm", "cold"],
      pre_selected: 1,
    };

    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_radio_btn = wrapper.findAll("input[type='radio']");

    expect(target_radio_btn.at(1).element.checked).toBeTruthy();
  });
});
