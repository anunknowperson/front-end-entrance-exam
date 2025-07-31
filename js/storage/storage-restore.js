export function restoreDynamicStructure(counts) {
    restoreLanguages(counts.languages);
    restoreExperienceStructure(counts.experience);
    restoreEducation(counts.education);
    restoreInterests(counts.interests);
}

function restoreLanguages(targetCount) {
    const namesColumn = document.querySelector('.skill-list .names');
    const levelsColumn = document.querySelector('.skill-list .levels');
    if (!namesColumn || !levelsColumn) return;
    
    const currentCount = namesColumn.children.length;
    
    if (targetCount > currentCount) {
        for (let i = currentCount; i < targetCount; i++) {
            const name = document.createElement('div');
            name.contentEditable = true;
            name.className = 'editable name';
            name.textContent = 'New Language';
            namesColumn.appendChild(name);
            
            const levelControl = document.createElement('div');
            levelControl.className = 'level-control';
            levelControl.innerHTML = `
                <div class="slider" role="slider" aria-label="Language proficiency" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                    <div class="fill" data-value="50"></div>
                    <div class="handle"></div>
                </div>
            `;
            levelsColumn.appendChild(levelControl);
        }
    } else if (targetCount < currentCount) {
        for (let i = currentCount - 1; i >= targetCount; i--) {
            namesColumn.children[i].remove();
            levelsColumn.children[i].remove();
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
            const card = document.createElement('article');
            card.className = 'education-card';
            card.innerHTML = `
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
            educationGrid.appendChild(card);
        }
    } else if (targetCount < currentCount) {
        for (let i = currentCount - 1; i >= targetCount; i--) {
            educationGrid.children[i].remove();
        }
    }
}

function restoreInterests(targetCount) {
    const tagList = document.querySelector('.tag-list');
    if (!tagList) return;
    
    const currentCount = tagList.children.length;
    
    if (targetCount > currentCount) {
        for (let i = currentCount; i < targetCount; i++) {
            const tag = document.createElement('span');
            tag.className = 'editable tag';
            tag.contentEditable = 'true';
            tag.textContent = 'new interest';
            tagList.appendChild(tag);
        }
    } else if (targetCount < currentCount) {
        for (let i = currentCount - 1; i >= targetCount; i--) {
            tagList.children[i].remove();
        }
    }
}