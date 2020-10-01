import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/PopDialogForm.vue";
import { PopDialogForm as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

import Vue from "vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import { BFormInput } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import uuid from "@tofandel/uuid-base62";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.use(uuid);

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

afterEach(() => wrapper.destroy());

describe("popdialogForm.vue => Edit Customer", () => {
  const array_of_customerids_HTML = {
    cust_id: 0,
    uuid: "4vqyd62oARXqj9nRUNhtLQ",
    api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
    nickname: "Customer account -1",
    user_ids: [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    ],
  };
  const array_of_customerids_alpha = {
    cust_id: 0,
    uuid: "",
    api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
    nickname: "Customer account -1",
    user_ids: [
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
    ],
  };
  test("When mounting popdialogForm from the build dist file, it loads successfully and the prop `Edit Customer` defines the popdialogForm text of HTML_contenttitle", () => {
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_HTML,
      dataindex: 0,
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(
      ".span__popdialog-form-controls-content-title"
    );
    expect(target_span.text()).toEqual(
      "Edit\u00a0Customer\u00a0Account\u00a0ID"
    );
  });
  test("When mounting popdialogForm from the build dist file, it loads successfully and the prop `Edit Customer` defines the popdialogForm text of HTML_numericid", () => {
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_HTML,
      dataindex: 0,
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(
      ".span__popdialog-form-controls-content-numericid-label"
    );
    expect(target_span.text()).toEqual("Alphanumeric\u00a0ID");
  });

  test("When mounting popdialogForm from the build dist file, it loads successfully and the prop `Edit Customer` defines the popdialogForm text of HTML_apikey", () => {
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_HTML,
      dataindex: 0,
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(
      ".span__popdialog-form-controls-content-apikey-label"
    );
    expect(target_span.text()).toEqual("API\u00a0Key\u00a0(Optional)");
  });

  test("When mounting popdialogForm from the build dist file, it loads successfully and the prop `Edit Customer` defines the popdialogForm text of HTML_idnickname", () => {
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_HTML,
      dataindex: 0,
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(
      ".span__popdialog-form-controls-content-idnickname"
    );
    expect(target_span.text()).toEqual("ID\u00a0Nickname");
  });

  test("Validation of the encoded base57-UUID for 'Edit Customer->Alphanumeric ID' and missing (missing 01lIO) resulting in valid condition", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    array_of_customerids_alpha.uuid = uuid_base57;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.alphanumerickeyState).toEqual(true);
  });
  test("Validation of the encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' and missing (missing 01lIO) resulting in valid condition asseting length", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const len = uuid_base57.length; // This value is 22
    array_of_customerids_alpha.uuid = uuid_base57;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    expect(wrapper.vm.alphanumerickey.length).toEqual(22);
    expect(wrapper.vm.alphanumerickeyState).toEqual(true);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' contains (0) zero resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "0VSckkBYH2An3dqHEyfRRE"; // the first charcter is a (0)zero this has to be discarded.
    array_of_customerids_alpha.uuid = uuidBase62;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 0,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });

  test("Validate if the invalid  encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' contains 21 characters an appropriate invalid text is displayed", async () => {
    const uuidBase62 = "2VSckkBY2An3dqHEyfRRE"; // contains 21 characters only.
    array_of_customerids_alpha.uuid = uuidBase62;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID is 21 characters. All valid IDs are exactly 22 characters."
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' contains (1) one resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSckkBY12An3dqHEyfRRE"; // the middle charcter is a (1) one this has to be discarded.
    array_of_customerids_alpha.uuid = uuidBase62;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 1,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' contains (I) capital I resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSIkkBYH2An3dqHEyfRRE"; // the middle charcter is a (I) I this has to be discarded.
    array_of_customerids_alpha.uuid = uuidBase62;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character I,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' contains (l) l resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHElfRRE"; // the middle charcter is a (l) l this has to be discarded.
    array_of_customerids_alpha.uuid = uuidBase62;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character l,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' contains (0) 0 resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHEyfRR0"; // the middle charcter is a (0) 0 this has to be discarded.
    array_of_customerids_alpha.uuid = uuidBase62;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 0,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' contains (O) O resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHEyfRRO"; // the middle charcter is a (O) O this has to be discarded.
    array_of_customerids_alpha.uuid = uuidBase62;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character O,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit Customer->Alphanumeric ID' error in encoding resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "4vqyd62oARXqj9nRUNhtLQ"; // the middle charcter is a (O) O this has to be discarded.
    array_of_customerids_alpha.uuid = uuidBase62;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "This combination of 22 characters is invalid encoded id"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });

  test("Validate if the valid base57-UUID in the 'Edit Customer->API Key' is accepted on a valid condition", async () => {
    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e17";
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.api_key = apikey_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.apikeyState).toEqual(true);
  });
  test("Validate if the valid base57-UUID in the 'Edit Customer->API Key' is accepted on a valid condition and the length matches the apikey ID", async () => {
    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e17";
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.api_key = apikey_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    expect(wrapper.vm.apikey.length).toEqual(36);
    expect(wrapper.vm.apikeyState).toEqual(true);
  });
  test("Validate if the valid base57-UUID in the 'Edit Customer->API Key' is invalid the tokens have missing hypen on the apikey ID", async () => {
    const apikey_id = "06ad547f fe02-477b-9473-f7977e4d5e17";
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.api_key = apikey_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("Wrong Format of API Key");
    expect(wrapper.vm.apikeyState).toEqual(false);
  });
  test("Validate if the valid base57-UUID in the 'Edit Customer->API Key' is invalid and the length of apikey ID is less than 36", async () => {
    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e1";
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.api_key = apikey_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("Wrong Format of API Key");
    expect(wrapper.vm.apikeyState).toEqual(false);
  });
  test("Validate if the valid base57-UUID in the 'Edit Customer->API Key' is invalid and the length of apikey ID is more than 36", async () => {
    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e14k";
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.api_key = apikey_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("Wrong Format of API Key");
    expect(wrapper.vm.apikeyState).toEqual(false);
  });
  test("Validate if the valid Curi Account ID in the 'Edit Customer->ID Nickname' is valid and has minimum 1 Capital C charcter as Nickname", async () => {
    const nickname_id = "C"; // 1 charcter Capital C
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.nickname = nickname_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.nickname_validation).toEqual(true);
  });
  test("Validate if the valid Curi Account ID in the 'Edit Customer->ID Nickname' is valid and has maximum 20 charcter as Nickname", async () => {
    const nickname_id = "Experiment anemia -1"; // 20 charcters Nickname
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.nickname = nickname_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.nickname_validation).toEqual(true);
  });
  test("Validate if the valid Curi Account ID in the 'Edit Customer->ID Nickname' is invalid and has 0 charcter as Nickname", async () => {
    const nickname_id = null;
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.nickname = nickname_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual("This field is required");
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validate if the valid Curi Account ID in the 'Edit Customer->ID Nickname' is more than 20 charcter as Nickname", async () => {
    const nickname_id = "Experiment anemia alpha cells -1"; // 20 charcters Nickname
    const uuid_valid = "2VSckkBYr2An3dqHEyfRRE";
    array_of_customerids_alpha.uuid = uuid_valid;
    array_of_customerids_alpha.nickname = nickname_id;
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_alpha,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual(
      "Invalid as its more than 20 charcters"
    );
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });

  /*test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains unicode (浩) resulting in display of appropriate invalid text", async () => {
    const propsData = { category: "Add Customer", dialogdata: null };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const uuidBase62 = "2VSckkBY浩2An3dqHEyfRRE"; // the first charcter is a (浩 )unicode this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "Entry permitted for Alphanumeric only"
    );
  }); */
  test("Validation of Edit Customer with all proper values and 'Save-ID' btn results in and event @SaveId is emmitted", async () => {
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_HTML,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    Vue.nextTick(async () => {
      uuid.customBase = new uuid.baseX(
        "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
      );
      const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
      const uuid_base57 = uuid.encode(pre_encode_value);
      const input_alphanumeric = wrapper.find("#input-alphanumeric");
      input_alphanumeric.element.value = uuid_base57;
      await input_alphanumeric.trigger("input");
      const input_apikey = wrapper.find("#input-apikey");
      input_apikey.element.value = "941532a0-6be1-443a-ffff-d57bdf180a52";
      await input_apikey.trigger("input");
      const input_curiaccount = wrapper.find("#input-curiaccount");
      input_curiaccount.element.value = "Customer Account -1";
      await input_curiaccount.trigger("input");
      const save_customer_id = wrapper.find(
        ".span__popdialog-form-controls-save-btn-enable"
      );
      await save_customer_id.trigger("click");
      // assert event has been emitted
      expect(wrapper.emitted("save-id")).toBeTruthy();
    });
  });
  test("Validation of Edit Customer with all proper values and 'Delete ID' btn results in and event @delete-id is emmitted", async () => {
    const propsData = {
      category: "Edit Customer",
      dialogdata: array_of_customerids_HTML,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    Vue.nextTick(async () => {
      const delete_customer_id = wrapper.find(
        ".span__popdialog-form-controls-delete-btn"
      );
      await delete_customer_id.trigger("click");
      // assert event has been emitted
      expect(wrapper.emitted("delete-id")).toBeTruthy();
    });
  });
});

