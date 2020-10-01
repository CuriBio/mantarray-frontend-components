import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curibio/frontend_test_utils";

const customer_alphanumeric_input_field = Selector("#input-alphanumeric");

const customer_apikey_input_field = Selector("#input-apikey");

const customer_idnickname_input_field = Selector("#input-curiaccount");

const add_customer_cancel_btn = Selector(
  ".span__popdialog-form-controls-cancel-btn"
);
const customer_save_btn = Selector(
  ".span__popdialog-form-controls-save-btn-enable"
); // common for all
const edit_customer_cancel_btn = Selector(
  ".span__popdialog-form-controls-edit-cancel-btn"
);
const edit_customer_delete_btn = Selector(
  ".span__popdialog-form-controls-delete-btn"
);
const edit_customer_save_btn = Selector(
  ".span__popdialog-form-controls-saveid-btn"
);
const add_user_cancel_btn = Selector(
  ".span__popdialog-form-controls-user-cancel-btn"
);
const edit_user_cancel_btn = Selector(
  ".span__popdialog-form-controls-user-edit-cancel-btn"
);
const edit_user_delete_btn = Selector(
  ".span__popdialog-form-controls-user-delete"
);
const edit_user_save_btn = Selector(
  ".span__popdialog-form-controls-user-saveid-btn"
);

// the fixture declares what we are testing
fixture`playback/controls/player/settings-button/settings-form-vuex`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/settings-form-vuex`; // specify the start page

test("testing the settings page should display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-settings-form-vuex"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/settings-button/settings-form-no-vuex`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/settings-form-no-vuex`; // specify the start page

test("testing the settings page should display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-settings-form-no-vuex"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-add-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-add-customer`; // specify the start page

test("testing the popdialogform for the add customer INVALID State", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-add-customer-invalid"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-add-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-add-customer`; // specify the start page

test("testing the popdialogform for the add customer VALID State", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );

  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(
    customer_apikey_input_field,
    "ba86b8f0-6fdf-4944-87a0-8a491a19490e"
  );
  await t.typeText(customer_idnickname_input_field, "Curi Bio Customer-1");
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-add-customer-valid"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-add-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-add-customer`; // specify the start page

test("testing the popdialogform for the add customer VALID State and CANCEL HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );

  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(
    customer_apikey_input_field,
    "ba86b8f0-6fdf-4944-87a0-8a491a19490e"
  );
  await t.typeText(customer_idnickname_input_field, "Curi Bio Customer-1");
  await t.hover(add_customer_cancel_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-add-customer-valid-CANCEL-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-add-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-add-customer`; // specify the start page

test("testing the popdialogform for the add customer VALID State and SAVE HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );

  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(
    customer_apikey_input_field,
    "ba86b8f0-6fdf-4944-87a0-8a491a19490e"
  );
  await t.typeText(customer_idnickname_input_field, "Curi Bio Customer-1");
  await t.hover(customer_save_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-add-customer-valid-SAVE-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-edit-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-edit-customer`; // specify the start page

test("testing the popdialogform for the edit customer VALID State", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  // await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  // await t.typeText(
  //  customer_apikey_input_field,
  //  "ba86b8f0-6fdf-4944-87a0-8a491a19490e"
  // );
  // await t.typeText(customer_idnickname_input_field, "Curi Bio Customer-1");
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-edit-customer-valid"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-edit-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-edit-customer`; // specify the start page

test("testing the popdialogform for the edit customer VALID and CANCEL HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );

  await t.hover(edit_customer_cancel_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-edit-customer-valid-CANCEL-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-edit-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-edit-customer`; // specify the start page

test("testing the popdialogform for the edit customer VALID and DELETE HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );

  await t.hover(edit_customer_delete_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-edit-customer-valid-DELETE-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-edit-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-edit-customer`; // specify the start page

test("testing the popdialogform for the edit customer VALID and SAVE HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );

  await t.hover(edit_customer_save_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-edit-customer-valid-SAVE-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-add-user`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-add-user`; // specify the start page

test("testing the popdialogform for the add user INVALID State", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-add-user-invalid"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-add-user`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-add-user`; // specify the start page

test("testing the popdialogform for the add user VALID State", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(customer_apikey_input_field, "User Account-1");
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-add-user-valid"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-add-user`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-add-user`; // specify the start page

test("testing the popdialogform for the add user VALID State and CANCEL HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(customer_apikey_input_field, "User Account-1");
  await t.hover(add_user_cancel_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-add-user-valid-CANCEL-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-add-user`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-add-user`; // specify the start page

test("testing the popdialogform for the add user VALID State and SAVE HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(customer_apikey_input_field, "User Account-1");
  await t.hover(customer_save_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-add-user-valid-SAVE-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-edit-user`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-edit-user`; // specify the start page

test("testing the popdialogform for the edit user VALID State", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-edit-user-valid"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-edit-user`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-edit-user`; // specify the start page

test("testing the popdialogform for the edit user VALID State CANCEL HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  await t.hover(edit_user_cancel_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-edit-user-valid-CANCEL-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-edit-user`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-edit-user`; // specify the start page

test("testing the popdialogform for the edit user VALID State DELETE HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  await t.hover(edit_user_delete_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-edit-user-valid-DELETE-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/dialog-form-edit-user`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/dialog-form-edit-user`; // specify the start page

test("testing the popdialogform for the edit user VALID State SAVE HOVER", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  await t.hover(edit_user_save_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "dialog-form-edit-user-valid-SAVE-HOVER"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
