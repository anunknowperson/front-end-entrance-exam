export function saveToLocalStorage(isClearing) {
  if (isClearing) return;

  const data = {
    sections: {},
    sectionHeaders: {},
    dynamicCounts: {
      languages: 0,
      experience: 0,
      education: 0,
      interests: 0,
    },
  };

  saveSectionHeaders(data.sectionHeaders);
  saveStaticSections(data.sections);
  saveDynamicSections(data);

  localStorage.setItem("resumeData", JSON.stringify(data));
}

function saveSectionHeaders(headers) {
  const languagesHeader = document.querySelector(".languages .header-label");
  if (languagesHeader) {
    headers.languages = languagesHeader.textContent;
  }

  const experienceHeader = document.querySelector(".experience .header-label");
  if (experienceHeader) {
    headers.experience = experienceHeader.textContent;
  }

  const educationHeader = document.querySelector(".education .header-label");
  if (educationHeader) {
    headers.education = educationHeader.textContent;
  }

  const interestsHeader = document.querySelector(".interests .header-label");
  if (interestsHeader) {
    headers.interests = interestsHeader.textContent;
  }

  const toolsHeader = document.querySelector(".tools .header-label");
  if (toolsHeader) {
    headers.tools = toolsHeader.textContent;
  }
}

function saveStaticSections(sections) {
  const profileSection = document.querySelector(".name");
  if (profileSection) {
    sections.profile = {};
    profileSection
      .querySelectorAll('[contenteditable="true"]')
      .forEach((el) => {
        const key = el.className.replace("editable", "").trim();
        sections.profile[key] = el.textContent;
      });
  }

  const toolsSection = document.querySelector(".tools");
  if (toolsSection) {
    sections.tools = {};
    const editables = toolsSection.querySelectorAll(
      '[contenteditable="true"]:not(.header-label)',
    );
    editables.forEach((el, index) => {
      sections.tools[`item_${index}`] = el.textContent;
    });
  }

  const contactsSection = document.querySelector(".contact-section");
  if (contactsSection) {
    sections.contacts = {};
    contactsSection
      .querySelectorAll('[contenteditable="true"]')
      .forEach((el, index) => {
        sections.contacts[`item_${index}`] = el.textContent;
      });
  }
}

function saveDynamicSections(data) {
  const languageNames = document.querySelectorAll(".skill-list .names .name");
  data.sections.languages = [];
  languageNames.forEach((name) => {
    data.sections.languages.push(name.textContent);
  });
  data.dynamicCounts.languages = languageNames.length;

  const experienceBlocks = document.querySelectorAll(
    ".experience-rows .experience-block",
  );
  data.sections.experience = [];
  experienceBlocks.forEach((block) => {
    const blockData = {
      date:
        block.querySelector(".experience-block-head span")?.textContent || "",
      role: block.querySelector(".role-name-label")?.textContent || "",
      company:
        block.querySelector(".job-info-label:first-child")?.textContent || "",
      type:
        block.querySelector(".job-info-label:last-child")?.textContent || "",
      skills: [],
    };

    block.querySelectorAll(".skill-item").forEach((skill) => {
      blockData.skills.push(skill.textContent);
    });

    data.sections.experience.push(blockData);
  });
  data.dynamicCounts.experience = experienceBlocks.length;

  const educationCards = document.querySelectorAll(
    ".education-grid .education-card",
  );
  data.sections.education = [];
  educationCards.forEach((card) => {
    const blockData = {
      date: card.querySelector(".header .title")?.textContent || "",
      title: card.querySelector(".details h3")?.textContent || "",
      tags: card.querySelector(".tags")?.textContent || "",
      institution: card.querySelector("footer")?.textContent || "",
    };
    data.sections.education.push(blockData);
  });
  data.dynamicCounts.education = educationCards.length;

  const tags = document.querySelectorAll(".tag-list .tag");
  data.sections.interests = [];
  tags.forEach((tag) => {
    data.sections.interests.push(tag.textContent);
  });
  data.dynamicCounts.interests = tags.length;
}

export function saveProgressBars() {
  const fills = document.querySelectorAll(".fill");
  const progressData = {};

  fills.forEach((fill, index) => {
    const value = fill.getAttribute("data-value") || "50";
    progressData[`progress_${index}`] = value;
  });

  localStorage.setItem("progressData", JSON.stringify(progressData));
}

export function saveColorState() {
  const colorPicker = document.getElementById("primary-color");
  if (colorPicker) {
    localStorage.setItem("primaryColor", colorPicker.value);
  }
}
