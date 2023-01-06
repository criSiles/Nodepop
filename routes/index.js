var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Nodepop" });
});

// Params by route
router.get("/:name", function (req, res, next) {
  const name = req.params.name;
  console.log(req.params);
  res.send(`Obteining directly the object, ${name}.`);
});

router.get("/myFirstPar/:name", function (req, res, next) {
  const name = req.params.name;
  console.log(req.params);
  res.send(`The object I want to buy is a ${name}.`);
});

// Optional params by route

router.get("/myFirstOptPar/:tag?", function (req, res, next) {
  const tag = req.params.tag;
  console.log(req.params.tag);
  res.send(`Tags are not mandatory, like ${tag}.`);
});
module.exports = router;

// Various params and with numbers included by route
router.get(
  "/price/:price([0-9]+)/quantity/:quantity([0-9]+)",
  (req, res, next) => {
    const price = req.params.price;
    const quantity = req.params.quantity;
    res.send(` The unit price is ${price} and You will take ${quantity}`);
  }
);

// By query string

router.get("/by_query_string", function (req, res) {
  console.log("query-string", req.query);
  var price = req.query.price;
  res.send(` The unit price is ${price}`);
});
