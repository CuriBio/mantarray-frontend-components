import { Selector } from "testcafe";

const path = require("path");

const radio_selected = Selector(".custom-control-input");
const radio_label = Selector(".custom-control-label");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

fixture`playback/controls/player/radiobutton-widget/basic-radio`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/radiobutton-widget/basic-radio`; // specify the start page

test("testing the Radio Button Widget for the NO pre-selected option Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "radio-widget"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-radio-no-selection"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Radio Button Widget for the NO pre-selected option Entered a Hover Effect", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "radio-widget"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-radio-button-hover"
  );
  await t.hover(radio_label.nth(0));
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/radiobutton-widget/basic-radio-preselect`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/radiobutton-widget/basic-radio-preselect`; // specify the start page

test("testing the Radio Button Widget for the ON selected option Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "radio-widget"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-radio-pre-select"
  );
  await t.click(radio_selected.nth(1));
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/radiobutton-widget/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/radiobutton-widget/x-y-offset`; // specify the start page
test("testing the Radio Button Widget with a x y offset Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "radio-widget"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "x-y-offset-radio-button"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
