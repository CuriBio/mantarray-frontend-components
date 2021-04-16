import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

fixture`stimulation/basic`.page // declare the fixture
`http://localhost:8080/stimulation/basic`; // specify the start page

test("testing the stimulation dialog for current settings", async (t) => {
  const screenshot_path_base = path.join("stimulation", "stimulation-dialog");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-stimulation-current-settings"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`stimulation/basic-voltage`
  .page // declare the fixture
`http://localhost:8080/stimulation/basic-voltage`; // specify the start page

test("testing the stimulation dialog for voltage settings", async (t) => {
  const screenshot_path_base = path.join("stimulation", "stimulation-dialog");
  const screenshot_path = path.join(
    screenshot_path_base,
    "basic-stimulation-voltage-settings"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});
