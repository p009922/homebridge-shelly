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
const shelly_common_1 = require("./shelly_common");
const shelly_common_2 = require("./shelly_common");
class Shelly1Access extends shelly_common_1.ShellyCommonAccess {
    getSettingsRelay(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.getUrl() + "/settings/relay/" + index;
            this.debug("getSettingsRelay(" + index + ") with url: " + URL);
            return shelly_common_2.default(URL);
        });
    }
    getStatusRelay(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = this.getUrl() + "/relay/" + index;
            this.debug("getStatusRelay(" + index + ") with url: " + URL);
            return shelly_common_2.default(URL);
        });
    }
}
exports.shelly1Access = new Shelly1Access("http://shelly-device");
//# sourceMappingURL=shelly_1.js.map