"use strict";

const express = require("express");
const createError = require("http-errors");
const Advertisement = require("../../models/Advertisement");

const router = express.Router();

// POST /api/advertisements (body=adData)
// Create an advertisement
router.post("/", async (req, res, next) => {
  try {
    const adData = req.body;

    // making a new ad in memory
    const ad = new Advertisement(adData);

    // save the ad in the db
    const adSaved = await ad.save();

    res.json({ result: adSaved });
  } catch (err) {
    next(err);
  }
});

// GET /api/advertisements
// Return a list of ads
router.get("/", async (req, res, next) => {
  try {
    // filters
    const name = req.query.name;
    const sale = req.query.sale;
    const price = req.query.price;
    const photo = req.query.photo;
    const tag = req.query.tag;

    // pagination
    const skip = req.query.skip;
    const limit = req.query.limit;
    // select fields
    const fields = req.query.fields;
    // sort
    const sort = req.query.sort;

    const filter = {};

    if (name) {
      // /api/advertisements?name=bike
      filter.name = new RegExp("^" + req.query.name, "i");
    }

    if (sale) {
      // /api/advertisements?sale=true
      filter.sale = sale;
    }

    if (price) {
      // /api/advertisements?price=230.15

      let prices = price.split("-");

      if (prices.length === 1) {
        filter.price = parseFloat(price);
      } else {
        filter.price = {};

        let greaterThan = parseFloat(prices[0]);
        if (greaterThan) {
          filter.price.$gte = greaterThan;
        }

        let lowerThan = parseFloat(prices[1]);
        if (lowerThan) {
          filter.price.$lte = lowerThan;
        }
      }
    }

    if (photo) {
      // /api/advertisements?photo=name.jpg
      filter.photo = photo;
    }

    if (tag) {
      // /api/advertisements?tag=lifestyle
      let tags = tag.split(" ");
      let tagStructure = [];
      console.log(tags);
      for (let mytag of tags) {
        tagStructure.push({ tag: mytag });
      }

      filter.$or = tagStructure;
      console.log(filter.$or);
    }

    console.log("HOLAAA", filter, skip);
    const adList = await Advertisement.lista(filter, skip, limit, fields, sort);
    console.log("The items found are:", adList);

    // print how many ads are in the database
    const total = await Advertisement.countDocuments();
    console.log(`There are ${total} ads in the data base`);
    if (adList.length === 0) {
      res.send("Product not found");
    } else {
      res.render("listItems", { items: adList });
    }
  } catch (err) {
    next(err);
  }
});


// GET /api/advertisements/tags
// Return a list of existent tags

router.get("/tags", async (req, res, next) => {
  let undefinedVar;
  const adTags = await Advertisement.lista({}, undefinedVar, undefinedVar, "tag", undefinedVar);
  let myTags = [];
  for (let element of adTags) {
    for (let item of element.tag) {
      if (!myTags.includes(item)) {
        myTags.push(item);
      }
    }
  }
  res.render("tags", {tags: myTags});
})



module.exports = router;
