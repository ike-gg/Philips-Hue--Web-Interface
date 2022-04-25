import chalk from 'chalk';
import axios from 'axios';
import fs from 'fs';

export default function(req, res) {
  console.log(chalk.red(`Waiting for authorise hue with ${req.body.hueIp} ip. (Press button on bridge)`));
  axios.post(`http://${req.body.hueIp}/api`,{
      devicetype: "HueWebInterfacea"
  }).then(response => { 
      if ("error" in response.data[0]) {
          res.json({
              status: "noAuth"
          })
      } else if ("success" in response.data[0]) {
          let username = response.data[0].success.username;
          if (!(fs.existsSync('bin/config.json'))) {
              console.log(chalk.blue("Config file missing in bin/config.json, generating new one."));
              fs.writeFileSync('bin/config.json', '{}');
          }
          let config = fs.readFileSync('bin/config.json');
          try {
              config = JSON.parse(config);
          } catch (e) {
              console.log(chalk.red("Fixing corrupted file."));
              fs.writeFileSync('bin/config.json', '{}');
          }
          config.hueIp = req.body.hueIp;
          config.usernameHue = username;
          fs.writeFileSync('bin/config.json', JSON.stringify(config));
          console.log(chalk.green(`User authorised! (${username})`));
          res.json({
              status: "auth"
          })
      }
  })
}