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
class TasmotaAccess {
    constructor(url) {
        this.urlCommand = "/cm?cmnd=";
        this.init(url);
    }
    init(url) {
        this.url = url || "http://sonoff-device";
        this.debug("init with url: " + url);
    }
    getState() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "state";
            this.debug("getState with url: " + URL);
            return request(URL);
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "status";
            this.debug("getStatus with url: " + URL);
            return request(URL);
        });
    }
    getStatusPRM() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "status%20" + "1";
            this.debug("getStatusPRM with url: " + URL);
            return request(URL);
        });
    }
    getStatusFWR() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "status%20" + "2";
            this.debug("getStatusFWR with url: " + URL);
            return request(URL);
        });
    }
    getStatusFWR9() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "status%20" + "9";
            this.debug("getStatusFWR9 with url: " + URL);
            return request(URL);
        });
    }
    getHostname() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "hostname" + "";
            this.debug("getHostname with url: " + URL);
            return request(URL);
        });
    }
    getPower() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "power";
            this.debug("getPower with url: " + URL);
            return request(URL);
        });
    }
    getVoltRes() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "VoltRes";
            this.debug("getVoltRes with url: " + URL);
            return request(URL);
        });
    }
    getPowerOnState() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.url + this.urlCommand + "PowerOnState";
            this.debug("getPowerOnState with url: " + URL);
            return request(URL);
        });
    }
    getPulseTime() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("request getPulseTime:");
            const URL = this.url + this.urlCommand + "PulseTime";
            this.debug("getPulseTime with url: " + URL);
            return request(URL);
        });
    }
    debug(msg) {
        if (DEBUG_MODE) {
            console.log("TasmotaAccess:" + msg);
        }
    }
}
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
exports.tasmotaAccess = new TasmotaAccess("http://sonoff-device");
//# sourceMappingURL=tasmota.js.map