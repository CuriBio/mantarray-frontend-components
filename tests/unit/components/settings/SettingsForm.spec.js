import { mount } from "@vue/test-utils";
import SettingsForm from "@/components/settings/SettingsForm.vue";
import { SettingsForm as DistComponentToTest } from "@/dist/mantarray.common";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const MockAxiosAdapter = require("axios-mock-adapter");
let mocked_axios;

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;

describe("SettingsForm.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    store.commit("settings/set_beta_2_mode", true);
    mocked_axios = new MockAxiosAdapter(axios);
  });

  afterEach(() => {
    mocked_axios.restore();
    jest.resetAllMocks();
    wrapper.destroy();
  });

  const test_user_account = {
    password: "4vqyd62oARXqj9nRUNhtLQ",
    customer_id: "941532a0-6be1-443a-a9d5-d57bdf180a52",
    username: "User account -1",
  };

  test("When mounting SettingsForm from the build dist file, Then verify that it loads successfully", () => {
    const propsData = null;
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const target_span = wrapper.find(".span__settingsform-title");
    const save_changes = wrapper.find(".span__settings-tool-tip-save-btn-txt-disable");
    const login = wrapper.find(".span__settings-tool-tip-login-btn-txt-disable");

    expect(target_span.text()).toStrictEqual("User Settings");
    expect(save_changes.isVisible()).toBe(true);
    expect(login.isVisible()).toBe(true);
  });

  describe("Given a user is logged in", () => {
    beforeEach(() => {
      store.commit("settings/set_user_account", { ...test_user_account });
      mocked_axios.onGet("http://localhost:4567/update_settings").reply(204, {});
    });

    test("When mounting SettingsForm from the build dist file, Then verify that it loads successfully", () => {
      const propsData = null;
      wrapper = mount(SettingsForm, {
        propsData,
        store,
        localVue,
      });

      const logging_in_text = wrapper.find(".div__logged_in_text");
      const disabled_tooltips = wrapper.findAll(".div__tooltip-container");
      const save_changes = wrapper.find(".span__settings-tool-tip-save-btn-txt-enable");

      expect(logging_in_text.isVisible()).toBe(true);
      expect(disabled_tooltips).toHaveLength(0);
      expect(save_changes.isVisible()).toBe(true);
    });

    test("When a user wants to save settings and there is no error sending request, Then the modal close", async () => {
      wrapper = mount(SettingsForm, {
        store,
        localVue,
      });
      expect(store.state.settings.run_recording_snapshot_default).toBe(true);
      expect(store.state.settings.auto_upload).toBe(false);

      await wrapper.find("#toggle_input_recording_snapshot").trigger("click");
      await wrapper.find("#toggle_input_auto_upload").trigger("click");
      await wrapper.find(".span__settings-tool-tip-save-btn-txt-enable").trigger("click");

      expect(wrapper.vm.user_settings.auto_upload).toBe(true);
      expect(store.state.settings.run_recording_snapshot_default).toBe(false);

      const close_event = wrapper.emitted("close_modal");
      expect(close_event[0]).toStrictEqual([true]);
    });

    test.each([
      ["recording_snapshot", true],
      ["auto_upload", false],
    ])(
      "When a user toggles the setting for %s, Then state saves under user_settings",
      async (setting, state) => {
        wrapper = mount(SettingsForm, {
          store,
          localVue,
        });
        expect(wrapper.vm.user_settings[setting]).toBe(state);
        await wrapper.find(`#toggle_input_${setting}`).trigger("click");
        expect(wrapper.vm.user_settings[setting]).toBe(!state);
      }
    );

    test("When the job_limit_reached gets updated to true, Then the auto_upload checkbox state will auto switch to the opposite state", async () => {
      wrapper = mount(SettingsForm, {
        store,
        localVue,
      });

      wrapper.vm.user_settings.auto_upload = true;
      await store.commit("settings/set_job_limit_reached", true);
      expect(wrapper.vm.user_settings.auto_upload).toBe(false);
    });

    test("When user selects pulse3d version from the dropdown, Then the pulse3d_focus_idx will get updated to selected version index", async () => {
      wrapper = mount(SettingsForm, {
        store,
        localVue,
      });
      expect(wrapper.vm.user_settings.pulse3d_focus_idx).toBe(0);

      store.commit("settings/set_pulse3d_versions", ["12.34.56", "0.24.6", "1.0.0"]);
      await wrapper.find(".div__small-dropdown-controls-content-widget").trigger("click");
      await wrapper.find("#pulse3d_version_1").trigger("click");

      expect(wrapper.vm.user_settings.pulse3d_focus_idx).toBe(1);
    });

    test("When a user clicks close to hide modal, Then the state in vuex repopulates user settings", async () => {
      wrapper = mount(SettingsForm, {
        store,
        localVue,
      });

      expect(wrapper.vm.user_settings.pulse3d_focus_idx).toBe(0);
      expect(wrapper.vm.user_settings.auto_upload).toBe(false);
      expect(wrapper.vm.user_settings.auto_delete).toBe(false);
      expect(wrapper.vm.user_settings.recording_snapshot).toBe(true);

      store.commit("settings/set_pulse3d_versions", ["12.34.56", "0.24.6", "1.0.0"]);
      store.commit("settings/set_auto_upload", true);
      store.commit("settings/set_auto_delete", true);
      store.commit("settings/set_pulse3d_version_selection_index", 1);
      store.commit("settings/set_recording_snapshot_state", false);

      await wrapper.find(".div__settings-tool-tip-cancel-btn").trigger("click");

      expect(wrapper.vm.user_settings.pulse3d_focus_idx).toBe(1);
      expect(wrapper.vm.user_settings.auto_upload).toBe(true);
      expect(wrapper.vm.user_settings.auto_delete).toBe(true);
      expect(wrapper.vm.user_settings.recording_snapshot).toBe(false);
    });
  });
});
