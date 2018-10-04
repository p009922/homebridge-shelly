"use strict";

// import fetch from 'node-fetch';
import * as request from 'request'; // important ist "* as ..."
// import { tasmotaAccess } from './api/tasmota';

let Accessory: any;
let Service: any;
let Characteristic: any;
let uuid: any;

type ILog = (msg: string) => void;

interface IShellyConfig {
    servicetype: string;
    name: string;
    url: string;
    channel: number;
    // username: string; // username is always = 'admin'
    password: string;
    debug: boolean; // TODO
}

export default class ShellySwitch {

    public static init(exportTypes: any) {
        Accessory = exportTypes.Accessory;
        Service = exportTypes.Service;
        Characteristic = exportTypes.Characteristic;
        uuid = exportTypes.uuid;
    }

    private readonly name: string;
    private readonly displayName: string;
    private readonly config: IShellyConfig;
    private loginparams = ""; // if empty string, then no security

    private log: ILog;

    private serviceSwitch: HAPNodeJS.Service; // can be different types, which support a "switch"
    private serviceInformation: HAPNodeJS.Service;

    constructor(log: ILog, config: IShellyConfig) {
        log(uuid + Accessory); // TODO: must be read...
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
            this.config.url = "http://device-shelly/";  // for testing ...
        }
        if (!this.config.channel) {
            this.config.channel = 0;
            if (this.config.channel > 1) {
                this.log("WARNING: channel number seems to high");
            }
        }
        if (this.config.password) { // if password defined, then security
            this.loginparams = "&user=admin&password=" + this.config.password;
        }
        if (this.config.debug) {
            this.log("config parameter read: " + JSON.stringify(config));
        }

        // enhance/correct any configs:
        if (!this.config.url.startsWith("http")) {
            this.log("url enhanced by http:// ... ");
            this.config.url = "http://" + this.config.url;
        }

        // now setting up the relevant services:
        this.name = this.config.name;  // ! important - otherwise error in homebridge environment
        this.displayName = this.name; // ! important - otherwise error in homebridge environment
        if (this.config.debug) {
            this.log("displayName = " +  this.displayName);
        }
        this.initServiceInformation();

        // this.serviceSwitch = new Service.Outlet(this.name);
        // this.serviceSwitch = this.getService("Outlet"); // default ...
        // this.serviceSwitch = this.getService("GarageDoorOpener"); // FEHLER !!
        // this.serviceSwitch = this.getService("Switch");
        // this.serviceSwitch = this.getService("Lightbulb");
        // this.serviceSwitch = this.getService("StatefulProgrammableSwitch"); // FEHLER !!
        // this.serviceSwitch = this.getService("Fan");
        // this.serviceSwitch = this.getService("Relay"); // FEHLER !!
        this.serviceSwitch = this.getService(this.config.servicetype);
        this.serviceSwitch
            .getCharacteristic(Characteristic.On)
            .on('get', this.getSwitchState.bind(this))
            .on('set', this.setSwitchState.bind(this));

