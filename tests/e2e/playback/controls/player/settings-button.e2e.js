import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curibio/frontend_test_utils";

// the fixture declares what we are testing
fixture`playback/controls/player/settings-button/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/basic`; // specify the start page

const settings_button = Selector(
  ".span__playback-player-controls-settings-button"
);

test("player controls settings button should look as expected", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-button"
  );
  let screenshot_path = path.join(screenshot_path_base, "basic-init");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(screenshot_path_base, "basic-hover");
  await t.hover(settings_button);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/settings-button/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/x-y-offset`; // specify the start page

test("player controls settings button renders in offset position when parent div is moved", async (t) => {
  const screenshot_path = path.join(
    "playback",
    "controls",
    "player",
    "settings-button",
    "x-y-offset"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
