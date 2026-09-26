/*
Copyright (c) 2024-2026 Tobias Klumpp (https://www.toklumpp.net/)
Copyright (c) 2022 codewithsadee
SPDX-License-Identifier: MIT
*/
"use strict";

/**
 * Toggles the "active" CSS class on the given element.
 * @param {HTMLElement} elem - The element to toggle.
 */
// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

/** @type {HTMLElement} */
// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
/** @type {HTMLElement} */
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

/** @type {NodeListOf<HTMLElement>} */
// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
/** @type {HTMLElement} */
const modalContainer = document.querySelector("[data-modal-container]");
/** @type {HTMLElement} */
const overlay = document.querySelector("[data-overlay]");

// modal variable
/** @type {HTMLImageElement} */
const modalImg = document.querySelector("[data-modal-img]");
/** @type {HTMLElement} */
const modalTitle = document.querySelector("[data-modal-title]");
/** @type {HTMLElement} */
const modalText = document.querySelector("[data-modal-text]");

/**
 * Opens/closes the testimonials modal and its overlay.
 */
// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]",
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]",
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button

/** @type {HTMLElement} */
// custom select variables
const select = document.querySelector("[data-select]");
/** @type {NodeListOf<HTMLElement>} */
const selectItems = document.querySelectorAll("[data-select-item]");
/** @type {HTMLElement} */
const selectValue = document.querySelector("[data-selecct-value]");
/** @type {NodeListOf<HTMLElement>} */
const filterBtn = document.querySelectorAll("[data-filter-btn]");

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

/** @type {NodeListOf<HTMLElement>} */
// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

/**
 * Shows portfolio filter items matching the selected value and hides the rest.
 * @param {string} selectedValue - The lower-case filter value to apply.
 */
const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
/** @type {HTMLElement} */
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
/** @type {HTMLFormElement} */
const form = document.querySelector("[data-form]");
/** @type {NodeListOf<HTMLElement>} */
const formInputs = document.querySelectorAll("[data-form-input]");
/** @type {HTMLElement} */
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

/** @type {NodeListOf<HTMLElement>} */
// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
/** @type {NodeListOf<HTMLElement>} */
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  /** @type {NodeListOf<HTMLFormElement>} */
  const forms = document.querySelectorAll('form[action^="mailto:"]');

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      // Stop the default HTML form submission (which causes the '+' bug)
      event.preventDefault();

      // Dynamically grab the action (email) and inputs
      const action = form.getAttribute("action"); // e.g., "mailto:your-email@example.com"
      /** @type {string} */
      const subjectVal = form.querySelector('[name="subject"]').value;
      /** @type {string} */
      const messageVal = form.querySelector('[name="body"]').value;

      // Properly encode to turn spaces into %20 instead of +
      const encodedSubject = encodeURIComponent(subjectVal);
      const encodedBody = encodeURIComponent(messageVal);

      // Redirect cleanly
      window.location.href = `${action}?subject=${encodedSubject}&body=${encodedBody}`;
    });
  });
});
