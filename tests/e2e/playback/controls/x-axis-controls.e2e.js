import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const zoom_in_button = Selector(".span__playback-x-axis-controls-zoom-in-button");
const zoom_out_button = Selector(".span__playback-x-axis-controls-zoom-out-button");

// the fixture declares what we are testing
fixture`playback/controls/x-axis-controls/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/x-axis-controls/basic`; // specify the start page

test("x-axis controls have both buttons enabled initially when the zoom index is in the middle of the range", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-init");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("x-axis controls have both buttons enabled initially and we hover on the zoom_out_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-zoom-out-hover");

  await t.hover(zoom_out_button);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("x-axis controls have both buttons enabled initially and we hover to verify the tooltips on the zoom_out_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-zoom-out-tooltip");

  await t.hover(zoom_out_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("x-axis controls have both buttons enabled and reached max zoom_out and we hover on the zoom_out_button", async (t) => {
  await t.click(zoom_out_button);
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-zoom-out-max-hover");

  await t.hover(zoom_out_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(zoom_in_button);
});

test("x-axis controls have both buttons enabled and reached max zoom_out and verify the tooltips on the zoom_out_button", async (t) => {
  await t.click(zoom_out_button);
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-zoom-out-max-tooltip");

  await t.hover(zoom_out_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(zoom_in_button);
});

test("x-axis controls have both buttons enabled initially and we hover on the zoom_in_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-zoom-in-hover");

  await t.hover(zoom_in_button);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("x-axis controls have both buttons enabled and we hover to verify the tooltips on the zoom_in_button", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-zoom-in-tooltip");

  await t.hover(zoom_in_button);
  // wait for tooltips to visually display state to complete
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("x-axis controls have both buttons enabled and reached max zoom_in and we hover on the zoom_in_button", async (t) => {
  await t.click(zoom_in_button);
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-zoom-in-max-hover");

  await t.hover(zoom_in_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(zoom_out_button);
});

test("x-axis controls have both buttons enabled and reached max zoom_in and verify the tooltips on the zoom_in_button", async (t) => {
  await t.click(zoom_in_button);
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-zoom-in-max-tooltip");

  await t.hover(zoom_in_button);
  await t.wait(2000);
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(zoom_out_button);
});

test("clicking on zoom in to bring to max zoom level causes zoom in button to render as disabled", async (t) => {
  await t.click(zoom_in_button);
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-max-zoom-in");
  await testcafe_page_visual_regression(t, screenshot_path);
  // restore to initial state
  await t.click(zoom_out_button);
});

test("clicking on zoom out to bring to min zoom level causes zoom out button to render as disabled", async (t) => {
  await t.click(zoom_out_button);
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-max-zoom-out");
  await testcafe_page_visual_regression(t, screenshot_path);
  await t.click(zoom_in_button);
});

test("x-axis controls should shrink background bar width and reposition text/buttons when window width resized to half screen (960px)", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-resized-960");
  await t.resizeWindow(960, 930); // TODO (Eli 4/10/20): figure out how to get the current height so that the height isn't changed
  await testcafe_page_visual_regression(t, screenshot_path);

  // restore to initial state
  await t.resizeWindow(1920, 930); // TODO (Eli 4/10/20): figure out how to get the height/width prior to resizizing so that it can be restored
});

test("x-axis controls should shink background bar width and reposition text/buttons when window width resized to 1800px", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-resized-1800");
  await t.resizeWindow(1800, 930); // TODO (Eli 4/10/20): figure out how to get the current height so that the height isn't changed
  await testcafe_page_visual_regression(t, screenshot_path);

  // restore to initial state
  await t.resizeWindow(1920, 930); // TODO (Eli 4/10/20): figure out how to get the height/width prior to resizizing so that it can be restored
});

test("x-axis controls should shrink background bar width and reposition text/buttons when window width resized to 1500px", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "basic-resized-1500");
  await t.resizeWindow(1500, 930); // TODO (Eli 4/10/20): figure out how to get the current height so that the height isn't changed
  await testcafe_page_visual_regression(t, screenshot_path);

  // restore to initial state
  await t.resizeWindow(1920, 930); // TODO (Eli 4/10/20): figure out how to get the height/width prior to resizizing so that it can be restored
});

fixture`playback/controls/x-axis-controls/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/x-axis-controls/x-y-offset`; // specify the start page

test("x-axis controls render in offset position when props supplied", async (t) => {
  const screenshot_path = path.join("playback", "controls", "x-axis-controls", "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});
