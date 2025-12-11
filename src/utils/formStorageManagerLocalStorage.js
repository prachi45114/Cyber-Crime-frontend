class FormStorageManager {
    constructor() {
        this.storageKey = "formStorage";
        this.cache = this._loadStorage();
        this.debounceTimer = null;
    }

    _loadStorage() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }

    _saveStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
    }

    _debouncedSave() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this._saveStorage(), 500);
    }

    updateField(formId, fieldName, value) {
        if (!this.cache[formId]) {
            this.cache[formId] = {};
        }
        this.cache[formId][fieldName] = value;
        this._debouncedSave();
    }

    deleteField(formId, fieldName) {
        if (this.cache[formId] && this.cache[formId][fieldName]) {
            delete this.cache[formId][fieldName];
            this._debouncedSave();
        }
    }

    getFormFields(formId) {
        return this.cache[formId] || {};
    }

    getFormField(formId, fieldName) {
        return this.cache[formId]?.[fieldName] || "";
    }

    clearFormFields(formId) {
        if (this.cache[formId]) {
            delete this.cache[formId];
            this._saveStorage();
        }
    }

    clearAllForms() {
        this.cache = {};
        localStorage.removeItem(this.storageKey);
    }

    removeFormOnSubmit(formId) {
        this.clearFormFields(formId);
    }

    setupUnloadListener() {
        window.addEventListener("beforeunload", () => this._saveStorage());
    }
}
export const formStorageManager = new FormStorageManager();
export default FormStorageManager;
