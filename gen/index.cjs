/* *******************************************************
 * chabrador
 * 
 * @license
 * 
 * Apache-2.0
 * 
 * Copyright 2019-2025 Alex Stevovich
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * @meta
 *
 * package_name: chabrador
 * file_name: gen/index.cjs
 * purpose: Core functionality and exports combined.
 *  
 * @system
 *
 * generated_on: 2025-03-12T23:20:59.603Z
 * certified_version: 1.0.1
 * file_uuid: 31b39b2d-eba2-4494-9c17-fb02b9eba957
 * file_size: 7889 bytes
 * file_hash: 470d7c0eae307677a05b661809e2e7fb38ea6a3ed9127f11f5e89bd85517f20e
 * mast_hash: b44bf2dc4737ceab8e2a370bd0e60044c17a3f255bc3fd7c2081b141bfb8b767
 * generated_by: preamble on npm!
 *
 * [Preamble Metadata]
********************************************************/ 
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  Chabrador: () => Chabrador,
  adopt: () => adopt,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_promises = __toESM(require("fs/promises"), 1);
var import_path = __toESM(require("path"), 1);
var import_chalk = __toESM(require("chalk"), 1);

const pluginHexColor = "c999ff";
function doFanfare(logger) {
  const art = String.raw`
                             ;\ 
                            |' \ 
         _                  ; : ; 
        / '-.              /: : | 
       |  ,-.'-.          ,': : | 
       \  :  '. '.       ,'-. : | 
        \ ;    ;  '-.__,'    '-.| 
         \ ;   ;  :::  ,::'':.  '. 
          \ '-. :  '    :.    '.  \ 
           \   \    ,   ;   ,:    (\ 
            \   :., :.    ,'o)): ' '-. 
           ,/,' ;' ,::"''.'---'   '.  '-._ 
         ,/  :  ; '"      ';'          ,--'. 
        ;/   :; ;             ,:'     (   ,:) 
          ,.,:.    ; ,:.,  ,-._ '.     \""'/ 
          '::'     ':''  ,'(  \'._____.-'"' 
             ;,   ;  '.  '. '._'-.  \\ 
             ;:.  ;:       '-._'-.\  \'. 
              '':. :        |' '. '\  ) \ 
 ${import_chalk.default.white.bold("-chabrador-")}   ' ;:       |    '--\__,' 
                   ''      ,' 
                        ,-' 
    `;
  art.split("\n").forEach((line) => {
    logger.info(import_chalk.default.hex(pluginHexColor).bold(line));
  });
}
class KeyValType {
  static SUCCESS = "SUCCESS";
  static WARN = "WARN";
  static ERROR = "ERROR";
  static PENDING = "PENDING";
}
function logKeyVal(key, value, type) {
  const outputKey = import_chalk.default.hex(pluginHexColor).bold(`CHABRADOR`) + import_chalk.default.hex("#FFFFFF").bold(`.${key}:`);
  let color = import_chalk.default.hex("FFFFFF");
  if (type == KeyValType.SUCCESS) {
    color = import_chalk.default.hex("00FF00").bold(value);
  } else if (type == KeyValType.WARN) {
    color = import_chalk.default.hex("ffd642").bold(value);
  } else if (type == KeyValType.ERROR) {
    color = import_chalk.default.hex("FF0000").bold(value);
  } else if (type == KeyValType.PENDING) {
    color = import_chalk.default.bgHex("#2c79e6").bold(` ${value} `);
  }
  const outputValue = color;
  return `${outputKey} ${outputValue}`;
}
class Chabrador {
  constructor({
    filePath = "chabrador-memory.json",
    backupInterval = 6e5,
    // 10 minutes
    maxEntries = 25e4,
    // Auto-delete if exceeded
    logger = console,
    // Allow external logger, default to console
    fanfare = false
  } = {}) {
    this._filePath = import_path.default.resolve(filePath);
    this._memory = { overflows: [], entries: {} };
    this._backupInterval = backupInterval;
    this._maxEntries = maxEntries;
    this._loaded = false;
    this.logger = logger;
    if (fanfare) {
      doFanfare(logger);
    }
    this.logger.info(logKeyVal("status", "Online", KeyValType.SUCCESS));
    this._startAutoSave();
  }
  async load() {
    this.logger.info(logKeyVal("load-memory", "Start", KeyValType.PENDING));
    try {
      const content = await import_promises.default.readFile(this._filePath, "utf-8");
      const data = JSON.parse(content);
      this._memory = {
        overflows: Array.isArray(data.overflows) ? data.overflows : [],
        entries: typeof data.entries === "object" ? data.entries : {}
      };
      this._loaded = true;
      this.logger.info(
        logKeyVal("load-memory", "Success", KeyValType.SUCCESS)
      );
    } catch {
      this.logger.warn(logKeyVal("load-memory", "New", KeyValType.WARN));
      this._memory = { overflows: [], entries: {} };
    }
  }
  boop(id) {
    const now = Date.now();
    if (!this._memory.entries[id]) {
      this._memory.entries[id] = { c: 1, t: now };
    } else {
      this._memory.entries[id].c += 1;
      this._memory.entries[id].t = now;
    }
    this._handleOverflow();
  }
  _handleOverflow() {
    const entryCount = Object.keys(this._memory.entries).length;
    if (entryCount > this._maxEntries) {
      this._memory.overflows.push({ t: Date.now(), c: entryCount });
      this._memory.entries = {};
      this.logger.warn(
        logKeyVal("overflow-memory", "\u26A0\uFE0F Success", KeyValType.SUCCESS)
      );
    }
  }
  async save() {
    try {
      await import_promises.default.writeFile(
        this._filePath,
        JSON.stringify(this._memory, null, 2)
      );
      this.logger.info(
        logKeyVal("memory.task.save", "complete", KeyValType.SUCCESS)
      );
    } catch (error) {
      this.logger.error("\u274C Error saving Chabrador database:", error);
      this.logger.error(
        logKeyVal("memory.task.save", "error", KeyValType.ERROR)
      );
    }
  }
  reset() {
    this._memory = { overflows: [], entries: {} };
    this.logger.info(
      logKeyVal("reset-memory", "Memory Cleared", KeyValType.SUCCESS)
    );
  }
  _startAutoSave() {
    setInterval(() => {
      this.save();
    }, this._backupInterval);
  }
}
async function adopt(options) {
  const chabrador = new Chabrador(options);
  await chabrador.load();
  return chabrador;
}
var index_default = { adopt, Chabrador };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Chabrador,
  adopt
});
