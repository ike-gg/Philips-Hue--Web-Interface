import dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express();
import bodyParser from 'body-parser';
import chalk from 'chalk';

import apiHandler from './src/apiHandler.js';

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(bodyParser.json());

app.listen(process.env.port, () => {
    console.log(chalk.blue(`Philips Hue interface is now working on ${process.env.port} port!`))
})

apiHandler(app);

//"hueIp":"192.168.8.155","usernameHue":"O5mDFyouH0pudVbHElDw1fgOkUep63wROxGa-rgZ","user":"Marek"