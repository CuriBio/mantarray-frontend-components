import { Selector } from "testcafe";
import { RequestMock } from "testcafe";
const path = require("path");

import {
  testcafe_page_visual_regression,
  testcafe_element_visual_regression,
} from "@curibio/frontend_test_utils";

import {
  system_status_when_buffering_regexp,
  system_status_when_calibrated_regexp,
  system_status_when_calibrating_regexp,
  system_status_when_recording_regexp,
  system_status_when_live_view_active_regexp,
  system_status_when_calibration_needed_regexp,
  system_status_when_server_initializing_regexp,
  all_mantarray_commands_regexp,
} from "../../../../../store/modules/flask/url_regex";
import { get_available_data_regex } from "../../../../../store/modules/waveform/url_regex";

import { STATUS } from "../../../../../store/modules/flask/enums";

const base_screenshot_path = path.join(
  "playback",
  "controls",
  "player",
  "desktop-player"
);

const mocked_all_mantarray_commands = RequestMock()
  .onRequestTo(all_mantarray_commands_regexp)
  .respond({}, 200, { "Access-Control-Allow-Origin": "*" });

const mocked_system_status_static_calibration_needed = RequestMock()
  .onRequestTo(system_status_when_calibration_needed_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED }, 200, {
    "Access-Control-Allow-Origin": "*",
  });

const mocked_static_system_status_states = RequestMock()
  .onRequestTo(system_status_when_calibrated_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.STOPPED_uuid }, 200, {
    "Access-Control-Allow-Origin": "*",
  })
  .onRequestTo(system_status_when_calibration_needed_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED }, 200, {
    "Access-Control-Allow-Origin": "*",
  })
  .onRequestTo(system_status_when_live_view_active_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE }, 200, {
    "Access-Control-Allow-Origin": "*",
  })
  .onRequestTo(system_status_when_recording_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.RECORDING }, 200, {
    "Access-Control-Allow-Origin": "*",
  })
  .onRequestTo(system_status_when_server_initializing_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.SERVER_STILL_INITIALIZING }, 200, {
    "Access-Control-Allow-Origin": "*",
  });

const mocked_system_status_switch_to_calibration_needed_from_server_still_initializing = RequestMock()
  .onRequestTo(system_status_when_server_initializing_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED }, 200, {
    "Access-Control-Allow-Origin": "*",
  });

const mocked_system_status_keep_calibrating = RequestMock()
  .onRequestTo(system_status_when_calibrating_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.CALIBRATING_uuid }, 200, {
    "Access-Control-Allow-Origin": "*",
  });

const mocked_system_status_finish_calibration = RequestMock()
  .onRequestTo(system_status_when_calibrating_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.STOPPED_uuid }, 200, {
    "Access-Control-Allow-Origin": "*",
  });

const mocked_system_status_finish_buffering = RequestMock()
  .onRequestTo(system_status_when_buffering_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid }, 200, {
    "Access-Control-Allow-Origin": "*",
  });

const mocked_system_status_recording_even_when_in_live_view_active = RequestMock()
  .onRequestTo(system_status_when_live_view_active_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.RECORDING_uuid }, 200, {
    "Access-Control-Allow-Origin": "*",
  });
const mocked_system_status_live_view_active_when_in_live_view_active = RequestMock()
  .onRequestTo(system_status_when_live_view_active_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE }, 200, {
    "Access-Control-Allow-Origin": "*",
  });
const mocked_system_status_recording_when_in_recording = RequestMock()
  .onRequestTo(system_status_when_recording_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.RECORDING }, 200, {
    "Access-Control-Allow-Origin": "*",
  });

const mocked_get_available_data_handler = RequestMock()
  .onRequestTo(get_available_data_regex)
  .respond(null, 204, {
    "Access-Control-Allow-Origin": "*",
  });

/* Eli (6/11/20): note for the future---you can remove and add mocks on the fly during a test as well. https://github.com/DevExpress/testcafe/issues/2477
    await t.removeRequestHooks(mock1);

    await t.addRequestHooks(mock2);
*/

const calibrate_button = Selector(
  ".svg__playback-desktop-player-controls-calibrate-button"
);
const live_view_button = Selector(
  ".svg__playback-desktop-player-controls-live-view-button"
);
const inactive_record_button = Selector(
  ".svg__playback-desktop-player-controls-record-button--inactive"
);
const active_record_button = Selector(
  ".svg__playback-desktop-player-controls-record-button--active"
);
const whole_component = Selector(".div__play-desktop-player-controls");
const title_text = Selector(".span__playback-desktop-player-controls-text");

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
  .requestHooks(
    mocked_all_mantarray_commands,
    mocked_static_system_status_states,
    mocked_system_status_finish_calibration,
    mocked_system_status_finish_buffering,
    mocked_get_available_data_handler
  );

