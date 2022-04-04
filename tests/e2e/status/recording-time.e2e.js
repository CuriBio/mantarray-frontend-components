import { RequestMock } from "testcafe";
const path = require("path");
import url from "url";

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

import { system_status_regexp, all_mantarray_commands_regexp } from "../../../store/modules/flask/url_regex";

const base_screenshot_path = path.join("status");

const mocked_all_mantarray_commands = RequestMock()
  .onRequestTo(all_mantarray_commands_regexp)
  .respond({}, 200, { "Access-Control-Allow-Origin": "*" });

const mocked_system_status = RequestMock()
  .onRequestTo(system_status_regexp)
  .respond((req, res) => {
    res.headers["Access-Control-Allow-Origin"] = "*";
    res.statusCode = 200;

    const status_uuid = url.parse(req.url, true).query.current_vuex_status_uuid;
    res.setBody(JSON.stringify({ ui_status_code: status_uuid }));
  });

// the fixture declares what we are testing
fixture`status/recording-time/recording-basic`
  .page // declare the fixture
`http://localhost:8080/status/recording-time/recording-basic`; // specify the start page

test("recording time looks as expected when not recording", async (t) => {
  const screenshot_path = path.join(base_screenshot_path, "recording-time", "basic-init");

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/recording-time/recording-x-y-offset`
  .page // declare the fixture
`http://localhost:8080/status/recording-time/recording-x-y-offset`; // specify the start page

test("recording looks as expected when anchored at an offset from top left", async (t) => {
  const screenshot_path = path.join(base_screenshot_path, "recording-time", "x-y-offset");

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/recording-time/on-recording-init`
  .page(
    // declare the fixture
    `http://localhost:8080/status/recording-time/on-recording-init`
  )
  .requestHooks(mocked_all_mantarray_commands, mocked_system_status);

test.requestHooks()("recording time text displays as 0", async (t) => {
  const screenshot_path = path.join(base_screenshot_path, "recording-time", "on-recording-init");

  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/recording-time/on-recording-after-time-elapsed`
  .page(
    // declare the fixture
    `http://localhost:8080/status/recording-time/on-recording-after-time-elapsed`
  )
  .requestHooks(mocked_all_mantarray_commands, mocked_system_status);

test.requestHooks()("recording time text contains numbers greater than 0", async (t) => {
  const screenshot_path = path.join(
    base_screenshot_path,
    "recording-time",
    "on-recording-after-time-elapsed"
  );

  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});
