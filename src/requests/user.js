import fs from 'fs';

export default function(req, res) {
  let config = JSON.parse(fs.readFileSync('bin/config.json'));
  config.user = req.body.user;
  fs.writeFileSync('bin/config.json', JSON.stringify(config));
  res.json({
      status: "userAdded"
  })
}