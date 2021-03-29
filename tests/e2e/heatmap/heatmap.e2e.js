import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

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
