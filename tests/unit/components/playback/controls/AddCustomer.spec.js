import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/AddCustomer.vue";
import { AddCustomer as DistComponentToTest } from "@/dist/mantarray.common";
// import { shallowMount } from "@vue/test-utils";

// import Vue from "vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
// import { BFormInput } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import uuid from "@tofandel/uuid-base62";
import { TextValidation } from "@/js_utils/text_validation.js";
let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.use(uuid);

let NuxtStore;
let store;

describe("AddCustomer.vue", () => {
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
  });
  test("When mounting AddCustomer from the build dist file, Then it loads successfully and the `Add Customer` defined title text is rendered", () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const target_span = wrapper.find(
      ".span__addcustomer-form-controls-content-title"
    );

    expect(target_span.text()).toStrictEqual("Add New Customer Account ID");
  });
});

describe("AddCustomer.enter_uuidbase57", () => {
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    store = await NuxtStore.createStore();
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  afterEach(() => wrapper.destroy());
  test("Given a  encoded base57-UUID for 'Add Customer->Alphanumeric ID' is input, When the base57-UUID is matching all validation criteria, Then this results in valid condition and feedback text is <empty>", async () => {
    /* eslint-disable new-cap */
    uuid.customBase = new uuid.baseX(
      "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    );
    /* eslint-enable */

    /* Following happens in the below section :-      */
    /* a) User has an encoded value in uuid_base57 */
    /* b) User enter the the uuid_base57 value into input with
           id #input-widget @(0) location in DOM */
    const spied_text_validator = jest.spyOn(
      TextValidation.prototype,
      "validate_uuidBase_fiftyseven_encode"
    );
    const pre_encode_value = "ba86b8f0-6fdf-4944-87a0-8a491a19490e";
    const uuid_base57 = uuid.encode(pre_encode_value);
    const input_all = wrapper.findAll("#input-widget");
    const input_alphanumeric = input_all.at(0);
    input_alphanumeric.element.value = uuid_base57;
    await input_alphanumeric.trigger("input");

    await wrapper.vm.$nextTick(); // wait for update

    /* c) InputWidget now emmits and event update with uuid_base57 */

    wrapper.vm.$emit("update", "");
    wrapper.vm.$emit("update", uuid_base57);

    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[1]).toStrictEqual([uuid_base57]);

    /* d) This results in assigning the prop enter_uuidbase57 with uuid_base57 */

    wrapper.vm.enter_uuidbase57 = uuid_base57;

    /* e) The AddCustomer now invokes the watch function of enter_uuidbase57 from the solution shared from vue-test-utils in the link below */
    /* https://github.com/vuejs/vue-test-utils/issues/331#issuecomment-382037200 <Imiller1990> */

    wrapper.vm.$options.watch.enter_uuidbase57.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates
    expect(spied_text_validator).toHaveBeenCalledWith(uuid_base57);
    /* f) The Javascript function of validation TextValidation.validate is executed */

    await wrapper.vm.$nextTick(); // wait for update

    /* g) The response feedback text or invalid_text is set to "" */

    expect(wrapper.vm.error_text_uuid).toStrictEqual("");
  });
  test.each([
    [
      "(0) zero",
      "0VSckkBYH2An3dqHEyfRRE",
      "The entered ID has an invalid character 0,",
    ],
    [
      "21 characters",
      "2VSckkBY2An3dqHEyfRRE",
      "The entered ID is 21 characters. All valid IDs are exactly 22 characters.",
    ],
    [
      "23 characters",
      "2VSckkBY2An3dqHEyfRREab",
      "The entered ID is 23 characters. All valid IDs are exactly 22 characters.",
    ],
    [
      "(1) one",
      "2VSckkBY12An3dqHEyfRRE",
      "The entered ID has an invalid character 1,",
    ],
    [
      "(I) capital I",
      "2VSIkkBYH2An3dqHEyfRRE",
      "The entered ID has an invalid character I,",
    ],
    [
      "(l) l",
      "2VSskkBYH2An3dqHElfRRE",
      "The entered ID has an invalid character l,",
    ],
    [
      "(O) O",
      "2VSskkBYH2An3dqHEyfRRO",
      "The entered ID has an invalid character O,",
    ],
    [
      "error in encoding",
      "4vqyd62oARXqj9nRUNhtLQ",
      "This combination of 22 characters is invalid encoded id",
    ],
    [
      "(-) hypen",
      "2VSckkBY-2An3dqHEyfRRE",
      "Entry permitted for Alphanumeric only",
    ],
    [
      "(º) symbols",
      "2VSckkBYº2An3dqHEyfRRE",
      "Entry permitted for Alphanumeric only",
    ],
  ])(
    "Given an invalid encoded base57-UUID for 'Add Customer->Alphanumeric ID' is input, When the input contains %s resulting in failing the critera, Then display of appropriate invalid text occur",
    async (error, uuid, message) => {
      const uuidBase57_error = uuid; // this contains the error.
      const input_all = wrapper.findAll("#input-widget");
      const input_alphanumeric = input_all.at(0);
      input_alphanumeric.element.value = uuidBase57_error;
      await input_alphanumeric.trigger("input");

      await wrapper.vm.$nextTick(); // wait for update
      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", uuidBase57_error);

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      expect(wrapper.emitted().update[1]).toStrictEqual([uuidBase57_error]);
      wrapper.vm.enter_uuidbase57 = uuidBase57_error;
      wrapper.vm.$options.watch.enter_uuidbase57.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.error_text_uuid).toStrictEqual(message);
    }
  );
});

