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
    const skillList = languagesSection.querySelector('.skill-list');
    const namesColumn = skillList.querySelector('.names');
    const levelsColumn = skillList.querySelector('.levels');

    updateProgressBars();

    addButton.addEventListener('click', () => {
        if (namesColumn.children.length >= 3) return;

        const newName = document.createElement('div');
        newName.contentEditable = true;
        newName.className = 'editable name';
        newName.textContent = 'New Language';
        namesColumn.appendChild(newName);

        const newLevelControl = document.createElement('div');
        newLevelControl.className = 'level-control';
        newLevelControl.innerHTML = `
            <div class="slider" role="slider" aria-label="Language proficiency" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                <div class="fill" data-value="50"></div>
                <div class="handle"></div>
            </div>
        `;
        levelsColumn.appendChild(newLevelControl);

        initializeSlider(newLevelControl);
        newName.focus();
        selectAllText(newName);
        
        setTimeout(() => {
            saveToLocalStorage();
            saveProgressBars();
        }, 100);
    });

    deleteButton.addEventListener('click', () => {
        namesColumn.innerHTML = '';
        levelsColumn.innerHTML = '';
        saveToLocalStorage();
        saveProgressBars();
    });

    Array.from(levelsColumn.children).forEach(initializeSlider);
}

function initializeSlider(levelControl) {
    const slider = levelControl.querySelector('.slider');
    const fill = levelControl.querySelector('.fill');
    const handle = levelControl.querySelector('.handle');

    let isDragging = false;

    updateSlider(fill, handle);

    handle.addEventListener('mousedown', startDrag);
    slider.addEventListener('click', (e) => {
        if (e.target === slider || e.target === fill) {
            const rect = slider.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            setProgress(fill, handle, percentage);
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
        const rect = slider.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        setProgress(fill, handle, percentage);
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        saveProgressBars();
    }
}

function setProgress(fill, handle, percentage) {
    percentage = Math.max(0, Math.min(100, percentage));
    fill.setAttribute('data-value', percentage);
    fill.style.width = percentage + '%';
    handle.style.left = `calc(${percentage}% - 8px)`;
}

function updateSlider(fill, handle) {
    const value = parseFloat(fill.getAttribute('data-value')) || 0;
    fill.style.width = value + '%';
    handle.style.left = `calc(${value}% - 8px)`;
}

function updateProgressBars() {
    const levelsColumn = document.querySelector('.skill-list .levels');
    if (levelsColumn) {
        Array.from(levelsColumn.children).forEach(levelControl => {
            const fill = levelControl.querySelector('.fill');
            const handle = levelControl.querySelector('.handle');
            updateSlider(fill, handle);
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
                <span class="editable regular" contenteditable="true">2025</span>
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
            //const skillList = currentItem.parentElement;

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
        newBlock.className = 'education-card';
        newBlock.innerHTML = `
            <div class="card-content">
                <header class="header">
                    <div class="editable title" contenteditable="true">2024</div>
                </header>
                <div class="details">
                    <h3 class="editable title" contenteditable="true">New Course</h3>
                    <div class="editable tags" contenteditable="true">#newskill #learning</div>
                </div>
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
    const interestsBlock = extraSection.querySelector('.interests');
    const addButton = interestsBlock.querySelector('.add-item-btn');
    const deleteButton = interestsBlock.querySelector('.delete-btn');
    const tagList = interestsBlock.querySelector('.tag-list');

    addButton.addEventListener('click', () => {
        if (tagList.children.length >= 20) return;

        const newTag = document.createElement('span');
        newTag.className = 'editable tag';
        newTag.contentEditable = 'true';
        newTag.textContent = 'new interest';

        tagList.appendChild(newTag);
        newTag.focus();
        selectAllText(newTag);
        
        setTimeout(() => saveToLocalStorage(), 100);
    });

    deleteButton.addEventListener('click', () => {
        tagList.innerHTML = '';
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