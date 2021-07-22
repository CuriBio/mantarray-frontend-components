import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const input_field = Selector("#input-dropdown-widget-");
const input_label = Selector(".span__input-dropdown-content-label");
const input_selected_handler = Selector(".input-selected-handler");

fixture`basic_widgets/input-dropdown/basic-dropdown`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-dropdown/basic-dropdown`; // specify the start page

test("testing the Input DropDown for the NO Value Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-dropdown");
  const screenshot_path = path.join(screenshot_path_base, "input-dropdown-no-value");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Input DropDown for the VALID Value Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-dropdown");
  const screenshot_path = path.join(screenshot_path_base, "input-dropdown-valid-value");
  await t.typeText(input_field, "Customer Account 1");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Input DropDown for the INVALID Value Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-dropdown");
  const screenshot_path = path.join(screenshot_path_base, "input-dropdown-invalid-value");
  await t.typeText(input_field, "New Customer -1");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-dropdown/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-dropdown/x-y-offset`; // specify the start page

test("testing the Input Widget for the X-Y Offset", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-dropdown");
  const screenshot_path = path.join(screenshot_path_base, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-dropdown/input-dropdown-width-200`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-dropdown/input-dropdown-width-200`; // specify the start page

test("testing the Input DropDown for width of 200px", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-dropdown");
  const screenshot_path = path.join(screenshot_path_base, "input-dropdown-width-200px");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-dropdown/input-dropdown-width-300`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-dropdown/input-dropdown-width-300`; // specify the start page

test("testing the Input Widget for width of 300px", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-dropdown");
  const screenshot_path = path.join(screenshot_path_base, "input-dropdown-width-300px");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-dropdown/input-no-title-dropdown`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-dropdown/input-no-title-dropdown`; // specify the start page

test("testing the Input Widget when the title of widget is <empty> the widget height correction happens and the rest of input dropdown features are rendered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-dropdown");
  const screenshot_path = path.join(screenshot_path_base, "input-dropdown-no-title-dropdown");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-dropdown/input-dropdown-event`
  .page // declare the fixture
`http://localhost:8080/basic_widgetsr/input-dropdown/input-dropdown-event`; // specify the start page
test("testing the InputDropDown and options in the dropdown 1,2,3 choosen and asserted", async (t) => {
  const nicknames_list = ["Customer Account 1", "Customer Account-2", "Customer Account-3"];
  var count = await nicknames_list.count;

  for (var i = 0; i < count; i++) {
    await await t.typeText(input_field, nicknames_list[i]);
    await t
      .expect(input_selected_handler.textContent)
      .contains("The Input Option that was selected :" + nicknames_list[i]);
  }
});
