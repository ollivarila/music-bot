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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var commands = [
    {
        name: 'join',
        description: 'Join a voice channel',
    },
    {
        name: 'leave',
        description: 'Leave a voice channel',
    },
    {
        name: 'play',
        description: 'Play a song, adds song to queue if already playing',
        options: [
            {
                name: 'song',
                description: 'The song to play',
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    {
        name: 'pause',
        description: 'Pause the current song',
    },
    {
        name: 'unpause',
        description: 'Resume the current song',
    },
    {
        name: 'skip',
        description: 'Skip the current song',
    },
    {
        name: 'stop',
        description: 'Stop the current song',
    },
    {
        name: 'queue',
        description: 'Show the current queue',
    },
    {
        name: 'clear',
        description: 'Clear the current queue',
    },
    {
        name: 'enqueue',
        description: 'Add a song to the queue',
        options: [
            {
                name: 'song',
                description: 'The song to add',
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
];
var rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.TOKEN);
function update() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Started refreshing application (/) commands.');
                    return [4 /*yield*/, rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })];
                case 1:
                    _a.sent();
                    console.log('Successfully reloaded application (/) commands.');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
update();
