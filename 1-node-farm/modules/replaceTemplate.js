module.exports = (temp, product) => {
  let output = temp.split('@NAME').join(product.productName);
  output = output.split('@IMAGE').join(product.image);
  output = output.split('@PRICE').join(product.price);
  output = output.split('@FROM').join(product.from);
  output = output.split('@NUTRIENTS').join(product.nutrients);
  output = output.split('@ID').join(product.id);
  output = output.split('@QUANTITY').join(product.quantity);
  output = output.split('@DESCRIPTION').join(product.description);

  if (!product.organic) {
    output = output.split('@NOT_ORGANIC').join('not-organic');
  }

  return output;
};
