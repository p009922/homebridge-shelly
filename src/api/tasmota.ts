"use strict";
import fetch from 'node-fetch';

// https://github.com/arendst/Sonoff-Tasmota/wiki/Commands

const DEBUG_MODE = true;

export interface IState {  // cmnd=state
    Time: Date;
    Uptime: Date;
    Vcc: number;
    POWER: string;
    Wifi: {
        AP: number;
        SSId: string;
        RSSI: number;
        APMac: string;
    };
}

export interface IStatus {  // cmnd=status
    Status: {
        Module: number;
        FriendlyName: [string];
        Topic: string;
        ButtonTopic: string;
        Power: number;
        PowerOnState: number;
        LedState: number;
        SaveData: number;
        SaveState: number;
        ButtonRetain: number;
        PowerRetain: number;
    };
}

export interface IStatusPRM { // cmnd=status 1
    StatusPRM: {
        Baudrate: number;
        GroupTopic: string;
        OtaUrl: string;
        RestartReason: string;
        Uptime: Date;
        StartupUTC: Date;
        Sleep: number;
        BootCount: number;
        SaveCount: number;
        SaveAddress: string;
    };
}

export interface IStatusFWR { // cmnd=status 2
    StatusFWR: {
        Version: string;
        BuildDateTime: Date;
        Boot: number;
        Core: string;
        SDK: string;
    };
}

export interface IPower { // {"POWER":"ON"}
    POWER: string;
}

export interface IPowerOnState { // { PowerOnState: 0 }
    PowerOnState: number;
}

export interface IVoltRes { // { VoltRes: 0 }
    VoltRes: number;
}

export interface IPulseTime { // { PulseTime1: '10 (Active 0)' }
    PulseTime1: string;
}

class TasmotaAccess {

    private url: string;
    private urlCommand = "/cm?cmnd=";

    /**
     * initialize the access to the Tasmota actor
     * @param url http-address of the tasmota actor
     */
    constructor(url: string) {
        this.init(url);
    }

    public init(url: string) {
        this.url = url || "http://sonoff-device";
        this.debug("init with url: " +  url);
    }

    public async getState(): Promise<IState> {
        const URL = this.url + this.urlCommand + "state";
        this.debug("getState with url: " +  URL);
        return request(URL) as Promise<IState>;
    }

    public async getStatus(): Promise<IStatus> {
        const URL = this.url + this.urlCommand +  "status";
        this.debug("getStatus with url: " +  URL);
        return request(URL) as Promise<IStatus>;
    }

    public async getStatusPRM(): Promise<IStatusPRM> {
        const URL = this.url + this.urlCommand + "status%20" + "1";
        this.debug("getStatusPRM with url: " +  URL);
        return request(URL) as Promise<IStatusPRM>;
    }

    public async getStatusFWR(): Promise<IStatusFWR> {
        const URL = this.url + this.urlCommand + "status%20" + "2";
        this.debug("getStatusFWR with url: " +  URL);
        return request(URL) as Promise<IStatusFWR>;
    }

    public async getStatusFWR9(): Promise<IStatusFWR> {
        const URL = this.url + this.urlCommand + "status%20" + "9";
        this.debug("getStatusFWR9 with url: " +  URL);
        return request(URL) as Promise<IStatusFWR>;
    }

    public async getHostname(): Promise<IStatusFWR> {
        const URL = this.url + this.urlCommand + "hostname" + "";
        this.debug("getHostname with url: " +  URL);
        return request(URL) as Promise<IStatusFWR>;
    }

    public async getPower(): Promise<IPower> {
        const URL = this.url + this.urlCommand + "power";
        this.debug("getPower with url: " +  URL);
        return request(URL) as Promise<IPower>;
    }

    /**
     * Show current Voltage Resolution
     */
    public async getVoltRes(): Promise<IVoltRes> {
        const URL = this.url + this.urlCommand + "VoltRes";
        this.debug("getVoltRes with url: " +  URL);
        return request(URL) as Promise<IVoltRes>;
    }

    /**
     * Show current relay power on state
     *    0 = Keep relay(s) off after power on
     *    1 = Turn relay(s) on after power on
     *    2 = Toggle relay(s) on from last saved
     *    3 = default) Turn relay(s) on as last saved
     */
    public async getPowerOnState(): Promise<IPowerOnState> {
        const URL = this.url + this.urlCommand + "PowerOnState";
        this.debug("getPowerOnState with url: " +  URL);
        return request(URL) as Promise<IPowerOnState>;
    }

    /*************************************************************************
     * Show current PulseTime of relay<x> in 0.1 seconds
     */
    public async getPulseTime(): Promise<IPulseTime> {
        console.log("request getPulseTime:");
        const URL = this.url + this.urlCommand + "PulseTime";
        this.debug("getPulseTime with url: " +  URL);
        return request(URL) as Promise<IPulseTime>;
    }

    private debug(msg: string) {
        if (DEBUG_MODE) {
            console.log("TasmotaAccess:" + msg);
        }
    }
}

async function request<T>(url: string): Promise<T> {  // TODO? any - type safety ?
    console.log("request url:", url);
    const HEADERS = {
        "Content-type": "application/json",
        "Accept": "application/json"
    };
    const HTTP_REQUEST = {
        method: "GET",
        json: true,
        headers: HEADERS
    };
    // await response of fetch call
    if (DEBUG_MODE) { console.info("HEADERS:", HEADERS); }
    const response = await fetch(url, HTTP_REQUEST);

    // only proceed once promise is resolved
    const result = await response.json();
    if (!response.ok) {
        console.info("response with error:", result);
        throw new Error(result.title);
    }
    // assign relevant a
    if (DEBUG_MODE) { console.info("Result = ", result); }
    // return JSON.parse(result);
    return JSON.parse(JSON.stringify(result));
    // return result;
}

export const tasmotaAccess = new TasmotaAccess("http://sonoff-device");
