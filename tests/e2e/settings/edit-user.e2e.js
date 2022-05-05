import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const span__button_label = Selector(".span__button_label");

const customer_id_input_field = Selector("#input-widget-field-customer-id");
const username_input_field = Selector("#input-widget-field-username");
const user_password_input_field = Selector("#input-widget-field-passkey-id");

const edit_user_cancel_btn = span__button_label.nth(0);
const edit_user_delete_btn = span__button_label.nth(1);
const edit_user_save_btn = span__button_label.nth(2);

fixture`settings/edit-user`.page // declare the fixture
`http://localhost:8080/settings/edit-user`; // specify the start page

test("testing for the edit user Valid State", async (t) => {
  const screenshot_path_base = path.join("settings", "edit-user");
  const screenshot_path = path.join(screenshot_path_base, "edit-user-valid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the edit user Valid State Cancel Hover", async (t) => {
  const screenshot_path_base = path.join("settings", "edit-user");
  const screenshot_path = path.join(screenshot_path_base, "edit-user-Cancel-Hover");
  await t.hover(edit_user_cancel_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the edit user Valid State Delete Hover", async (t) => {
  const screenshot_path_base = path.join("settings", "edit-user");
  const screenshot_path = path.join(screenshot_path_base, "edit-user-Delete-Hover");
  await t.hover(edit_user_delete_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the edit user Valid State Save Hover", async (t) => {
  const screenshot_path_base = path.join("settings", "edit-user");
  const screenshot_path = path.join(screenshot_path_base, "edit-user-Save-Hover");
  await t.hover(edit_user_save_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the edit user INVALID State", async (t) => {
  const screenshot_path_base = path.join("settings", "edit-user");
  const screenshot_path = path.join(screenshot_path_base, "edit-user-invalid");
  await t.click(customer_id_input_field).pressKey("ctrl+a delete");
  await t.click(username_input_field).pressKey("ctrl+a delete");
  await t.click(user_password_input_field).pressKey("ctrl+a delete");
  await testcafe_page_visual_regression(t, screenshot_path);
});
