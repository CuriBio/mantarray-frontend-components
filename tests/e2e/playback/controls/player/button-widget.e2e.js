import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const button_background = Selector(".div__button-background");
const span__button_label = Selector(".span__button_label");

fixture`playback/controls/player/button-widget/basic-button`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/button-widget/basic-button`; // specify the start page

test("testing the popinput for the NO Value Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "button-widget"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-button-widget"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/button-widget/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/button-widget/x-y-offset`; // specify the start page

test("testing the popinput for the X-Y Offset", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "button-widget"
  );
  const screenshot_path = path.join(screenshot_path_base, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
