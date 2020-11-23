import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/SettingsForm.vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;

describe("SettingsForm.vue", () => {
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

  const array_of_customerids_no_user_ids = [
    {
      cust_id: 0,
      uuid: "4vqyd62oARXqj9nRUNhtLQ",
      api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      nickname: "Customer account -1",
      user_ids: [],
    },
  ];
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  test("Given the SettingsForm has a valid customer account set as 'Customer account -1, When the value is set as focus Customer ID, Then a valid rules are executed and relevant buttons are enabled rest are greyed", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -1");

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    await wrapper.vm.$nextTick(); // wait for update

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(false);
  });
  test("Given the SettingsForm has a valid customer account set as 'Customer account -1'and 'User account -1', When the value is set as focus Customer ID and User ID, Then a valid rules are executed and all buttons are enabled none of the buttons are greyed", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -1");
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widget-user-")
      .setValue("User account -1");
    await wrapper.vm.$nextTick(); // wait for update

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(true);
  });

  test("Given the SettingsForm and neither customer nor user 'ID'  set, When the value is set as focus Customer ID/User ID is <empty>, Then a valid rules are executed and only 'Add Customer ID' is in focus the rest are greyed", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });
  test("Given the SettingsForm has neither customer nor user 'ID'  set, When the Vuex value has empty user_ids and no focus  Customer ID/User ID is <empty>, Then a valid rules are executed and only 'Add Customer ID' is in focus the rest are greyed", async () => {
    store.commit(
      "settings/set_customer_account_ids",
      array_of_customerids_no_user_ids
    );

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });
  test("Given the SettingsForm has Vuex data empty, When the user attempts to enter details, Then validate that only 'Add New Customer' button is enabled and remaining buttons are greyed", async () => {
    const array_of_customerids = [];
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });

  test("Given the SettingsForm has a valid customer account set as 'Customer account -1' and 'User account -1', When the value is set as focus Customer ID and user deletes the 'Customer Account -1', Then validate based on rules only 'Add New Customer' button is enabled, and other buttons are greyed", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -1");
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widget-user-")
      .setValue("User account -1");
    await wrapper.vm.$nextTick(); // wait for update

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(true);

    const delete_user = {
      user_id: 0,
      uuid: "2VSckkBYr2An3dqHEyfRRE",
      nickname: "User account -1",
    };
    wrapper.vm.onDeleteUserId(delete_user);

    await wrapper.vm.$nextTick(); // wait for update

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(false);
  });

  test("Given the SettingsForm has a valid customer account set as 'Customer account -1' and 'User account -1', When the value set as focus User ID 'User account -1' is deleted and followed by 'Customer account -1 deleted, Then based on the rules relevant buttons are enabled and the others are greyed", async () => {
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -1");
    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widget-user-")
      .setValue("User account -1");
    await wrapper.vm.$nextTick(); // wait for update

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(true);

    const delete_user = {
      user_id: 0,
      uuid: "2VSckkBYr2An3dqHEyfRRE",
      nickname: "User account -1",
    };
    wrapper.vm.onDeleteUserId(delete_user);

    await wrapper.vm.$nextTick(); // wait for update

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(false);

    const delete_customer = {
      cust_id: 0,
      uuid: "4vqyd62oARXqj9nRUNhtLQ",
      api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      nickname: "Customer account -1",
      user_ids: [],
    };
    wrapper.vm.onDeleteCustomerId(delete_customer);

    await wrapper.vm.$nextTick(); // wait for update

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });

  test("When the SettingsForm, has neither valid customer nor user 'ID' set, Then visually the Reset and Save Buttons are greyed", async () => {
    store.commit("settings/set_customer_account_ids", array_of_customerids);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Reset_Btn = wrapper.find(
      ".span__settings-tool-tip-reset-btn-txt-disable"
    );
    const Save_Btn = wrapper.find(
      ".span__settings-tool-tip-save-btn-txt-disable"
    );
    const Save_Btn_Container = wrapper.find(
      ".div__settings-tool-tip-save-btn-disable"
    );

    expect(Reset_Btn.isVisible()).toBe(true);
    expect(Save_Btn.isVisible()).toBe(true);
    expect(Save_Btn_Container.isVisible()).toBe(true);
  });
  test("When the SettingsForm, has a valid customer and user 'ID' set, Then visually the Reset and Save Buttons are enabled", async () => {
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Reset_Btn = wrapper.find(
      ".span__settings-tool-tip-reset-btn-txt-enable"
    );
    const Save_Btn = wrapper.find(
      ".span__settings-tool-tip-save-btn-txt-enable"
    );
    const Save_Btn_Container = wrapper.find(
      ".div__settings-tool-tip-save-btn-enable"
    );

    expect(Reset_Btn.isVisible()).toBe(true);
    expect(Save_Btn.isVisible()).toBe(true);
    expect(Save_Btn_Container.isVisible()).toBe(true);
  });
  test("When the SettingsForm, has neither valid customer nor user 'ID' set, Then visually the RED Box is enabled around the Customer ID and User ID", async () => {
    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Boxes = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--invalid"
    );
    const Customer_ID_Input_Editor_Red_Box = Boxes.at(0);
    const User_ID_Input_Editor_Red_Box = Boxes.at(1);

    expect(Customer_ID_Input_Editor_Red_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Red_Box.isVisible()).toBe(true);
  });
  test("Given the SettingsForm has a valid customer account set as 'Customer account -1' and 'User account -1', When the 'Customer account -1 and 'User account -1 is in focus, Then the GREEN Box is enabled around the Customer ID and User ID", async () => {
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Boxes = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--valid"
    );
    const Customer_ID_Input_Editor_Green_Box = Boxes.at(0);
    const User_ID_Input_Editor_Green_Box = Boxes.at(1);

    expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
  });
  test("Given the SettingsForm has a valid customer account set as 'Customer account -1' and 'User account -1', When the user now modifies to non-existant customer say 'Customer account -', Then validate that Red Boxes are visible around Customer ID and User ID and only 'Add New Customer Button' is enabled", async () => {
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Boxes = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--valid"
    );
    const Customer_ID_Input_Editor_Green_Box = Boxes.at(0);
    const User_ID_Input_Editor_Green_Box = Boxes.at(1);

    expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Green_Box.isVisible()).toBe(true);

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -"); // customer with this doesn't exist.

    await wrapper.vm.$nextTick(); // wait for update

    const Boxes_2 = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--invalid"
    );
    const Customer_ID_Input_Editor_Red_Box = Boxes_2.at(0);
    const User_ID_Input_Editor_Red_Box = Boxes_2.at(1);

    expect(Customer_ID_Input_Editor_Red_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Red_Box.isVisible()).toBe(true);

    expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Green_Box.isVisible()).toBe(true);

    await wrapper.vm.$nextTick(); // wait for update
    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(false);
    expect(add_user_btn.isVisible()).toBe(false);
    expect(edit_user_btn.isVisible()).toBe(false);
  });
  test("Given the SettingsForm has a valid customer account set as 'Customer account -1' and 'User account -1', When the user now modifies to non-existant user say 'User account -', Then validate that Red Boxes are visible around User ID and based on rules relevant buttons are enabled", async () => {
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
    });

    const Boxes = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--valid"
    );
    const Customer_ID_Input_Editor_Green_Box = Boxes.at(0);
    const User_ID_Input_Editor_Green_Box = Boxes.at(1);

    expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Green_Box.isVisible()).toBe(true);

    await wrapper
      .find("#input-dropdown-widget-user-")
      .setValue("User account -"); // user  doesn't exist.

    await wrapper.vm.$nextTick(); // wait for update

    const Boxes_2 = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--invalid"
    );
    const User_ID_Input_Editor_Red_Box = Boxes_2.at(0);

    expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Red_Box.isVisible()).toBe(true);

    await wrapper.vm.$nextTick(); // wait for update
    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(false);
  });

  test("Given the SettingsForm has a valid customer account set as 'Customer account -1' and 'User account -1', When the user does not modifies any input values, Then validate that Green Box is around the input, and based on rules relevant buttons are enabled", async () => {
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
    store.commit("settings/set_customer_account_ids", array_of_customerids);
    store.commit("settings/set_customer_index", 0);
    store.commit("settings/set_user_index", 0);

    wrapper = mount(ComponentToTest, {
      store,
      localVue,
      data() {
        return {
          customerid: "",
          userid: "",
          valid_customer_focus: false,
          valid_user_focus: false,
          disable_edit_customer: true,
          disable_add_user: true,
          disable_edit_user: true,
        };
      },
    });

    await wrapper.vm.$nextTick(); // wait for update

    await wrapper
      .find("#input-dropdown-widget-cust-")
      .setValue("Customer account -1");
    await wrapper.vm.$nextTick(); // wait for update
    await wrapper
      .find("#input-dropdown-widget-user-")
      .setValue("User account -1");
    await wrapper.vm.$nextTick(); // wait for update

    const Boxes = wrapper.findAll(
      ".div__input-dropdown-controls-content-widget--valid"
    );
    const Customer_ID_Input_Editor_Green_Box = Boxes.at(0);
    const User_ID_Input_Editor_Green_Box = Boxes.at(1);

    expect(Customer_ID_Input_Editor_Green_Box.isVisible()).toBe(true);
    expect(User_ID_Input_Editor_Green_Box.isVisible()).toBe(true);

    const add_customer_btn = wrapper.find(
      ".span__settingsform-customer-add-btn_txt"
    );
    const edit_customer_btn = wrapper.find(
      ".span__settingsform-customer-edit-btn-txt"
    );
    const add_user_btn = wrapper.find(".span__settingsform_user-input-editor");
    const edit_user_btn = wrapper.find(
      ".span__settingsform-user-input-edit-btn-txt"
    );

    expect(add_customer_btn.isVisible()).toBe(true);
    expect(edit_customer_btn.isVisible()).toBe(true);
    expect(add_user_btn.isVisible()).toBe(true);
    expect(edit_user_btn.isVisible()).toBe(true);
  });
});
