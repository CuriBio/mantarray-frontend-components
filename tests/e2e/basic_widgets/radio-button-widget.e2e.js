import { Selector } from "testcafe";

const path = require("path");

const radio_group = Selector(".custom-control-input");
const radio_label = Selector(".custom-control-label");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

fixture`basic_widgets/radiobutton-widget/basic-radio`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/radiobutton-widget/basic-radio`; // specify the start page

test("testing the Radio Button Widget for the NO pre-selected option Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "radio-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-radio-no-selection");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Radio Button Widget for the NO pre-selected option Entered a Hover Effect", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "radio-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-radio-button-hover");
  await t.hover(radio_label.nth(0));
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/radiobutton-widget/basic-radio-preselect`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/radiobutton-widget/basic-radio-preselect`; // specify the start page

test("testing the Radio Button Widget with a preselect value with no focus", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "radio-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-radio-pre-select-no-focus");

  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Radio Button Widget with a preselect value and a click on the same button results having focus on preselect radio button", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "radio-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-radio-pre-select-click-with-focus");
  await t.click(radio_group.nth(2));

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/radiobutton-widget/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/radiobutton-widget/x-y-offset`; // specify the start page
test("testing the Radio Button Widget with a x y offset Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "radio-widget");
  const screenshot_path = path.join(screenshot_path_base, "x-y-offset-radio-button");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/radiobutton-widget/basic-radio-space`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/radiobutton-widget/basic-radio-space`; // specify the start page
test("testing the Radio Button Widget with a x y offset Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "radio-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-radio-space-between-button");
  await testcafe_page_visual_regression(t, screenshot_path);
});
