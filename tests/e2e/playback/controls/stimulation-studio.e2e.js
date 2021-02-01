import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

// the fixture declares what we are testing
fixture`playback/controls/stimulation-studio/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/stimulation-studio/basic`; // specify the start page

test("x-axis controls have both buttons enabled initially when the zoom index is in the middle of the range", async (t) => {
  const screenshot_path = path.join(
    "playback",
    "controls",
    "simulation-studio",
    "basic-simulation"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
