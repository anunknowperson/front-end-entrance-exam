import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { initializeRippleEffect } from "./ripple.js";
import { 
    saveToLocalStorage, 
    loadFromLocalStorage, 
    clearLocalStorage,
    initializeAutoSave,
    saveProgressBars,
    loadProgressBars,
    saveColorState,
    loadColorState
} from "./storage/storage.js";

function initializeLanguages() {
    const languagesSection = document.querySelector('.languages');
    const addButton = languagesSection.querySelector('.add-item-btn');
    const deleteButton = languagesSection.querySelector('.delete-btn');
    const languagesList = languagesSection.querySelector('.languages-list');
    const labelsColumn = languagesList.querySelector('.labels-column');
    const controlsColumn = languagesList.querySelector('.controls-column');

    updateProgressBars();

    addButton.addEventListener('click', () => {
        if (labelsColumn.children.length >= 3) return;

        const newInput = document.createElement('div');
        newInput.contentEditable = true;
        newInput.className = 'editable language-label';
        newInput.textContent = 'New Language';
        labelsColumn.appendChild(newInput);

        const newControls = document.createElement('div');
        newControls.className = 'progress-controls';
        newControls.innerHTML = `
            <div class="progress-container" role="slider" aria-label="Language proficiency" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" data-value="50"></div>
                <div class="progress-handle"></div>
            </div>
        `;
        controlsColumn.appendChild(newControls);

        initializeProgressBar(newControls);
        newInput.focus();
        selectAllText(newInput);
        
        setTimeout(() => {
            saveToLocalStorage();
            saveProgressBars();
        }, 100);
    });

    deleteButton.addEventListener('click', () => {
        labelsColumn.innerHTML = '';
        controlsColumn.innerHTML = '';
        saveToLocalStorage();
        saveProgressBars();
    });

    Array.from(controlsColumn.children).forEach(initializeProgressBar);
}

function initializeProgressBar(progressControls) {
    const progressContainer = progressControls.querySelector('.progress-container');
    const progressBar = progressControls.querySelector('.progress-bar');
    const handle = progressControls.querySelector('.progress-handle');

    let isDragging = false;

    updateProgressBar(progressBar, handle);

    handle.addEventListener('mousedown', startDrag);
    progressContainer.addEventListener('click', (e) => {
        if (e.target === progressContainer || e.target === progressBar) {
            const rect = progressContainer.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            setProgress(progressBar, handle, percentage);
            saveProgressBars();
        }
    });

    function startDrag(e) {
        isDragging = true;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        const rect = progressContainer.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        setProgress(progressBar, handle, percentage);
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        saveProgressBars();
    }
}

function setProgress(progressBar, handle, percentage) {
    percentage = Math.max(0, Math.min(100, percentage));
    progressBar.setAttribute('data-value', percentage);
    progressBar.style.width = percentage + '%';
    handle.style.left = `calc(${percentage}% - 8px)`;
}

function updateProgressBar(progressBar, handle) {
    const value = parseFloat(progressBar.getAttribute('data-value')) || 0;
    progressBar.style.width = value + '%';
    handle.style.left = `calc(${value}% - 8px)`;
}

function updateProgressBars() {
    const controlsColumn = document.querySelector('.languages-list .controls-column');
    if (controlsColumn) {
        Array.from(controlsColumn.children).forEach(progressControls => {
            const progressBar = progressControls.querySelector('.progress-bar');
            const handle = progressControls.querySelector('.progress-handle');
            updateProgressBar(progressBar, handle);
        });
    }
}

function initializeExperience() {
    const experienceSection = document.querySelector('.experience');
    const addButton = experienceSection.querySelector('.add-item-btn');
    const deleteButton = experienceSection.querySelector('.delete-btn');
    const experienceRows = experienceSection.querySelector('.experience-rows');

    addButton.addEventListener('click', () => {
        if (experienceRows.children.length >= 5) return;

        const newBlock = document.createElement('article');
        newBlock.className = 'experience-block';
        newBlock.innerHTML = `
            <header class="experience-block-head">
                <time class="editable regular" contenteditable="true">2025</time>
            </header>
            <div class="experience-block-content">
                <div class="experience-job-info">
                    <h3 class="editable role-name-label" contenteditable="true">New Role</h3>
                    <div class="experience-about-job">
                        <span class="editable regular job-info-label" contenteditable="true">Company Name</span>
                        <span class="regular" aria-hidden="true">|</span>
                        <span class="editable regular job-info-label" contenteditable="true">Full-time</span>
                    </div>
                </div>
                <div class="skill-list-container">
                    <ul class="skill-list">
                        <li class="editable regular skill-item" contenteditable="true">New responsibility or achievement</li>
                    </ul>
                </div>
            </div>
        `;

        experienceRows.appendChild(newBlock);
        setTimeout(() => saveToLocalStorage(), 100);
    });

    deleteButton.addEventListener('click', () => {
        experienceRows.innerHTML = '';
        saveToLocalStorage();
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-skill-btn')) {
            const experienceBlock = e.target.closest('.experience-block');
            const skillList = experienceBlock.querySelector('.skill-list');

            const newSkill = document.createElement('li');
            newSkill.className = 'editable regular skill-item';
            newSkill.contentEditable = 'true';
            newSkill.textContent = 'New skill or responsibility';

            skillList.appendChild(newSkill);
            newSkill.focus();
            selectAllText(newSkill);
            
            setTimeout(() => saveToLocalStorage(), 100);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('skill-item') && e.key === 'Enter') {
            e.preventDefault();

            const currentItem = e.target;
            const skillList = currentItem.parentElement;

            const newSkill = document.createElement('li');
            newSkill.className = 'editable regular skill-item';
            newSkill.contentEditable = 'true';

            currentItem.insertAdjacentElement('afterend', newSkill);
            newSkill.focus();
            
            setTimeout(() => saveToLocalStorage(), 100);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('skill-item') && e.key === 'Backspace') {
            const currentItem = e.target;
            const skillList = currentItem.parentElement;

            if (currentItem.textContent.trim() === '' && skillList.children.length > 1) {
                const prevItem = currentItem.previousElementSibling;
                const nextItem = currentItem.nextElementSibling;

                currentItem.remove();

                if (prevItem) {
                    prevItem.focus();
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(prevItem);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (nextItem) {
                    nextItem.focus();
                }

                e.preventDefault();
                setTimeout(() => saveToLocalStorage(), 100);
            }
        }
    });
}

