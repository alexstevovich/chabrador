declare module 'chabrador' {
    export interface ChabradorOptions {
        filePath?: string;
        backupInterval?: number;
        maxEntries?: number;
        logger?: Console;
        fanfare?: boolean;
    }

    export interface ChabradorEntry {
        c: number; // Count of boops
        t: number; // Timestamp of last boop
    }

    export class Chabrador {
        constructor(options?: ChabradorOptions);

        /**
         * Loads data from the file and populates memory.
         * Returns a promise that resolves once the data is loaded.
         */
        load(): Promise<void>;

        /**
         * Increments the count for the given ID.
         * If the ID does not exist, initializes it with a count of 1.
         * Updates the timestamp to the current time.
         */
        boop(id: string): void;

        /**
         * Saves the current memory state to the file.
         * Returns a promise that resolves once the save is complete.
         */
        save(): Promise<void>;

        /**
         * Clears all memory, resetting stored entries and overflow logs.
         */
        reset(): void;
    }

    /**
     * Creates a new Chabrador instance, loads data, and returns the instance.
     */
    export function adopt(options?: ChabradorOptions): Promise<Chabrador>;

    export default { adopt, Chabrador };
}
