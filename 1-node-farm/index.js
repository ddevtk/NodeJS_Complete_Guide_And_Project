const fs = require('fs');

const text = fs.readFileSync('./txt/input.txt', 'utf-8');

console.log(text);

const textOut = `This is what we know about avocado: ${text}. \nCreated on: ${new Date()}`;

fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written successfully');
