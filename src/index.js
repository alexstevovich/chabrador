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
 * file_name: src/index.js
 * purpose: Core functionality and exports combined.
 *
 * @system
 *
 * generated_on: 2025-03-12T22:41:53.666Z
 * certified_version: 1.0.0
 * file_uuid: 31b39b2d-eba2-4494-9c17-fb02b9eba957
 * file_size: 6287 bytes
 * file_hash: ff156d88bb566bfd9f970fc025facbfde99af2c9ae0f193ec632214a514386b2
 * mast_hash: a603c6ece7943d0e6a421c117903c8876bfc2b1667e8ccc9595c18b74c0c6a2c
 * generated_by: preamble on npm!
 *
 * [Preamble Metadata]
 ********************************************************/
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const pluginHexColor = 'c999ff';

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
 ${chalk.white.bold('-chabrador-')}   ' ;:       |    '--\__,' 
                   ''      ,' 
                        ,-' 
    `;
    art.split('\n').forEach((line) => {
        logger.info(chalk.hex(pluginHexColor).bold(line));
    });
}

class KeyValType {
    static SUCCESS = 'SUCCESS';
    static WARN = 'WARN';
    static ERROR = 'ERROR';
    static PENDING = 'PENDING';
}

function logKeyVal(key, value, type) {
    const outputKey =
        chalk.hex(pluginHexColor).bold(`CHABRADOR`) +
        chalk.hex('#FFFFFF').bold(`.${key}:`);
    let color = chalk.hex('FFFFFF');
    if (type == KeyValType.SUCCESS) {
        color = chalk.hex('00FF00').bold(value);
    } else if (type == KeyValType.WARN) {
        color = chalk.hex('ffd642').bold(value);
    } else if (type == KeyValType.ERROR) {
        color = chalk.hex('FF0000').bold(value);
    } else if (type == KeyValType.PENDING) {
        color = chalk.bgHex('#2c79e6').bold(` ${value} `);
    }
    const outputValue = color;

    return `${outputKey} ${outputValue}`;
}

export class Chabrador {
    constructor({
        filePath = 'chabrador-memory.json',
        backupInterval = 600000, // 10 minutes
        maxEntries = 250000, // Auto-delete if exceeded
        logger = console, // Allow external logger, default to console
        fanfare = false,
    } = {}) {
        this._filePath = path.resolve(filePath);
        this._memory = { overflows: [], entries: {} }; // Always fresh
        this._backupInterval = backupInterval;
        this._maxEntries = maxEntries;
        this._loaded = false;
        this.logger = logger;

        if (fanfare) {
            doFanfare(logger);
        }
        this.logger.info(logKeyVal('status', 'Online', KeyValType.SUCCESS));
        this._startAutoSave();
    }

    async load() {
        this.logger.info(logKeyVal('load-memory', 'Start', KeyValType.PENDING));

        try {
            const content = await fs.readFile(this._filePath, 'utf-8');
            const data = JSON.parse(content);
            this._memory = {
                overflows: Array.isArray(data.overflows) ? data.overflows : [],
                entries: typeof data.entries === 'object' ? data.entries : {},
            };
            this._loaded = true;
            this.logger.info(
                logKeyVal('load-memory', 'Success', KeyValType.SUCCESS),
            );
        } catch {
            this.logger.warn(logKeyVal('load-memory', 'New', KeyValType.WARN));

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
            this._memory.entries = {}; // Purge entries
            this.logger.warn(
                logKeyVal('overflow-memory', '⚠️ Success', KeyValType.SUCCESS),
            );
        }
    }

    async save() {
        try {
            await fs.writeFile(
                this._filePath,
                JSON.stringify(this._memory, null, 2),
            );
            this.logger.info(
                logKeyVal('memory.task.save', 'complete', KeyValType.SUCCESS),
            );
        } catch (error) {
            this.logger.error('❌ Error saving Chabrador database:', error);
            this.logger.error(
                logKeyVal('memory.task.save', 'error', KeyValType.ERROR),
            );
        }
    }

    reset() {
        this._memory = { overflows: [], entries: {} };
        this.logger.info(
            logKeyVal('reset-memory', 'Memory Cleared', KeyValType.SUCCESS),
        );
    }

    _startAutoSave() {
        setInterval(() => {
            this.save();
        }, this._backupInterval);
    }
}

export async function adopt(options) {
    const chabrador = new Chabrador(options);
    await chabrador.load();

    return chabrador;
}

export default { adopt, Chabrador };
