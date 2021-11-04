import { Selector } from "testcafe";
const path = require("path");
import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const protocol = Selector("li").withText("A Tester");
const apply_btn = Selector(".div__stimulationstudio-btn-container").withText("Apply to Selection");
const update_button = Selector(".update-button");
const protocol_dropdown = Selector(".div__select-dropdown-controls-content-widget");

fixture`playback/controls/stimulation-studio-controls/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/stimulation-studio-controls/basic`; // specify the start page

const status_btn_active = Selector(".span__stimulation-controls-play-stop-button--active");

test("testing the StimulationStudioControls layout on initialization", async (t) => {
  const screenshot_path_base = path.join("playback", "controls", "stimulation-studio-controls");
  const screenshot_path = path.join(screenshot_path_base, "basic-init-inactive");

  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the StimulationStudioControls layout when stimulation is active", async (t) => {
  const screenshot_path_base = path.join("playback", "controls", "stimulation-studio-controls");
  const screenshot_path = path.join(screenshot_path_base, "basic-active");
  await t.click(update_button).click(status_btn_active).wait(1000);

  await testcafe_page_visual_regression(t, screenshot_path);
});
