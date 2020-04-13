const itemModel = require("../models/item.model");
const axios = require("axios");

function is_url(str) {
  regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
}

function getHostname(url) {
  return new URL(url).hostname;
}

exports.insert = (req, res) => {
  const typeInfos = {
    photo: {
      urlService: "https://www.flickr.com/services/oembed/?format=json",
    },
    video: { urlService: "https://vimeo.com/api/oembed.json" },
  };
  let type = "";

  if (!req.body.url) {
    res.status(400).send("no url");
    return;
  }
  if (!is_url(req.body.url)) {
    res.sendStatus(400);
    return;
  }
  const hostnameUrl = getHostname(req.body.url)
  if (["flickr.com", "flic.kr"].includes(hostnameUrl)) {
    type = "photo";
  } else if (["vimeo.com"].includes(hostnameUrl)) {
    type = "video";
  } else {
    res.status(400).send("bad url, please use flickr or vimeo url");
    return;
  }
  axios
    .get(typeInfos[type].urlService, {
      params: {
        url: req.body.url,
      },
    })
    .then(function (response) {
      itemModel.createItem(response.data, type, req.body.url).then((result) => {
        res.status(201).send({ id: result._id });
      });
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
};

exports.getById = (req, res) => {
  itemModel.findById(req.params.itemId).then((result) => {
    res.status(200).send(result);
  });
};

exports.getAll = (req, res) => {
  itemModel.findAll().then((result) => {
    console.log(result);
    res.status(200).send(result);
  });
};

exports.addKeywords = (req, res) => {
  console.log(req.params.itemId);
  itemModel
    .updateKeywords(req.params.itemId, req.body.keywords)
    .then((result) => {
      res.status(201).send({ id: result._id });
    });
};

exports.delete = (req, res) => {
  itemModel.delete(req.params.itemId).then((result) => {
    res.sendStatus(204);
  });
};
