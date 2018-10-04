"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("hap-nodejs");
const ShellySwitch_1 = require("./ShellySwitch");
module.exports = (homebridge) => {
    const exportTypes = {
        Accessory: homebridge.hap.Accessory,
        Service: homebridge.hap.Service,
        Characteristic: homebridge.hap.Characteristic,
        uuid: homebridge.hap.uuid
    };
    ShellySwitch_1.default.init(exportTypes);
    console.info("SHELLY-plugin registering accessory...");
    homebridge.registerAccessory("shelly", "shelly", ShellySwitch_1.default);
    console.info("SHELLY-plugin registered !");
};
//# sourceMappingURL=index.js.map