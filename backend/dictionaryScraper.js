"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDictionary = void 0;
var puppeteer_1 = __importDefault(require("puppeteer"));
var fs_1 = __importDefault(require("fs"));
var readDictionary = function () { return __awaiter(void 0, void 0, void 0, function () {
    var words, data, browser, browserPage, i, letter, page, letterWords, pageWords, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                words = [];
                try {
                    data = fs_1.default.readFileSync('words.txt', 'utf8');
                    words = JSON.parse(data);
                }
                catch (err) {
                    console.error(err);
                }
                return [4 /*yield*/, puppeteer_1.default.launch({
                        args: ["--no-sandbox", "--disable-setuid-sandbox"],
                        'ignoreHTTPSErrors': true, 'headless': true, env: { LANGUAGE: "fi_fi" }
                    })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                browserPage = _a.sent();
                return [4 /*yield*/, browserPage.goto("https://www.suomisanakirja.fi", {
                        waitUntil: 'networkidle2'
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, browserPage.evaluate(function () {
                        document.getElementsByTagName("button")[2].click();
                    })];
            case 4:
                _a.sent();
                browserPage.on('console', function (msg) { return console.log('PAGE LOG:', msg.text()); });
                i = 0;
                _a.label = 5;
            case 5:
                if (!(i < letters.length)) return [3 /*break*/, 16];
                letter = letters[i];
                page = 0;
                letterWords = [];
                console.log("Waiting..");
                return [4 /*yield*/, browserPage.waitForTimeout(2000)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!true) return [3 /*break*/, 14];
                _a.label = 8;
            case 8:
                _a.trys.push([8, 12, , 13]);
                return [4 /*yield*/, browserPage.goto(getUrl(letter, page), {
                        waitUntil: 'networkidle2',
                    })];
            case 9:
                _a.sent();
                console.log("Waiting..");
                return [4 /*yield*/, browserPage.waitForTimeout(2000)];
            case 10:
                _a.sent();
                console.log("Crawling letter '" + letter + "' through page " + page + "..");
                return [4 /*yield*/, browserPage.evaluate(function () {
                        var _a;
                        var retArr = [];
                        try {
                            var wordDivs = (_a = document.getElementById("main")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("div");
                            if (!wordDivs || wordDivs.length === 0)
                                return undefined;
                            for (var i_1 = 0; i_1 < (wordDivs === null || wordDivs === void 0 ? void 0 : wordDivs.length); i_1++) {
                                var decodedWord = wordDivs[i_1].innerText.replaceAll(/\(|\)|\d/ig, "").trim();
                                if (decodedWord !== '' && retArr.indexOf(decodedWord) === -1)
                                    retArr.push(decodedWord);
                            }
                        }
                        catch (err) {
                            console.log("Page error: " + err);
                        }
                        return retArr;
                    })];
            case 11:
                pageWords = _a.sent();
                console.log("Found ".concat(pageWords === null || pageWords === void 0 ? void 0 : pageWords.length, " words"));
                if (pageWords && pageWords.length > 0)
                    letterWords.push.apply(letterWords, pageWords);
                else
                    return [3 /*break*/, 14];
                page++;
                return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                console.log("GOTO ERROR: " + err_1);
                return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 7];
            case 14:
                words.push.apply(words, letterWords);
                _a.label = 15;
            case 15:
                i++;
                return [3 /*break*/, 5];
            case 16:
                console.log("Got words");
                words.forEach(function (word) { return console.log(word); });
                console.log("Writing to file...");
                fs_1.default.writeFileSync('words.txt', JSON.stringify(words));
                return [2 /*return*/];
        }
    });
}); };
exports.readDictionary = readDictionary;
var getUrl = function (letter, page) {
    return "https://www.suomisanakirja.fi/selaa.php?k=".concat(letter, "&p=").concat(page);
};
var letters = [
    //    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z','ä','ö'
    // -f
    'n'
];
(0, exports.readDictionary)();
