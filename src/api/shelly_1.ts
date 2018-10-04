"use strict";
import { ShellyCommonAccess } from "./shelly_common";
import request from "./shelly_common";
// import fetch from 'node-fetch';

/**
 * Shelly API
 * @version 0.2.0
 * @copyright Henner Harnisch 2018
 *
 * Typescript interface for assync calls to the Shelly API
 *
 * This file covers all specific API calls for the
 * device of the "Shelly 1"
 *
 * For details see:
 * @see http://shelly-api-docs.shelly.cloud/#shelly1
 */

// const DEBUG_MODE = true;

/**
 * return interface: "/settings/relay/(index)"
 * @see http://shelly-api-docs.shelly.cloud/#shelly1-settings-relay-index
 */
export interface ISettingsRelayIndex {
    name?: string;
    ison: boolean;
    has_timer: boolean;
    default_state: "off" | "on" | "last" | "switch" ;  // string;  // maybe array "off" / "on"
    btn_type: "momentary" | "toggle" | "edge";  // string;  // maybe array
    auto_on: number;
    auto_off: number;
    schedule: boolean;
    // schedule_rules: [];
    sun: boolean;
    sun_on_times: string;
    sun_off_times: string;
}

/**
 * return interface: "/status"
 * @see http://shelly-api-docs.shelly.cloud/#shelly1-status
 */
export interface IStatus {
    relays: [IRelayIndex];  // see below
}

/**
 * return interface: "/relay/(index)"
 * @see http://shelly-api-docs.shelly.cloud/#shelly1-relay-index
 */
export interface IRelayIndex {
    ison: boolean;
    has_timer: boolean;
}

class Shelly1Access extends ShellyCommonAccess {

    public async getSettingsRelay(index: number): Promise<ISettingsRelayIndex> {
        const URL = this.getUrl() + "/settings/relay/" + index;
        this.debug("getSettingsRelay(" + index + ") with url: " +  URL);
        return request(URL) as Promise<ISettingsRelayIndex>;
    }

    /*
    public async getStatus(): Promise<IStatus> {
        const URL = this.getUrl() + "/status";
        this.debug("getStatus() with url: " +  URL);
        return request(URL) as Promise<IStatus>;
    }
    */

    public async getStatusRelay(index: number): Promise<IRelayIndex> {
        const URL = this.getUrl() + "/relay/" + index;
        this.debug("getStatusRelay(" + index + ") with url: " +  URL);
        return request(URL) as Promise<IRelayIndex>;
    }
}

export const shelly1Access = new Shelly1Access("http://shelly-device");
