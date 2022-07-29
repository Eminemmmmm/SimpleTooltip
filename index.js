'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const log = console.log;

const path = require('path');
app.use(express.static(path.join(__dirname, '/pub')));

app.listen(port, () => {
	log(`Listening on port ${port}...`);
});