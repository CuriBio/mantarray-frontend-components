import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const input_field = Selector("#input-dropdown-widget");
const input_label = Selector(".span__input-dropdown-content-label");

fixture`playback/controls/player/input-dropdown/basic-dropdown`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/input-dropdown/basic-dropdown`; // specify the start page

test("testing the Input DropDown for the NO Value Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "input-dropdown"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "input-dropdown-no-value"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Input DropDown for the VALID Value Entered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "input-dropdown"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "input-dropdown-valid-value"
  );
  await t.typeText(input_field, "Customer Account 1");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/input-dropdown/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/input-dropdown/x-y-offset`; // specify the start page

test("testing the Input Widget for the X-Y Offset", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "input-dropdown"
  );
  const screenshot_path = path.join(screenshot_path_base, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/input-dropdown/input-dropdown-width-200`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/input-dropdown/input-dropdown-width-200`; // specify the start page

test("testing the Input DropDown for width of 200px", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "input-dropdown"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "input-dropdown-width-200px"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/input-dropdown/input-dropdown-width-300`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/input-dropdown/input-dropdown-width-300`; // specify the start page

test("testing the Input Widget for width of 300px", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "input-dropdown"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "input-dropdown-width-300px"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/input-dropdown/input-dropdown-disallow`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/input-dropdown/input-dropdown-disallow`; // specify the start page

test("testing the Input Widget when the input is disabled or not allowed then entering text doesn't update visually", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "input-dropdown"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "input-dropdown-disallow"
  );
  await t.typeText(input_field, "sample text");
  await t.click(input_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/input-dropdown/input-no-title-dropdown`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/input-dropdown/input-no-title-dropdown`; // specify the start page

test("testing the Input Widget when the title of widget is <empty> the widget height correction happens and the rest of input dropdown features are rendered", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "input-dropdown"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "input-dropdown-no-title-dropdown"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
