import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";
const base_screenshot_path = path.join("plate_based_widgets", "plate-navigator");

const well_in_top_left_selector = Selector("#well_0");
const well_in_top_right_selector = Selector("#well_12");
const well_in_bottom_left_selector = Selector("#well_2");
const well_in_bottom_right_selector = Selector("#well_23");

// the fixture declares what we are testing
fixture`plate_based_widgets/plate-navigator/basic`
  .page // declare the fixture
`http://localhost:8080/plate_based_widgets/plate-navigator/basic`; // specify the start page

test("Plate Navigator updates shifting Quadrant -1 to Quadrant -2 to Quadrant -3 to Quadrant-4 and hovers correctly on all quadrants when in different states", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "basic-init");
  await testcafe_page_visual_regression(t, screenshot_path);
  let active_quadrant_str = "top-left-quadrant-active";
  await t.hover(well_in_top_left_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-top-left");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_top_right_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-top-right");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_bottom_right_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-bottom-right");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_bottom_left_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-bottom-left");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(Selector(well_in_top_right_selector));
  screenshot_path = path.join(base_screenshot_path, "top-right-quadrant");
  await testcafe_page_visual_regression(t, screenshot_path);
  active_quadrant_str = "top-right-quadrant-active";
  await t.hover(well_in_top_left_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-top-left");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_top_right_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-top-right");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_bottom_right_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-bottom-right");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_bottom_left_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-bottom-left");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(Selector(well_in_bottom_left_selector));
  screenshot_path = path.join(base_screenshot_path, "bottom-left-quadrant");
  await testcafe_page_visual_regression(t, screenshot_path);
  active_quadrant_str = "bottom-left-quadrant-active";
  await t.hover(well_in_top_left_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-top-left");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_top_right_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-top-right");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_bottom_right_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-bottom-right");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_bottom_left_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-bottom-left");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(Selector(well_in_bottom_right_selector));
  screenshot_path = path.join(base_screenshot_path, "bottom-right-quadrant");
  await testcafe_page_visual_regression(t, screenshot_path);
  active_quadrant_str = "bottom-right-quadrant-active";
  await t.hover(well_in_top_left_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-top-left");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_top_right_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-top-right");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_bottom_right_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-bottom-right");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.hover(well_in_bottom_left_selector);
  screenshot_path = path.join(base_screenshot_path, active_quadrant_str + "--hovering-on-bottom-left");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`plate_based_widgets/plate-navigator/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/plate_based_widgets/plate-navigator/x-y-offset`; // specify the start page

test("PlateNavigator renders in offset position when parent div is moved", async (t) => {
  const screenshot_path = path.join(base_screenshot_path, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
