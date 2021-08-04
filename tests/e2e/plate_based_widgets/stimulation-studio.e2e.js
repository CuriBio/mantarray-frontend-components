import { Selector } from "testcafe";

const path = require("path");

const teal = Selector("#test-1");
const blue = Selector("#test-2");
const yellow = Selector("#test-3");
const orange = Selector("#test-4");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

// the fixture declares what we are testing
fixture`plate_based_widgets/stimulation-studio/basic`
  .page // declare the fixture
`http://localhost:8080/plate_based_widgets/stimulation-studio/basic`; // specify the start page

test("StimulationStudioWidget when the no protocol is applied to any StimulationStudioPlateWell", async (t) => {
  const screenshot_path = path.join("plate_based_widgets", "stimulation-studio", "basic-simulation");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// test("StimulationStudioWidget when the Teal color is applied to any StimulationStudioPlateWell", async t => {
//   const screenshot_path = path.join("plate_based_widgets", "simulation-studio", "basic-teal-color");
//   await t.click(teal);
//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("StimulationStudioWidget when the Blue color is applied to any StimulationStudioPlateWell", async (t) => {
//   const screenshot_path = path.join("plate_based_widgets", "stimulation-studio", "basic-blue-color");
//   await t.click(blue);
//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("StimulationStudioWidget when the Yellow color is applied to any StimulationStudioPlateWell", async (t) => {
//   const screenshot_path = path.join("plate_based_widgets", "simulation-studio", "basic-yellow-color");
//   await t.click(yellow);
//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("StimulationStudioWidget when the Yellow color is applied to any StimulationStudioPlateWell", async (t) => {
//   const screenshot_path = path.join("plate_based_widgets", "simulation-studio", "basic-orange-color");
//   await t.click(orange);
//   await testcafe_page_visual_regression(t, screenshot_path);
// });
