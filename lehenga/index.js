const fs = require("fs");
const express = require("express");
const url = require("url");

const app = express();
app.use("/cards", express.static("cards"));

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%PRIZE%}/g, product.price);
  output = output.replace(/{%CATEGORY%}/g, "Lehanga");
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%SUMMARY%}/g, product.summary);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  return output;
};

const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

const tempCard = fs.readFileSync("./templates/tempCard.html", "utf-8");
const tempOverview = fs.readFileSync("./templates/tempOverview.html", "utf-8");
const tempProduct = fs.readFileSync("./templates/tempProduct.html", "utf-8");

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-type": "text/html" });
  const cardsHtml = data.map((el) => replaceTemplate(tempCard, el));
  const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
  res.end(output);
});

app.get("/product", (req, res) => {
  const { query } = url.parse(req.url, true);
  res.writeHead(200, {
    "Content-type": "text/html",
  });
  const product = data[query.id];
  const output = replaceTemplate(tempProduct, product);
  res.end(output);
});

app.listen(8000, () => {
  console.log("Listening to app on port 8000");
});
