import { Selector } from "testcafe";
const path = require("path");
import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

fixture`playback/controls/stimulation-studio-controls/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/stimulation-studio-controls/basic`; // specify the start page

const status_btn = Selector(".span__stimulation-controls-play-stop-button");

test("testing the StimulationStudioControls layout on initialization", async (t) => {
  const screenshot_path_base = path.join("playback", "controls", "stimulation-studio-controls");
  const screenshot_path = path.join(screenshot_path_base, "basic-init-inactive");

  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the StimulationStudioControls layout when stimulation is active", async (t) => {
  const screenshot_path_base = path.join("playback", "controls", "stimulation-studio-controls");
  const screenshot_path = path.join(screenshot_path_base, "basic-active");

  await t.click(status_btn);

  await testcafe_page_visual_regression(t, screenshot_path);
});
