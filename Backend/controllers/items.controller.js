const itemModel = require("../models/item.model");
const axios = require("axios");

exports.insert = (req, res) => {
  const typeInfos = {
      photo: { urlService: 'https://www.flickr.com/services/oembed/?format=json'},
      video: { urlService: 'https://vimeo.com/api/oembed.json'}
  }
  let type = '';

  if (!req.body.url) {
    res.status(400).send("no url");
    return;
  }
  if (req.body.url.includes("flickr")) {
    type = 'photo';
    
  } else if (req.body.url.includes("vimeo")) {
    type = 'video';
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
    })
}