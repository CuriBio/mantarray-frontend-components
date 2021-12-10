import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/basic_widgets/RadioButtonWidget.vue";
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
      radio_buttons: [{ value: "warm" }],
      pre_selected: 0,
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".custom-control-label > span");

    expect(wrapper.vm.selected).toBe("warm");
    expect(target_span.text()).toStrictEqual("warm");
  });
  test("When mounted, Then it loads successfully multiple defined in props as array rendered in the sequence", () => {
    const propsData = {
      radio_buttons: [{ value: "warm" }, { value: "cool" }, { value: "blue/red" }, { value: "purple/green" }],
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.findAll(".custom-control-label > span");

    expect(target_span.at(0).text()).toStrictEqual("warm");
    expect(target_span.at(1).text()).toStrictEqual("cool");
    expect(target_span.at(2).text()).toStrictEqual("blue/red");
    expect(target_span.at(3).text()).toStrictEqual("purple/green");
  });
  test("Given that the radio buttons are rendered in a sequence, When a click-select of radio button occurs, Then an event 'radio-btn-selected' with index and name of the radio button is emitted", async () => {
    const propsData = {
      radio_buttons: [{ value: "warm" }, { value: "cold" }],
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
  test("When parent component resets to a pre-selected idx of 0, Then preselect functions gets called and selects radio button at index 0", async () => {
    const pre_select_spy = jest.spyOn(ComponentToTest.methods, "preselect");

    const propsData = {
      radio_buttons: [{ value: "warm" }, { value: "cool" }, { value: "blue/red" }, { value: "purple/green" }],
      pre_selected: 2,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });

    expect(wrapper.vm.selected).toBe("blue/red");
    expect(pre_select_spy).toHaveBeenCalledTimes(1);

    wrapper.setProps({ pre_selected: 0 });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.selected).toBe("warm");
    expect(pre_select_spy).toHaveBeenCalledTimes(2);
  });
});
