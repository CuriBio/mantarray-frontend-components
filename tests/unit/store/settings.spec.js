import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { settings_store_module } from "@/dist/mantarray.common";
import * as axios_helpers from "../../../js_utils/axios_helpers.js";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");

describe("store/settings", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;
  let mocked_axios;

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    mocked_axios = new MockAxiosAdapter(axios);
  });
  afterEach(async () => {
    mocked_axios.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("When initialized, Then the user_accounts is an empty with no value assigned", () => {
    const array_of_user_accounts = store.state.settings.user_accounts;
    expect(array_of_user_accounts).toHaveLength(0);
  });
  test("When initialized, Then the user_accounts when accessed via settings_store_module is an empty with no value assigned", () => {
    const array_of_user_accounts = settings_store_module.state().user_accounts;
    expect(array_of_user_accounts).toHaveLength(0);
  });
  test("When initialized, Then the file_count and total_file_count is zero 0 as with no value assigned", () => {
    const value = store.state.settings.file_count;
    const max = store.state.settings.total_file_count;
    expect(value).toStrictEqual(0);
    expect(max).toStrictEqual(0);
  });
  test("When initialized the array of user_accounts is empty and size 0, Then commit a single valid user_account as the first record in user_accounts, active_user_index/active_user_index and assert the same", () => {
    const array_of_user_accounts = [
      {
        customer_id: "4vqyd62oARXqj9nRUNhtLQ",
        user_password: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_name: "User account -1",
      },
    ];
    expect(store.state.settings.user_accounts).toHaveLength(0);
    store.commit("settings/set_user_accounts", array_of_user_accounts);
    store.commit("settings/set_active_user_index", 0);
    expect(
      store.state.settings.user_accounts[store.state.settings.active_user_index].customer_id
    ).toStrictEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(
      store.state.settings.user_accounts[store.state.settings.active_user_index].user_password
    ).toStrictEqual("941532a0-6be1-443a-a9d5-d57bdf180a52");
    expect(
      store.state.settings.user_accounts[store.state.settings.active_user_index].user_name
    ).toStrictEqual("User account -1");
  });
  test("When initialized the array of user_accounts is empty and size 0, Then commit an array of customer details in user_accounts and assert the number of customer records", () => {
    const array_of_user_accounts = [
      {
        customer_id: "4vqyd62oARXqj9nRUNhtLQ",
        user_password: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_name: "User account -1",
      },
      {
        customer_id: "6cBaidlJ84Ggc5JA7IYCgv",
        user_password: "941532a0-6be1-443a-cdee-d57bdf180a52",
        user_name: "User account -1",
      },
    ];
    expect(store.state.settings.user_accounts).toHaveLength(0);
    store.commit("settings/set_user_accounts", array_of_user_accounts);
    expect(store.state.settings.user_accounts).toHaveLength(2);
  });
  test("Given the store has multiple customer details, When the mutation deletes one Customer details, Then validate the number of the customer decrements by one", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit Customer)       |    -------- >  ======================== */
    /* |                        |                | EditUser.vue      | */
    /* |                        |    < --------  |  (Delete ID)         | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */

    const array_of_user_accounts = [
      {
        customer_id: "4vqyd62oARXqj9nRUNhtLQ",
        user_password: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_name: "User account -1",
      },
      {
        customer_id: "6cBaidlJ84Ggc5JA7IYCgv",
        user_password: "941532a0-6be1-443a-cdee-d57bdf180a52",
        user_name: "User account -2",
      },
    ];
    expect(store.state.settings.user_accounts).toHaveLength(0);
    store.commit("settings/set_user_accounts", array_of_user_accounts);

    /* User now does Edit Customer Click on the "User account - 1*/
    store.commit("settings/set_active_user_index", 0);
    const current_focus_customerid = store.state.settings.user_accounts[0];
    expect(current_focus_customerid.user_name).toStrictEqual("User account -1");
    expect(current_focus_customerid.customer_id).toStrictEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(current_focus_customerid.user_password).toStrictEqual("941532a0-6be1-443a-a9d5-d57bdf180a52");
    /*  (Delete ID) selected */
    const current_customerids = store.state.settings.user_accounts;
    const focus_active_user_index = store.state.settings.active_user_index;
    /* Javascript array provides an internal api array.splice(idx,1)  so we delete object in array and store in Vuex*/
    current_customerids.splice(focus_active_user_index, 1);
    /*  (SaveChanges) selected */
    store.commit("settings/set_user_accounts", current_customerids);
    const updated_focus_customerid = store.state.settings.user_accounts[0];
    expect(updated_focus_customerid.customer_id).toStrictEqual("6cBaidlJ84Ggc5JA7IYCgv");
    expect(updated_focus_customerid.user_password).toStrictEqual("941532a0-6be1-443a-cdee-d57bdf180a52");
    expect(updated_focus_customerid.user_name).toStrictEqual("User account -2");
    expect(store.state.settings.user_accounts).toHaveLength(1);
  });
  test("When a user resets the settings form, Then the mutation will only reset current selection and toggle switches and will not reset existing IDs", async () => {
    const array_of_user_accounts = [
      {
        customer_id: "4vqyd62oARXqj9nRUNhtLQ",
        user_password: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_name: "User account -1",
      },
    ];

    store.commit("settings/set_user_accounts", array_of_user_accounts);
    expect(store.state.settings.user_accounts).toHaveLength(1);
    store.commit("settings/set_active_user_index", 0);

    store.commit("settings/set_auto_upload", true);
    store.commit("settings/set_auto_delete", true);

    await store.commit("settings/reset_to_default");

    expect(store.state.settings.user_accounts).toHaveLength(1);
    expect(store.state.settings.auto_delete).toBe(false);
    expect(store.state.settings.auto_upload).toBe(false);
    expect(store.state.settings.active_user_index).toBeNull();
  });

  test("When the app is created and the user's log path is committed, Then the base downloads path also gets updated with user_name", async () => {
    const test_win_path = "C:\\Users\\CuriBio\\TestPath";
    const expected_win_base_path = "C:\\Users\\CuriBio\\Downloads";

    store.commit("settings/set_log_path", test_win_path);

    const { log_path, root_downloads_path } = store.state.settings;
    expect(log_path).toBe(test_win_path);
    expect(root_downloads_path).toBe(expected_win_base_path);

    const test_path = "/Users/CuriBio/TestPath";
    const expected_downloads_base_path = "C:\\Users\\CuriBio\\Downloads";

    store.commit("settings/set_log_path", test_path);

    expect(store.state.settings.log_path).toBe(test_path);
    expect(store.state.settings.root_downloads_path).toBe(expected_downloads_base_path);
  });

  test("When an failed upload status gets sent on startup, Then the the file will get added to state and total file count will automatically increase", async () => {
    const test_filename = "test_file";
    store.commit("settings/set_file_count");
    store.commit("settings/set_file_name", test_filename);
    store.commit("settings/set_upload_error", true);

    const { total_file_count, total_uploaded_files, upload_error } = store.state.settings;
    expect(total_file_count).toBe(1);
    expect(total_uploaded_files[0]).toBe(test_filename);
    expect(upload_error).toBe(true);
  });
  describe("settings/actions", () => {
    test("When a user wants to save user credentials in settings, Then the vuex action to update settings will send axios request", async () => {
      jest.spyOn(axios_helpers, "call_axios_get_from_vuex").mockImplementation(() => {
        return {
          status: 200,
        };
      });

      const array_of_user_accounts = [
        {
          customer_id: "4vqyd62oARXqj9nRUNhtLQ",
          user_password: "941532a0-6be1-443a-a9d5-d57bdf180a52",
          user_name: "User account -1",
        },
      ];

      store.commit("settings/set_user_accounts", array_of_user_accounts);
      store.commit("settings/set_active_user_index", 0);

      const { status } = await store.dispatch("settings/update_settings");
      expect(status).toBe(200);
    });
    test.each([true, false])(
      "When a user confirms whether or not they want to proceed with a FW update, Then that decision is sent to the BE",
      async (decision) => {
        const post_spy = jest.spyOn(axios_helpers, "call_axios_post_from_vuex").mockImplementation(() => {
          return {
            status: 200,
          };
        });

        const { status } = await store.dispatch("settings/send_firmware_update_confirmation", decision);
        expect(status).toBe(200);
        expect(post_spy).toHaveBeenCalledWith(`/firmware_update_confirmation?update_accepted=${decision}`);
      }
    );
    test("When a user selects Select Files to start a new data analysis, Then a request to the BE is made returning list of local directories and root path", async () => {
      const get_url = "http://localhost:4567/get_recordings";
      const test_recordings = {
        recordings_list: ["rec_1", "rec_2", "rec_3"],
        root_recording_path: "C\\test\\recording\\path\\",
      };

      const spied_helper = jest.spyOn(axios_helpers, "call_axios_get_from_vuex");
      mocked_axios.onGet(get_url).reply(200, test_recordings);

      await store.dispatch("settings/get_recording_dirs");

      expect(store.state.settings.recordings_list).toStrictEqual(test_recordings.recordings_list);
      expect(spied_helper).toHaveBeenCalledWith(get_url);
    });
  });
  describe("settings/mutations", () => {
    test.each([true, false])(
      "When set_firmware_update_available is commited, Then firmware_update_dur_mins is updated accordingly",
      (channel) => {
        const update_info = { channel_fw_update: channel };
        store.commit("settings/set_firmware_update_available", update_info);
        expect(store.state.settings.firmware_update_dur_mins).toStrictEqual(channel ? 5 : 1);
      }
    );
    test.each([true, false])(
      "When set_firmware_update_available is commited, Then firmware_update_available is updated accordingly",
      (update) => {
        const update_info = { firmware_update_available: update };
        store.commit("settings/set_firmware_update_available", update_info);
        expect(store.state.settings.firmware_update_available).toStrictEqual(update);
      }
    );
  });
});
