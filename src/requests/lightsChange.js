import fs from 'fs';
import axios from 'axios';

export default function(req, res) {
  let config = JSON.parse(fs.readFileSync('bin/config.json'));
  let stateOfLight;
  console.log(req.body)
  if (req.body.bri == 0) {
      stateOfLight = false;
  } else {
      stateOfLight = true;
  }
  if (req.body.type == "group") {
      axios.put(`http://${config.hueIp}/api/${config.usernameHue}/groups/${req.body.id}/action`, {
          on: stateOfLight,
          bri: req.body.bri,
          hue: req.body.hue,
          sat: req.body.sat
      }).then(() => {
          res.json({
              status: "ok"
          })
      }).catch( error => {
          res.json({
              status: 'error',
              error
          })
      })
  } else if (req.body.type == "light") {
      axios.put(`http://${config.hueIp}/api/${config.usernameHue}/lights/${req.body.id}/state`, {
          on: stateOfLight,
          bri: req.body.bri,
          hue: req.body.hue,
          sat: req.body.sat
      }).then(() => {
          res.json({
              status: "ok"
          })
      }).catch( error => {
          res.json({
              status: 'error',
              error
          })
      })
  }
}