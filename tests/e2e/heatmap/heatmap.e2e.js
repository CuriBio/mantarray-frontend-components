import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const input_max = Selector("#input-widget-field-max");
const input_min = Selector("#input-widget-field-min");

const input_display = Selector("#input-dropdown-widget-display");

fixture`heatmap/basic`.page // declare the fixture
`http://localhost:8080/heatmap/basic`; // specify the start page

test("testing the HeatMap Layout NO option selected", async (t) => {
  const screenshot_path_base = path.join("heatmap", "heatmap-layout-basic");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-layout-no-selection"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the HeatMap Layout and the max and min value are valid", async (t) => {
  const screenshot_path_base = path.join("heatmap", "heatmap-layout-basic");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-layout-min-max-selection"
  );
  await t.typeText(input_max, "100");
  await t.typeText(input_min, "10");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the HeatMap Layout and the max and min when max and min value are same", async (t) => {
  const screenshot_path_base = path.join("heatmap", "heatmap-layout-basic");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-layout-min-max-value-same-selection"
  );
  await t.typeText(input_max, "100");
  await t.typeText(input_min, "100");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the HeatMap Layout and the Display Value is set to 'Twitch Force' as dropdown", async (t) => {
  const screenshot_path_base = path.join("heatmap", "heatmap-layout-basic");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-layout-display-value-selected"
  );
  await t.typeText(input_display, "Twitch Force");
  await testcafe_page_visual_regression(t, screenshot_path);
});
