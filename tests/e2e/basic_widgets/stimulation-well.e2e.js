import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

// the fixture declares what we are testing
fixture`basic_widgets/stimulation-well/basic`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/stimulation-well/basic`; // specify the start page

test("StimulationWellWidget when the no protocol is applied", async (t) => {
  const screenshot_path = path.join("basic_widgets", "simulation-well", "basic-stimulation-well");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/stimulation-well/basic-protocol-applied`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/stimulation-well/basic-protocol-applied`; // specify the start page

test("StimulationWellWidget with the protocol is applied", async (t) => {
  const screenshot_path = path.join("basic_widgets", "simulation-well", "basic-stimulation-protocol-applied");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/stimulation-well/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/stimulation-well/x-y-offset`; // specify the start page

test("StimulationWellWidget with the X Y Offset applied", async (t) => {
  const screenshot_path = path.join("basic_widgets", "simulation-well", "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
