import fs from 'fs';
import axios from 'axios';
import chalk from 'chalk';

export default function(req, res) {
  let config = JSON.parse(fs.readFileSync('bin/config.json'));
  axios.get(`http://${config.hueIp}/api/${config.usernameHue}/lights`)
      .then(response => {
          res.json({
              status: "ok",
              lights: response.data
          })
      }).catch(error => {
          console.log(chalk.red("Something went wrong.. (Check browser console for details)"));
          res.json({
              status: "error",
              error
          })
      });
}