export const TEST_BIPHASIC_PULSE_SETTINGS = {
  phase_one_duration: "",
  phase_one_charge: "",
  interphase_interval: "",
  phase_two_duration: "",
  phase_two_charge: "",
  postphase_interval: "",
  total_active_duration: {
    duration: "",
    unit: "milliseconds",
  },
  num_cycles: 0,
  frequency: "",
};

export const TEST_MONOPHASIC_PULSE_SETTINGS = {
  phase_one_duration: "",
  phase_one_charge: "",
  postphase_interval: "",
  total_active_duration: {
    duration: "",
    unit: "milliseconds",
  },
  num_cycles: 0,
  frequency: "",
};

export const MONOPHASIC_DROP_ELEMENT = {
  type: "Monophasic",
  color: "",
  pulse_settings: TEST_MONOPHASIC_PULSE_SETTINGS,
};

export const BIPHASIC_DROP_ELEMENT = {
  type: "Biphasic",
  color: "",
  pulse_settings: TEST_BIPHASIC_PULSE_SETTINGS,
};

export const VALID_STIM_JSON = JSON.stringify({
  protocols: [
    {
      color: "hsla(51, 90%, 40%, 1)",
      letter: "A",
      label: "",
      protocol: {
        name: "test_proto_1",
        run_until_stopped: true,
        stimulation_type: "C",
        rest_duration: 0,
        time_unit: "milliseconds",
        subprotocols: [
          {
            type: "Delay",
            duration: 333,
            unit: "milliseconds",
          },
        ],
        detailed_subprotocols: [
          {
            type: "Delay",
            color: "hsla(69, 92%, 45%, 1)",
            pulse_settings: {
              duration: 333,
              unit: "milliseconds",
            },
          },
        ],
      },
    },
    {
      color: "hsla(334, 95%, 53%, 1)",
      letter: "B",
      label: "",
      protocol: {
        name: "test_proto_2",
        run_until_stopped: true,
        stimulation_type: "C",
        rest_duration: 0,
        time_unit: "milliseconds",
        subprotocols: [
          {
            type: "Delay",
            duration: 15000,
            unit: "milliseconds",
          },
        ],
        detailed_subprotocols: [
          {
            type: "Delay",
            color: "hsla(69, 92%, 45%, 1)",
            pulse_settings: {
              duration: 15000,
              unit: "milliseconds",
            },
          },
        ],
      },
    },
  ],
  protocol_assignments: {
    A1: null,
    B1: null,
    C1: null,
    D1: null,
    A2: null,
    B2: null,
    C2: null,
    D2: null,
    A3: null,
    B3: null,
    C3: null,
    D3: null,
    A4: "B",
    B4: "B",
    C4: "B",
    D4: "B",
    A5: "A",
    B5: "A",
    C5: "A",
    D5: "A",
    A6: null,
    B6: null,
    C6: null,
    D6: null,
  },
});

