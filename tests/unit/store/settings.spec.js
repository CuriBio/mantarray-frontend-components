import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { settings_store_module } from "@/dist/mantarray.common";
import { call_axios_get_from_vuex } from "@/js_utils/axios_helpers.js";
import actions from "../../../store/modules/settings/actions";

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
  test("When initialized, Then the file_count and max_file_count is zero 0 as with no value assigned", () => {
    const value = store.state.settings.file_count;
    const max = store.state.settings.max_file_count;
    expect(value).toStrictEqual(0);
    expect(max).toStrictEqual(0);
  });
  test("When initialized user_details of UUID, Nickname is empty, Then commit user_details which have valid user_id UUID and nickname assert the values in Vuex for user_id, UUID and nickname", () => {
    const array_of_userid = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      }
    ];
    expect(store.state.settings.user_details.uuid).toBeNull();
    expect(store.state.settings.user_details.nickname).toBeNull();
    store.commit("settings/set_user_details", array_of_userid);
    expect(store.state.settings.user_details[0].user_id).toStrictEqual(0);
    expect(store.state.settings.user_details[0].uuid).toStrictEqual("2VSckkBYr2An3dqHEyfRRE");
    expect(store.state.settings.user_details[0].nickname).toStrictEqual("User account -1");
  });
  test("When initialized customer_details UUID, API-key, customer name and user_details UUID, nickname is empty, Then commit customer_details with valid cust_id, UUID, API-key, customer name and user_details of user_id, UUID, nickname to the Vuex and assert the same", () => {
    const array_of_userid = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid
      }
    ];
    expect(store.state.settings.customer_details.cust_id).toBeNull();
    expect(store.state.settings.customer_details.uuid).toBeNull();
    expect(store.state.settings.customer_details.api_key).toBeNull();
    expect(store.state.settings.customer_details.nickname).toBeNull();
    expect(store.state.settings.customer_details.user_ids).toHaveLength(0);
    store.commit("settings/set_customer_details", array_of_customerids);
    expect(store.state.settings.customer_details[0].cust_id).toStrictEqual(0);
    expect(store.state.settings.customer_details[0].uuid).toStrictEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(store.state.settings.customer_details[0].api_key).toStrictEqual(
      "941532a0-6be1-443a-a9d5-d57bdf180a52"
    );
    expect(store.state.settings.customer_details[0].nickname).toStrictEqual("Customer account -1");
    expect(store.state.settings.customer_details[0].user_ids).toHaveLength(1);
    expect(store.state.settings.customer_details[0].user_ids[0].user_id).toStrictEqual(0);
    expect(store.state.settings.customer_details[0].user_ids[0].uuid).toStrictEqual("2VSckkBYr2An3dqHEyfRRE");
    expect(store.state.settings.customer_details[0].user_ids[0].nickname).toStrictEqual("User account -1");
  });
  test("When initialized the array of customer_account_ids is empty and size 0, Then commit a single valid record of customer_details as the first record in customer_account_ids, customer_index/user_index and assert the same", () => {
    const array_of_userid = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid
      }
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);
    expect(store.state.settings.customer_account_ids[store.state.settings.customer_index].uuid).toStrictEqual(
      "4vqyd62oARXqj9nRUNhtLQ"
    );
    expect(
      store.state.settings.customer_account_ids[store.state.settings.customer_index].api_key
    ).toStrictEqual("941532a0-6be1-443a-a9d5-d57bdf180a52");
    expect(
      store.state.settings.customer_account_ids[store.state.settings.customer_index].nickname
    ).toStrictEqual("Customer account -1");
    expect(
      store.state.settings.customer_account_ids[store.state.settings.customer_index].user_ids
    ).toHaveLength(1);
    expect(
      store.state.settings.customer_account_ids[store.state.settings.customer_index].user_ids[
        store.state.settings.user_index
      ].uuid
    ).toStrictEqual("2VSckkBYr2An3dqHEyfRRE");
    expect(
      store.state.settings.customer_account_ids[store.state.settings.customer_index].user_ids[
        store.state.settings.user_index
      ].nickname
    ).toStrictEqual("User account -1");
  });
  test("When initialized the array of customer_account_ids is empty and size 0, Then commit customer_details with multiple user_ids in customer_account_ids and assert the number of user_ids to match the number of user_ids", () => {
    const array_of_userid = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2"
      },
      {
        uuid: "7N42dgm5tFLK9N8MT7fHC7",
        nickname: "User account -3"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid
      }
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);
    expect(store.state.settings.customer_account_ids[0].user_ids).toHaveLength(3);
  });
  test("When initialized the array of customer_account_ids is empty and size 0, Then commit an array of customer details in customer_account_ids and assert the number of customer records", () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2"
      },
      {
        user_id: 2,
        uuid: "7N42dgm5tFLK9N8MT7fHC7",
        nickname: "User account -3"
      }
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        nickname: "Lab User  -1"
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1"
      },
      {
        user_id: 3,
        uuid: "7N42dnnntFLK9N8MT7fHC7",
        nickname: "Envio test -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_2
      }
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
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2"
      }
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        nickname: "Lab User  -1"
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_userid_2
      }
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Add Customer Click  */
    const add_customer = [
      {
        cust_id: 2,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        api_key: "941532a0-6be1-443a-ssds-d57bdf180a52",
        nickname: "Customer account -3",
        user_ids: []
      }
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
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2"
      }
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        nickname: "Lab User  -1"
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_userid_2
      }
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Edit Customer Click on the "Customer account - 2*/
    store.commit("settings/set_customer_index", 1);
    const current_focus_customerid = store.state.settings.customer_account_ids[1];
    expect(current_focus_customerid.nickname).toStrictEqual("Customer account -2");
    current_focus_customerid.uuid = "7N42dgm5tFLK9N8MT7fHC7"; /* UUID modified */
    current_focus_customerid.nickname = "Updated account -2"; /* Nickname modified */
    store.commit("settings/set_customer_details", current_focus_customerid); /*  (Save ID) selected */

    const current_customerids = store.state.settings.customer_account_ids;
    const modified_customerids = store.state.settings.customer_account_ids[1];

    /* Javascript array provides an internal api array.find(v => v.id === match.id).data = new.data  so we update object in array and store in Vuex*/
    current_customerids.find(customer => customer.cust_id === current_focus_customerid.cust_id).uuid =
      modified_customerids.uuid;
    current_customerids.find(customer => customer.cust_id === current_focus_customerid.cust_id).nickname =
      modified_customerids.nickname;
    current_customerids.find(customer => customer.cust_id === current_focus_customerid.cust_id).api_key =
      modified_customerids.api_key;
    current_customerids.find(customer => customer.cust_id === current_focus_customerid.cust_id).user_ids =
      modified_customerids.user_ids;
    /*  (SaveChanges) selected */
    store.commit("settings/set_customer_account_ids", current_customerids);

    /*  assert the uuid and nickname from settings store is updated */
    const updated_focus_customerid = store.state.settings.customer_account_ids[1];
    expect(updated_focus_customerid.uuid).toStrictEqual("7N42dgm5tFLK9N8MT7fHC7");
    expect(updated_focus_customerid.nickname).toStrictEqual("Updated account -2");
  });
  test("Given the store has multiple customer details, When the mutation deletes one Customer details, Then validate the number of the customer decrements by one", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit Customer)       |    -------- >  ======================== */
    /* |                        |                | EditCustomer.vue      | */
    /* |                        |    < --------  |  (Delete ID)         | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2"
      }
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        nickname: "Lab User  -1"
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_userid_2
      }
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Edit Customer Click on the "Customer account - 1*/
    store.commit("settings/set_customer_index", 0);
    const current_focus_customerid = store.state.settings.customer_account_ids[0];
    expect(current_focus_customerid.nickname).toStrictEqual("Customer account -1");
    expect(current_focus_customerid.uuid).toStrictEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(current_focus_customerid.api_key).toStrictEqual("941532a0-6be1-443a-a9d5-d57bdf180a52");
    /*  (Delete ID) selected */
    const current_customerids = store.state.settings.customer_account_ids;
    const focus_customer_index = store.state.settings.customer_index;
    /* Javascript array provides an internal api array.splice(idx,1)  so we delete object in array and store in Vuex*/
    current_customerids.splice(focus_customer_index, 1);
    /*  (SaveChanges) selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    const updated_focus_customerid = store.state.settings.customer_account_ids[0];
    expect(updated_focus_customerid.uuid).toStrictEqual("6cBaidlJ84Ggc5JA7IYCgv");
    expect(updated_focus_customerid.api_key).toStrictEqual("941532a0-6be1-443a-cdee-d57bdf180a52");
    expect(updated_focus_customerid.nickname).toStrictEqual("Customer account -2");
    expect(store.state.settings.customer_account_ids).toHaveLength(1);
  });
  test("Given the Vuex has customer details with single user id, When mutation adds user details, Then the number of user details increments by one", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Add  User)           |    -------- >  ======================== */
    /* |                        |                | AddUser.vue      | */
    /* |                        |    < --------  |  (Save ID)           | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1
      }
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    const current_customerids = store.state.settings.customer_account_ids;
    const current_list_of_user_ids = store.state.settings.customer_account_ids[0].user_ids;
    expect(current_list_of_user_ids).toHaveLength(1);
    const add_new_user = {
      user_id: 1,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      nickname: "User account -2"
    };
    /*  (Save ID) user selected */
    current_list_of_user_ids.push(add_new_user);
    const current_customer_index = store.state.settings.customer_index;
    current_customerids[current_customer_index].user_ids = current_list_of_user_ids;
    /* SaveChanges selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    const updated_list_of_user_ids =
      store.state.settings.customer_account_ids[current_customer_index].user_ids;
    expect(updated_list_of_user_ids).toHaveLength(2);
  });
  test("Given the Vuex has customer details with multiple user id, When the mutation updates one of the User ID details, Then validate only modified user ID details are stored in Vuex", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit  User)           |    -------- >  ======================== */
    /* |                        |                | EditUser.vue         | */
    /* |                        |    < --------  |  (Save ID)           | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1
      }
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 1);

    const current_customerids = store.state.settings.customer_account_ids;
    const current_list_of_user_ids = store.state.settings.customer_account_ids[0].user_ids;
    expect(current_list_of_user_ids).toHaveLength(2);

    const focused_user_details = store.state.settings.customer_account_ids[0].user_ids;
    const focused_user_id = store.state.settings.user_index;

    focused_user_details.uuid = "6cBaidlJ84Ggc5JA7IYCgv";
    focused_user_details.nickname = "Updated Account -1";
    /*  (Save ID) user selected */
    current_list_of_user_ids.find(user => user.user_id === focused_user_id).uuid = focused_user_details.uuid;
    current_list_of_user_ids.find(user => user.user_id === focused_user_id).nickname =
      focused_user_details.nickname;
    current_customerids.user_ids = current_list_of_user_ids;
    /* SaveChanges selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    const updated_list_of_user_ids = store.state.settings.customer_account_ids[0].user_ids;
    const modified_userids = store.state.settings.customer_account_ids[0].user_ids[1];
    expect(modified_userids.uuid).toStrictEqual("6cBaidlJ84Ggc5JA7IYCgv");
    expect(modified_userids.nickname).toStrictEqual("Updated Account -1");
    expect(updated_list_of_user_ids).toHaveLength(2);
  });

  test("When a user resets the settings form, Then the mutation will only reset current selection and toggle switches and will not reset existing IDs", async () => {
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: []
      }
    ];

    store.commit("settings/set_customer_account_ids", array_of_customerids);
    expect(store.state.settings.customer_account_ids).toHaveLength(1);
    store.commit("settings/set_customer_index", 0);
    console.log(store.state.settings.auto_upload);

    store.commit("settings/set_auto_upload", false);
    store.commit("settings/set_auto_delete", true);
    console.log(store.state.settings.auto_upload);

    await store.commit("settings/reset_to_default");
    console.log(store.state.settings.auto_upload);

    expect(store.state.settings.customer_account_ids).toHaveLength(1);
    expect(store.state.settings.auto_delete).toBe(false);
    expect(store.state.settings.auto_upload).toBe(true);
    expect(store.state.settings.customer_index).toBeNull();
  });

  test("Given the Vuex has customer details with multiple user id, When the mutation deletes one of the User ID details, Then validate that the number of user ids is reduced by one in the Vuex", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit  User)          |    -------- >  ======================== */
    /* |                        |                | EditUser.vue      | */
    /* |                        |    < --------  |  (Delete ID)         | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1"
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1"
      }
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1
      }
    ];
    expect(store.state.settings.customer_account_ids).toHaveLength(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    const current_customerids = store.state.settings.customer_account_ids;
    const current_list_of_user_ids = store.state.settings.customer_account_ids[0].user_ids;
    expect(current_list_of_user_ids).toHaveLength(2);

    const focused_user_details = store.state.settings.customer_account_ids[0].user_ids[0];
    expect(focused_user_details.uuid).toStrictEqual("2VSckkBYr2An3dqHEyfRRE");
    expect(focused_user_details.nickname).toStrictEqual("User account -1");

    const focused_user_id = store.state.settings.user_index;
    /* Delete ID selected */
    /* Javascript array provides an internal api array.splice(idx,1)  so we delete object in array and store in Vuex*/
    current_list_of_user_ids.splice(focused_user_id, 1);
    current_customerids.user_ids = current_list_of_user_ids;
    /* SaveChanges selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    const modified_userids = store.state.settings.customer_account_ids[0].user_ids;
    expect(modified_userids).toHaveLength(1);
  });
  describe("settings/actions", () => {
    test("When a user wants to save user credentials in settings, Then the vuex action to update settings will send axios request", async () => {
      jest.spyOn(actions, "call_update_axios_request").mockImplementation(() => {
        return {
          status: 200
        };
      });
      const array_of_customerids = [
        {
          cust_id: 0,
          uuid: "4vqyd62oARXqj9nRUNhtLQ",
          api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
          nickname: "Customer account -1",
          user_ids: []
        }
      ];

      store.commit("settings/set_customer_account_ids", array_of_customerids);
      store.commit("settings/set_customer_index", 0);

      const { status } = await store.dispatch("settings/update_settings");
      expect(status).toBe(200);
    });
  });
});
