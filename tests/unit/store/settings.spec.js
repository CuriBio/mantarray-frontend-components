import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { settings_store_module } from "@/dist/mantarray.common";
import * as axios_helpers from "../../../js_utils/axios_helpers.js";

describe("store/settings", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });
  test("When initialized, Then the customer_account_ids is an empty with no value assigned", () => {
    const array_of_customerids = store.state.settings.customer_account_ids;
    expect(array_of_customerids).toHaveLength(0);
  });
  test("When initialized, Then the customer_account_ids when accessed via settings_store_module is an empty with no value assigned", () => {
    const array_of_customerids = settings_store_module.state().customer_account_ids;
    expect(array_of_customerids).toHaveLength(0);
  });
  test("When initialized, Then the file_count and total_file_count is zero 0 as with no value assigned", () => {
    const value = store.state.settings.file_count;
    const max = store.state.settings.total_file_count;
    expect(value).toStrictEqual(0);
    expect(max).toStrictEqual(0);
  });
  test("When initialized customer_details UUID, pass-key, customer name and user_details UUID, user_account_id is empty, Then commit customer_details with valid cust_idx, UUID, pass-key, customer name and user_details of user_id, UUID, user_account_id to the Vuex and assert the same", () => {
    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
    ];
    expect(store.state.settings.customer_details.cust_idx).toBeNull();
    expect(store.state.settings.customer_details.cust_id).toBeNull();
    expect(store.state.settings.customer_details.pass_key).toBeNull();
    expect(store.state.settings.customer_details.user_account_id).toBeNull();
    store.commit("settings/set_customer_details", array_of_customerids);
    expect(store.state.settings.customer_details[0].cust_idx).toStrictEqual(0);
    expect(store.state.settings.customer_details[0].cust_id).toStrictEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(store.state.settings.customer_details[0].pass_key).toStrictEqual(
      "941532a0-6be1-443a-a9d5-d57bdf180a52"
    );
    expect(store.state.settings.customer_details[0].user_account_id).toStrictEqual("Customer account -1");
  });
  test("When initialized the array of customer_account_ids is empty and size 0, Then commit a single valid record of customer_details as the first record in customer_account_ids, customer_index/user_index and assert the same", () => {
    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    expect(
      store.state.settings.customer_account_ids[store.state.settings.customer_index].cust_id
    ).toStrictEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(
      store.state.settings.customer_account_ids[store.state.settings.customer_index].pass_key
    ).toStrictEqual("941532a0-6be1-443a-a9d5-d57bdf180a52");
    expect(
      store.state.settings.customer_account_ids[store.state.settings.customer_index].user_account_id
    ).toStrictEqual("Customer account -1");
  });
  test("When initialized the array of customer_account_ids is empty and size 0, Then commit customer_details with multiple user_ids in customer_account_ids and assert the number of user_ids to match the number of user_ids", () => {
    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
    ];

    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
  });
  test("When initialized the array of customer_account_ids is empty and size 0, Then commit an array of customer details in customer_account_ids and assert the number of customer records", () => {
    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
      {
        cust_idx: 1,
        cust_id: "6cBaidlJ84Ggc5JA7IYCgv",
        pass_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    expect(store.state.settings.customer_account_ids).toHaveLength(2);
  });
  test("Given the store has multiple customer details, When the mutations adds new customer, Then validate the number of customer increments by one", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Add Customer)        |    -------- >  ======================== */
    /* |                        |                | AddCustomer.vue      | */
    /* |                        |    < --------  |  (Save ID)           | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */

    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
      {
        cust_idx: 1,
        cust_id: "6cBaidlJ84Ggc5JA7IYCgv",
        pass_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        user_account_id: "Customer account -2",
      },
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Add Customer Click  */
    const add_customer = [
      {
        cust_idx: 2,
        cust_id: "5FY8KwTsQaUJ2KzHJGetfE",
        pass_key: "941532a0-6be1-443a-ssds-d57bdf180a52",
        user_account_id: "Customer account -3",
      },
    ];
    store.commit("settings/set_customer_details", add_customer); /*  (Save ID) selected */
    const current_customerids = store.state.settings.customer_account_ids;
    current_customerids.push(store.getters["settings/customer_details"]);
    store.commit("settings/set_customer_details", current_customerids); /*  (SaveChanges) selected */
    expect(store.state.settings.customer_account_ids).toHaveLength(
      3
    ); /*  assert the number of customer_account_ids to three */
  });
  test("Given the store has multiple customer details, When the mutation updates one Customer details, Then validate the updates is reflecting in the store", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit Customer)       |    -------- >  ======================== */
    /* |                        |                | EditCustomer.vue      | */
    /* |                        |    < --------  |  (Save ID)           | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
      {
        cust_idx: 1,
        cust_id: "6cBaidlJ84Ggc5JA7IYCgv",
        pass_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        user_account_id: "Customer account -2",
      },
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Edit Customer Click on the "Customer account - 2*/
    store.commit("settings/set_customer_index", 1);
    const current_focus_customerid = store.state.settings.customer_account_ids[1];
    expect(current_focus_customerid.user_account_id).toStrictEqual("Customer account -2");
    current_focus_customerid.cust_id = "7N42dgm5tFLK9N8MT7fHC7"; /* cust_id modified */
    current_focus_customerid.user_account_id = "Updated account -2"; /* user_account_id modified */
    store.commit("settings/set_customer_details", current_focus_customerid); /*  (Save ID) selected */

    const current_customerids = store.state.settings.customer_account_ids;
    const modified_customerids = store.state.settings.customer_account_ids[1];

    /* Javascript array provides an internal api array.find(v => v.id === match.id).data = new.data  so we update object in array and store in Vuex*/
    current_customerids.find((customer) => customer.cust_idx === current_focus_customerid.cust_idx).cust_id =
      modified_customerids.cust_id;
    current_customerids.find(
      (customer) => customer.cust_idx === current_focus_customerid.cust_idx
    ).user_account_id = modified_customerids.user_account_id;
    current_customerids.find((customer) => customer.cust_idx === current_focus_customerid.cust_idx).pass_key =
      modified_customerids.pass_key;
    /*  (SaveChanges) selected */
    store.commit("settings/set_customer_account_ids", current_customerids);

    /*  assert the cust_id and user_account_id from settings store is updated */
    const updated_focus_customerid = store.state.settings.customer_account_ids[1];
    expect(updated_focus_customerid.cust_id).toStrictEqual("7N42dgm5tFLK9N8MT7fHC7");
    expect(updated_focus_customerid.user_account_id).toStrictEqual("Updated account -2");
  });
  test("Given the store has multiple customer details, When the mutation deletes one Customer details, Then validate the number of the customer decrements by one", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit Customer)       |    -------- >  ======================== */
    /* |                        |                | EditCustomer.vue      | */
    /* |                        |    < --------  |  (Delete ID)         | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */

    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
      {
        cust_idx: 1,
        cust_id: "6cBaidlJ84Ggc5JA7IYCgv",
        pass_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        user_account_id: "Customer account -2",
      },
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Edit Customer Click on the "Customer account - 1*/
    store.commit("settings/set_customer_index", 0);
    const current_focus_customerid = store.state.settings.customer_account_ids[0];
    expect(current_focus_customerid.user_account_id).toStrictEqual("Customer account -1");
    expect(current_focus_customerid.cust_id).toStrictEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(current_focus_customerid.pass_key).toStrictEqual("941532a0-6be1-443a-a9d5-d57bdf180a52");
    /*  (Delete ID) selected */
    const current_customerids = store.state.settings.customer_account_ids;
    const focus_customer_index = store.state.settings.customer_index;
    /* Javascript array provides an internal api array.splice(idx,1)  so we delete object in array and store in Vuex*/
    current_customerids.splice(focus_customer_index, 1);
    /*  (SaveChanges) selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    const updated_focus_customerid = store.state.settings.customer_account_ids[0];
    expect(updated_focus_customerid.cust_id).toStrictEqual("6cBaidlJ84Ggc5JA7IYCgv");
    expect(updated_focus_customerid.pass_key).toStrictEqual("941532a0-6be1-443a-cdee-d57bdf180a52");
    expect(updated_focus_customerid.user_account_id).toStrictEqual("Customer account -2");
    expect(store.state.settings.customer_account_ids).toHaveLength(1);
  });
  test("When a user resets the settings form, Then the mutation will only reset current selection and toggle switches and will not reset existing IDs", async () => {
    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
    ];

    store.commit("settings/set_customer_account_ids", array_of_customerids);
    expect(store.state.settings.customer_account_ids).toHaveLength(1);
    store.commit("settings/set_customer_index", 0);

    store.commit("settings/set_auto_upload", true);
    store.commit("settings/set_auto_delete", true);

    await store.commit("settings/reset_to_default");

    expect(store.state.settings.customer_account_ids).toHaveLength(1);
    expect(store.state.settings.auto_delete).toBe(false);
    expect(store.state.settings.auto_upload).toBe(false);
    expect(store.state.settings.customer_index).toBeNull();
  });

  test("When the app is created and the user's log path is committed, Then the base downloads path also gets updated with user_account_id", async () => {
    const test_win_path = "C:\\Users\\CuriBio\\TestPath";
    const expected_win_base_path = "C:\\Users\\CuriBio\\Downloads";

    store.commit("settings/set_log_path", test_win_path);

    const { log_path, base_downloads_path } = store.state.settings;
    expect(log_path).toBe(test_win_path);
    expect(base_downloads_path).toBe(expected_win_base_path);

    const test_path = "/Users/CuriBio/TestPath";
    const expected_downloads_base_path = "C:\\Users\\CuriBio\\Downloads";

    store.commit("settings/set_log_path", test_path);

    expect(store.state.settings.log_path).toBe(test_path);
    expect(store.state.settings.base_downloads_path).toBe(expected_downloads_base_path);
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

      const array_of_customerids = [
        {
          cust_idx: 0,
          cust_id: "4vqyd62oARXqj9nRUNhtLQ",
          pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
          user_account_id: "Customer account -1",
        },
      ];

      store.commit("settings/set_customer_account_ids", array_of_customerids);
      store.commit("settings/set_customer_index", 0);

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
