import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const user_alphanumeric_input_field = Selector(
  "#input-widget-field-alphanumeric-id"
);

const user_id_nickname_input_field = Selector(
  "#input-widget-field-nickname-id"
);
const span__button_label = Selector(".span__button_label");

const add_user_cancel_btn = span__button_label.nth(0);
const add_user_save_btn = span__button_label.nth(1);

fixture`settings/add-user`.page // declare the fixture
`http://localhost:8080/settings/add-user`; // specify the start page

test("testing the add user INVALID State", async (t) => {
  const screenshot_path_base = path.join("settings", "add-user");
  const screenshot_path = path.join(screenshot_path_base, "add-user-invalid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the add user Valid State", async (t) => {
  const screenshot_path_base = path.join("settings", "add-user");
  await t.typeText(user_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(user_id_nickname_input_field, "User Account-1");
  const screenshot_path = path.join(screenshot_path_base, "add-user-valid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the add user Valid State Cancel Hover", async (t) => {
  const screenshot_path_base = path.join("settings", "add-user");
  await t.typeText(user_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(user_id_nickname_input_field, "User Account-1");
  await t.hover(add_user_cancel_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "add-user-Cancel-Hover"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the add user Valid State Save Hover", async (t) => {
  const screenshot_path_base = path.join("settings", "add-user");
  await t.typeText(user_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(user_id_nickname_input_field, "User Account-1");
  await t.hover(add_user_save_btn);
  const screenshot_path = path.join(
    screenshot_path_base,
    "add-user-Save-Hover"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
