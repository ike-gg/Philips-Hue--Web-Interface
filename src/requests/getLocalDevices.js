import chalk from 'chalk';
import localDevices from 'local-devices';

export default function(req, res) {
  console.log(chalk.red("Finding hue in your local area network..."));
  localDevices().then(devices => {
      console.log(devices);
      let indexOfHue = devices.findIndex(e => e.name.includes("philips") || e.name.includes("hue"));
      if (indexOfHue != -1) {
          console.log(chalk.redBright(`Hue found! (${devices[indexOfHue].ip})`));
          res.json(devices[indexOfHue]);
      } else {
          console.log(chalk.redBright(`Hue not found.`));
          res.json({status: "notFound"});
      }
  });
}