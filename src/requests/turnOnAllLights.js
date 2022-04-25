import fs from 'fs';
import axios from 'axios';

export default function(req, res) {
  let config = JSON.parse(fs.readFileSync('bin/config.json'));
  if ("group" in req.query) {
      axios.put(`http://${config.hueIp}/api/${config.usernameHue}/groups/${req.query.group}/action`, {
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