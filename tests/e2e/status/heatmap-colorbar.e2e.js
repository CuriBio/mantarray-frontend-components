import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const change_gradient = Selector(".test1");
const change_height = Selector(".test3");
const change_range = Selector(".test4");
const change_units = Selector(".test5");

fixture`status/heatmap-colorbar/basic`
  .page // declare the fixture
`http://localhost:8080/status/heatmap-colorbar/basic`; // specify the start page

test("testing the HeatMapColorBar with a valid uuid", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(screenshot_path_base, "basic-heatmap-uuid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the HeatMapColorBar with a non-valid uuid", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-gradient"
  );
  await t.click(change_gradient);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the HeatMapColorBar with modified height", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-low-height"
  );
  await t.click(change_height);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the HeatMapColorBar with range values", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-range-values"
  );
  await t.click(change_range);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the HeatMapColorBar with new UNITS values", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-range-units"
  );
  await t.click(change_units);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/heatmap-colorbar/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/status/heatmap-colorbar/x-y-offset`; // specify the start page

test("testing the HeatMapColorBar with a non-valid uuid and an offset of X and Y", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(screenshot_path_base, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
