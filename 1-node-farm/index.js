const fs = require('fs');
const http = require('http');
const url = require('url');

/*
// blocking, synchronous way
const text = fs.readFileSync('./txt/input.txt', 'utf-8');
const textOut = `This is what we know about avocado: ${text}. \nCreated on: ${new Date()}`;
fs.writeFileSync('./txt/output.txt', textOut);

 */
// blocking, synchronous way

/* fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log(data1);
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (_err, data2) => {
    console.log(data2);
    fs.readFile('./txt/append.txt', 'utf-8', (_err, data3) => {
      console.log(data3);
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', _err => {
        console.log('File has been written');
      });
    });
  });
});
console.log('Write this file');
 */

const replaceTemplate = (temp, product) => {
  let output = temp.replace('NAME', product.productName);
  output = output.replace('@IMAGE', product.image);
  output = output.replace('@PRICE', product.price);
  output = output.replace('@IMAGE', product.image);
  output = output.replace('@FROM', product.from);
  output = output.replace('@NUTRIENTS', product.nutrients);
  output = output.replace('@ID', product.id);
  output = output.replace('@QUANTITY', product.quantity);
  output = output.replace('@DESCRIPTION', product.description);

  if (!product.organic) {
    output = output.replace('@NOT_ORGANIC', 'not-organic');
  }

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);
console.log(productData);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // OVERVIEW
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardHtml = productData
      .map(data => replaceTemplate(tempCard, data))
      .join('');
    const output = tempOverview.replace('@PRODUCT_CARDS', cardHtml);
    res.end(output);

    // PRODUCT
  } else if (pathName === '/product') {
    res.end('this.is product page');

    // API
  } else if (pathName === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // ERROR
  } else {
    res.writeHead('404', {
      'Content-type': 'text/html',
      'my-owner-header': 'hello world',
    });
    res.end('<h1>page not found</h1>');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
