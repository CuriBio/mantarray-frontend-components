import { Selector } from "testcafe";
import { RequestMock } from "testcafe";
const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

import {
  system_status_when_recording_regexp,
  system_status_when_calibration_needed_regexp,
  all_mantarray_commands_regexp,
} from "../../../store/modules/flask/url_regex";
import { STATUS } from "../../../store/modules/flask/enums";

const base_screenshot_path = path.join("status");

const mocked_all_mantarray_commands = RequestMock()
  .onRequestTo(all_mantarray_commands_regexp)
  .respond({}, 200, { "Access-Control-Allow-Origin": "*" });

const mocked_static_system_status_states = RequestMock()
  .onRequestTo(system_status_when_calibration_needed_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.NEEDS_CALIBRATION_uuid }, 200, {
    "Access-Control-Allow-Origin": "*",
  })
  .onRequestTo(system_status_when_recording_regexp)
  .respond({ ui_status_code: STATUS.MESSAGE.RECORDING_uuid }, 200, {
    "Access-Control-Allow-Origin": "*",
  });

// the fixture declares what we are testing
fixture`status/recording-time/recording-basic`
  .page // declare the fixture
`http://localhost:8080/status/recording-time/recording-basic`; // specify the start page

test("recording time looks as expected when not recording", async (t) => {
  const screenshot_path = path.join(
    base_screenshot_path,
    "recording-time",
    "basic-init"
  );

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/recording-time/recording-x-y-offset`
  .page // declare the fixture
`http://localhost:8080/status/recording-time/recording-x-y-offset`; // specify the start page

test("recording looks as expected when anchored at an offset from top left", async (t) => {
  const screenshot_path = path.join(
    base_screenshot_path,
    "recording-time",
    "x-y-offset"
  );

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/recording-time/on-recording-init`
  .page(
    // declare the fixture
    `http://localhost:8080/status/recording-time/on-recording-init`
  )
  .requestHooks(
    mocked_all_mantarray_commands,
    mocked_static_system_status_states
  );

test.requestHooks()("recording time text displays as 0", async (t) => {
  const screenshot_path = path.join(
    base_screenshot_path,
    "recording-time",
    "on-recording-init"
  );

  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/recording-time/on-recording-after-time-elapsed`
  .page(
    // declare the fixture
    `http://localhost:8080/status/recording-time/on-recording-after-time-elapsed`
  )
  .requestHooks(
    mocked_all_mantarray_commands,
    mocked_static_system_status_states
  );

test.requestHooks()(
  "recording time text contains numbers greater than 0",
  async (t) => {
    const screenshot_path = path.join(
      base_screenshot_path,
      "recording-time",
      "on-recording-after-time-elapsed"
    );

    await t.wait(2000);
    await testcafe_page_visual_regression(t, screenshot_path);
  }
);
