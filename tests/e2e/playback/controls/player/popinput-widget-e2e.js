import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const input_field = Selector("#input-widget");

fixture`playback/controls/player/popup-input/basic-input`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/popup-input/basic-input`; // specify the start page

test("testing the popinput for the NO Value Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(screenshot_path_base, "pop-input-no-value");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the popinput for the VALID Value Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "pop-input-valid-value"
  );
  await t.typeText(input_field, "2VSckkBYH2An3dqHEyfRRE");
  await testcafe_page_visual_regression(t, screenshot_path);
});
