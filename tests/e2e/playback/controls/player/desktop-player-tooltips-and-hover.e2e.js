import { Selector } from "testcafe";
import { RequestMock } from "testcafe";
const path = require("path");

import {
  testcafe_page_visual_regression,
  testcafe_element_visual_regression,
} from "@curi-bio/frontend-test-utils";

const base_screenshot_path = path.join("playback", "controls", "player", "desktop-player");

const settings_button = Selector("#settings");

const schedule_button = Selector(".svg__playback-desktop-player-controls-schedule-button");

const calibrate_button = Selector(".svg__playback-desktop-player-controls-calibrate-button");
const live_view_button = Selector(".svg__playback-desktop-player-controls-live-view-button");
const record_button = Selector(".svg__playback-desktop-player-controls-record-button");
const active_record_button = Selector(".svg__playback-desktop-player-controls-record-button--active");
const whole_component = Selector(".div__play-desktop-player-controls");
const title_text = Selector(".span__playback-desktop-player-controls-text");

const msec_to_wait_for_tooltip_after_hover_screenshot = 1200;

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/initial-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/initial-tooltips`
); // specify the start page

test("Given Vuex is in the default player state and a valid Barcode has been committed, When hovering on the elements, Then the hover behavior occurs followed by the correct tooltip", async (t) => {
  const this_base_screenshot_path = path.join(base_screenshot_path, "initial-tooltips");

  let screenshot_path = path.join(this_base_screenshot_path, "settings-tooltip");
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

  screenshot_path = path.join(this_base_screenshot_path, "still-initializing--hover-on-calibrate");
  await t.hover(calibrate_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "still-initializing--hover-on-live-view");
  await t.hover(live_view_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "still-initializing--hover-on-record");
  await t.hover(record_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/needs-calibration-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/needs-calibration-tooltips`
); // specify the start page

test("Given that Vuex is in the CALIBRATION_NEEDED state and a valid barcode is committed to the store, When hovering on the elements, Then the hover behavior occurs followed by the correct tooltip", async (t) => {
  const this_base_screenshot_path = path.join(base_screenshot_path, "needs-calibration-tooltips");

  let screenshot_path = path.join(this_base_screenshot_path, "settings-tooltip");
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

  screenshot_path = path.join(this_base_screenshot_path, "needs-calibration--hover-on-calibrate");
  await t.hover(calibrate_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "needs-calibration--hover-on-live-view");
  await t.hover(live_view_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "needs-calibration--hover-on-record");
  await t.hover(record_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/calibrated-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/calibrated-tooltips`
); // specify the start page

test("Given that Vuex is in the CALIBRATED state and a valid barcode is committed to the store, When hovering on the elements, Then the hover behavior occurs followed by the correct tooltip", async (t) => {
  const this_base_screenshot_path = path.join(base_screenshot_path, "calibrated-tooltips");

  let screenshot_path = path.join(this_base_screenshot_path, "settings-tooltip");
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

  screenshot_path = path.join(this_base_screenshot_path, "calibrated--hover-on-calibrate");
  await t.hover(calibrate_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "calibrated--hover-on-live-view");
  await t.hover(live_view_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "calibrated--hover-on-record");
  await t.hover(record_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/live-view-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/live-view-tooltips`
); // specify the start page

test("Given that Vuex is in the LIVE_VIEW_ACTIVE state and a valid barcode is committed to the store, When hovering on the elements, Then the hover behavior occurs followed by the correct tooltip", async (t) => {
  const this_base_screenshot_path = path.join(base_screenshot_path, "live-view-tooltips");

  let screenshot_path = path.join(this_base_screenshot_path, "settings-tooltip");
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

  screenshot_path = path.join(this_base_screenshot_path, "live-view-active--hover-on-calibrate");
  await t.hover(calibrate_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "live-view-active--hover-on-live-view");
  await t.hover(live_view_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  // await t.wait(1000); // Eli (7/1/20): odd issue where there was a tiny 1 pixel difference in CodeBuild but not locally...hopefully this wait solves it...
  screenshot_path = path.join(this_base_screenshot_path, "live-view-active--hover-on-record");

  await t.hover(record_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/recording-tooltips`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/recording-tooltips`
); // specify the start page

test("Given that Vuex is in the RECORDING state and a valid barcode is committed to the store, When hovering on the elements, Then the hover behavior occurs followed by the correct tooltip", async (t) => {
  const this_base_screenshot_path = path.join(base_screenshot_path, "recording-tooltips");

  let screenshot_path = path.join(this_base_screenshot_path, "settings-tooltip");
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

  screenshot_path = path.join(this_base_screenshot_path, "recording--hover-on-calibrate");
  await t.hover(calibrate_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "calibrate-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "recording--hover-on-live-view");
  await t.hover(live_view_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "live-view-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(this_base_screenshot_path, "recording--hover-on-record");
  await t.hover(active_record_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // wait for tooltips to visually display state to complete
  await t.wait(msec_to_wait_for_tooltip_after_hover_screenshot);
  screenshot_path = path.join(this_base_screenshot_path, "record-tooltip");
  await testcafe_page_visual_regression(t, screenshot_path);
});