        this.log(this.name + " initialized !");
    }

    public initServiceInformation() {
        if (this.serviceInformation) { // if alredy defined!
            return;
        }
        // else not defined:
        const newServiceInformation = new Service.AccessoryInformation(); // "ShellyInformation", uuid1, "information");

        // const requestResult = await tasmotaAccess.getStatusFWR();
        newServiceInformation
            .setCharacteristic(Characteristic.Name, this.name)
            .setCharacteristic(Characteristic.Manufacturer, "p009922")
            .setCharacteristic(Characteristic.Model, this.config.url) // "Shelly Switch")
            .setCharacteristic(Characteristic.SerialNumber, uuid.generate(this.config.name)) // = homebridge.hap.uuid;
            .setCharacteristic(Characteristic.FirmwareRevision, "1.0") // requestResult.StatusFWR.Version)
            .setCharacteristic(Characteristic.HardwareRevision, "1");
        this.serviceInformation = newServiceInformation;

        // now:  define potential polling async method
        /*
        if (this.POLLING_MINUTES) {
            setInterval(function() {
                this.nassignStatusFromDevice();
            }.bind(this), this.POLLING_MINUTES * 60 * 1000);
        }
        **/
    }

    public getServices() {
        if (this.config.debug) {
            this.log(this.name + ": getServices() ...");
        }
        // this.initServiceInformation();
        return [this.serviceInformation, this.serviceSwitch];
    }

    public getSwitchState(callback: (error: Error | null, state?: boolean) => void): void {
        const that = this;
        // request("http://" + that.hostname + "/cm?user=admin&password=" + that.password + "&cmnd=Power" + that.relay, function(error, response, body) {
        // http://device-shelly/relay/0  (ison=?)
        request(this.config.url + "/relay/" + this.config.channel + this.loginparams, (error, response, body) => {
            if (error) {
                return callback(error);
            }
            const parsedbody = JSON.parse(body); // {"POWER":"ON"}
            if (this.config.debug) {
                that.log("response: " + response);
                that.log("parsedbody: " + JSON.stringify(parsedbody));
            }
            const data = parsedbody.ison;
            callback(undefined, data === "on"); // data.toLowerCase() === "on");
        });
    }

    public setSwitchState(powerOn: boolean, callback: (error?: Error) => void): void {
        // http://device-shelly/relay/0?turn=off
        let newstate = "off";
        if (powerOn) {
            newstate = "on";
        }
        const that = this;
        // request("http://" + that.hostname + "/cm?user=admin&password=" + that.password + "&cmnd=Power" + that.relay + newstate, function(error, response, body) {
        request(this.config.url + "/relay/" + this.config.channel + "?turn=" + newstate + this.loginparams, (error, response, body) => {
            if (error) {
                return callback(error);
            }
            const parsedbody = JSON.parse(body); // {"POWER":"ON"}
            if (this.config.debug) {
                that.log("response: " + response);
                that.log("parsedbody: " + JSON.stringify(parsedbody));
            }
            callback();
        });
    }

    public identify(callback: (error?: Error) => void): void {
        if (this.config.debug) {
            this.log("identify requested!");
        }
        callback(); // success
    }

    private getService(service: string): HAPNodeJS.Service {
        let newService: HAPNodeJS.Service;
        switch (service) {
            // case "AccessoryInformation": newService = new Service.AccessoryInformation(this.name); break;
            case "AirQualitySensor": newService = new Service.AirQualitySensor(this.name); break;
            case "BatteryService": newService = new Service.BatteryService(this.name); break;
            case "BridgeConfiguration": newService = new Service.BridgeConfiguration(this.name); break;
            case "BridgingState": newService = new Service.BridgingState(this.name); break;
            case "CameraControl": newService = new Service.CameraControl(this.name); break;
            case "CameraRTPStreamManagement": newService = new Service.CameraRTPStreamManagement(this.name); break;
            case "CarbonDioxideSensor": newService = new Service.CarbonDioxideSensor(this.name); break;
            case "CarbonMonoxideSensor": newService = new Service.CarbonMonoxideSensor(this.name); break;
            case "ContactSensor": newService = new Service.ContactSensor(this.name); break;
            case "Door": newService = new Service.Door(this.name); break;
            case "Doorbell": newService = new Service.Doorbell(this.name); break;
            case "Fan": newService = new Service.Fan(this.name); break;
            case "Fan2": newService = new Service.Fan2(this.name); break;
            case "GarageDoorOpener": newService = new Service.GarageDoorOpener(this.name); break;
            case "HumiditySensor": newService = new Service.HumiditySensor(this.name); break;
            case "LeakSensor": newService = new Service.LeakSensor(this.name); break;
            case "LightSensor": newService = new Service.LightSensor(this.name); break;
            case "Lightbulb": newService = new Service.Lightbulb(this.name); break;
            case "LockManagement": newService = new Service.LockManagement(this.name); break;
            case "LockMechanism": newService = new Service.LockMechanism(this.name); break;
            case "Microphone": newService = new Service.LockMechanism(this.name); break;
            case "MotionSensor": newService = new Service.MotionSensor(this.name); break;
            case "OccupancySensor": newService = new Service.OccupancySensor(this.name); break;
            case "Outlet": newService = new Service.Outlet(this.name); break;
            case "Pairing": newService = new Service.Pairing(this.name); break;
            case "ProtocolInformation": newService = new Service.ProtocolInformation(this.name); break;
            case "Relay": newService = new Service.Relay(this.name); break;
            case "SecuritySystem": newService = new Service.SecuritySystem(this.name); break;
            case "SmokeSensor": newService = new Service.SmokeSensor(this.name); break;
            case "Speaker": newService = new Service.Speaker(this.name); break;
            case "StatefulProgrammableSwitch": newService = new Service.StatefulProgrammableSwitch(this.name); break;
            case "StatelessProgrammableSwitch": newService = new Service.StatelessProgrammableSwitch(this.name); break;
            case "Switch": newService = new Service.Switch(this.name); break;
            case "TemperatureSensor": newService = new Service.TemperatureSensor(this.name); break;
            case "Thermostat": newService = new Service.Thermostat(this.name); break;
            case "TimeInformation": newService = new Service.TimeInformation(this.name); break;
            case "TunneledBTLEAccessoryService": newService = new Service.TunneledBTLEAccessoryService(this.name); break;
            case "Window": newService = new Service.Window(this.name); break;
            case "WindowCovering": newService = new Service.WindowCovering(this.name); break;
            // case "FanIR": newService = new HomeKitExtensions.Service.FanIR(this.name); break;
            // case "TVIR": newService = new HomeKitExtensions.Service.TVIR(this.name); break;
            default: newService = undefined;
        }
        return newService;
    }
}