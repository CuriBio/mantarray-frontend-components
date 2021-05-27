import { Selector } from "testcafe";

const path = require("path");

const checkbox_group = Selector(".custom-control-input");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

fixture`basic_widgets/checkbox-widget/basic-checkbox`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/checkbox-widget/basic-checkbox`; // specify the start page

test("testing the Check Box Widget for the NO option selected", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "checkbox-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-checkbox-no-selection");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Check Box Widget with a one option selected", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "checkbox-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-checkbox-selected");
  await t.click(checkbox_group.nth(1));
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Check Box Widget with multiple option selected", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "checkbox-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-checkbox-multiple-selected");
  await t.click(checkbox_group.nth(1));
  await t.click(checkbox_group.nth(3));
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/checkbox-widget/basic-checkbox-empty-text`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/checkbox-widget/basic-checkbox-empty-text`; // specify the start page

test("testing the Check Box Widget with no text NO option selected", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "checkbox-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-checkbox-empty-text");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/checkbox-widget/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/checkbox-widget/x-y-offset`; // specify the start page
test("testing the Check Box Widget with a x y offset Entered", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "checkbox-widget");
  const screenshot_path = path.join(screenshot_path_base, "x-y-offset-checkbox-button");
  await testcafe_page_visual_regression(t, screenshot_path);
});
