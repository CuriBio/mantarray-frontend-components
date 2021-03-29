import { Selector } from "testcafe";

const path = require("path");

const radio_group = Selector(".custom-control-input");
const radio_label = Selector(".custom-control-label");

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
  await t.click(radio_label.nth(0));
  await t.hover(radio_label.nth(0));
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("y-axis controls settings widget and hover on the disabled radio button shows popover meessage is rendered as defined in the MockFlow UI", async (t) => {
  const screenshot_path = path.join(
    "playback",
    "controls",
    "y-axis-controls",
    "y-axis-controls-settings-popover-message"
  );
  await t.hover(radio_label.nth(1));
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});
