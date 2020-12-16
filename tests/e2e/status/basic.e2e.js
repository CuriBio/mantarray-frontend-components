import { Selector, ClientFunction } from "testcafe";
import { RequestMock } from "testcafe";
const CDP = require("chrome-remote-interface");
const fs = require("fs");
import { getPerformanceMetrics } from "@platform-os/testcafe-helpers";
const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const error_active_btn = Selector("#test");
const okay_btn_label = Selector(".span__button_label");

const shutdown_request_url = "http://localhost:4567/shutdown";

const mocked_shutdown_commands = RequestMock()
  .onRequestTo(shutdown_request_url)
  .respond({}, 200, { "Access-Control-Allow-Origin": "*" });

import VueSelector from "testcafe-vue-selectors";

// the fixture declares what we are testing
fixture`status/basic`.page // declare the fixture
`http://localhost:8080/status/basic`; // specify the start page

test("status widget looks as expected with default values", async (t) => {
  const screenshot_path = path.join("status", "basic");

  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`status/basic-error-catch`
  .page(`http://localhost:8080/status/basic-error-catch`)
  .requestHooks(mocked_shutdown_commands); // specify the start page

test("status widget captures an ERROR Catch Widget and ShutDown", async (t) => {
  const screenshot_path = path.join("status", "basic-status-error-catch");

  await t.click(error_active_btn);
  await testcafe_page_visual_regression(t, screenshot_path);

  const screenshot_path_shutdown = path.join("status", "basic-status-shutdown");

  await t.click(okay_btn_label);
  await testcafe_page_visual_regression(t, screenshot_path_shutdown);
});

fixture`status/x-y-offset`.page // declare the fixture
`http://localhost:8080/status/x-y-offset`; // specify the start page

test("status widget looks as expected when anchored at an offset from top left", async (t) => {
  const screenshot_path = path.join("status", "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