test("DesktopPlayerControls UI updates transitioning through 'needs calibration'-->'stopped'-->'playing'-->'recording'-->'playing'-->'recording'-->'playing'-->'stopped'-->'playing'-->'stopped'-->['stopped' after clicking calibrate again]", async (t) => {
  // since the buttons have different hover behavior, making sure to move the mouse back off of the button (onto the generic text span) to deactivate the hover state of a button after clicking it
  const this_base_screenshot_path = path.join(base_screenshot_path, "basic");

  let screenshot_path = path.join(
    this_base_screenshot_path,
    "calibration-needed"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(calibrate_button);
  await t.hover(title_text);

  // wait for 'calibrating' state to complete
  await t.wait(3000);
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

  screenshot_path = path.join(
    this_base_screenshot_path,
    "live-view-after-recording"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(inactive_record_button);
  await t.hover(title_text);
  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  screenshot_path = path.join(
    this_base_screenshot_path,
    "recording-second-time"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(active_record_button);
  await t.hover(title_text);
  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  screenshot_path = path.join(
    this_base_screenshot_path,
    "live-view-after-second-recording"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(live_view_button);
  await t.hover(title_text);
  await t.pressKey("a"); // Press a key to stop the status pinging
  await t.wait(3000); // wait for status pinging to fully stop

  screenshot_path = path.join(
    this_base_screenshot_path,
    "calibrated-after-playing"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(live_view_button);
  await t.hover(title_text);

  // wait for 'buffering' state to complete
  await t.wait(3000);

  screenshot_path = path.join(
    this_base_screenshot_path,
    "live-view-second-time-after-calibrated"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(live_view_button);
  await t.hover(title_text);

  screenshot_path = path.join(
    this_base_screenshot_path,
    "calibrated-after-second-initiation-of-live-view"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(calibrate_button);
  await t.hover(title_text);

  // wait for 'calibrating' state to complete
  await t.wait(3000);

  screenshot_path = path.join(
    this_base_screenshot_path,
    "calibrated-after-second-live-view"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/player/desktop-player/x-y-offset`
  .page(
    // declare the fixture
    `http://localhost:8080/playback/controls/player/desktop-player/x-y-offset`
  ) // specify the start page
  .requestHooks(
    mocked_all_mantarray_commands,
    mocked_static_system_status_states,
    mocked_system_status_finish_calibration,
    mocked_system_status_finish_buffering,
    mocked_get_available_data_handler
  );

test("Given x/y offset of div containing DesktopPlayerControls, Then the component renders in offset position. Also hover elements work as anticipated in different states.", async (t) => {
  const this_base_screenshot_path = path.join(
    base_screenshot_path,
    "x-y-offset"
  );

  let screenshot_path = path.join(this_base_screenshot_path, "init");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(calibrate_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "still-initializing--hover-on-calibrate"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(live_view_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "still-initializing--hover-on-live-view"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(inactive_record_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "still-initializing--hover-on-record"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  // transition the system to CALIBRATION NEEDED
  await t.addRequestHooks(
    mocked_system_status_switch_to_calibration_needed_from_server_still_initializing,
    mocked_system_status_static_calibration_needed
  );
  await t.removeRequestHooks(mocked_static_system_status_states);
  await t.wait(2000);
  await t.addRequestHooks(mocked_static_system_status_states);
  await t.removeRequestHooks(
    mocked_system_status_switch_to_calibration_needed_from_server_still_initializing,
    mocked_system_status_static_calibration_needed
  );

  await t.hover(calibrate_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "needs-calibration--hover-on-calibrate"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(live_view_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "needs-calibration--hover-on-live-view"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(inactive_record_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "needs-calibration--hover-on-record"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(calibrate_button);
  await t.hover(title_text);
  // wait for 'calibrating' state to complete
  await t.wait(3000);

  await t.hover(calibrate_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "calibrated--hover-on-calibrate"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(live_view_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "calibrated--hover-on-live-view"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(inactive_record_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "calibrated--hover-on-record"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(live_view_button);

  // wait for 'buffering' state to complete
  await t.wait(3000);

  await t.hover(calibrate_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "live-view-active--hover-on-calibrate"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(live_view_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "live-view-active--hover-on-live-view"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(inactive_record_button);
  await t.wait(1000); // Eli (7/1/20): odd issue where there was a tiny 1 pixel difference in CodeBuild but not locally...hopefully this wait solves it...
  screenshot_path = path.join(
    this_base_screenshot_path,
    "live-view-active--hover-on-record"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(inactive_record_button);

  await t.hover(calibrate_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "recording--hover-on-calibrate"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(live_view_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "recording--hover-on-live-view"
  );
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.hover(active_record_button);
  screenshot_path = path.join(
    this_base_screenshot_path,
    "recording--hover-on-record"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
