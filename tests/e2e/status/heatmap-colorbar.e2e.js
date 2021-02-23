import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

fixture`status/heatmap-colorbar/basic`
  .page // declare the fixture
`http://localhost:8080/status/heatmap-colorbar/basic`; // specify the start page

test("testing the HeatMapColorBar with a valid uuid", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(screenshot_path_base, "basic-heatmap-uuid");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/heatmap-colorbar/basic-gradient`
  .page // declare the fixture
`http://localhost:8080/status/heatmap-colorbar/basic-gradient`; // specify the start page

test("testing the HeatMapColorBar with a non-valid uuid", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-gradient"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/heatmap-colorbar/basic-height`
  .page // declare the fixture
`http://localhost:8080/status/heatmap-colorbar/basic-height`; // specify the start page

test("testing the HeatMapColorBar with modified height", async (t) => {
  const screenshot_path_base = path.join("status", "heatmap-colorbar");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-heatmap-low-height"
  );
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
