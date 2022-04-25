import fs from 'fs';
import axios from 'axios';

export default function(req, res) {
  let config = JSON.parse(fs.readFileSync('bin/config.json'));
  if ("light" in req.query) {
      axios.put(`http://${config.hueIp}/api/${config.usernameHue}/lights/${req.query.light}/state`, {
          on: true,
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