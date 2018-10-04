"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const DEBUG_MODE = true;
class ShellyCommonAccess {
    constructor(url) {
        this.init(url);
    }
    init(url) {
        this.url = url || "http://shelly-device";
        this.debug("init with url: " + url);
    }
    getShelly() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + "/shelly";
            this.debug("getShelly() with url: " + URL);
            return request(URL);
        });
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + "/settings";
            this.debug("getSettings() with url: " + URL);
            return request(URL);
        });
    }
    getSettingsAp() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + "/settings/ap";
            this.debug("getSettingsAp() with url: " + URL);
            return request(URL);
        });
    }
    getSettingsSta() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + "/settings/sta";
            this.debug("getSettingsSta() with url: " + URL);
            return request(URL);
        });
    }
    getSettingsLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + "/settings/login";
            this.debug("getSettingsLogin() with url: " + URL);
            return request(URL);
        });
    }
    getSettingsCloud() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + "/settings/cloud";
            this.debug("getSettingsCloud() with url: " + URL);
            return request(URL);
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + "/status";
            this.debug("getStatus() with url: " + URL);
            return request(URL);
        });
    }
    reboot() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + "/reboot";
            this.debug("getReboot() with url: " + URL);
            return request(URL);
        });
    }
    debug(msg) {
        if (DEBUG_MODE) {
            console.log("ShellyCommonAccess: " + msg);
        }
    }
    getUrl() {
        return this.url;
    }
}
exports.ShellyCommonAccess = ShellyCommonAccess;
function request(url) {
    return __awaiter(this, void 0, void 0, function* () {
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
        if (DEBUG_MODE) {
            console.info("HEADERS:", HEADERS);
        }
        const response = yield node_fetch_1.default(url, HTTP_REQUEST);
        const result = yield response.json();
        if (!response.ok) {
            console.info("response with error:", result);
            throw new Error(result.title);
        }
        if (DEBUG_MODE) {
            console.info("Result = ", result);
        }
        return JSON.parse(JSON.stringify(result));
    });
}
exports.default = request;
//# sourceMappingURL=shelly_common.js.map