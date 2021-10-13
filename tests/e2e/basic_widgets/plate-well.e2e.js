import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";
const base_screenshot_path = path.join("basic_widgets", "plate-well");

// the fixture declares what we are testing
fixture`basic_widgets/plate-well/plate-well`.page // declare the fixture
`http://localhost:8080/basic_widgets/plate-well/plate-well`; // specify the start page
test("testing the Plate-MapEditor page should display as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "plate-well-init");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`basic_widgets/plate-well/x-y-offset-plate-well`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/plate-well/x-y-offset-plate-well`; // specify the start page
test("testing the Plate-MapEditor page should display as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "x-y-offset-plate-well");
  await testcafe_page_visual_regression(t, screenshot_path);
});
