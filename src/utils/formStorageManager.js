class FormStorageManager {
    constructor() {
        this.dbName = "formStorageDB";
        this.storeName = "forms";
        this.db = null;
        this.debounceTimer = null;
        this.pendingUpdates = new Map();
        this.dbReady = this._initDB();

        // Save pending updates before page unload
        window.addEventListener("beforeunload", async () => {
            for (const [formId, updates] of this.pendingUpdates.entries()) {
                const data = await this._getData(formId);
                for (const [fieldName, value] of Object.entries(updates)) {
                    data[fieldName] = value;
                }
                await this._saveData(formId, data);
            }
        });
    }

    async _initDB() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                return resolve(this.db);
            }

            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async _getDB() {
        if (!this.db) {
            await this.dbReady; // Ensure DB is initialized before any operation
        }
        return this.db;
    }

    async _saveData(formId, data) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            store.put(data, formId);

            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject(event.target.error);
        });
    }

    async _getData(formId) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(formId);

            request.onsuccess = () => resolve(request.result || {});
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async _deleteData(formId) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            store.delete(formId);

            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject(event.target.error);
        });
    }

    async updateField(formId, fieldName, value) {
        if (!this.pendingUpdates.has(formId)) {
            this.pendingUpdates.set(formId, {});
        }
        this.pendingUpdates.get(formId)[fieldName] = value;

        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(async () => {
            const updates = this.pendingUpdates.get(formId);
            const data = await this._getData(formId);
            Object.assign(data, updates);
            await this._saveData(formId, data);
            this.pendingUpdates.delete(formId);
        }, 500);
    }

    async updateFields(formId, value) {
        this.debounceTimer = setTimeout(async () => {
            await this._saveData(formId, value);
        }, 500);
    }

    async deleteField(formId, fieldName) {
        const data = await this._getData(formId);
        if (data[fieldName]) {
            delete data[fieldName];
            await this._saveData(formId, data);
        }
    }

    async getFormFields(formId) {
        return await this._getData(formId);
    }

    async getFormField(formId, fieldName) {
        const data = await this._getData(formId);
        return data[fieldName] || "";
    }

    async clearFormFields(formId) {
        await this._deleteData(formId);
    }

    async clearAllForms() {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async removeFormOnSubmit(formId) {
        await this.clearFormFields(formId);
    }
}

// Usage
const formStorageManager = new FormStorageManager();
export { formStorageManager };
export default FormStorageManager;
