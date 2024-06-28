const uid = require("uuid");

app.get("/products", function (req, res) {
  res.send(products);
});

app.post("/product", function (req, res) {
  const productDetails = req.body;
  const id = uid.v4();

  products.push({
    id,
    name: productDetails.name,
    price: productDetails.price,
  });

  res.send("product added successfully!");
});

app.get("/product/:id", function (req, res) {
  const productId = req.params.id;

  const productDetails = products.find((product) => product.id === productId);

  res.send(productDetails);
});

app.put("/product/:id", (req, res) => {
  const productId = req.params.id;
  const updatedProductDetails = req.body;

  for (let i = 0; i < products.length; i++) {
    if (products[i].id == productId) {
      products[i].name = updatedProductDetails.name;
      products[i].price = updatedProductDetails.price;
    }
  }

  res.send("product updated successfully");
});

app.delete("/product/:id", (req, res) => {
  const productId = req.params.id;
  products = products.filter((product) => product.id != productId);

  res.send("product deleted successfully!");
});
