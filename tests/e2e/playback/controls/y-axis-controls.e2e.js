import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const zoom_in_button = Selector(".span__playback-y-axis-controls-zoom-in-button");
const zoom_out_button = Selector(".span__playback-y-axis-controls-zoom-out-button");
const set_max_window = Selector("#max_button");
const set_min_window = Selector("#min_button");

// the fixture declares what we are testing
fixture`playback/controls/y-axis-controls/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/y-axis-controls/basic` // specify the start page
  .beforeEach(async (t) => {
    // Resize window
    await t.resizeWindow(1920, 930);
  });

test("y-axis controls have both buttons enabled initially when the zoom index is in the middle of the range", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-init");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("y-axis controls have both buttons enabled initially and we hover on the zoom_out_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-init-out-hover");
  await t.hover(zoom_out_button);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("y-axis controls have both buttons enabled and  zoom_out on hover and verify the tooltips on the zoom_out_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-init-out-tooltips");

  await t.hover(zoom_out_button).wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("y-axis controls have both buttons enabled initially and we hover on the zoom_out_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-init-out-max-hover");

  await t.click(set_max_window).hover(zoom_out_button);

  await testcafe_page_visual_regression(t, screenshot_path);
  await t.click(zoom_in_button);
});

test("y-axis controls have both buttons enabled and reached max zoom_out and verify the tooltips on the zoom_out_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-init-out-max-tooltips");

  await t.click(set_max_window).hover(zoom_out_button).wait(2000);

  await testcafe_page_visual_regression(t, screenshot_path);
  await t.click(zoom_in_button);
});

test("y-axis controls have both buttons enabled initially and we hover on the zoom_in_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-init-in-hover");
  await t.hover(zoom_in_button);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("y-axis controls have both buttons enabled initially and verify the tooltips zoom_in_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-init-in-tooltips");
  await t.hover(zoom_in_button).wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("y-axis controls have both buttons enabled enabled and reached max and verify the tooltips zoom_in_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-init-in-max-tooltips");

  await t.click(set_min_window).hover(zoom_in_button).wait(2000);

  await testcafe_page_visual_regression(t, screenshot_path);
  await t.click(zoom_out_button);
});

test("clicking on zoom in to bring to max zoom level causes zoom in button to render as disabled", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-max-zoom-in");
  await t.click(set_min_window).click(zoom_in_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  // restore to initial state
  await t.click(zoom_out_button);
});

test("clicking on zoom out to bring to min zoom level causes zoom out button to render as disabled", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "basic-max-zoom-out");
  await t.click(set_max_window).click(zoom_out_button);
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.click(zoom_in_button);
});

fixture`playback/controls/y-axis-controls/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/y-axis-controls/x-y-offset`; // specify the start page

test("y-axis controls render in offset position when props supplied", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/y-axis-controls/height-700px`
  .page // declare the fixture
`http://localhost:8080/playback/controls/y-axis-controls/height-700px`; // specify the start page

test("y-axis controls render at a different height when props supplied", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "height-700px");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/y-axis-controls/height-2000px`
  .page // declare the fixture
`http://localhost:8080/playback/controls/y-axis-controls/height-2000px`; // specify the start page

test("y-axis controls render at a different height when props supplied", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "height-2000px");
  await t.resizeWindow(1920, 2000);

  await testcafe_page_visual_regression(t, screenshot_path);
  // restore to initial state
  await t.resizeWindow(1920, 930);
});

fixture`playback/controls/y-axis-controls/height-100px`
  .page // declare the fixture
`http://localhost:8080/playback/controls/y-axis-controls/height-100px`; // specify the start page

test("y-axis controls render at a different height when props supplied", async (t) => {
  const screenshot_path = path.join("playback", "controls", "y-axis-controls", "height-100px");
  await testcafe_page_visual_regression(t, screenshot_path);
});