export const INVALID_STIM_JSON = JSON.stringify({
  protocols: [
    {
      color: "hsla(51, 90%, 40%, 1)",
      letter: "A",
      label: "",
      protocol: {
        name: "test_proto_1",
        run_until_stopped: true,
        stimulation_type: "C",
        rest_duration: 0,
        time_unit: "milliseconds",
        subprotocols: [
          {
            type: "Delay",
            duration: 0,
            unit: "milliseconds",
          },
        ],
        detailed_subprotocols: [
          {
            type: "Delay",
            color: "hsla(69, 92%, 45%, 1)",
            pulse_settings: {
              duration: 0,
              unit: "milliseconds",
            },
          },
        ],
      },
    },
    {
      color: "hsla(334, 95%, 53%, 1)",
      letter: "B",
      label: "",
      protocol: {
        name: "test_proto_2",
        run_until_stopped: true,
        stimulation_type: "C",
        rest_duration: 0,
        time_unit: "milliseconds",
        subprotocols: [
          {
            type: "Biphasic",
            phase_one_duration: 0,
            phase_one_charge: 200,
            interphase_interval: 10,
            phase_two_duration: 3,
            phase_two_charge: 200,
            postphase_interval: 5,
            total_active_duration: {
              duration: 1000,
              unit: "milliseconds",
            },
            num_cycles: 1,
          },
        ],
        detailed_subprotocols: [
          {
            type: "Biphasic",
            color: "hsla(69, 92%, 45%, 1)",
            pulse_settings: {
              phase_one_duration: 100,
              phase_one_charge: 200,
              interphase_interval: 10,
              phase_two_duration: 3,
              phase_two_charge: 200,
              postphase_interval: 5,
              total_active_duration: {
                duration: 1000,
                unit: "milliseconds",
              },
              num_cycles: 1,
            },
          },
        ],
      },
    },
    {
      color: "hsla(310, 95%, 53%, 1)",
      letter: "C",
      label: "",
      protocol: {
        name: "test_proto_3",
        run_until_stopped: true,
        stimulation_type: "C",
        rest_duration: 0,
        time_unit: "milliseconds",
        subprotocols: [
          {
            type: "Monophasic",
            phase_one_duration: 10,
            phase_one_charge: 0,
            postphase_interval: 5,
            total_active_duration: {
              duration: 1,
              unit: "seconds",
            },
            num_cycles: 1,
          },
        ],
        detailed_subprotocols: [
          {
            type: "Monophasic",
            color: "hsla(69, 92%, 45%, 1)",
            pulse_settings: {
              phase_one_duration: 10,
              phase_one_charge: 0,
              postphase_interval: 5,
              total_active_duration: {
                duration: 1,
                unit: "seconds",
              },
              num_cycles: 1,
            },
          },
        ],
      },
    },
  ],
  protocol_assignments: {
    A1: null,
    B1: null,
    C1: null,
    D1: null,
    A2: null,
    B2: null,
    C2: null,
    D2: null,
    A3: null,
    B3: null,
    C3: null,
    D3: null,
    A4: "B",
    B4: "B",
    C4: "B",
    D4: "B",
    A5: "A",
    B5: "A",
    C5: "A",
    D5: "A",
    A6: "C",
    B6: "C",
    C6: null,
    D6: null,
  },
});

export const TEST_PROTOCOL_ORDER = [
  {
    type: "Biphasic",
    src: "test",
    color: "b7b7b7",
    pulse_settings: {
      phase_one_duration: 100,
      phase_one_charge: 200,
      interphase_interval: 10,
      phase_two_duration: 3,
      phase_two_charge: 200,
      postphase_interval: 5,
      total_active_duration: {
        duration: 1000,
        unit: "milliseconds",
      },
      num_cycles: 1,
    },
    nested_protocols: [],
  },
];

