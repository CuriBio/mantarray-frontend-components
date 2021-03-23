import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

// the fixture declares what we are testing
fixture`playback/controls/y-axis-controls/y-axis-controls-settings`
  .page // declare the fixture
`http://localhost:8080/playback/controls/y-axis-controls/y-axis-controls-settings`; // specify the start page

test("y-axis controls settings widget is rendered as defined in the MockFlow UI", async (t) => {
  const screenshot_path = path.join(
    "playback",
    "controls",
    "y-axis-controls",
    "y-axis-controls-settings-basic"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
