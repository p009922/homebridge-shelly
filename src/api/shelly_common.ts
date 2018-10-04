"use strict";
import fetch from 'node-fetch';

/**
 * Shelly API
 * @version 0.2.0
 * @copyright Henner Harnisch 2018
 *
 * Typescript interface for assync calls to the Shelly API
 *
 * This file covers all general common API-issues of the
 * product family "Shelly".
 *
 * For details see:
 * @see http://shelly-api-docs.shelly.cloud/#common-http-api
 */

const DEBUG_MODE = true;

/**
 * return interface: "/shelly"
 * @see http://shelly-api-docs.shelly.cloud/#shelly
 */
export interface IShelly {
    type: string;
    mac: string;
    auth: boolean;
    fw: string;
    num_outputs: number;
}

/**
 * return interface: "/settings"
 * @see http://shelly-api-docs.shelly.cloud/#settings
 */
export interface ISettings {
    device: {
        type: string;
        mac: string;
    };
    wifi_ap: ISettingsAp; // see below
    wifi_sta: ISettingsSta; // see below
    login: ISettingsLogin; // see below
    name: string;
    fw: string;
    cloud: ISettingsCloud; // see below
    timezone: string;
    time?: Date;
}

/**
 * return interface: "/settings/ap"
 * @see http://shelly-api-docs.shelly.cloud/#settings-ap
 */
export interface ISettingsAp {
    enabled: boolean;
    ssid: string;
    key: string;
}

/**
 * return interface: "/settings/sta"
 * @see http://shelly-api-docs.shelly.cloud/#settings-sta
 */
export interface ISettingsSta {
    enabled: boolean;
    ssid: string;
    key: string;
    ipv4_method: string;
    ip?: string;
    gw?: string;
    mask?: string;
    dns?: string;
}

/**
 * return interface: "/settings/login"
 * @see http://shelly-api-docs.shelly.cloud/#settings-login
 */
export interface ISettingsLogin {
    enabled: boolean;
    unprotected: boolean;
    username: string;
    password: string;
}

/**
 * return interface: "/settings/cloud"
 * @see http://shelly-api-docs.shelly.cloud/#settings-cloud
 */
export interface ISettingsCloud {
    enabled: boolean;
    connected: true;
}

/**
 * return interface: "/status"
 * @see http://shelly-api-docs.shelly.cloud/#status
 */
export interface IStatus {
    wifi_sta: { // maybe common type...?
        connected: boolean;
        ssid: string;
        ip?: string;
    };
    cloud: ISettingsCloud;
    time: string;
    has_update: boolean;
    ram_total: number;
    ram_free: number;
    uptime: number;
}

/**
 * return interface: "/reboot"
 * @see http://shelly-api-docs.shelly.cloud/#reboot
 */
// nothing to return

// ---------------------------------------------------------------

export abstract class ShellyCommonAccess { // TODO: maybe abstract class ?

    private url: string;

    /**
     * initialize the access to the device
     * @constructs
     * @param url http-address of the device
     */
    constructor(url: string) {
        this.init(url);
    }

    public init(url: string) {
        this.url = url || "http://shelly-device";
        this.debug("init with url: " +  url);
    }

    public async getShelly(): Promise<IShelly> {
        const URL = this.url + "/shelly";
        this.debug("getShelly() with url: " +  URL);
        return request(URL) as Promise<IShelly>;
    }

    public async getSettings(): Promise<ISettings> {
        const URL = this.url + "/settings";
        this.debug("getSettings() with url: " +  URL);
        return request(URL) as Promise<ISettings>;
    }

    public async getSettingsAp(): Promise<ISettingsAp> {
        const URL = this.url + "/settings/ap";
        this.debug("getSettingsAp() with url: " +  URL);
        return request(URL) as Promise<ISettingsAp>;
    }

    public async getSettingsSta(): Promise<ISettingsSta> {
        const URL = this.url + "/settings/sta";
        this.debug("getSettingsSta() with url: " +  URL);
        return request(URL) as Promise<ISettingsSta>;
    }

    public async getSettingsLogin(): Promise<ISettingsLogin> {
        const URL = this.url + "/settings/login";
        this.debug("getSettingsLogin() with url: " +  URL);
        return request(URL) as Promise<ISettingsLogin>;
    }

    public async getSettingsCloud(): Promise<ISettingsCloud> {
        const URL = this.url + "/settings/cloud";
        this.debug("getSettingsCloud() with url: " +  URL);
        return request(URL) as Promise<ISettingsCloud>;
    }

    public async getStatus(): Promise<IStatus> {
        const URL = this.url + "/status";
        this.debug("getStatus() with url: " +  URL);
        return request(URL) as Promise<IStatus>;
    }

    public async reboot(): Promise<null> {
        const URL = this.url + "/reboot";
        this.debug("getReboot() with url: " +  URL);
        return request(URL) as Promise<null>;
    }

    protected debug(msg: string) {
        if (DEBUG_MODE) {
            console.log("ShellyCommonAccess: " + msg);
        }
    }

    protected getUrl(): string {
        return this.url;
    }
}

export default async function request<T>(url: string): Promise<T> {  // TODO? any - type safety ?
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