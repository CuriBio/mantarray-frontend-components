import { Selector } from "testcafe";
const path = require("path");
import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const enable_button = Selector(".enable-button");
const update_button = Selector(".update-button");
const start_button = Selector(".start-button");

fixture`playback/controls/stimulation-controls/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/stimulation-controls/basic`; // specify the start page

const screenshot_path_base = path.join("playback", "controls", "stimulation-controls");

test("testing the StimulationControls layout on initialization", async (t) => {
  const screenshot_path = path.join(screenshot_path_base, "basic-init-disabled");

  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the StimulationControls layout after enabled", async (t) => {
  const screenshot_path = path.join(screenshot_path_base, "basic-init-enabled");
  await t.click(enable_button);

  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the StimulationControls layout when stimulation is active", async (t) => {
  const screenshot_path = path.join(screenshot_path_base, "basic-active");
  await t.click(enable_button).click(update_button).click(start_button).wait(1000);

  await testcafe_page_visual_regression(t, screenshot_path);
});
