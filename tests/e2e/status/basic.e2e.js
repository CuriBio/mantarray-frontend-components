import { Selector, ClientFunction } from "testcafe";
const CDP = require("chrome-remote-interface");
const fs = require("fs");
import { getPerformanceMetrics } from "@platform-os/testcafe-helpers";
const path = require("path");

import { testcafe_page_visual_regression } from "@curibio/frontend_test_utils";

import VueSelector from "testcafe-vue-selectors";

// the fixture declares what we are testing
fixture`status/basic`.page // declare the fixture
`http://localhost:8080/status/basic`; // specify the start page

test("status widget looks as expected with default values", async (t) => {
  const screenshot_path = path.join("status", "basic");

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/x-y-offset`.page // declare the fixture
`http://localhost:8080/status/x-y-offset`; // specify the start page

test("status widget looks as expected when anchored at an offset from top left", async (t) => {
  const screenshot_path = path.join("status", "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
