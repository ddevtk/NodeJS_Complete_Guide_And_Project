const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

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

const productNameLower = productData.map(product =>
  slugify(product.productName, { lower: true })
);
console.log(productNameLower);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // OVERVIEW
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardHtml = productData
      .map(data => replaceTemplate(tempCard, data))
      .join('');
    const output = tempOverview.replace('@PRODUCT_CARDS', cardHtml);
    res.end(output);

    // PRODUCT
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const productItem = productData[query.id];

    const output = replaceTemplate(tempProduct, productItem);
    res.end(output);

    // API
  } else if (pathname === '/api') {
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
