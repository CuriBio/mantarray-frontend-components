import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const add_customer_btn = Selector("#add-a-customer");
const edit_customer_btn = Selector("#edit-a-customer");
const add_user_btn = Selector("#add-a-user");
const edit_user_btn = Selector("#edit-a-user");

// the fixture declares what we are testing
fixture`settings/settings-form-vuex`
  .page // declare the fixture
`http://localhost:8080/settings/settings-form-vuex`; // specify the start page

test("testing the settings page should display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join("settings", "settings-form");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-settings-form-vuex"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`settings/settings-form-vuex`
  .page // declare the fixture
`http://localhost:8080/settings/settings-form-vuex`; // specify the start page

test("testing the settings page and add-customer should overlap display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join("settings", "settings-form");
  const screenshot_path = path.join(
    screenshot_path_base,
    "settings-form-with-add-customer"
  );
  await t.click(add_customer_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`settings/settings-form-vuex`
  .page // declare the fixture
`http://localhost:8080/settings/settings-form-vuex`; // specify the start page

test("testing the settings page and edit-customer should overlap display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join("settings", "settings-form");
  const screenshot_path = path.join(
    screenshot_path_base,
    "settings-form-with-edit-customer"
  );
  await t.click(edit_customer_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`settings/settings-form-vuex`
  .page // declare the fixture
`http://localhost:8080/settings/settings-form-vuex`; // specify the start page

test("testing the settings page and add-user should overlap display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join("settings", "settings-form");
  const screenshot_path = path.join(
    screenshot_path_base,
    "settings-form-with-add-user"
  );
  await t.click(add_user_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`settings/settings-form-vuex`
  .page // declare the fixture
`http://localhost:8080/settings/settings-form-vuex`; // specify the start page

test("testing the settings page and edit-user should overlap display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join("settings", "settings-form");
  const screenshot_path = path.join(
    screenshot_path_base,
    "settings-form-with-edit-user"
  );
  await t.click(edit_user_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`settings/settings-form-no-vuex`
  .page // declare the fixture
`http://localhost:8080/settings/settings-form-no-vuex`; // specify the start page

test("testing the settings page should display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join("settings", "settings-form");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-settings-form-no-vuex"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
