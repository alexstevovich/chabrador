import { describe, it, expect, beforeEach, vi } from 'vitest';
import { adopt, Chabrador } from '../src/index.js';
import fs from 'fs/promises';
import path from 'path';

const TEST_FILE = path.resolve('./temp/test-chabrador.json');

describe('Chabrador - Core Functionality', () => {
    let chabrador;
    let mockLogger;

    beforeEach(async () => {
        // Create a fresh instance before each test
        mockLogger = {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };

        chabrador = await adopt({
            filePath: TEST_FILE,
            backupInterval: 1000, // 1 second for test speed
            maxEntries: 5, // Lowered for easier overflow testing
            logger: mockLogger,
        });

        // Ensure the test file is clean
        await fs.writeFile(
            TEST_FILE,
            JSON.stringify({ overflows: [], entries: {} }),
        );
    });

    it('should initialize correctly', () => {
        expect(chabrador).toBeInstanceOf(Chabrador);
        expect(chabrador._filePath).toBe(TEST_FILE);
        expect(chabrador._memory).toEqual({ overflows: [], entries: {} });
        expect(mockLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('Online'),
        );
    });

    it('should boop a new key and set count to 1', () => {
        chabrador.boop('test-id');
        expect(chabrador._memory.entries['test-id']).toEqual({
            c: 1,
            t: expect.any(Number),
        });
    });

    it('should increment count and update timestamp on repeated boops', () => {
        chabrador.boop('test-id');
        const firstTimestamp = chabrador._memory.entries['test-id'].t;

        chabrador.boop('test-id');
        expect(chabrador._memory.entries['test-id'].c).toBe(2);
        expect(chabrador._memory.entries['test-id'].t).not.toBeGreaterThan(
            firstTimestamp,
        );
    });

    it('should handle overflow correctly', () => {
        for (let i = 1; i <= 6; i++) {
            chabrador.boop(`key-${i}`);
        }

        expect(chabrador._memory.entries).toEqual({});
        expect(chabrador._memory.overflows.length).toBe(1);
        expect(mockLogger.warn).toHaveBeenCalledWith(
            expect.stringContaining('overflow-memory'),
        );
    });

    it('should save and load data correctly', async () => {
        chabrador.boop('save-test');
        await chabrador.save();

        const newInstance = new Chabrador({
            filePath: TEST_FILE,
            logger: mockLogger,
        });
        await newInstance.load();

        expect(newInstance._memory.entries).toHaveProperty('save-test');
        expect(newInstance._memory.entries['save-test'].c).toBe(1);
    });

    it('should log correctly on memory load', async () => {
        await chabrador.load();
        expect(mockLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('load-memory'),
        );
    });

    it('should reset memory when reset() is called', () => {
        chabrador.boop('reset-test');
        chabrador.reset();

        expect(chabrador._memory.entries).toEqual({});
        expect(chabrador._memory.overflows).toEqual([]);
        expect(mockLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('reset-memory'),
        );
    });
});
