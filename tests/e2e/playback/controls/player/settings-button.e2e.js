import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

// the fixture declares what we are testing
fixture`settings/basic`.page // declare the fixture
`http://localhost:8080/settings/basic`; // specify the start page

const settings_button = Selector(".span__playback-player-controls-settings-button");

test("player controls settings button should look as expected", async (t) => {
  const screenshot_path_base = path.join("settings", "settings-button");
  let screenshot_path = path.join(screenshot_path_base, "basic-init");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(screenshot_path_base, "basic-hover");
  await t.hover(settings_button);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`settings/x-y-offset`.page // declare the fixture
`http://localhost:8080/settings/x-y-offset`; // specify the start page

test("player controls settings button renders in offset position when parent div is moved", async (t) => {
  const screenshot_path = path.join("settings", "settings-button", "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
