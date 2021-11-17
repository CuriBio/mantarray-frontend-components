import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const file_count = Selector("#test-1");
const total_file_count = Selector("#test-2");

fixture`status/upload-files-widget/basic-upload-status`
  .page // declare the fixture
`http://localhost:8080/status/upload-files-widget/basic-upload-status`; // specify the start page

test("testing the UploadFilesWidget with start, one file waiting to upload, two files waiting to upload, and one out of two files complete", async (t) => {
  const screenshot_path_base = path.join("status", "uploadfiles");
  const screenshot_path = path.join(screenshot_path_base, "basic-upload-init");

  const screenshot_path_one_file_uploading = path.join(
    screenshot_path_base,
    "basic-upload-one-file-uploading"
  );
  await t.click(total_file_count);
  await testcafe_page_visual_regression(t, screenshot_path_one_file_uploading);

  const screenshot_path_two_files_uploading = path.join(
    screenshot_path_base,
    "basic-upload-two-files-uploading"
  );
  await t.click(total_file_count);
  await testcafe_page_visual_regression(t, screenshot_path_two_files_uploading);

  await testcafe_page_visual_regression(t, screenshot_path);
  const screenshot_path_midpoint = path.join(screenshot_path_base, "basic-upload-midpoint");
  await t.click(file_count);
  await testcafe_page_visual_regression(t, screenshot_path_midpoint);
});