describe("AddCustomer.enter_apikey", () => {
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    store = await NuxtStore.createStore();
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  afterEach(() => wrapper.destroy());

  test("Given a  API Key for 'Add Customer->API Key' is input, When the API Key is matching all validation criteria, Then this results in valid condition and feedback text is <empty>", async () => {
    /* Following happens in the below section :-      */
    /* a) User has an API Key value in apikey_id */
    /* b) User enter the the apikey_id value into input with
           id #input-widget @(1) location in DOM */

    const apikey_id = "06ad547f-fe02-477b-9473-f7977e4d5e17";
    const input_all = wrapper.findAll("#input-widget");
    const input_alphanumeric = input_all.at(1);
    input_alphanumeric.element.value = apikey_id;
    await input_alphanumeric.trigger("input");

    await wrapper.vm.$nextTick(); // wait for update

    /* c) InputWidget now emmits and event update with apikey_id */

    wrapper.vm.$emit("update", "");
    wrapper.vm.$emit("update", apikey_id);

    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[1]).toStrictEqual([apikey_id]);

    /* d) This results in assigning the prop enter_apikey with apikey_id */

    wrapper.vm.enter_apikey = apikey_id;

    /* e) The AddCustomer now invokes the watch function of enter_apikey from the solution shared from vue-test-utils in the link below */
    /* https://github.com/vuejs/vue-test-utils/issues/331#issuecomment-382037200 <Imiller1990> */

    wrapper.vm.$options.watch.enter_apikey.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates

    /* f) The Javascript function of validation TextValidation.validate is executed */

    await wrapper.vm.$nextTick(); // wait for update

    /* g) The response feedback text or invalid_text is set to "" */

    expect(wrapper.vm.error_text_api).toStrictEqual("");
  });
  test.each([
    [
      "missing hypen",
      "06ad547f fe02-477b-9473-f7977e4d5e17",
      "Wrong Format of API Key",
    ],
    [
      "less than 36",
      "06ad547f-fe02-477b-9473-f7977e4d5e1",
      "Wrong Format of API Key",
    ],
    [
      "more than 36",
      "06ad547f-fe02-477b-9473-f7977e4d5e14k",
      "Wrong Format of API Key",
    ],
  ])(
    "Given an invalid API Key for 'Add Customer->API Key' is input, When the input contains %s resulting in failing the critera, Then display of appropriate invalid text occur",
    async (error, apikey, message) => {
      const apikey_id = apikey;
      const input_all = wrapper.findAll("#input-widget");
      const input_alphanumeric = input_all.at(1);
      input_alphanumeric.element.value = apikey_id;
      await input_alphanumeric.trigger("input");

      await wrapper.vm.$nextTick(); // wait for update
      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", apikey_id);

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      expect(wrapper.emitted().update[1]).toStrictEqual([apikey_id]);
      wrapper.vm.enter_apikey = apikey_id;

      wrapper.vm.$options.watch.enter_apikey.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates

      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.error_text_api).toStrictEqual(message);
    }
  );
});

