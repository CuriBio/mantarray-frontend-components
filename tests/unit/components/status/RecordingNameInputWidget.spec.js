import RecordingNameInputWidget from "@/components/status/RecordingNameInputWidget.vue";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueAxios, axios);
let NuxtStore;
let store;

describe("RecordingNameInputWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    jest.restoreAllMocks();
  });

  afterEach(() => wrapper.destroy());

  test("When RecordingNameInputWidget is mounted, Then the correct labels will be rendered", () => {
    const propsData = { default_recording_name: "test_recording_name" };
    wrapper = mount(RecordingNameInputWidget, {
      propsData,
      store,
      localVue,
    });
    expect(wrapper.find(".span__recording-name-input-label").text()).toStrictEqual("Important!");
    expect(wrapper.find("#input-widget-field-recording-name").element.value).toStrictEqual(
      propsData.default_recording_name
    );
    expect(wrapper.find("#input-widget-feedback-recording-name").text()).toStrictEqual("");
  });
  test("When input field is empty, Then the error message with say 'Please enter a name'", async () => {
    const propsData = { default_recording_name: "test_recording_name" };
    wrapper = mount(RecordingNameInputWidget, {
      propsData,
      store,
      localVue,
    });
    const error_msg = wrapper.find("#input-widget-feedback-recording-name");
    const input_widget = wrapper.find("#input-widget-field-recording-name");

    input_widget.element.value = "";
    await input_widget.trigger("input");
    expect(error_msg.text()).toStrictEqual("Please enter a name");

    input_widget.element.value = "new_name";
    await input_widget.trigger("input");
    expect(error_msg.text()).toStrictEqual("");
  });
  test.each([true, false])(
    "When an error message is present, Then a user will not be able to confirm the new name",
    async (beta_2_mode) => {
      const propsData = { default_recording_name: "test_recording_name" };
      wrapper = mount(RecordingNameInputWidget, {
        propsData,
        store,
        localVue,
      });

      await store.commit("settings/set_beta_2_mode", beta_2_mode);

      const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
      const error_msg = wrapper.find("#input-widget-feedback-recording-name");
      const input_widget = wrapper.find("#input-widget-field-recording-name");
      const button_widget = wrapper.findAll(".span__button-label").at(0);

      input_widget.element.value = "";
      await input_widget.trigger("input");
      expect(error_msg.text()).toStrictEqual("Please enter a name");

      await button_widget.trigger("click");
      expect(wrapper.vm.is_enabled).toBe(false);
      expect(action_spy).toHaveBeenCalledTimes(0);

      input_widget.element.value = "new_name";
      await input_widget.trigger("input");
      expect(error_msg.text()).toStrictEqual("");

      await button_widget.trigger("click");
      expect(wrapper.vm.is_enabled).toBe(true);
      expect(action_spy).toHaveBeenCalledTimes(1);
    }
  );

  test("When a 403 status code gets returned when checking if name already exists, Then new warning will pop up asking user to confirm", async () => {
    const propsData = { default_recording_name: "test_recording_name" };
    wrapper = mount(RecordingNameInputWidget, {
      propsData,
      store,
      localVue,
    });

    jest.spyOn(store, "dispatch").mockImplementation(() => 403);
    const input_widget = wrapper.find("#input-widget-field-recording-name");
    const button_widget = wrapper.findAll(".span__button-label").at(0);

    input_widget.element.value = "new_name";
    await input_widget.trigger("input");
    await button_widget.trigger("click");

    Vue.nextTick(() => {
      expect(wrapper.find(`#existing-recording-warning`).isVisible()).toBe(true);
    });
  });
  test.each([true, false])(
    "When a 200 status code gets returned when checking if name already exists, Then handle_confirmation is emitted to close modal and is_recording_snapshot_running updated correctly",
    async (beta_2_mode) => {
      const propsData = { default_recording_name: "test_recording_name" };
      wrapper = mount(RecordingNameInputWidget, {
        propsData,
        store,
        localVue,
      });

      await store.commit("settings/set_beta_2_mode", beta_2_mode);
      store.state.playback.is_recording_snapshot_running = false;

      jest.spyOn(store, "dispatch").mockImplementation(() => 200);
      const input_widget = wrapper.find("#input-widget-field-recording-name");
      const button_widget = wrapper.findAll(".span__button-label").at(0);

      input_widget.element.value = "new_name";
      await input_widget.trigger("input");
      await button_widget.trigger("click");

      expect(wrapper.emitted("handle_confirmation")).toStrictEqual([[]]);

      expect(store.state.playback.is_recording_snapshot_running).toBe(beta_2_mode);
    }
  );

  test("When component mounts, Then the recording snapshot toggle will be switched to what has been stored globally", async () => {
    const propsData = { default_recording_name: "test_recording_name" };
    wrapper = mount(RecordingNameInputWidget, {
      propsData,
      store,
      localVue,
    });

    const stored_state = store.state.settings.run_recording_snapshot_default;
    expect(stored_state).toBe(true);

    expect(wrapper.vm.run_recording_snapshot_current).toBe(stored_state);
  });

  test("When user toggles the recording snapshot switch, Then the correct value will be set in the store", async () => {
    const propsData = { default_recording_name: "test_recording_name" };
    wrapper = mount(RecordingNameInputWidget, {
      propsData,
      store,
      localVue,
    });

    await store.commit("settings/set_beta_2_mode", true);

    expect(wrapper.vm.run_recording_snapshot_current).toBe(true);
    jest.spyOn(store, "dispatch").mockImplementation(() => 200);

    // simulate user turning off feature
    await store.commit("settings/set_recording_snapshot_state", false);
    expect(wrapper.vm.run_recording_snapshot_current).toBe(false);

    const toggle_input = wrapper.find("#toggle_input_run_recording_snapshot_current");
    const button_widget = wrapper.findAll(".span__button-label");

    await toggle_input.trigger("click");
    await button_widget.at(2).trigger("click");

    expect(store.state.playback.is_recording_snapshot_running).toBe(true);
  });
  test("When a user chooses an existing recording name and wants to select a new name instead of overriding, Then warning modal will close and show error message for existing name", async () => {
    const propsData = { default_recording_name: "test_recording_name" };
    wrapper = mount(RecordingNameInputWidget, {
      propsData,
      store,
      localVue,
    });

    jest.spyOn(store, "dispatch").mockImplementation(() => 403);
    const input_widget = wrapper.find("#input-widget-field-recording-name");
    const button_widget = wrapper.findAll(".span__button-label");
    const error_msg = wrapper.find("#input-widget-feedback-recording-name");

    input_widget.element.value = "new_name";
    await input_widget.trigger("input");
    await button_widget.at(0).trigger("click");

    Vue.nextTick(() => {
      expect(wrapper.find(`#existing-recording-warning`).isVisible()).toBe(true);
    });

    await button_widget.at(1).trigger("click");
    expect(error_msg.text()).toStrictEqual("Name already exists");
  });

  test.each([true, false])(
    "When a user chooses an existing recording name and confirms to override existing recording, Then warning modal will close, emit closure to parent component, and set is_recording_snapshot_running correctly",
    async (beta_2_mode) => {
      const propsData = { default_recording_name: "test_recording_name" };
      wrapper = mount(RecordingNameInputWidget, {
        propsData,
        store,
        localVue,
      });

      await store.commit("settings/set_beta_2_mode", beta_2_mode);
      store.state.playback.is_recording_snapshot_running = false;

      jest.spyOn(store, "dispatch").mockImplementation(() => 403);
      const input_widget = wrapper.find("#input-widget-field-recording-name");
      const button_widget = wrapper.findAll(".span__button-label");

      input_widget.element.value = "new_name";
      await input_widget.trigger("input");
      await button_widget.at(0).trigger("click");

      Vue.nextTick(() => {
        expect(wrapper.find(`#existing-recording-warning`).isVisible()).toBe(true);
      });

      await button_widget.at(2).trigger("click");
      expect(wrapper.emitted("handle_confirmation")).toStrictEqual([[]]);

      expect(store.state.playback.is_recording_snapshot_running).toBe(beta_2_mode);
    }
  );
});
