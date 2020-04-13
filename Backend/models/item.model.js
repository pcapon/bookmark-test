var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  type: String,
  url: String,
  title: String,
  author: String,
  uploadDate: String,
  width: Number,
  height: Number,
  duration: Number,
  keywords: Array,
  thumbnailUrl: String,
});

const Item = mongoose.model("Item", itemSchema);

exports.createItem = (Data, type, url) => {
  const item = new Item({
    type: type,
    url: url,
    title: Data.title,
    author: Data.author_name,
    uploadDate: Data.upload_date,
    width: Data.width,
    height: Data.height,
    duration: type === "video" ? Data.duration : 0,
    keywords: [],
    thumbnailUrl: Data.thumbnail_url,
  });
  return item.save();
};

exports.findById = (id) => {
  return Item.findById(id).then((result) => {
    result = result.toJSON();
    return result;
  });
};

exports.findAll = () => {
  return new Promise((resolve, reject) => {
    Item.find().exec(function (err, item) {
      if (err) {
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
};

exports.updateKeywords = (id, keywords) => {
  return new Promise((resolve, reject) => {
    Item.findByIdAndUpdate(id, { keywords: keywords }).exec(function (
      err,
      item
    ) {
      if (err) {
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    Item.findByIdAndDelete(id).exec(function (
      err,
      item
    ) {
      if (err) {
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
};