describe("AddCustomer.enter_nickname", () => {
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    store = await NuxtStore.createStore();
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  afterEach(() => wrapper.destroy());

  test("Given a  Nickname for 'Add Customer->ID Nickname' is input, When the Nickname is matching all validation criteria, Then this results in valid condition and feedback text is <empty>", async () => {
    /* Following happens in the below section :-      */
    /* a) User has an nickname value in nickname_id */
    /* b) User enter the the nickname_id value into input with
           id #input-widget @(2) location in DOM */

    const nickname_id = "C";
    const input_all = wrapper.findAll("#input-widget");
    const input_alphanumeric = input_all.at(1);
    input_alphanumeric.element.value = nickname_id;
    await input_alphanumeric.trigger("input");

    await wrapper.vm.$nextTick(); // wait for update

    /* c) InputWidget now emmits and event update with nickname_id */

    wrapper.vm.$emit("update", "");
    wrapper.vm.$emit("update", nickname_id);

    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[1]).toStrictEqual([nickname_id]);

    /* d) This results in assigning the prop enter_apikey with apikey_id */

    wrapper.vm.enter_nickname = nickname_id;

    /* e) The AddCustomer now invokes the watch function of enter_apikey from the solution shared from vue-test-utils in the link below */
    /* https://github.com/vuejs/vue-test-utils/issues/331#issuecomment-382037200 <Imiller1990> */

    wrapper.vm.$options.watch.enter_nickname.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates

    /* f) The Javascript function of validation TextValidation.validate is executed */

    await wrapper.vm.$nextTick(); // wait for update

    /* g) The response feedback text or invalid_text is set to "" */

    expect(wrapper.vm.error_text_nickname).toStrictEqual("");
  });
  test.each([
    [
      "* asterisk",
      "Cat * lab",
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /",
    ],
    [
      "` left quote",
      "Cat lab`",
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /",
    ],
    [
      "; semi-colon",
      "Cat lab;",
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /",
    ],
    [
      "more than 20 charcter",
      "Experiment anemia alpha cells -1",
      "Invalid as its more than 20 charcters",
    ],
    ["null", null, "This field is required"],
    ["contains maximum 20", "Experiment anemia -1", ""],
  ])(
    "Given an invalid Nickname for 'Add Customer->ID Nickname' is input, When the input contains %s resulting in failing the critera, Then display of appropriate invalid text occur",
    async (error, nickname, message) => {
      const nickname_id = nickname;
      const input_all = wrapper.findAll("#input-widget");
      const input_alphanumeric = input_all.at(2);
      input_alphanumeric.element.value = nickname_id;
      await input_alphanumeric.trigger("input");
      await wrapper.vm.$nextTick(); // wait for update

      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", nickname_id);
      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      expect(wrapper.emitted().update[1]).toStrictEqual([nickname_id]);
      wrapper.vm.enter_nickname = nickname_id;
      wrapper.vm.$options.watch.enter_nickname.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.vm.error_text_nickname).toStrictEqual(message);
    }
  );
});

