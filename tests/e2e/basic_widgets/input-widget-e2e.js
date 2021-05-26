import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const input_field = Selector("#input-widget-field-");
const input_label = Selector(".span__input-content-label");

fixture`basic_widgets/input-widget/basic-input`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-widget/basic-input`; // specify the start page

test("testing the Input Widget for the NO Value Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "input-widget-no-value");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Input Widget for the VALID Value Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "input-widget-valid-value");
  await t.typeText(input_field, "2VSckkBYH2An3dqHEyfRRE");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Input Widget for the spellcheck is set to false so red squiggle line not visible", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "input-widget-with-no-red-squiggle");
  await t.typeText(input_field, "abcellek");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-widget/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-widget/x-y-offset`; // specify the start page

test("testing the Input Widget for the X-Y Offset", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-widget/input-spellcheck`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-widget/input-spellcheck`; // specify the start page

test("testing the Input Widget for the NO Value Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  await t.typeText(input_field, "abcellek");
  await t.click(input_label);
  const screenshot_path = path.join(screenshot_path_base, "input-widget-with-red-squiggle");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-widget/input-width-200`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-widget/input-width-200`; // specify the start page

test("testing the Input Widget for width of 200px", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "input-widget-width-200px");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-widget/input-width-300`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-widget/input-width-300`; // specify the start page

test("testing the Input Widget for width of 300px", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "input-widget-width-300px");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-widget/input-disallow`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-widget/input-disallow`; // specify the start page

test("testing the Input Widget when the input is disabled or not allowed then entering text doesn't update visually", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "input-widget-disallow");
  await t.typeText(input_field, "sample text");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/input-widget/input-validation-rules`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-widget/input-validation-rules`; // specify the start page

test("testing the Input Widget when the input validation rules 1, 2, 3 charters", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "input-widget-validation-rules");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.typeText(input_field, "a");
  await t.click(input_label);
  const screenshot_path_one = path.join(screenshot_path_base, "input-widget-validation-rules-one-charter");
  await testcafe_page_visual_regression(t, screenshot_path_one);
  await t.typeText(input_field, "b");
  await t.click(input_label);
  const screenshot_path_two = path.join(screenshot_path_base, "input-widget-validation-rules-two-charter");
  await testcafe_page_visual_regression(t, screenshot_path_two);
  await t.typeText(input_field, "c");
  await t.click(input_label);
  const screenshot_path_three = path.join(
    screenshot_path_base,
    "input-widget-validation-rules-three-charter"
  );
  await testcafe_page_visual_regression(t, screenshot_path_three);
});

fixture`basic_widgets/input-widget/input-no-title-label`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/input-widget/input-no-title-label`; // specify the start page

test("testing the Input Widget when the input is disabled or not allowed then entering text doesn't update visually", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "input-widget");
  const screenshot_path = path.join(screenshot_path_base, "input-widget-no-title-label");
  await testcafe_page_visual_regression(t, screenshot_path);
});