export const TEST_PROTOCOL_ORDER_2 = [
  {
    type: "Biphasic",
    src: "placeholder",
    color: "#ffff1",
    pulse_settings: {
      phase_one_duration: 30,
      phase_one_charge: 20,
      interphase_interval: 5,
      phase_two_duration: 10,
      phase_two_charge: -5,
      postphase_interval: 10,
      total_active_duration: {
        duration: 2000,
        unit: "milliseconds",
      },
      num_cycles: 2,
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    color: "#ffff2",
    pulse_settings: {
      phase_one_duration: 30,
      phase_one_charge: 2,
      postphase_interval: 20,
      total_active_duration: {
        duration: 1000,
        unit: "milliseconds",
      },
      num_cycles: 1,
    },
  },
  {
    type: "Delay",
    src: "placeholder",
    color: "#ffff3",
    pulse_settings: {
      duration: 1300,
      unit: "seconds",
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    color: "#ffff4",
    pulse_settings: {
      phase_one_duration: 30,
      phase_one_charge: 50,
      postphase_interval: 10,
      total_active_duration: {
        duration: 2000,
        unit: "milliseconds",
      },
      num_cycles: 2,
    },
  },
];

export const TEST_PROTOCOL_LIST = [
  { letter: "", color: "", label: "Create New" },
  {
    letter: "A",
    color: "#118075",
    label: "Tester",
    protocol: {
      name: "Tester",
      stimulation_type: "C",
      rest_duration: 20,
      time_unit: "milliseconds",
      subprotocols: [
        {
          type: "Delay",
          duration: 15,
          unit: "seconds",
        },
        {
          type: "Delay",
          duration: 20,
          unit: "milliseconds",
        },
      ],
      detailed_subprotocols: [
        {
          type: "Delay",
          src: "/delay-tile.png",
          nested_protocols: [],
          color: "hsla(99, 60%, 40%, 1)",
          pulse_settings: { duration: 15, unit: "seconds" },
        },
      ],
    },
  },
];

export const TEST_PROTOCOL_B = {
  letter: "B",
  color: "#000000",
  label: "test_1",
  protocol: {
    stimulation_type: "C",
    run_until_stopped: true,
    subprotocols: [
      {
        type: "Monophasic",
        phase_one_duration: 15,
        phase_one_charge: 500,
        postphase_interval: 3,
        num_cycles: 1,
      },
    ],
    detailed_subprotocols: [
      {
        color: "hsla(45, 90%, 40%, 1)",
      },
    ],
  },
};
export const TEST_PROTOCOL_D = {
  letter: "D",
  color: "#000001",
  label: "test_2",
  protocol: {
    stimulation_type: "C",
    run_until_stopped: false,
    subprotocols: [
      {
        type: "Biphasic",
        phase_one_duration: 20,
        phase_one_charge: 400,
        interphase_interval: 10,
        phase_two_charge: -400,
        phase_two_duration: 20,
        postphase_interval: 0,
        num_cycles: 2,
      },
    ],
    detailed_subprotocols: [
      {
        color: "hsla(309, 50%, 60%, 1)",
      },
    ],
  },
};

export const TEST_PROTOCOL_ORDER_3 = [
  {
    type: "Biphasic",
    src: "placeholder",
    run_until_stopped: false,
    color: "hsla(15, 100%, 50%, 1)",
    pulse_settings: {
      phase_one_duration: 20,
      phase_one_charge: 2,
      interphase_interval: 10,
      phase_two_duration: 20,
      phase_two_charge: -5,
      postphase_interval: 0,
      total_active_duration: {
        duration: 1000,
        unit: "milliseconds",
      },
      num_cycles: 1,
      frequency: 3,
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    run_until_stopped: false,
    color: "hsla(205, 100%, 50%, 1)",
    pulse_settings: {
      phase_one_duration: 20,
      phase_one_charge: 3,
      postphase_interval: 0,
      total_active_duration: {
        duration: 2000,
        unit: "milliseconds",
      },
      num_cycles: 2,
      frequency: 1,
    },
  },
  {
    type: "Delay",
    src: "placeholder",
    run_until_stopped: false,
    color: "hsla(5, 100%, 50%, 1)",
    pulse_settings: {
      duration: 300,
      unit: "seconds",
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    run_until_stopped: false,
    color: "hsla(190, 100%, 50%, 1)",
    pulse_settings: {
      phase_one_duration: 10,
      phase_one_charge: 2,
      postphase_interval: 0,
      total_active_duration: {
        duration: 4000,
        unit: "milliseconds",
      },
      num_cycles: 4,
      frequency: 5,
    },
  },
];

export const TEST_PROTOCOL_LIST_2 = [
  { letter: "", color: "", label: "Create New" },
  {
    letter: "A",
    color: "#118075",
    label: "Tester",
    protocol: {
      name: "Tester",
      stimulation_type: "C",
      run_until_stopped: false,
      rest_duration: 20,
      time_unit: "milliseconds",
      subprotocols: [
        {
          type: "Delay",
          duration: 15000,
          unit: "milliseconds",
        },
        {
          type: "Delay",
          duration: 20,
          unit: "seconds",
        },
      ],
      detailed_subprotocols: [
        {
          type: "Delay",
          src: "/delay-tile.png",
          run_until_stopped: false,
          color: "hsla(65, 100%, 50%, 1)",
          pulse_settings: {
            pduration: 15000,
            unit: "milliseconds",
          },
        },
      ],
    },
  },
];
