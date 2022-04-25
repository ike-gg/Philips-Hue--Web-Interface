import chalk from 'chalk';
import fs from 'fs';
import axios from 'axios';

export default function(req, res) {
  if (!(fs.existsSync('bin/config.json'))) {
      console.log(chalk.blue("Config file missing in bin/config.json, generating new one."));
      fs.writeFileSync('bin/config.json', '{}');
  }
  let config = fs.readFileSync('bin/config.json');
  try {
      config = JSON.parse(config);
  } catch (e) {
      console.log(chalk.red("Corrupted config.json file!"));
      fs.writeFileSync('bin/config.json', '{}');
  }
  if (!("hueIp" in config) || !("usernameHue" in config) || !("user" in config)) {
      console.log(chalk.blue("First launch or corrupted config file, redirected to configure page."))
      res.json({
          status: 'firstLaunch'
      })
  } else {
      axios.get(`http://${config.hueIp}/api/${config.usernameHue}/groups`)
          .then(response => {
              console.log(chalk.greenBright("Successfully requested hue. (get groups of lights"));
              res.json({
                  status: "ok",
                  lights: response.data,
                  user: config.user
              })
          }).catch(error => {
              console.log(chalk.red("Something went wrong.. (Check browser console for details)"));
              res.json({
                  status: "error",
                  error
              })
          })
  }
}