function initializeEducation() {
    const educationSection = document.querySelector('.education');
    const addButton = educationSection.querySelector('.add-item-btn');
    const deleteButton = educationSection.querySelector('.delete-btn');
    const educationGrid = educationSection.querySelector('.education-grid');

    addButton.addEventListener('click', () => {
        if (educationGrid.children.length >= 4) return;

        const newBlock = document.createElement('article');
        newBlock.className = 'education-block';
        newBlock.innerHTML = `
            <div class="education-block-panel">
                <header class="education-top-bar">
                    <time class="editable education-name-label" contenteditable="true">2024</time>
                </header>
                <main class="education-content">
                    <h3 class="editable education-name-label" contenteditable="true">New Course</h3>
                    <div class="editable education-tags-label" contenteditable="true">#newskill #learning</div>
                </main>
                <footer class="editable regular" contenteditable="true">Institution</footer>
            </div>
        `;

        educationGrid.appendChild(newBlock);
        
        setTimeout(() => saveToLocalStorage(), 100);
    });

    deleteButton.addEventListener('click', () => {
        educationGrid.innerHTML = '';
        saveToLocalStorage();
    });
}

function initializeInterests() {
    const extraSection = document.querySelector('.extra');
    const interestsBlock = extraSection.querySelector('.interests-block');
    const addButton = interestsBlock.querySelector('.add-item-btn');
    const deleteButton = interestsBlock.querySelector('.delete-btn');
    const interestsGrid = interestsBlock.querySelector('.interests-grid');

    addButton.addEventListener('click', () => {
        if (interestsGrid.children.length >= 20) return;

        const newInterest = document.createElement('span');
        newInterest.className = 'editable interest';
        newInterest.contentEditable = 'true';
        newInterest.textContent = 'new interest';

        interestsGrid.appendChild(newInterest);
        newInterest.focus();
        selectAllText(newInterest);
        
        setTimeout(() => saveToLocalStorage(), 100);
    });

    deleteButton.addEventListener('click', () => {
        interestsGrid.innerHTML = '';
        saveToLocalStorage();
    });
}

function selectAllText(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function initializeColorPicker() {
    const colorPicker = document.getElementById('primary-color');

    colorPicker.addEventListener('change', (e) => {
        const newColor = e.target.value;
        document.documentElement.style.setProperty('--color-primary', newColor);
        saveColorState();
    });
}

function initializePDFDownload() {
    const downloadBtn = document.getElementById('download-pdf');

    downloadBtn.addEventListener('click', async () => {

        const header = document.querySelector('.editor-header');
        header.style.display = 'none';

        document.body.classList.add('pdf-mode');

        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const resumeContainer = document.querySelector('.resume-container');

            const canvas = await html2canvas(resumeContainer, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 601,
                windowWidth: 601,
                windowHeight: 850
            });

            const imgData = canvas.toDataURL('image/png');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const scaledWidth = pdfWidth;
            const scaledHeight = (canvas.height / canvas.width) * pdfWidth;
            
            let finalWidth = scaledWidth;
            let finalHeight = scaledHeight;
            
            if (scaledHeight > pdfHeight) {
                finalHeight = pdfHeight;
                finalWidth = (canvas.width / canvas.height) * pdfHeight;
            }

            const imgX = (pdfWidth - finalWidth) / 2;
            const imgY = (pdfHeight - finalHeight) / 2;

            pdf.addImage(imgData, 'PNG', imgX, imgY, finalWidth, finalHeight);

            pdf.save('resume.pdf');

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            header.style.display = 'flex';
            document.body.classList.remove('pdf-mode');
        }
    });
}

function initializeClearButton() {
    const clearBtn = document.getElementById('data-reset-btn');
    
    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Вы уверены что хотите сбросить резюме?')) {
            clearLocalStorage();
        }
    });
    
}

document.addEventListener('DOMContentLoaded', () => {
    const wasCleared = sessionStorage.getItem('dataCleared') === 'true';
    
    if (!wasCleared) {
        loadFromLocalStorage();
        loadProgressBars();
        loadColorState();
    }
    
    initializeLanguages();
    initializeExperience();
    initializeEducation();
    initializeInterests();
    initializeColorPicker();
    initializePDFDownload();
    initializeRippleEffect();
    initializeClearButton();
    
    initializeAutoSave();
    
    if (wasCleared) {
        sessionStorage.removeItem('dataCleared');
    }
});