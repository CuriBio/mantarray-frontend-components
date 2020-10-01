import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

import { get_recording } from "@/store/ApiService.js";

describe("api to get_recording", () => {
  beforeEach(() => {
    // jest.resetModules()
    // jest.clearAllMocks()
    jest.restoreAllMocks();
  });

  it("Calls axios.get with the correct endpoint URL and returns the result of the HTTP request", async () => {
    const mocked_axios_get = jest.spyOn(Vue.axios, "get");
    mocked_axios_get.mockReturnValue(Promise.resolve({ data: 3 }));

    // let mocked_axios_get = jest.fn();
    // mocked_axios_get.mockImplementation(() => Promise.resolve({ data: 3 }));
    // Vue.axios.get = mocked_axios_get;

    const result = await get_recording("sandbox_eli_waveform");
    expect(Vue.axios.get).toBeCalledWith(
      "https://94fjmm5591.execute-api.us-east-1.amazonaws.com/sandbox_eli_waveform"
    );

    expect(result).toEqual({ data: 3 });

    //mocked_axios_get = null;
    // Vue.axios.get = null
  }),
    it("Calls axios real API to obtain the waveform data from the HTTP GET", async () => {
      //const data = {}
      jest.setTimeout(10000);
      const result = await get_recording("sandbox_eli_waveform");

      //console.log(result)

      // expect(Vue.axios.get).toBeCalledWith('https://94fjmm5591.execute-api.us-east-1.amazonaws.com/sandbox_eli_waveform')

      expect(result.data["total_recording_length"]).toEqual(11200000);

      //expect(result).toEqual(Promise.resolve(data))
    }),
    it("Calls axios real API to obtain the raw waveform data from the HTTP GET and extracts x_data_points and y_data_points", async () => {
      const result = await get_recording("sandbox_eli_waveform");

      var first_simple_json_waveform = result.data["waveform_data_points"][0];

      expect(first_simple_json_waveform["x_data_points"][0]).toEqual(0);
      expect(first_simple_json_waveform["y_data_points"][0]).toEqual(
        230.417297
      );
    });
});