describe("popdialogForm.vue => Edit User", () => {
  const array_of_userid_1 = {
    user_id: 0,
    uuid: "",
    nickname: "User account -1",
  };
  test("Validation of the encoded base57-UUID for 'Edit User->Alphanumeric ID' and missing (missing 01lIO) resulting in valid condition", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    array_of_userid_1.uuid = uuid_base57;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.alphanumerickeyState).toEqual(true);
  });
  test("Validation of the encoded base57-UUID in the 'Edit User->Alphanumeric ID' and missing (missing 01lIO) resulting in valid condition asseting length", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const len = uuid_base57.length; // This value is 22
    array_of_userid_1.uuid = uuid_base57;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    expect(wrapper.vm.alphanumerickey.length).toEqual(22);
    expect(wrapper.vm.alphanumerickeyState).toEqual(true);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit User->Alphanumeric ID' contains (0) zero resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "0VSckkBYH2An3dqHEyfRRE"; // the first charcter is a (0)zero this has to be discarded.
    array_of_userid_1.uuid = uuidBase62;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 0,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });

  test("Validate if the invalid  encoded base57-UUID in the 'Edit User->Alphanumeric ID' contains 21 characters an appropriate invalid text is displayed", async () => {
    const uuidBase62 = "2VSckkBY2An3dqHEyfRRE"; // contains 21 characters only.
    array_of_userid_1.uuid = uuidBase62;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID is 21 characters. All valid IDs are exactly 22 characters."
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit User->Alphanumeric ID' contains (1) one resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSckkBY12An3dqHEyfRRE"; // the middle charcter is a (1) one this has to be discarded.
    array_of_userid_1.uuid = uuidBase62;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 1,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit User->Alphanumeric ID' contains (I) capital I resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSIkkBYH2An3dqHEyfRRE"; // the middle charcter is a (I) I this has to be discarded.
    array_of_userid_1.uuid = uuidBase62;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character I,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit User->Alphanumeric ID' contains (l) l resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHElfRRE"; // the middle charcter is a (l) l this has to be discarded.
    array_of_userid_1.uuid = uuidBase62;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character l,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit User->Alphanumeric ID' contains (0) 0 resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHEyfRR0"; // the middle charcter is a (0) 0 this has to be discarded.
    array_of_userid_1.uuid = uuidBase62;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 0,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit User->Alphanumeric ID' contains (O) O resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHEyfRRO"; // the middle charcter is a (O) O this has to be discarded.
    array_of_userid_1.uuid = uuidBase62;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character O,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Edit User->Alphanumeric ID' error in encoding resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "4vqyd62oARXqj9nRUNhtLQ"; // the middle charcter is a (O) O this has to be discarded.
    array_of_userid_1.uuid = uuidBase62;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "This combination of 22 characters is invalid encoded id"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the valid User Account ID in the 'Edit User->ID Nickname' is valid and has minimum 1 Capital C charcter as Nickname", async () => {
    const nickname_id = "C"; // 1 charcter Capital C
    array_of_userid_1.uuid = "2VSskkBYH2An3dqHEyfRRk";
    array_of_userid_1.nickname = nickname_id;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.nickname_validation).toEqual(true);
  });
  test("Validate if the valid User Account ID in the 'Edit User->ID Nickname' is valid and has maximum 20 charcter as Nickname", async () => {
    const nickname_id = "Experiment anemia -1"; // 20 charcters Nickname
    array_of_userid_1.uuid = "2VSskkBYH2An3dqHEyfRRk";
    array_of_userid_1.nickname = nickname_id;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.nickname_validation).toEqual(true);
  });
  test("Validate if the valid Curi Account ID in the 'Edit User->ID Nickname' is more than 20 charcter as Nickname", async () => {
    const nickname_id = "Experiment anemia alpha cells -1"; // 20 charcters Nickname
    array_of_userid_1.uuid = "2VSskkBYH2An3dqHEyfRRk";
    array_of_userid_1.nickname = nickname_id;
    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_1,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "Invalid as its more than 20 charcters"
    );
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validation of Edit User with all proper values and 'Save-ID' btn results in and event @save-id is emmitted", async () => {
    const array_of_userid_edit = {
      user_id: 0,
      uuid: "2VSskkBYH2An3dqHEyfRRk",
      nickname: "User account -1",
    };

    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_edit,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuid_base57;
    await input_alphanumeric.trigger("input");

    const input_apikey = wrapper.find("#input-apikey");
    input_apikey.element.value = "New User - 1";
    await input_apikey.trigger("input");

    const save_user_id = wrapper.find(
      ".span__popdialog-form-controls-user-saveid-btn"
    );
    await save_user_id.trigger("click");
    // assert event has been emitted
    expect(wrapper.emitted("save-id")).toBeTruthy();
  });
  test("Validation of Edit User with all proper values and 'Delete-ID' btn results in and event @delete-id is emmitted", async () => {
    const array_of_userid_edit = {
      user_id: 0,
      uuid: "2VSskkBYH2An3dqHEyfRRk",
      nickname: "User account -1",
    };

    const propsData = {
      category: "Edit User",
      dialogdata: array_of_userid_edit,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const save_user_id = wrapper.find(
      ".span__popdialog-form-controls-user-delete"
    );
    await save_user_id.trigger("click");
    // assert event has been emitted
    expect(wrapper.emitted("delete-id")).toBeTruthy();
  });
});

