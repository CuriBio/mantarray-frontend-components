import { Selector } from "testcafe";
import { RequestMock } from "testcafe";
const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

import { all_mantarray_commands_regexp } from "../../../../../store/modules/flask/url_regex";

import { STATUS } from "../../../../../store/modules/flask/enums";

const msec_to_wait_for_calibration_to_complete = 3500;

const base_screenshot_path = path.join("playback", "controls", "player", "desktop-player");

const mocked_all_mantarray_commands = RequestMock()
  .onRequestTo(all_mantarray_commands_regexp)
  .respond({}, 200, { "Access-Control-Allow-Origin": "*" });

const mocked_system_status = RequestMock()
  .onRequestTo(system_status_regexp)
  .respond((req, res) => {
    res.headers["Access-Control-Allow-Origin"] = "*";
    res.statusCode = 200;

    const status_uuid = new url.URLSearchParams(url.parse(req.url)).get("current_vuex_status_uuid");
    switch (status_uuid) {
      case STATUS.MESSAGE.CALIBRATED:
      case STATUS.MESSAGE.CALIBRATION_NEEDED:
      case STATUS.MESSAGE.LIVE_VIEW_ACTIVE:
      case STATUS.MESSAGE.RECORDING:
      case STATUS.MESSAGE.SERVER_STILL_INITIALIZING:
        res.setBody(JSON.stringify({ ui_status_code: status_uuid }));
        break;
      case STATUS.MESSAGE.CALIBRATING:
        res.setBody(JSON.stringify({ ui_status_code: STATUS.MESSAGE.CALIBRATED }));
        break;
      case STATUS.MESSAGE.BUFFERING:
        res.setBody(JSON.stringify({ ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE }));
        break;
    }
  });

/* Eli (6/11/20): note for the future---you can remove and add mocks on the fly during a test as well. https://github.com/DevExpress/testcafe/issues/2477
    await t.removeRequestHooks(mock1);

    await t.addRequestHooks(mock2);
*/

const calibrate_button = Selector(".svg__playback-desktop-player-controls-calibrate-button");
const live_view_button = Selector(".svg__playback-desktop-player-controls-live-view-button");
const inactive_record_button = Selector(".svg__playback-desktop-player-controls-record-button--inactive");
const active_record_button = Selector(".svg__playback-desktop-player-controls-record-button--active");
const whole_component = Selector(".div__play-desktop-player-controls");
const title_text = Selector(".span__playback-desktop-player-controls-text");
const update_customer_idx_button = Selector(".update-idx-button");

fixture`playback/controls/player/desktop-player/basic`.page(
  // declare the fixture
  `http://localhost:8080/playback/controls/player/desktop-player/basic`
); // specify the start page

test("When DesktopPlayerControls UI loads, Then it looks initially correct in the instrument_initializing state", async (t) => {
  // since the buttons have different hover behavior, making sure to move the mouse back off of the button (onto the generic text span) to deactivate the hover state of a button after clicking it
  const this_base_screenshot_path = path.join(base_screenshot_path, "basic");

  const screenshot_path = path.join(this_base_screenshot_path, "init");
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/calibration-needed`
  .page(
    // declare the fixture
    `http://localhost:8080/playback/controls/player/desktop-player/calibration-needed`
  ) // specify the start page
  .requestHooks(mocked_all_mantarray_commands, mocked_system_status);

test("DesktopPlayerControls UI updates transitioning through 'needs calibration'-->'stopped'-->'playing'-->'recording'-->'playing'-->'recording'-->'playing'-->'stopped'-->'playing'-->'stopped'-->['stopped' after clicking calibrate again]", async (t) => {
  // since the buttons have different hover behavior, making sure to move the mouse back off of the button (onto the generic text span) to deactivate the hover state of a button after clicking it
  const this_base_screenshot_path = path.join(base_screenshot_path, "basic");

  await t.click(update_customer_idx_button);

  let screenshot_path = path.join(this_base_screenshot_path, "calibration-needed");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(calibrate_button);
  await t.hover(title_text);

  // wait for 'calibrating' state to complete
  await t.wait(msec_to_wait_for_calibration_to_complete);
  screenshot_path = path.join(this_base_screenshot_path, "calibrated");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(live_view_button);
  await t.hover(title_text);

  // wait for 'buffering' state to complete
  await t.wait(3000);

  screenshot_path = path.join(this_base_screenshot_path, "live-view-active");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  await t.click(inactive_record_button);
  await t.hover(title_text);
  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  screenshot_path = path.join(this_base_screenshot_path, "recording");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(active_record_button);
  await t.hover(title_text);
  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  screenshot_path = path.join(this_base_screenshot_path, "live-view-after-recording");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(inactive_record_button);
  await t.hover(title_text);
  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  screenshot_path = path.join(this_base_screenshot_path, "recording-second-time");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(active_record_button);
  await t.hover(title_text);
  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  screenshot_path = path.join(this_base_screenshot_path, "live-view-after-second-recording");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(live_view_button);
  await t.hover(title_text);
  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  screenshot_path = path.join(this_base_screenshot_path, "calibrated-after-playing");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(live_view_button);
  await t.hover(title_text);

  // wait for 'buffering' state to complete
  await t.wait(3000);

  screenshot_path = path.join(this_base_screenshot_path, "live-view-second-time-after-calibrated");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(live_view_button);
  await t.hover(title_text);

  screenshot_path = path.join(this_base_screenshot_path, "calibrated-after-second-initiation-of-live-view");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(calibrate_button);
  await t.hover(title_text);

  // wait for 'calibrating' state to complete
  await t.wait(msec_to_wait_for_calibration_to_complete);

  screenshot_path = path.join(this_base_screenshot_path, "calibrated-after-second-live-view");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/x-y-offset`
  .page(
    // declare the fixture
    `http://localhost:8080/playback/controls/player/desktop-player/x-y-offset`
  ) // specify the start page
  .requestHooks(mocked_all_mantarray_commands, mocked_system_status);

test("Given x/y offset of div containing DesktopPlayerControls, Then the component renders in offset position", async (t) => {
  const this_base_screenshot_path = path.join(base_screenshot_path, "x-y-offset");

  let screenshot_path = path.join(this_base_screenshot_path, "init");
  await testcafe_page_visual_regression(t, screenshot_path);
});
