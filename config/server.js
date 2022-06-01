const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  const html = fs.readFileSync(path.resolve(__dirname, './jest.html'))
    .toString();
  res.setHeader('content-type', 'text/html; charset=UTF-8');
  res.send(html);
});

app.get(/\/(es|cjs|umd)\//, (req, res) => {
  const localFilePath = path.resolve(process.cwd(), req.path.substring(1));
  const fileContent = fs.readFileSync(localFilePath).toString();
  res.send(fileContent);
});

app.listen(3999);
