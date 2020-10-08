import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curibio/frontend_test_utils";
const base_screenshot_path = path.join("playback", "controls", "plate-well");

// the fixture declares what we are testing
fixture`playback/controls/player/controls/plate-well/plate-well`
  .page // declare the fixture
`http://localhost:8080/playback/controls/plate-well/plate-well`; // specify the start page
test("testing the Plate-MapEditor page should display as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "plate-well-init");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/controls/plate-well/x-y-offset-plate-well`
  .page // declare the fixture
`http://localhost:8080/playback/controls/plate-well/x-y-offset-plate-well`; // specify the start page
test("testing the Plate-MapEditor page should display as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(
    base_screenshot_path,
    "x-y-offset-plate-well"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
