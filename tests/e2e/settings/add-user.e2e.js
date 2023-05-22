import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const customer_id_input_field = Selector("#input-widget-field-customer-id");
const username_input_field = Selector("#input-dropdown-widget-username");
const user_password_input_field = Selector("#input-widget-field-passkey-id");
const span__button_label = Selector(".span__button_label");

const add_user_cancel_btn = span__button_label.nth(0);
const user_save_btn = span__button_label.nth(1);

fixture`settings/add-user`.page // declare the fixture
`http://localhost:8080/settings/add-user`; // specify the start page

test("testing for the add user INVALID State", async (t) => {
  const screenshot_path_base = path.join("settings", "add-user");
  const screenshot_path = path.join(screenshot_path_base, "add-user-invalid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the add user VALID State", async (t) => {
  const screenshot_path_base = path.join("settings", "add-user");

  await t.typeText(customer_id_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(user_password_input_field, "ba86b8f0-6fdf-4944-87a0-8a491a19490e");
  await t.typeText(username_input_field, "Curi Bio User-1");
  const screenshot_path = path.join(screenshot_path_base, "add-user-valid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the add user VALID State and CANCEL HOVER", async (t) => {
  const screenshot_path_base = path.join("settings", "add-user");

  await t.typeText(customer_id_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(user_password_input_field, "ba86b8f0-6fdf-4944-87a0-8a491a19490e");
  await t.typeText(username_input_field, "Curi Bio User-1");
  await t.hover(add_user_cancel_btn);
  const screenshot_path = path.join(screenshot_path_base, "add-user-valid-Cancel-Hover");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the add user VALID State and SAVE HOVER", async (t) => {
  const screenshot_path_base = path.join("settings", "add-user");

  await t.typeText(customer_id_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(user_password_input_field, "ba86b8f0-6fdf-4944-87a0-8a491a19490e");
  await t.typeText(username_input_field, "Curi Bio User-1");
  await t.hover(user_save_btn);
  const screenshot_path = path.join(screenshot_path_base, "add-user-valid-Save-Hover");
  await testcafe_page_visual_regression(t, screenshot_path);
});
