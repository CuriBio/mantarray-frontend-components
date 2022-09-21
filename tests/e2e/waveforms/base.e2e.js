import { Selector, ClientFunction } from "testcafe";
const CDP = require("chrome-remote-interface");
const fs = require("fs");
import { getPerformanceMetrics } from "@platform-os/testcafe-helpers";
const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

import VueSelector from "testcafe-vue-selectors";

// the fixture declares what we are testing
fixture`waveforms/base/basic`.page // declare the fixture
`http://localhost:8080/waveforms/base/basic`; // specify the start page

test("waveform looks as expected with default values", async (t) => {
  const screenshot_path = path.join("waveforms", "base", "basic");

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`waveforms/base/x-y-offset`.page // declare the fixture
`http://localhost:8080/waveforms/base/x-y-offset`; // specify the start page

test("waveform looks as expected when anchored at an offset from top left", async (t) => {
  const screenshot_path = path.join("waveforms", "base", "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// Tanner (9/20/22): this test is sporadically failing so removing it for now
// fixture`waveforms/base/extending-into-margins`
//   .page // declare the fixture
// `http://localhost:8080/waveforms/base/extending-into-margins`; // specify the start page

// test("margin blockers effectively cover datapoints that would jump out of the graph", async (t) => {
//   const screenshot_path = path.join("waveforms", "base", "extending-into-margins");

//   await testcafe_page_visual_regression(t, screenshot_path);
// });

fixture`waveforms/base/shorter-graph-width`.page // declare the fixture
`http://localhost:8080/waveforms/base/shorter-graph-width`; // specify the start page

test("Given a shorter graph width supplied as a prop, Then it renders a shorter graph", async (t) => {
  const screenshot_path = path.join("waveforms", "base", "shorter-graph-width");

  await testcafe_page_visual_regression(t, screenshot_path);
});
