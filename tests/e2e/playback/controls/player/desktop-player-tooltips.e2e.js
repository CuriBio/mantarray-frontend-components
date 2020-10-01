import { Selector } from "testcafe";
import { RequestMock } from "testcafe";
const path = require("path");

import {
  testcafe_page_visual_regression,
  testcafe_element_visual_regression,
} from "@curibio/frontend_test_utils";

const base_screenshot_path = path.join(
  "playback",
  "controls",
  "player",
  "desktop-player"
);

const settings_button = Selector("#settings");

const schedule_button = Selector(
  ".svg__playback-desktop-player-controls-schedule-button"
);

const calibrate_button = Selector(
  ".svg__playback-desktop-player-controls-calibrate-button"
);
const live_view_button = Selector(
  ".svg__playback-desktop-player-controls-live-view-button"
);
const record_button = Selector(
  ".svg__playback-desktop-player-controls-record-button"
);
const active_record_button = Selector(
  ".svg__playback-desktop-player-controls-record-button--active"
);
const whole_component = Selector(".div__play-desktop-player-controls");
const title_text = Selector(".span__playback-desktop-player-controls-text");

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/initial-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/initial-tooltips`
); // specify the start page

test("DesktopPlayerControls UI tooltips at INITIAL State settings schedule calibrate live-view recording", async (t) => {
  const this_base_screenshot_path = path.join(
    base_screenshot_path,
    "initial-tooltips"
  );

  let screenshot_path = path.join(
    this_base_screenshot_path,
    "settings-tooltip"
  );
  // await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(settings_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "schedule-tooltip");
  await t.hover(schedule_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await t.hover(calibrate_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await t.hover(live_view_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await t.hover(record_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/needs-calibration-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/needs-calibration-tooltips`
); // specify the start page

test("DesktopPlayerControls UI tooltips at NEEDS CALIBRATION settings schedule calibrate live-view recording", async (t) => {
  const this_base_screenshot_path = path.join(
    base_screenshot_path,
    "needs-calibration-tooltips"
  );

  let screenshot_path = path.join(
    this_base_screenshot_path,
    "settings-tooltip"
  );
  // await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(settings_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "schedule-tooltip");
  await t.hover(schedule_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await t.hover(calibrate_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await t.hover(live_view_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await t.hover(record_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/calibrated-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/calibrated-tooltips`
); // specify the start page

test("DesktopPlayerControls UI tooltips at CALIBIRATED STATE settings schedule calibrate live-view recording", async (t) => {
  const this_base_screenshot_path = path.join(
    base_screenshot_path,
    "calibrated-tooltips"
  );

  let screenshot_path = path.join(
    this_base_screenshot_path,
    "settings-tooltip"
  );
  // await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(settings_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "schedule-tooltip");
  await t.hover(schedule_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await t.hover(calibrate_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await t.hover(live_view_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await t.hover(record_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/live-view-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/live-view-tooltips`
); // specify the start page

test("DesktopPlayerControls UI tooltips at LIVE VIEW settings schedule calibrate live-view recording", async (t) => {
  const this_base_screenshot_path = path.join(
    base_screenshot_path,
    "live-view-tooltips"
  );

  let screenshot_path = path.join(
    this_base_screenshot_path,
    "settings-tooltip"
  );
  // await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(settings_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "schedule-tooltip");
  await t.hover(schedule_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await t.hover(calibrate_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await t.hover(live_view_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await t.hover(record_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/recording-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/recording-tooltips`
); // specify the start page

test("DesktopPlayerControls UI tooltips at RECORD STATE settings schedule calibrate live-view recording", async (t) => {
  const this_base_screenshot_path = path.join(
    base_screenshot_path,
    "recording-tooltips"
  );

  let screenshot_path = path.join(
    this_base_screenshot_path,
    "settings-tooltip"
  );
  // await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(settings_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "schedule-tooltip");
  await t.hover(schedule_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await t.hover(calibrate_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await t.hover(live_view_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await t.hover(active_record_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});
