import ToggleWidget from "@/components/basic_widgets/ToggleWidget.vue";
import { ToggleWidget as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount, mount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);

let NuxtStore;
let store;

describe("ToggleWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());

  test("When mounting ToggleWidget from the build dist file, Then it loads successfully and the slider is displayed and takes the default state passed down", () => {
    const propsData = {
      checked_state: true,
      label: "test_label",
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_switch_div = wrapper.find(".switch");
    expect(target_switch_div.isVisible()).toBe(true);
    expect(wrapper.vm.checked).toBe(true);
  });

  test("When a user toggles the slider, Then the new boolean value should be emitted to parent component with label and value", async () => {
    const propsData = {
      label: "test_label",
    };

    wrapper = mount(ToggleWidget, {
      propsData,
      store,
      localVue,
    });

    await wrapper.find("input").trigger("click");
    const toggle_event = wrapper.emitted("handle_toggle_state");
    expect(toggle_event[0]).toStrictEqual([true, propsData.label]);
  });

  test("When a user resets the toggle state in settings modal, Then the new props state will be applied to the checked data", async () => {
    const watch_spy = jest.spyOn(ToggleWidget.watch, "checked_state");

    const propsData = {
      label: "test_label",
      checked_state: false,
    };

    wrapper = mount(ToggleWidget, {
      propsData,
      store,
      localVue,
    });

    await wrapper.setProps({ checked_state: true });

    expect(wrapper.vm.checked).toBe(true);
    expect(watch_spy).toHaveBeenCalledWith(true, false);

    await wrapper.setProps({ checked_state: false });

    expect(wrapper.vm.checked).toBe(false);
    expect(watch_spy).toHaveBeenCalledWith(false, true);
  });
});
