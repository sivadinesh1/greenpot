import pgLib from 'pg-promise';

const pgp = pgLib(/* initialization options */);

interface IDatabaseScope {
	db: pgLib.IDatabase<any>;
	pgp: pgLib.IMain;
}

export function getDB(): IDatabaseScope {
    return createSingleton<IDatabaseScope>('my-app-db-space', () => {
        return {
            db: pgp(process.env.DATABASE_URL),
            pgp,
        };
    });
}

// generic singleton creator:
export function createSingleton<T>(name: string, create: () => T): T {
    const s = Symbol.for(name);
    let scope = (global as any)[s];
    if (!scope) {
        scope = { ...create() };
        (global as any)[s] = scope;
    }
    return scope;
}

// const initOptions = {
//     // initialization options;
// };

// const pgp = require('pg-promise')(initOptions);
// const cn = process.env.DATABASE_URL;
// const db = pgp(cn);

// module.exports = db;
