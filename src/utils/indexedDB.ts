export type Migration = (vcTransaction: IDBTransaction) => void;
export type Migrations = [Migration, ...Migration[]];

export  function openDB (dbName: string, dbMigrations: Migrations): Promise<IDBDatabase> {
    return  new Promise<IDBDatabase>((resolve, reject) => {
        const openRequest = indexedDB.open(dbName, dbMigrations.length);

        openRequest.onerror = () => reject(openRequest.error);
        openRequest.onsuccess = () => resolve(openRequest.result);
        openRequest.onupgradeneeded = ({oldVersion}) => {
            for (const  migration of dbMigrations.slice(oldVersion)) {
                migration(openRequest.transaction!);
            }
        };
    });
}

export  function readFromDB<T>(db: IDBDatabase, storageName: string, key: IDBValidKey | IDBKeyRange): Promise<T> {
    return  new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storageName, 'readonly');
        const objectStore = transaction.objectStore(storageName);
        const readRequest = objectStore.get(key);

        readRequest.onerror = () => reject(readRequest.error);
        readRequest.onsuccess = () => resolve(readRequest.result);
    })
}

export function addIntoDB<T, K extends  IDBValidKey>(db: IDBDatabase, storageName: string, data: T, key?: K): Promise<K> {
    return new Promise<K>((resolve, reject) => {
        const transaction = db.transaction(storageName, 'readwrite');
        const objectStore = transaction.objectStore(storageName);
        const addRequest = key === undefined ? objectStore.add(data) : objectStore.add(data, key);

        addRequest.onerror = () => reject(addRequest.error);
        addRequest.onsuccess = () => resolve(addRequest.result as K)
    });
}

export function  updateInDB<T, K extends IDBValidKey>(db: IDBDatabase, storageName: string, data: T, key?: K): Promise<K>{
    return  new Promise<K>((resolve, reject) => {
        const transaction = db.transaction(storageName, 'readwrite');
        const objectStore = transaction.objectStore(storageName);
        const updateRequest = key === undefined ? objectStore.put(data) : objectStore.put(data, key);

        updateRequest.onerror = () => reject(updateRequest.error);
        updateRequest.onsuccess = () => resolve(updateRequest.result as K);
    })
}

export function removeFromDB(db: IDBDatabase, storageName: string, key: IDBValidKey | IDBKeyRange): Promise<void>{
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storageName, 'readwrite');
        const objectStore = transaction.objectStore(storageName);
        const deleteRequest = objectStore.delete(key);

        deleteRequest.onerror = () => reject(deleteRequest.error);
        deleteRequest.onsuccess = () => resolve();
    });
}

export function getAllFromDB<T>(db: IDBDatabase, storageName: string, key?: IDBKeyRange): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
        const results: T[] = [];
        const transaction = db.transaction(storageName, 'readonly');
        const objectStore = transaction.objectStore(storageName);
        const cursor = objectStore.openCursor(key)

        cursor.onerror = () => reject(cursor.error);
        cursor.onsuccess = () => {
            const { result } = cursor;

            if (result) {
                results.push(result.value);
                result.continue();
            } else {
                resolve(results);
            }
        }

    });
}