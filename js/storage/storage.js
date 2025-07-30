import { saveToLocalStorage as saveData, saveProgressBars, saveColorState } from './storage-save.js';
import { loadFromLocalStorage as loadData, loadProgressBars, loadColorState } from './storage-load.js';

let isClearing = false;

export function saveToLocalStorage() {
    return saveData(isClearing);
}

export function loadFromLocalStorage() {
    return loadData();
}

export function clearLocalStorage() {
    isClearing = true;
    
    localStorage.removeItem('resumeData');
    localStorage.removeItem('progressData');
    localStorage.removeItem('primaryColor');
    
    sessionStorage.setItem('dataCleared', 'true');
    
    setTimeout(() => {
        location.reload();
    }, 100);
}

export function initializeAutoSave() {
    if (sessionStorage.getItem('dataCleared') === 'true') {
        sessionStorage.removeItem('dataCleared');
        return;
    }
    
    let saveTimeout;
    
    document.addEventListener('input', (e) => {
        if (e.target.hasAttribute('contenteditable') && !isClearing) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveToLocalStorage();
            }, 500);
        }
    });
    
    document.addEventListener('blur', (e) => {
        if (e.target.hasAttribute('contenteditable') && !isClearing) {
            saveToLocalStorage();
        }
    }, true);
    
    window.addEventListener('beforeunload', () => {
        if (!isClearing) {
            saveToLocalStorage();
        }
    });
}

export { saveProgressBars, loadProgressBars, saveColorState, loadColorState };