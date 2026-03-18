const js2xmlparser = require("js2xmlparser");

function responseFormat(req, res, next) {
  // Override res.json to handle XML
  res.formatResponse = (data) => {
    const accept = req.headers["accept"];
    if (accept && accept.includes("application/xml")) {
      res.set("Content-Type", "application/xml");
      res.send(js2xmlparser.parse("response", data));
    } else {
      res.json(data);
    }
  };
  next();
}

module.exports = responseFormat;