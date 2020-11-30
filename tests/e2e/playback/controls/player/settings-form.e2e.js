import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

// the fixture declares what we are testing
fixture`playback/controls/player/settings-button/settings-form-vuex`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/settings-form-vuex`; // specify the start page

test("testing the settings page should display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-settings-form-vuex"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/settings-button/settings-form-no-vuex`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/settings-form-no-vuex`; // specify the start page

test("testing the settings page should display as designed in the mockflow", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "settings-form"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-settings-form-no-vuex"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
