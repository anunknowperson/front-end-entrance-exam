export function restoreDynamicStructure(counts) {
    restoreLanguages(counts.languages);
    restoreExperienceStructure(counts.experience);
    restoreEducation(counts.education);
    restoreInterests(counts.interests);
}

function restoreLanguages(targetCount) {
    const labelsColumn = document.querySelector('.languages-list .labels-column');
    const controlsColumn = document.querySelector('.languages-list .controls-column');
    if (!labelsColumn || !controlsColumn) return;
    
    const currentCount = labelsColumn.children.length;
    
    if (targetCount > currentCount) {
        for (let i = currentCount; i < targetCount; i++) {
            const label = document.createElement('div');
            label.contentEditable = true;
            label.className = 'editable language-label';
            label.textContent = 'New Language';
            labelsColumn.appendChild(label);
            
            const controls = document.createElement('div');
            controls.className = 'progress-controls';
            controls.innerHTML = `
                <div class="progress-container" role="slider" aria-label="Language proficiency" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" data-value="50"></div>
                    <div class="progress-handle"></div>
                </div>
            `;
            controlsColumn.appendChild(controls);
        }
    } else if (targetCount < currentCount) {
        for (let i = currentCount - 1; i >= targetCount; i--) {
            labelsColumn.children[i].remove();
            controlsColumn.children[i].remove();
        }
    }
}

function restoreExperienceStructure(targetCount) {
    const experienceRows = document.querySelector('.experience-rows');
    if (!experienceRows) return;
    
    const currentCount = experienceRows.children.length;
    
    if (targetCount > currentCount) {
        for (let i = currentCount; i < targetCount; i++) {
            const block = document.createElement('article');
            block.className = 'experience-block';
            block.innerHTML = `
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
            experienceRows.appendChild(block);
        }
    } else if (targetCount < currentCount) {
        for (let i = currentCount - 1; i >= targetCount; i--) {
            experienceRows.children[i].remove();
        }
    }
}

function restoreEducation(targetCount) {
    const educationGrid = document.querySelector('.education-grid');
    if (!educationGrid) return;
    
    const currentCount = educationGrid.children.length;
    
    if (targetCount > currentCount) {
        for (let i = currentCount; i < targetCount; i++) {
            const block = document.createElement('article');
            block.className = 'education-block';
            block.innerHTML = `
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
            educationGrid.appendChild(block);
        }
    } else if (targetCount < currentCount) {
        for (let i = currentCount - 1; i >= targetCount; i--) {
            educationGrid.children[i].remove();
        }
    }
}

function restoreInterests(targetCount) {
    const interestsGrid = document.querySelector('.interests-grid');
    if (!interestsGrid) return;
    
    const currentCount = interestsGrid.children.length;
    
    if (targetCount > currentCount) {
        for (let i = currentCount; i < targetCount; i++) {
            const interest = document.createElement('span');
            interest.className = 'editable interest';
            interest.contentEditable = 'true';
            interest.textContent = 'new interest';
            interestsGrid.appendChild(interest);
        }
    } else if (targetCount < currentCount) {
        for (let i = currentCount - 1; i >= targetCount; i--) {
            interestsGrid.children[i].remove();
        }
    }
}