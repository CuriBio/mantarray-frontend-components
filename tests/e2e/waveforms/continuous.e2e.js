import { Selector, ClientFunction } from "testcafe";
const CDP = require("chrome-remote-interface");
const fs = require("fs");
import { getPerformanceMetrics } from "@platform-os/testcafe-helpers";
const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

import VueSelector from "testcafe-vue-selectors";

// the fixture declares what we are testing
fixture`waveforms/continuous/basic`.page // declare the fixture
`http://localhost:8080/waveforms/continuous/basic`; // specify the start page

test("waveform looks as expected with default position", async (t) => {
  const screenshot_path = path.join("waveforms", "continuous", "basic");

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`waveforms/continuous/x-y-offset`.page // declare the fixture
`http://localhost:8080/waveforms/continuous/x-y-offset`; // specify the start page

test("waveform looks as expected when anchored at an offset from top left", async (t) => {
  const screenshot_path = path.join("waveforms", "continuous", "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
