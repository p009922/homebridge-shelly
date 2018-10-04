"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
let Accessory;
let Service;
let Characteristic;
let uuid;
class ShellySwitch {
    constructor(log, config) {
        this.loginparams = "";
        log(uuid + Accessory);
        this.log = log;
        this.config = config;
        if (!this.config.servicetype) {
            this.log("You can specify a specific type of service (changes the icon in HomeKit)");
            this.config.servicetype = "Outlet";
        }
        if (!this.config.name) {
            this.log("ERROR: you shoud specify a valid 'name' in the config.json!");
            this.config.name = "ERROR: no name specified in config.json";
        }
        if (!this.config.url) {
            this.log("ERROR: you shoud specify a valid 'url' in the config.json!");
            this.config.url = "http://device-shelly/";
        }
        if (!this.config.channel) {
            this.config.channel = 0;
            if (this.config.channel > 1) {
                this.log("WARNING: channel number seems to high");
            }
        }
        if (this.config.password) {
            this.loginparams = "&user=admin&password=" + this.config.password;
        }
        if (this.config.debug) {
            this.log("config parameter read: " + JSON.stringify(config));
        }
        if (!this.config.url.startsWith("http")) {
            this.log("url enhanced by http:// ... ");
            this.config.url = "http://" + this.config.url;
        }
        this.name = this.config.name;
        this.displayName = this.name;
        if (this.config.debug) {
            this.log("displayName = " + this.displayName);
        }
        this.initServiceInformation();
        this.serviceSwitch = this.getService(this.config.servicetype);
        this.serviceSwitch
            .getCharacteristic(Characteristic.On)
            .on('get', this.getSwitchState.bind(this))
            .on('set', this.setSwitchState.bind(this));
        this.log(this.name + " initialized !");
    }
    static init(exportTypes) {
        Accessory = exportTypes.Accessory;
        Service = exportTypes.Service;
        Characteristic = exportTypes.Characteristic;
        uuid = exportTypes.uuid;
    }
    initServiceInformation() {
        if (this.serviceInformation) {
            return;
        }
        const newServiceInformation = new Service.AccessoryInformation();
        newServiceInformation
            .setCharacteristic(Characteristic.Name, this.name)
            .setCharacteristic(Characteristic.Manufacturer, "p009922")
            .setCharacteristic(Characteristic.Model, this.config.url)
            .setCharacteristic(Characteristic.SerialNumber, uuid.generate(this.config.name))
            .setCharacteristic(Characteristic.FirmwareRevision, "1.0")
            .setCharacteristic(Characteristic.HardwareRevision, "1");
        this.serviceInformation = newServiceInformation;
    }
    getServices() {
        if (this.config.debug) {
            this.log(this.name + ": getServices() ...");
        }
        return [this.serviceInformation, this.serviceSwitch];
    }
    getSwitchState(callback) {
        const that = this;
        request(this.config.url + "/relay/" + this.config.channel + this.loginparams, (error, response, body) => {
            if (error) {
                return callback(error);
            }
            const parsedbody = JSON.parse(body);
            if (this.config.debug) {
                that.log("response: " + response);
                that.log("parsedbody: " + JSON.stringify(parsedbody));
            }
            const data = parsedbody.ison;
            callback(undefined, data === "on");
        });
    }
    setSwitchState(powerOn, callback) {
        let newstate = "off";
        if (powerOn) {
            newstate = "on";
        }
        const that = this;
        request(this.config.url + "/relay/" + this.config.channel + "?turn=" + newstate + this.loginparams, (error, response, body) => {
            if (error) {
                return callback(error);
            }
            const parsedbody = JSON.parse(body);
            if (this.config.debug) {
                that.log("response: " + response);
                that.log("parsedbody: " + JSON.stringify(parsedbody));
            }
            callback();
        });
    }
    identify(callback) {
        if (this.config.debug) {
            this.log("identify requested!");
        }
        callback();
    }
    getService(service) {
        let newService;
        switch (service) {
            case "AirQualitySensor":
                newService = new Service.AirQualitySensor(this.name);
                break;
            case "BatteryService":
                newService = new Service.BatteryService(this.name);
                break;
            case "BridgeConfiguration":
                newService = new Service.BridgeConfiguration(this.name);
                break;
            case "BridgingState":
                newService = new Service.BridgingState(this.name);
                break;
            case "CameraControl":
                newService = new Service.CameraControl(this.name);
                break;
            case "CameraRTPStreamManagement":
                newService = new Service.CameraRTPStreamManagement(this.name);
                break;
            case "CarbonDioxideSensor":
                newService = new Service.CarbonDioxideSensor(this.name);
                break;
            case "CarbonMonoxideSensor":
                newService = new Service.CarbonMonoxideSensor(this.name);
                break;
            case "ContactSensor":
                newService = new Service.ContactSensor(this.name);
                break;
            case "Door":
                newService = new Service.Door(this.name);
                break;
            case "Doorbell":
                newService = new Service.Doorbell(this.name);
                break;
            case "Fan":
                newService = new Service.Fan(this.name);
                break;
            case "Fan2":
                newService = new Service.Fan2(this.name);
                break;
            case "GarageDoorOpener":
                newService = new Service.GarageDoorOpener(this.name);
                break;
            case "HumiditySensor":
                newService = new Service.HumiditySensor(this.name);
                break;
            case "LeakSensor":
                newService = new Service.LeakSensor(this.name);
                break;
            case "LightSensor":
                newService = new Service.LightSensor(this.name);
                break;
            case "Lightbulb":
                newService = new Service.Lightbulb(this.name);
                break;
            case "LockManagement":
                newService = new Service.LockManagement(this.name);
                break;
            case "LockMechanism":
                newService = new Service.LockMechanism(this.name);
                break;
            case "Microphone":
                newService = new Service.LockMechanism(this.name);
                break;
            case "MotionSensor":
                newService = new Service.MotionSensor(this.name);
                break;
            case "OccupancySensor":
                newService = new Service.OccupancySensor(this.name);
                break;
            case "Outlet":
                newService = new Service.Outlet(this.name);
                break;
            case "Pairing":
                newService = new Service.Pairing(this.name);
                break;
            case "ProtocolInformation":
                newService = new Service.ProtocolInformation(this.name);
                break;
            case "Relay":
                newService = new Service.Relay(this.name);
                break;
            case "SecuritySystem":
                newService = new Service.SecuritySystem(this.name);
                break;
            case "SmokeSensor":
                newService = new Service.SmokeSensor(this.name);
                break;
            case "Speaker":
                newService = new Service.Speaker(this.name);
                break;
            case "StatefulProgrammableSwitch":
                newService = new Service.StatefulProgrammableSwitch(this.name);
                break;
            case "StatelessProgrammableSwitch":
                newService = new Service.StatelessProgrammableSwitch(this.name);
                break;
            case "Switch":
                newService = new Service.Switch(this.name);
                break;
            case "TemperatureSensor":
                newService = new Service.TemperatureSensor(this.name);
                break;
            case "Thermostat":
                newService = new Service.Thermostat(this.name);
                break;
            case "TimeInformation":
                newService = new Service.TimeInformation(this.name);
                break;
            case "TunneledBTLEAccessoryService":
                newService = new Service.TunneledBTLEAccessoryService(this.name);
                break;
            case "Window":
                newService = new Service.Window(this.name);
                break;
            case "WindowCovering":
                newService = new Service.WindowCovering(this.name);
                break;
            default: newService = undefined;
        }
        return newService;
    }
}
exports.default = ShellySwitch;
//# sourceMappingURL=ShellySwitch.js.map