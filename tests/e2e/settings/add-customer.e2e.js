import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const customer_alphanumeric_input_field = Selector("#input-widget-field-alphanumeric-id");
const customer_apikey_input_field = Selector("#input-widget-field-apikey-id");
const customer_id_nickname_input_field = Selector("#input-widget-field-nickname-id");
const span__button_label = Selector(".span__button_label");

const add_customer_cancel_btn = span__button_label.nth(0);
const customer_save_btn = span__button_label.nth(1);

fixture`settings/add-customer`
  .page // declare the fixture
`http://localhost:8080/settings/add-customer`; // specify the start page

test("testing for the add customer INVALID State", async (t) => {
  const screenshot_path_base = path.join("settings", "add-customer");
  const screenshot_path = path.join(screenshot_path_base, "add-customer-invalid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the add customer VALID State", async (t) => {
  const screenshot_path_base = path.join("settings", "add-customer");

  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(customer_apikey_input_field, "ba86b8f0-6fdf-4944-87a0-8a491a19490e");
  await t.typeText(customer_id_nickname_input_field, "Curi Bio Customer-1");
  const screenshot_path = path.join(screenshot_path_base, "add-customer-valid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the add customer VALID State and CANCEL HOVER", async (t) => {
  const screenshot_path_base = path.join("settings", "add-customer");

  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(customer_apikey_input_field, "ba86b8f0-6fdf-4944-87a0-8a491a19490e");
  await t.typeText(customer_id_nickname_input_field, "Curi Bio Customer-1");
  await t.hover(add_customer_cancel_btn);
  const screenshot_path = path.join(screenshot_path_base, "add-customer-valid-Cancel-Hover");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the add customer VALID State and SAVE HOVER", async (t) => {
  const screenshot_path_base = path.join("settings", "add-customer");

  await t.typeText(customer_alphanumeric_input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.typeText(customer_apikey_input_field, "ba86b8f0-6fdf-4944-87a0-8a491a19490e");
  await t.typeText(customer_id_nickname_input_field, "Curi Bio Customer-1");
  await t.hover(customer_save_btn);
  const screenshot_path = path.join(screenshot_path_base, "add-customer-valid-Save-Hover");
  await testcafe_page_visual_regression(t, screenshot_path);
});
