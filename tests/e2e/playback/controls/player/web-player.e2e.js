import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";
const base_screenshot_path = path.join(
  "playback",
  "controls",
  "player",
  "web-player"
);

const loop_button = Selector(".svg__playback-web-player-controls-loop-button");
const stop_button = Selector(".svg__playback-web-player-controls-stop-button");
const pause_button = Selector(
  ".svg__playback-web-player-controls-pause-button"
);
const play_button = Selector(".span__playback-web-player-controls-play-button");

// the fixture declares what we are testing
fixture`playback/controls/player/web-player/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/web-player/basic`; // specify the start page

test("Web Player Controls should look as expected when initialized in the default (no file loaded) state and can handle loop toggling", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "basic-init");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(loop_button);
  screenshot_path = path.join(base_screenshot_path, "loop-enabled");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.click(loop_button);
  screenshot_path = path.join(base_screenshot_path, "loop-disabled");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/web-player/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/web-player/x-y-offset`; // specify the start page

test("Web Player Controls renders in offset position when parent div is moved", async (t) => {
  const screenshot_path = path.join(base_screenshot_path, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/player/web-player/stopped-state`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/web-player/stopped-state`; // specify the start page

test("Web Player Controls moves through expected play/pause/stop states", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "stopped");
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(base_screenshot_path, "playing");
  await t.click(play_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(base_screenshot_path, "stopped-after-playing");
  await t.click(stop_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(base_screenshot_path, "playing-after-stopped");
  await t.click(play_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(base_screenshot_path, "paused");
  await t.click(pause_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(base_screenshot_path, "playing-after-paused");
  await t.click(play_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(
    base_screenshot_path,
    "paused-after-playing-after-paused"
  );
  await t.click(pause_button);
  await testcafe_page_visual_regression(t, screenshot_path);

  screenshot_path = path.join(base_screenshot_path, "stopped-after-paused");
  await t.click(stop_button);
  await testcafe_page_visual_regression(t, screenshot_path);
});
