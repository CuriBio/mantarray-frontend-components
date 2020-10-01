import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

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
    expect(array_of_customerids.length).toEqual(0);
  });
  test("Store a single user detail can be assigned to the user_ids ", () => {
    const array_of_userid = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    expect(store.state.settings.user_details.uuid).toBeNull();
    expect(store.state.settings.user_details.nickname).toBeNull();
    store.commit("settings/set_user_details", array_of_userid);
    expect(store.state.settings.user_details[0].user_id).toEqual(0);
    expect(store.state.settings.user_details[0].uuid).toEqual(
      "2VSckkBYr2An3dqHEyfRRE"
    );
    expect(store.state.settings.user_details[0].nickname).toEqual(
      "User account -1"
    );
  });
  test("Store a single customer detail can be assigned to the customer_details", () => {
    const array_of_userid = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid,
      },
    ];
    expect(store.state.settings.customer_details.cust_id).toBeNull();
    expect(store.state.settings.customer_details.uuid).toBeNull();
    expect(store.state.settings.customer_details.api_key).toBeNull();
    expect(store.state.settings.customer_details.nickname).toBeNull();
    expect(store.state.settings.customer_details.user_ids.length).toEqual(0);
    store.commit("settings/set_customer_details", array_of_customerids);
    expect(store.state.settings.customer_details[0].cust_id).toEqual(0);
    expect(store.state.settings.customer_details[0].uuid).toEqual(
      "4vqyd62oARXqj9nRUNhtLQ"
    );
    expect(store.state.settings.customer_details[0].api_key).toEqual(
      "941532a0-6be1-443a-a9d5-d57bdf180a52"
    );
    expect(store.state.settings.customer_details[0].nickname).toEqual(
      "Customer account -1"
    );
    expect(store.state.settings.customer_details[0].user_ids.length).toEqual(1);
    expect(
      store.state.settings.customer_details[0].user_ids[0].user_id
    ).toEqual(0);
    expect(store.state.settings.customer_details[0].user_ids[0].uuid).toEqual(
      "2VSckkBYr2An3dqHEyfRRE"
    );
    expect(
      store.state.settings.customer_details[0].user_ids[0].nickname
    ).toEqual("User account -1");
  });
  test("Store a single customer detail can be assigned to the customer_ids array", () => {
    const array_of_userid = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);
    expect(
      store.state.settings.customer_account_ids[
        store.state.settings.customer_index
      ].uuid
    ).toEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(
      store.state.settings.customer_account_ids[
        store.state.settings.customer_index
      ].api_key
    ).toEqual("941532a0-6be1-443a-a9d5-d57bdf180a52");
    expect(
      store.state.settings.customer_account_ids[
        store.state.settings.customer_index
      ].nickname
    ).toEqual("Customer account -1");
    expect(
      store.state.settings.customer_account_ids[
        store.state.settings.customer_index
      ].user_ids.length
    ).toEqual(1);
    expect(
      store.state.settings.customer_account_ids[
        store.state.settings.customer_index
      ].user_ids[store.state.settings.user_index].uuid
    ).toEqual("2VSckkBYr2An3dqHEyfRRE");
    expect(
      store.state.settings.customer_account_ids[
        store.state.settings.customer_index
      ].user_ids[store.state.settings.user_index].nickname
    ).toEqual("User account -1");
  });
  test("Store a single customer detail with multiple user ids can be assigned to the customer_ids array", () => {
    const array_of_userid = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2",
      },
      {
        uuid: "7N42dgm5tFLK9N8MT7fHC7",
        nickname: "User account -3",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);
    expect(
      store.getters["settings/user_ids_for_selected_customer_account"].length
    ).toEqual(3);
  });
  test("Store a multiple customer detail with multiple user ids can be assigned to the customer_ids array", () => {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2",
      },
      {
        user_id: 2,
        uuid: "7N42dgm5tFLK9N8MT7fHC7",
        nickname: "User account -3",
      },
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
      {
        user_id: 3,
        uuid: "7N42dnnntFLK9N8MT7fHC7",
        nickname: "Envio test -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_2,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    expect(store.getters["settings/customer_account_ids"].length).toEqual(2);
  });
  test("Store a multiple customer detail with multiple user ids can be assigned to the customer_ids array an 'Add Customer' ==>  PopopUpDialog (SaveID) ==> SettingsForm (SaveChanges) ", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Add Customer)        |    -------- >  ======================== */
    /* |                        |                | PopUpDialog.vue      | */
    /* |                        |    < --------  |  (Save ID)           | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2",
      },
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_userid_2,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Add Customer Click  */
    const add_customer = [
      {
        cust_id: 2,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        api_key: "941532a0-6be1-443a-ssds-d57bdf180a52",
        nickname: "Customer account -3",
        user_ids: [],
      },
    ];
    store.commit(
      "settings/set_customer_details",
      add_customer
    ); /*  (Save ID) selected */
    let current_customerids = store.getters["settings/customer_account_ids"];
    current_customerids.push(store.getters["settings/customer_details"]);
    store.commit(
      "settings/set_customer_details",
      current_customerids
    ); /*  (SaveChanges) selected */
    expect(store.getters["settings/customer_account_ids"].length).toEqual(
      3
    ); /*  assert the number of customer_account_ids to three */
  });
  test("Store a multiple customer detail with multiple user ids can be assigned to the customer_ids array an 'Edit Customer' ==>  PopopUpDialog (SaveID) ==> SettingsForm (SaveChanges) ", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit Customer)       |    -------- >  ======================== */
    /* |                        |                | PopUpDialog.vue      | */
    /* |                        |    < --------  |  (Save ID)           | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2",
      },
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_userid_2,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Edit Customer Click on the "Customer account - 2*/
    store.commit("settings/set_customer_index", 1);
    let current_focus_customerid = store.getters["settings/customer_details"];
    expect(current_focus_customerid.nickname).toEqual("Customer account -2");
    current_focus_customerid.uuid =
      "7N42dgm5tFLK9N8MT7fHC7"; /* UUID modified */
    current_focus_customerid.nickname =
      "Updated account -2"; /* Nickname modified */
    store.commit(
      "settings/set_customer_details",
      current_focus_customerid
    ); /*  (Save ID) selected */

    let current_customerids = store.getters["settings/customer_account_ids"];
    let modified_customerids = store.getters["settings/customer_details"];

    /* Javascript array provides an internal api array.find(v => v.id === match.id).data = new.data  so we update object in array and store in Vuex*/
    current_customerids.find(
      (customer) => customer.cust_id === current_focus_customerid.cust_id
    ).uuid = modified_customerids.uuid;
    current_customerids.find(
      (customer) => customer.cust_id === current_focus_customerid.cust_id
    ).nickname = modified_customerids.nickname;
    current_customerids.find(
      (customer) => customer.cust_id === current_focus_customerid.cust_id
    ).api_key = modified_customerids.api_key;
    current_customerids.find(
      (customer) => customer.cust_id === current_focus_customerid.cust_id
    ).user_ids = modified_customerids.user_ids;
    /*  (SaveChanges) selected */
    store.commit("settings/set_customer_account_ids", current_customerids);

    /*  assert the uuid and nickname from settings store is updated */
    let updated_focus_customerid = store.getters["settings/customer_details"];
    expect(updated_focus_customerid.uuid).toEqual("7N42dgm5tFLK9N8MT7fHC7");
    expect(updated_focus_customerid.nickname).toEqual("Updated account -2");
  });
  test("Store a multiple customer detail with multiple user ids can be assigned to the customer_ids array an 'Edit Customer' ==>  PopopUpDialog (DeleteID) ==> SettingsForm (SaveChanges) ", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit Customer)       |    -------- >  ======================== */
    /* |                        |                | PopUpDialog.vue      | */
    /* |                        |    < --------  |  (Delete ID)         | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "User account -2",
      },
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        nickname: "Lab User  -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
      {
        cust_id: 1,
        uuid: "6cBaidlJ84Ggc5JA7IYCgv",
        api_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        nickname: "Customer account -2",
        user_ids: array_of_userid_2,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    /* User now does Edit Customer Click on the "Customer account - 1*/
    store.commit("settings/set_customer_index", 0);
    let current_focus_customerid = store.getters["settings/customer_details"];
    expect(current_focus_customerid.nickname).toEqual("Customer account -1");
    expect(current_focus_customerid.uuid).toEqual("4vqyd62oARXqj9nRUNhtLQ");
    expect(current_focus_customerid.api_key).toEqual(
      "941532a0-6be1-443a-a9d5-d57bdf180a52"
    );
    /*  (Delete ID) selected */
    let current_customerids = store.getters["settings/customer_account_ids"];
    let focus_customer_index = store.state.settings.customer_index;
    /* Javascript array provides an internal api array.splice(idx,1)  so we delete object in array and store in Vuex*/
    current_customerids.splice(focus_customer_index, 1);
    /*  (SaveChanges) selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    let updated_focus_customerid = store.getters["settings/customer_details"];
    expect(updated_focus_customerid.uuid).toEqual("6cBaidlJ84Ggc5JA7IYCgv");
    expect(updated_focus_customerid.api_key).toEqual(
      "941532a0-6be1-443a-cdee-d57bdf180a52"
    );
    expect(updated_focus_customerid.nickname).toEqual("Customer account -2");
    expect(store.state.settings.customer_account_ids.length).toEqual(1);
  });
  test("Store has a single customer  with single user ids can be assigned to the customer_ids array an 'Add User' ==>  PopopUpDialog (Save ID) ==> SettingsForm (SaveChanges) ", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Add  User)           |    -------- >  ======================== */
    /* |                        |                | PopUpDialog.vue      | */
    /* |                        |    < --------  |  (Save ID)           | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    let current_customerids = store.getters["settings/customer_account_ids"];
    let current_list_of_user_ids =
      store.getters["settings/user_ids_for_selected_customer_account"];
    expect(current_list_of_user_ids.length).toEqual(1);
    const add_new_user = {
      user_id: 1,
      uuid: "5FY8KwTsQaUJ2KzHJGetfE",
      nickname: "User account -2",
    };
    /*  (Save ID) user selected */
    current_list_of_user_ids.push(add_new_user);
    let current_customer_index = store.getters["settings/customer_index"];
    current_customerids[
      current_customer_index
    ].user_ids = current_list_of_user_ids;
    /* SaveChanges selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    let updated_list_of_user_ids =
      store.getters["settings/user_ids_for_selected_customer_account"];
    expect(updated_list_of_user_ids.length).toEqual(2);
  });
  test("Store has a single customer  with multiple user ids can be assigned to the customer_ids array an 'Edit User' ==>  PopopUpDialog (Save ID) ==> SettingsForm (SaveChanges) ", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit  User)           |    -------- >  ======================== */
    /* |                        |                | PopUpDialog.vue      | */
    /* |                        |    < --------  |  (Save ID)           | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 1);

    let current_customerids = store.getters["settings/customer_account_ids"];
    let current_list_of_user_ids =
      store.getters["settings/user_ids_for_selected_customer_account"];
    expect(current_list_of_user_ids.length).toEqual(2);
    let userid_under_focus = store.getters["settings/user_index"];

    let focused_user_details = store.getters["settings/user_details"];
    let focused_user_id = store.getters["settings/user_index"];

    focused_user_details.uuid = "6cBaidlJ84Ggc5JA7IYCgv";
    focused_user_details.nickname = "Updated Account -1";
    /*  (Save ID) user selected */
    current_list_of_user_ids.find(
      (user) => user.user_id === focused_user_id
    ).uuid = focused_user_details.uuid;
    current_list_of_user_ids.find(
      (user) => user.user_id === focused_user_id
    ).nickname = focused_user_details.nickname;
    current_customerids.user_ids = current_list_of_user_ids;
    /* SaveChanges selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    let updated_list_of_user_ids =
      store.getters["settings/user_ids_for_selected_customer_account"];
    let modified_userids = store.getters["settings/user_details"];
    expect(modified_userids.uuid).toEqual("6cBaidlJ84Ggc5JA7IYCgv");
    expect(modified_userids.nickname).toEqual("Updated Account -1");
    expect(updated_list_of_user_ids.length).toEqual(2);
  });
  test("Store has a single customer  with multiple user ids can be assigned to the customer_ids array an 'Edit User' ==>  PopopUpDialog (Delete ID) ==> SettingsForm (SaveChanges) ", () => {
    /* ========================== */
    /* |  Settings.vue          | */
    /* |  (Edit  User)          |    -------- >  ======================== */
    /* |                        |                | PopUpDialog.vue      | */
    /* |                        |    < --------  |  (Delete ID)         | */
    /* |  (SaveChanges)         |                ======================== */
    /* ========================== */
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        nickname: "Intern -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_id: 0,
        uuid: "4vqyd62oARXqj9nRUNhtLQ",
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        nickname: "Customer account -1",
        user_ids: array_of_userid_1,
      },
    ];
    expect(store.state.settings.customer_account_ids.length).toEqual(0);
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    let current_customerids = store.getters["settings/customer_account_ids"];
    let current_list_of_user_ids =
      store.getters["settings/user_ids_for_selected_customer_account"];
    expect(current_list_of_user_ids.length).toEqual(2);
    let userid_under_focus = store.getters["settings/user_index"];

    let focused_user_details = store.getters["settings/user_details"];
    expect(focused_user_details.uuid).toEqual("2VSckkBYr2An3dqHEyfRRE");
    expect(focused_user_details.nickname).toEqual("User account -1");

    let focused_user_id = store.getters["settings/user_index"];
    /* Delete ID selected */
    /* Javascript array provides an internal api array.splice(idx,1)  so we delete object in array and store in Vuex*/
    current_list_of_user_ids.splice(focused_user_id, 1);
    current_customerids.user_ids = current_list_of_user_ids;
    /* SaveChanges selected */
    store.commit("settings/set_customer_account_ids", current_customerids);
    let modified_userids =
      store.getters["settings/user_ids_for_selected_customer_account"];
    expect(modified_userids.length).toEqual(1);
  });
});
