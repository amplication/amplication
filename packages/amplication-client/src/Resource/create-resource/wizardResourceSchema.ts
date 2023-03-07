const wizardSchema = {
  step0: {
    serviceName: {
      type: "String",
      require: true,
      min: 2,
    },
  },
  step1: {
    gitProvider: {},
  },
};

export default wizardSchema;
