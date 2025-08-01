import { restoreDynamicStructure } from "./storage-restore.js";

export function loadFromLocalStorage() {
  const savedData = localStorage.getItem("resumeData");
  if (!savedData) return;

  try {
    const data = JSON.parse(savedData);

    if (data.dynamicCounts) {
      restoreDynamicStructure(data.dynamicCounts);
    }

    setTimeout(() => {
      if (data.sectionHeaders) {
        restoreSectionHeaders(data.sectionHeaders);
      }

      if (data.sections) {
        restoreAllContent(data.sections);
      }
    }, 100);
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
  }
}

function restoreSectionHeaders(headers) {
  if (headers.languages) {
    const languagesHeader = document.querySelector(".languages .header-label");
    if (languagesHeader) {
      languagesHeader.textContent = headers.languages;
    }
  }

  if (headers.experience) {
    const experienceHeader = document.querySelector(
      ".experience .header-label",
    );
    if (experienceHeader) {
      experienceHeader.textContent = headers.experience;
    }
  }

  if (headers.education) {
    const educationHeader = document.querySelector(".education .header-label");
    if (educationHeader) {
      educationHeader.textContent = headers.education;
    }
  }

  if (headers.interests) {
    const interestsHeader = document.querySelector(".interests .header-label");
    if (interestsHeader) {
      interestsHeader.textContent = headers.interests;
    }
  }

  if (headers.tools) {
    const toolsHeader = document.querySelector(".tools .header-label");
    if (toolsHeader) {
      toolsHeader.textContent = headers.tools;
    }
  }
}

function restoreAllContent(sections) {
  if (sections.profile) {
    const profileSection = document.querySelector(".name");
    if (profileSection) {
      Object.keys(sections.profile).forEach((key) => {
        const element = profileSection.querySelector(`.${key}`);
        if (element) {
          element.textContent = sections.profile[key];
        }
      });
    }
  }

  if (sections.tools) {
    const toolsSection = document.querySelector(".tools");
    if (toolsSection) {
      const editables = toolsSection.querySelectorAll(
        '[contenteditable="true"]:not(.header-label)',
      );
      Object.keys(sections.tools).forEach((key, index) => {
        if (editables[index]) {
          editables[index].textContent = sections.tools[key];
        }
      });
    }
  }

  if (sections.contacts) {
    const contactsSection = document.querySelector(".contact-section");
    if (contactsSection) {
      const editables = contactsSection.querySelectorAll(
        '[contenteditable="true"]',
      );
      Object.keys(sections.contacts).forEach((key, index) => {
        if (editables[index]) {
          editables[index].textContent = sections.contacts[key];
        }
      });
    }
  }

  if (sections.languages) {
    const languageNames = document.querySelectorAll(".skill-list .names .name");
    sections.languages.forEach((text, index) => {
      if (languageNames[index]) {
        languageNames[index].textContent = text;
      }
    });
  }

  if (sections.experience) {
    const experienceBlocks = document.querySelectorAll(
      ".experience-rows .experience-block",
    );
    sections.experience.forEach((blockData, blockIndex) => {
      const block = experienceBlocks[blockIndex];
      if (!block) return;

      const dateEl = block.querySelector(".experience-block-head span");
      if (dateEl) dateEl.textContent = blockData.date;

      const roleEl = block.querySelector(".role-name-label");
      if (roleEl) roleEl.textContent = blockData.role;

      const companyEl = block.querySelector(".job-info-label:first-child");
      if (companyEl) companyEl.textContent = blockData.company;

      const typeEl = block.querySelector(".job-info-label:last-child");
      if (typeEl) typeEl.textContent = blockData.type;

      const skillList = block.querySelector(".skill-list");
      if (skillList && blockData.skills) {
        skillList.innerHTML = "";

        blockData.skills.forEach((skillText) => {
          const li = document.createElement("li");
          li.className = "editable regular skill-item";
          li.contentEditable = "true";
          li.textContent = skillText;
          skillList.appendChild(li);
        });
      }
    });
  }

  if (sections.education) {
    const educationCards = document.querySelectorAll(
      ".education-grid .education-card",
    );
    sections.education.forEach((blockData, index) => {
      const card = educationCards[index];
      if (!card) return;

      const dateEl = card.querySelector(".header .title");
      if (dateEl) dateEl.textContent = blockData.date;

      const titleEl = card.querySelector(".details h3");
      if (titleEl) titleEl.textContent = blockData.title;

      const tagsEl = card.querySelector(".tags");
      if (tagsEl) tagsEl.textContent = blockData.tags;

      const institutionEl = card.querySelector("footer");
      if (institutionEl) institutionEl.textContent = blockData.institution;
    });
  }

  if (sections.interests) {
    const tags = document.querySelectorAll(".tag-list .tag");
    sections.interests.forEach((text, index) => {
      if (tags[index]) {
        tags[index].textContent = text;
      }
    });
  }
}

export function loadProgressBars() {
  if (sessionStorage.getItem("dataCleared") === "true") {
    return;
  }

  const savedProgressData = localStorage.getItem("progressData");
  if (!savedProgressData) return;

  try {
    const progressData = JSON.parse(savedProgressData);
    const fills = document.querySelectorAll(".fill");

    fills.forEach((fill, index) => {
      const value = progressData[`progress_${index}`];
      if (value !== undefined) {
        fill.setAttribute("data-value", value);
        fill.style.width = value + "%";
        const handle = fill.parentElement.querySelector(".handle");
        if (handle) {
          handle.style.left = `calc(${value}% - 8px)`;
        }
      }
    });
  } catch (error) {
    console.error("Error loading progress data:", error);
  }
}

export function loadColorState() {
  if (sessionStorage.getItem("dataCleared") === "true") {
    return;
  }

  const savedColor = localStorage.getItem("primaryColor");
  if (savedColor) {
    const colorPicker = document.getElementById("primary-color");
    if (colorPicker) {
      colorPicker.value = savedColor;
      document.documentElement.style.setProperty("--color-primary", savedColor);
    }
  }
}