describe("popdialogForm.vue ==> Add Customer", () => {
  beforeEach(async () => {
    const propsData = {
      category: "Add Customer",
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
  });

  test("When mounting popdialogForm from the build dist file, it loads successfully and the prop `Add Customer` defines the popdialogForm text of HTML_contenttitle", () => {
    const target_span = wrapper.find(
      ".span__popdialog-form-controls-content-title"
    );

    expect(target_span.text()).toEqual(
      "Add\u00a0New\u00a0Customer\u00a0Account\u00a0ID"
    ); // the value of &nbsp<wbr> is '\u00a0'
  });

  test("When mounting popdialogForm from the component file, it loads successfully and the prop `Add Customer` defines the popdialogForm text of HTML_numericid", () => {
    const target_span = wrapper.find(
      ".span__popdialog-form-controls-content-numericid-label"
    );

    expect(target_span.text()).toEqual("Enter\u00a0Alphanumeric\u00a0ID"); // the value of &nbsp<wbr> is '\u00a0'
  });
  test("When mounting popdialogForm from the component file, it loads successfully and the prop `Add Customer` defines the popdialogForm text of HTML_apikey", () => {
    const target_span = wrapper.find(
      ".span__popdialog-form-controls-content-apikey-label"
    );

    expect(target_span.text()).toEqual(
      "Enter\u00a0API\u00a0Key\u00a0(Optional)"
    ); // the value of &nbsp<wbr> is '\u00a0'
  });

  test("When mounting popdialogForm from the component file, it loads successfully and the prop `Add Customer` defines the popdialogForm text of HTML_idnickname", () => {
    const target_span = wrapper.find(
      ".span__popdialog-form-controls-content-idnickname"
    );

    expect(target_span.text()).toEqual("Enter\u00a0ID\u00a0Nickname"); // the value of &nbsp<wbr> is '\u00a0'
  });
  test("Validation of the encoded base57-UUID for 'Add Customer->Alphanumeric ID' and missing (missing 01lIO) resulting in valid condition", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuid_base57;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.alphanumerickeyState).toEqual(true);
  });
  test("Validation of the encoded base57-UUID in the 'Add Customer->Alphanumeric ID' and missing (missing 01lIO) resulting in valid condition asseting length", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const len = uuid_base57.length; // This value is 22
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuid_base57;
    await input_alphanumeric.trigger("input");
    expect(wrapper.vm.alphanumerickey.length).toEqual(22);
    expect(wrapper.vm.alphanumerickeyState).toEqual(true);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains (0) zero resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "0VSckkBYH2An3dqHEyfRRE"; // the first charcter is a (0)zero this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 0,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains 21 characters an appropriate invalid text is displayed", async () => {
    const uuidBase62 = "2VSckkBY2An3dqHEyfRRE"; // contains 21 characters only.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID is 21 characters. All valid IDs are exactly 22 characters."
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains 23 characters an appropriate invalid text is displayed", async () => {
    const uuidBase62 = "2VSckkBY2An3dqHEyfRREab"; // contains 21 characters only.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID is 23 characters. All valid IDs are exactly 22 characters."
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains (1) one resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSckkBY12An3dqHEyfRRE"; // the middle charcter is a (1) one this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 1,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains (I) capital I resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSIkkBYH2An3dqHEyfRRE"; // the middle charcter is a (I) I this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character I,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains (l) l resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHElfRRE"; // the middle charcter is a (l) l this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character l,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains (O) O resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHEyfRRO"; // the middle charcter is a (O) O this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character O,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' error in encoding resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "4vqyd62oARXqj9nRUNhtLQ"; // Encoding error in the value
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "This combination of 22 characters is invalid encoded id"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });

  test("Validate if the valid base57-UUID in the 'Add Customer->API Key' is accepted on a valid condition", async () => {
    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e17";
    const input_apikey = wrapper.find("#input-apikey");
    input_apikey.element.value = apikey_id;
    await input_apikey.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.apikeyState).toEqual(true);
  });
  test("Validate if the valid base57-UUID in the 'Add Customer->API Key' is accepted on a valid condition and the length matches the apikey ID", async () => {
    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e17";
    const input_apikey = wrapper.find("#input-apikey");
    input_apikey.element.value = apikey_id;
    await input_apikey.trigger("input");
    expect(wrapper.vm.apikey.length).toEqual(36);
    expect(wrapper.vm.apikeyState).toEqual(true);
  });
  test("Validate if the valid base57-UUID in the 'Add Customer->API Key' is invalid the tokens have missing hypen on the apikey ID", async () => {
    const apikey_id = "06ad547f fe02-477b-9473-f7977e4d5e17";
    const input_apikey = wrapper.find("#input-apikey");
    input_apikey.element.value = apikey_id;
    await input_apikey.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("Wrong Format of API Key");
    expect(wrapper.vm.apikeyState).toEqual(false);
  });
  test("Validate if the valid base57-UUID in the 'Add Customer->API Key' is invalid and the length of apikey ID is less than 36", async () => {
    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e1";
    const input_apikey = wrapper.find("#input-apikey");
    input_apikey.element.value = apikey_id;
    await input_apikey.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("Wrong Format of API Key");
    expect(wrapper.vm.apikeyState).toEqual(false);
  });
  test("Validate if the valid base57-UUID in the 'Add Customer->API Key' is invalid and the length of apikey ID is more than 36", async () => {
    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e14k";
    const input_apikey = wrapper.find("#input-apikey");
    input_apikey.element.value = apikey_id;
    await input_apikey.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("Wrong Format of API Key");
    expect(wrapper.vm.apikeyState).toEqual(false);
  });
  test("Validate if the valid Curi Account ID in the 'Add Customer->ID Nickname' is valid and has minimum 1 Capital C charcter as Nickname", async () => {
    const nickname_id = "C"; // 1 charcter Capital C
    const input_nickname = wrapper.find("#input-curiaccount");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.nickname_validation).toEqual(true);
  });
  test("Validate if the valid Curi Account ID in the 'Add Customer->ID Nickname' is valid and has nick name as Cat * lab  charcter as Nickname", async () => {
    const nickname_id = "Cat * lab"; // nick name as Cat * lab
    const input_nickname = wrapper.find("#input-curiaccount");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual(
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /"
    );
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validate if the valid Curi Account ID in the 'Add Customer->ID Nickname' is valid and has nick name as Cat lab`  charcter as Nickname", async () => {
    const nickname_id = "Cat lab` "; // nick name as Cat lab`
    const input_nickname = wrapper.find("#input-curiaccount");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual(
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /"
    );
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validate if the valid Curi Account ID in the 'Add Customer->ID Nickname' is valid and has nick name as Cat lab;  charcter as Nickname", async () => {
    const nickname_id = "Cat lab;"; // nick name as Cat lab;
    const input_nickname = wrapper.find("#input-curiaccount");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual(
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /"
    );
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validate if the valid Curi Account ID in the 'Add Customer->ID Nickname' is valid and has maximum 20 charcter as Nickname", async () => {
    const nickname_id = "Experiment anemia -1"; // 20 charcters Nickname
    const input_nickname = wrapper.find("#input-curiaccount");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.nickname_validation).toEqual(true);
  });
  test("Validate if the valid Curi Account ID in the 'Add Customer->ID Nickname' is invalid and has 0 charcter as Nickname", async () => {
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual("This field is required");
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validate if the valid Curi Account ID in the 'Add Customer->ID Nickname' is more than 20 charcter as Nickname", async () => {
    const nickname_id = "Experiment anemia alpha cells -1"; // 20 charcters Nickname
    const input_nickname = wrapper.find("#input-curiaccount");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-idnickname-input-invalid"
    );
    expect(invalid_field.text()).toEqual(
      "Invalid as its more than 20 charcters"
    );
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });

  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains hypen (-) resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSckkBY-2An3dqHEyfRRE"; // the first charcter is a (-) hypen this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "Entry permitted for Alphanumeric only"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add Customer->Alphanumeric ID' contains scientific symbols (º) resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSckkBYº2An3dqHEyfRRE"; // the first charcter is a (º) symbol this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "Entry permitted for Alphanumeric only"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validation of Add Customer with all proper values and 'Save-ID' btn results in and event @save-id is emmitted", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuid_base57;
    await input_alphanumeric.trigger("input");

    const input_apikey = wrapper.find("#input-apikey");
    input_apikey.element.value = "941532a0-6be1-443a-a9d5-d57bdf180a52";
    await input_apikey.trigger("input");

    const input_curiaccount = wrapper.find("#input-curiaccount");
    input_curiaccount.element.value = "Customer Account -3";
    await input_curiaccount.trigger("input");

    const save_customer_id = wrapper.find(
      ".span__popdialog-form-controls-save-btn-enable"
    );
    await save_customer_id.trigger("click");
    // assert event has been emitted

    const save_id_events = wrapper.emitted("save-id");
    expect(save_id_events).toHaveLength(1);
    expect(save_id_events[0]).toStrictEqual([
      {
        api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        cust_id: 0,
        nickname: "Customer Account -3",
        user_ids: [],
        uuid: "AcErXTjqFRKkVJi3PVEQdN",
      },
    ]);
  });
});

