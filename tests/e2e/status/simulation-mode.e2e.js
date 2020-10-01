import { Selector, ClientFunction } from "testcafe";
const CDP = require("chrome-remote-interface");
const fs = require("fs");
import { getPerformanceMetrics } from "@platform-os/testcafe-helpers";
const path = require("path");

import { testcafe_page_visual_regression } from "@curibio/frontend_test_utils";

import VueSelector from "testcafe-vue-selectors";

// the fixture declares what we are testing
fixture`status/simulation-basic`
  .page // declare the fixture
`http://localhost:8080/status/simulation-basic`; // specify the start page

test("Simulation mode widget looks as expected with default values", async (t) => {
  const screenshot_path = path.join("status", "simulation-basic");

  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/simulation-x-y-offset`
  .page // declare the fixture
`http://localhost:8080/status/simulation-x-y-offset`; // specify the start page

test("Simulation Mode widget looks as expected when anchored at an offset from top left", async (t) => {
  const screenshot_path = path.join("status", "simulation-x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/simulation-with-copyright`
  .page // declare the fixture
`http://localhost:8080/status/simulation-with-copyright`; // specify the start page

test("Simulation Mode widget looks as expected when copyright text is externally added on top of it", async (t) => {
  const screenshot_path = path.join("status", "simulation-with-copyright");
  await testcafe_page_visual_regression(t, screenshot_path);
});
