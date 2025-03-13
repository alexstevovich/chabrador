# Chabrador

![Stella](res/stella.jpg)

<br>

**Chabrador** is a **key-incrementer database** with persistent memory across process resets.

## Features

- **In-Memory Data Handling** – Memory persists when process resets.
- **Overflow Protection** – Limits can be applied to stop theoretical endless growth.

## Installation

```bash
npm install chabrador
```

## Usage

```js
import { adopt } from 'chabrador';

const chabrador = await adopt({
    filePath: 'data.json',
    backupInterval: 600000, // 10 minutes
    maxEntries: 100000,
    logger: console,
});

chabrador.boop('unique-id');
```

## API

### boop(id: string)

Increments a key value by 1 If the key exists otherwise it creates a new entry set at 0. The timestamp of the last boop is recorded.

### adopt()

Creates a new Chabrador instance and initializes memory from a file.

## Development Homepage:

[https://github.com/alexstevovich/chabrador](https://github.com/alexstevovich/chabrador)

_This link might become chabrador-node in the future if conflicts arise._

## License

Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
