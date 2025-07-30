export function saveToLocalStorage(isClearing) {
    if (isClearing) return;
    
    const data = {
        sections: {},
        sectionHeaders: {},
        dynamicCounts: {
            languages: 0,
            experience: 0,
            education: 0,
            interests: 0
        }
    };
    
    saveSectionHeaders(data.sectionHeaders);
    saveStaticSections(data.sections);
    saveDynamicSections(data);
    
    localStorage.setItem('resumeData', JSON.stringify(data));
}

function saveSectionHeaders(headers) {
    const languagesHeader = document.querySelector('.languages .header-label');
    if (languagesHeader) {
        headers.languages = languagesHeader.textContent;
    }
    
    const experienceHeader = document.querySelector('.experience .header-label');
    if (experienceHeader) {
        headers.experience = experienceHeader.textContent;
    }
    
    const educationHeader = document.querySelector('.education .header-label');
    if (educationHeader) {
        headers.education = educationHeader.textContent;
    }
    
    const interestsHeader = document.querySelector('.interests-block .header-label');
    if (interestsHeader) {
        headers.interests = interestsHeader.textContent;
    }
    
    const toolsHeader = document.querySelector('.tools .header-label');
    if (toolsHeader) {
        headers.tools = toolsHeader.textContent;
    }
}

function saveStaticSections(sections) {
    const profileSection = document.querySelector('.name');
    if (profileSection) {
        sections.profile = {};
        profileSection.querySelectorAll('[contenteditable="true"]').forEach(el => {
            const key = el.className.replace('editable', '').trim();
            sections.profile[key] = el.textContent;
        });
    }
    
    const toolsSection = document.querySelector('.tools');
    if (toolsSection) {
        sections.tools = {};
        const editables = toolsSection.querySelectorAll('[contenteditable="true"]:not(.header-label)');
        editables.forEach((el, index) => {
            sections.tools[`item_${index}`] = el.textContent;
        });
    }
    
    const contactsBlock = document.querySelector('.contacts-block');
    if (contactsBlock) {
        sections.contacts = {};
        contactsBlock.querySelectorAll('[contenteditable="true"]').forEach((el, index) => {
            sections.contacts[`item_${index}`] = el.textContent;
        });
    }
}

function saveDynamicSections(data) {
    const languageLabels = document.querySelectorAll('.languages-list .labels-column .language-label');
    data.sections.languages = [];
    languageLabels.forEach(label => {
        data.sections.languages.push(label.textContent);
    });
    data.dynamicCounts.languages = languageLabels.length;
    
    const experienceBlocks = document.querySelectorAll('.experience-rows .experience-block');
    data.sections.experience = [];
    experienceBlocks.forEach(block => {
        const blockData = {
            date: block.querySelector('.experience-block-head time')?.textContent || '',
            role: block.querySelector('.role-name-label')?.textContent || '',
            company: block.querySelector('.job-info-label:first-child')?.textContent || '',
            type: block.querySelector('.job-info-label:last-child')?.textContent || '',
            skills: []
        };
        
        block.querySelectorAll('.skill-item').forEach(skill => {
            blockData.skills.push(skill.textContent);
        });
        
        data.sections.experience.push(blockData);
    });
    data.dynamicCounts.experience = experienceBlocks.length;
    
    const educationBlocks = document.querySelectorAll('.education-grid .education-block');
    data.sections.education = [];
    educationBlocks.forEach(block => {
        const blockData = {
            date: block.querySelector('.education-top-bar time')?.textContent || '',
            title: block.querySelector('.education-content h3')?.textContent || '',
            tags: block.querySelector('.education-tags-label')?.textContent || '',
            institution: block.querySelector('footer')?.textContent || ''
        };
        data.sections.education.push(blockData);
    });
    data.dynamicCounts.education = educationBlocks.length;
    
    const interests = document.querySelectorAll('.interests-grid .interest');
    data.sections.interests = [];
    interests.forEach(interest => {
        data.sections.interests.push(interest.textContent);
    });
    data.dynamicCounts.interests = interests.length;
}

export function saveProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressData = {};
    
    progressBars.forEach((bar, index) => {
        const value = bar.getAttribute('data-value') || '50';
        progressData[`progress_${index}`] = value;
    });
    
    localStorage.setItem('progressData', JSON.stringify(progressData));
}

export function saveColorState() {
    const colorPicker = document.getElementById('primary-color');
    if (colorPicker) {
        localStorage.setItem('primaryColor', colorPicker.value);
    }
}