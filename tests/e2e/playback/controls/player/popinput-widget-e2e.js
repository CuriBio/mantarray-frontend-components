import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const input_field = Selector("#input-widget");
const input_label = Selector(".span__popinput-content-label");

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
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the popinput for the spellcheck is set to false so red squiggle line not visible", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "pop-input-with-no-red-squiggle"
  );
  await t.typeText(input_field, "abcellek");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/popup-input/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/popup-input/x-y-offset`; // specify the start page

test("testing the popinput for the X-Y Offset", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(screenshot_path_base, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/popup-input/input-spellcheck`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/popup-input/input-spellcheck`; // specify the start page

test("testing the popinput for the NO Value Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  await t.typeText(input_field, "abcellek");
  await t.click(input_label);
  const screenshot_path = path.join(
    screenshot_path_base,
    "pop-input-with-red-squiggle"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/popup-input/input-width-200`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/popup-input/input-width-200`; // specify the start page

test("testing the popinput for width of 200px", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "pop-input-width-200px"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/popup-input/input-width-300`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/popup-input/input-width-300`; // specify the start page

test("testing the popinput for width of 300px", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "pop-input-width-300px"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/popup-input/input-disallow`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/popup-input/input-disallow`; // specify the start page

test("testing the popinput when the input is disabled or not allowed then entering text doesn't update visually", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(screenshot_path_base, "pop-input-disallow");
  await t.typeText(input_field, "sample text");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});
