"use strict";
import 'hap-nodejs';

import ShellySwitch from "./ShellySwitch";

interface IHomebridge {
  registerPlatform: (pluginname: string, platformname: string, platformobject: {})  => void;
  registerAccessory: (pluginname: string, accessoryname: string, accessoryobject: {})  => void;
  hap: {
    Accessory: HAPNodeJS.Accessory;
    Service: HAPNodeJS.Service;
    Characteristic: HAPNodeJS.Characteristic;
    uuid: HAPNodeJS.uuid;
  };
}

module.exports = (homebridge: IHomebridge) => {
  const exportTypes = {
    Accessory: homebridge.hap.Accessory,
    Service: homebridge.hap.Service,
    Characteristic: homebridge.hap.Characteristic,
    uuid: homebridge.hap.uuid
  };

  ShellySwitch.init(exportTypes);

  console.info("SHELLY-plugin registering accessory...");

  homebridge.registerAccessory(
        "shelly",
        "shelly",
        ShellySwitch
  );
  console.info("SHELLY-plugin registered !");
};
