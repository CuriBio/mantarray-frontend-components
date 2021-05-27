import Vue from "vue";
import { get_recording } from "@/store/ApiService.js";

describe("APIService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("Given that the get method is mocked, When the endpoint URL is valid, Then assert the response value matches the mocked json object", async () => {
    const mocked_axios_get = jest.spyOn(Vue.axios, "get");
    mocked_axios_get.mockReturnValue(Promise.resolve({ data: 3 }));

    const result = await get_recording("sandbox_eli_waveform");
    expect(Vue.axios.get).toHaveBeenCalledWith(
      "https://94fjmm5591.execute-api.us-east-1.amazonaws.com/sandbox_eli_waveform"
    );
    expect(result).toStrictEqual({ data: 3 });
  }),
    test("Given the endpoint URL is valid, When Axios obtains the response from AWS API, in the form of waveform data from the get method call, Then assert the value of the parameter total_recording_length", async () => {
      jest.setTimeout(10000);
      const result = await get_recording("sandbox_eli_waveform");
      expect(result.data["total_recording_length"]).toStrictEqual(11200000);
    }),
    test("Given the endpoint URL is valid, When Axios obtains the response waveform data from the get method call, Then extracts x_data_points and y_data_points and assert the value", async () => {
      const result = await get_recording("sandbox_eli_waveform");
      const first_simple_json_waveform = result.data["waveform_data_points"][0];
      expect(first_simple_json_waveform["x_data_points"][0]).toStrictEqual(0);
      expect(first_simple_json_waveform["y_data_points"][0]).toStrictEqual(230.417297);
    });
});
