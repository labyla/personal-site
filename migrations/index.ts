import * as migration_20260620_182611 from './20260620_182611';
import * as migration_20260621_165400 from './20260621_165400';
import * as migration_20260622_072800 from './20260622_072800';
import * as migration_20260622_080000 from './20260622_080000';
import * as migration_20260622_081000 from './20260622_081000';
import * as migration_20260622_082000 from './20260622_082000';
import * as migration_20260622_083000 from './20260622_083000';

export const migrations = [
  {
    up: migration_20260620_182611.up,
    down: migration_20260620_182611.down,
    name: '20260620_182611'
  },
  {
    up: migration_20260621_165400.up,
    down: migration_20260621_165400.down,
    name: '20260621_165400'
  },
  {
    up: migration_20260622_072800.up,
    down: migration_20260622_072800.down,
    name: '20260622_072800'
  },
  {
    up: migration_20260622_080000.up,
    down: migration_20260622_080000.down,
    name: '20260622_080000'
  },
  {
    up: migration_20260622_081000.up,
    down: migration_20260622_081000.down,
    name: '20260622_081000'
  },
  {
    up: migration_20260622_082000.up,
    down: migration_20260622_082000.down,
    name: '20260622_082000'
  },
  {
    up: migration_20260622_083000.up,
    down: migration_20260622_083000.down,
    name: '20260622_083000'
  },
];