describe("AddCustomer.enable_save_button", () => {
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    store = await NuxtStore.createStore();
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  afterEach(() => wrapper.destroy());

  test.each([
    [
      "0VSckkBYH2An3dqHEyfRRE",
      "The entered ID has an invalid character 0,",
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "",
      "Experiment anemia -1",
      "",
      [true, false],
    ],
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "",
      "06ad547f fe02-477b-9473-f7977e4d5e17",
      "Wrong Format of API Key",
      "Experiment anemia -1",
      "",
      [true, false],
    ],
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "",
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "",
      "Cat * lab",
      "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /",
      [true, false],
    ],
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "",
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "",
      "Experiment anemia -1",
      "",
      [true, true],
    ],
  ])(
    "Given an UUID, API Key, Nickname for 'Add Customer' as input, When the input contains based on valid the critera or failure, Then display of Label 'Save ID' is visible or greyed",
    async (
      uuid,
      invalid_uuid,
      apikey,
      invalid_apikey,
      nickname,
      invalid_nickname,
      enabelist
    ) => {
      const uuidBase57_error = uuid; // this contains the error.
      const input_all = wrapper.findAll("#input-widget");
      const input_alphanumeric = input_all.at(0);
      input_alphanumeric.element.value = uuidBase57_error;
      await input_alphanumeric.trigger("input");

      await wrapper.vm.$nextTick(); // wait for update
      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", uuidBase57_error);

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      wrapper.vm.enter_uuidbase57 = uuidBase57_error;
      wrapper.vm.$options.watch.enter_uuidbase57.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.error_text_uuid).toStrictEqual(invalid_uuid);

      const apikey_id = apikey;
      const input_apikey = input_all.at(1);
      input_apikey.element.value = apikey_id;
      await input_apikey.trigger("input");

      await wrapper.vm.$nextTick(); // wait for update
      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", apikey_id);

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      wrapper.vm.enter_apikey = apikey_id;

      wrapper.vm.$options.watch.enter_apikey.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates

      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.error_text_api).toStrictEqual(invalid_apikey);

      const nickname_id = nickname;
      const input_nickname = input_all.at(2);
      input_nickname.element.value = nickname_id;
      await input_nickname.trigger("input");
      await wrapper.vm.$nextTick(); // wait for update

      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", nickname_id);
      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      wrapper.vm.enter_nickname = nickname_id;
      wrapper.vm.$options.watch.enter_nickname.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.vm.error_text_nickname).toStrictEqual(invalid_nickname);
      expect(wrapper.vm.enablelist_add_customer).toStrictEqual(enabelist);
    }
  );
});

describe("AddCustomer.clicked_button", () => {
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    store = await NuxtStore.createStore();
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  afterEach(() => wrapper.destroy());

  test.each([
    [
      "5FY8KwTsQaUJ2KzHJGetfE",
      "",
      "06ad547f-fe02-477b-9473-f7977e4d5e17",
      "",
      "Experiment anemia -1",
      "",
      [true, true],
      1,
    ],
  ])(
    "Given an UUID, API Key, Nickname for 'Add Customer' as input, When the input contains based on valid the critera, Then buttons labels of Cancel and Save ID are clicked",
    async (
      uuid,
      invalid_uuid,
      apikey,
      invalid_apikey,
      nickname,
      invalid_nickname,
      enabelist,
      label
    ) => {
      const uuidBase57_error = uuid; // this contains the error.
      const input_all = wrapper.findAll("#input-widget");
      const input_alphanumeric = input_all.at(0);
      input_alphanumeric.element.value = uuidBase57_error;
      await input_alphanumeric.trigger("input");

      await wrapper.vm.$nextTick(); // wait for update
      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", uuidBase57_error);

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      wrapper.vm.enter_uuidbase57 = uuidBase57_error;
      wrapper.vm.$options.watch.enter_uuidbase57.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.error_text_uuid).toStrictEqual(invalid_uuid);

      const apikey_id = apikey;
      const input_apikey = input_all.at(1);
      input_apikey.element.value = apikey_id;
      await input_apikey.trigger("input");

      await wrapper.vm.$nextTick(); // wait for update
      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", apikey_id);

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      wrapper.vm.enter_apikey = apikey_id;

      wrapper.vm.$options.watch.enter_apikey.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates

      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.error_text_api).toStrictEqual(invalid_apikey);

      const nickname_id = nickname;
      const input_nickname = input_all.at(2);
      input_nickname.element.value = nickname_id;
      await input_nickname.trigger("input");
      await wrapper.vm.$nextTick(); // wait for update

      wrapper.vm.$emit("update", "");
      wrapper.vm.$emit("update", nickname_id);
      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.emitted().update).toBeTruthy();
      wrapper.vm.enter_nickname = nickname_id;
      wrapper.vm.$options.watch.enter_nickname.call(wrapper.vm); // we initiate the watch function to verify if the expected value in the prop happens and it updates

      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.vm.error_text_nickname).toStrictEqual(invalid_nickname);
      expect(wrapper.vm.enablelist_add_customer).toStrictEqual(enabelist);

      const customer_btn_label = wrapper.findAll(".span__button_label");
      const save_btn = customer_btn_label.at(label);
      await save_btn.trigger("click");

      wrapper.vm.$emit("btn-click", label);
      const child_id_events = wrapper.emitted("btn-click");
      expect(child_id_events).toHaveLength(1);
      expect(child_id_events).toStrictEqual([[1]]);
      //  expect(wrapper.vm.clicked_button).toHaveBeenCalledWith(label);
    }
  );
});
