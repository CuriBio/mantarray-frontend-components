import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const mid_point = Selector("#test-1");
const last_point = Selector("#test-2");

fixture`status/upload-files-widget/basic-upload-status`
  .page // declare the fixture
`http://localhost:8080/status/upload-files-widget/basic-upload-status`; // specify the start page

test("testing the UploadFilesWidget with start, midpoint and lastpoint", async (t) => {
  const screenshot_path_base = path.join("status", "uploadfiles");
  const screenshot_path = path.join(screenshot_path_base, "basic-upload-init");
  await testcafe_page_visual_regression(t, screenshot_path);
  const screenshot_path_midpoint = path.join(screenshot_path_base, "basic-upload-midpoint");
  await t.click(mid_point);
  await testcafe_page_visual_regression(t, screenshot_path_midpoint);
  const screenshot_path_lastpoint = path.join(screenshot_path_base, "basic-upload-lastpoint");
  await t.click(last_point);
  await testcafe_page_visual_regression(t, screenshot_path_lastpoint);
});