describe("popdialogForm.vue ==> Add User", () => {
  beforeEach(async () => {
    const propsData = {
      category: "Add User",
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
  });
  test("Validation of the encoded base57-UUID for 'Add User->Alphanumeric ID' and missing (missing 01lIO) resulting in valid condition", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuid_base57;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.alphanumerickeyState).toEqual(true);
  });
  test("Validation of the encoded base57-UUID in the 'Add User->Alphanumeric ID' and missing (missing 01lIO) resulting in valid condition asseting length", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const len = uuid_base57.length; // This value is 22
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuid_base57;
    await input_alphanumeric.trigger("input");
    expect(wrapper.vm.alphanumerickey.length).toEqual(22);
    expect(wrapper.vm.alphanumerickeyState).toEqual(true);
  });

  test("Validate if the invalid  encoded base57-UUID in the 'Add User->Alphanumeric ID' contains (0) zero resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "0VSckkBYH2An3dqHEyfRRE"; // the first charcter is a (0)zero this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 0,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });

  test("Validate if the invalid  encoded base57-UUID in the 'Add User->Alphanumeric ID' contains 21 characters an appropriate invalid text is displayed", async () => {
    const uuidBase62 = "2VSckkBY2An3dqHEyfRRE"; // contains 21 characters only.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID is 21 characters. All valid IDs are exactly 22 characters."
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });

  test("Validate if the invalid  encoded base57-UUID in the 'Add User->Alphanumeric ID' contains (1) one resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSckkBY12An3dqHEyfRRE"; // the middle charcter is a (1) one this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character 1,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });

  test("Validate if the invalid  encoded base57-UUID in the 'Add User->Alphanumeric ID' contains (I) capital I resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSIkkBYH2An3dqHEyfRRE"; // the middle charcter is a (I) I this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character I,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add User->Alphanumeric ID' contains (l) l resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHElfRRE"; // the middle charcter is a (l) l this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character l,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add User->Alphanumeric ID' contains (O) O resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "2VSskkBYH2An3dqHEyfRRO"; // the middle charcter is a (O) O this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "The entered ID has an invalid character O,"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the invalid  encoded base57-UUID in the 'Add User->Alphanumeric ID' error in encoding resulting in display of appropriate invalid text", async () => {
    const uuidBase62 = "4vqyd62oARXqj9nRUNhtLQ"; // the middle charcter is a (O) O this has to be discarded.
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuidBase62;
    await input_alphanumeric.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-numericid-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "This combination of 22 characters is invalid encoded id"
    );
    expect(wrapper.vm.alphanumerickeyState).toEqual(false);
  });
  test("Validate if the valid User Account ID in the 'Add User->ID Nickname' is valid and has minimum 1 Capital C charcter as Nickname", async () => {
    const nickname_id = "C"; // 1 charcter Capital C
    const input_nickname = wrapper.find("#input-apikey");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.nickname_validation).toEqual(true);
  });
  test("Validate if the valid Curi Account ID in the 'Add User->ID Nickname' is valid and has maximum 20 charcter as Nickname", async () => {
    const nickname_id = "Experiment anemia -1"; // 20 charcters Nickname
    const input_nickname = wrapper.find("#input-apikey");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("");
    expect(wrapper.vm.nickname_validation).toEqual(true);
  });
  test("Validate if the valid Curi Account ID in the 'Add User->ID Nickname' is invalid and has 0 charcter as Nickname", async () => {
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("This field is required");
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validate if the valid Curi Account ID in the 'Add User->ID Nickname' is more than 20 charcter as Nickname", async () => {
    const nickname_id = "Experiment anemia alpha cells -1"; // 20 charcters Nickname
    const input_nickname = wrapper.find("#input-apikey");
    input_nickname.element.value = nickname_id;
    await input_nickname.trigger("input");
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual(
      "Invalid as its more than 20 charcters"
    );
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validate if the valid User Account ID in the 'Add User->ID Nickname' is invalid and has 0 charcter as Nickname", async () => {
    const invalid_field = wrapper.find(
      ".div__popdialog-form-controls-content-apikey-input-invalid-info"
    );
    expect(invalid_field.text()).toEqual("This field is required");
    expect(wrapper.vm.nickname_validation).toEqual(false);
  });
  test("Validation of Add User with all proper values and 'Save-ID' btn results in and event @save-id is emmitted", async () => {
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const input_alphanumeric = wrapper.find("#input-alphanumeric");
    input_alphanumeric.element.value = uuid_base57;
    await input_alphanumeric.trigger("input");

    const input_apikey = wrapper.find("#input-apikey");
    input_apikey.element.value = "New User - 1";
    await input_apikey.trigger("input");

    const save_user_id = wrapper.find(
      ".span__popdialog-form-controls-user-save-btn"
    );
    await save_user_id.trigger("click");
    // assert event has been emitted
    expect(wrapper.emitted("save-id")).toBeTruthy();
  });
});
