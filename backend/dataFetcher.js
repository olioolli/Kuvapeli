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
exports.getSentences = exports.getNextWord = exports.retrievePuzzles = void 0;
var puppeteer_1 = __importDefault(require("puppeteer"));
var fs_1 = __importDefault(require("fs"));
var browser;
var browserPage;
var words;
var isFirstSearch = true;
var loadDictionary = function () {
    try {
        var data = fs_1.default.readFileSync('words.txt', 'utf8');
        words = JSON.parse(data);
    }
    catch (err) {
        console.error(err);
    }
};
var getRandomWord = function () {
    var idx = Math.floor(Math.random() * words.length);
    return words[idx];
};
var initBrowser = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (browser)
                    return [2 /*return*/];
                return [4 /*yield*/, puppeteer_1.default.launch({
                        args: ["--no-sandbox", "--disable-setuid-sandbox"],
                        'ignoreHTTPSErrors': true, 'headless': false, env: { LANGUAGE: "fi_fi" }
                    })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                browserPage = _a.sent();
                return [4 /*yield*/, browserPage.goto("https://www.google.com/", {
                        waitUntil: 'networkidle2',
                    })];
            case 3:
                _a.sent();
                //browserPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
                return [4 /*yield*/, browserPage.$$eval('button', function (buttons) {
                        var button = buttons[3];
                        if (button)
                            button.click();
                    })];
            case 4:
                //browserPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var retrievePuzzles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var puzzles, i, word, images;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loadDictionary();
                puzzles = [];
                return [4 /*yield*/, initBrowser()];
            case 1:
                _a.sent();
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < 3)) return [3 /*break*/, 5];
                word = getRandomWord();
                return [4 /*yield*/, retrieveImages(word)];
            case 3:
                images = _a.sent();
                if (images.length !== 4)
                    puzzles.push({ word: word, imageUrls: images });
                else
                    i--;
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, puzzles];
        }
    });
}); };
exports.retrievePuzzles = retrievePuzzles;
var retrieveImages = function (word) { return __awaiter(void 0, void 0, void 0, function () {
    var start, totalWaittime, imageUrls;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, browserPage.evaluate(function (word) {
                    var isFirstSearch = !location.href.startsWith("https://www.google.com/search");
                    var inputs = document.getElementsByTagName("input");
                    inputs[0].value = word;
                    //console.log("Location : " + location.href);
                    if (isFirstSearch) {
                        //console.log("Already searched");
                        inputs[3].click();
                    }
                    else {
                        //console.log("First search");
                        document.getElementsByTagName("button")[0].click();
                    }
                }, word)];
            case 1:
                _a.sent();
                start = new Date().getTime();
                //console.log("waiting..");
                return [4 /*yield*/, browserPage.waitForTimeout(2000)];
            case 2:
                //console.log("waiting..");
                _a.sent();
                if (!isFirstSearch) return [3 /*break*/, 5];
                //console.log("First search, moving to image search...");
                return [4 /*yield*/, browserPage.evaluate(function () {
                        try {
                            var a7 = document.getElementsByTagName("a")[7];
                            if (!a7.href.startsWith("https://maps"))
                                a7.click();
                            else
                                document.getElementsByTagName("a")[8].click();
                        }
                        catch (e) {
                            console.log("Failed to move to image search: " + e);
                        }
                    })];
            case 3:
                //console.log("First search, moving to image search...");
                _a.sent();
                //console.log("waiting..");
                return [4 /*yield*/, browserPage.waitForTimeout(1600)];
            case 4:
                //console.log("waiting..");
                _a.sent();
                _a.label = 5;
            case 5:
                isFirstSearch = false;
                totalWaittime = new Date().getTime() - start;
                //console.log("Waited for " + totalWaittime + "ms");
                console.log("searching for images..");
                return [4 /*yield*/, browserPage.evaluate(function () {
                        var _a, _b;
                        var imgSrcs = [];
                        var imgs = (_b = (_a = document.getElementsByTagName("h2")[0]) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getElementsByTagName("img");
                        if (!imgs)
                            return [];
                        for (var i = 0; i < imgs.length && i < 4; i++) {
                            imgSrcs.push(imgs[i].src);
                        }
                        return imgSrcs;
                    })];
            case 6:
                imageUrls = _a.sent();
                console.log("Found ".concat(imageUrls.length, " images for word ").concat(word));
                return [2 /*return*/, imageUrls];
        }
    });
}); };
var sentenceIdx = 0;
var getNextWord = function () {
    return "Talo";
};
exports.getNextWord = getNextWord;
var getSentences = function () {
    return ["Talo"];
};
exports.getSentences = getSentences;
