/*
Copyright (c) 2024-2026 Tobias Klumpp (https://www.toklumpp.net/)
Copyright (c) 2022 codewithsadee
SPDX-License-Identifier: MIT
*/
// @ts-check
"use strict";

/**
 * Toggles the "active" CSS class on the given element.
 * @param {HTMLElement} elem - The element to toggle.
 */
// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = /** @type {HTMLElement} */ (
  document.querySelector("[data-sidebar]")
);
const sidebarBtn = /** @type {HTMLElement} */ (
  document.querySelector("[data-sidebar-btn]")
);

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// custom select variables
const select = /** @type {HTMLElement} */ (
  document.querySelector("[data-select]")
);
/** @type {NodeListOf<HTMLElement>} */
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = /** @type {HTMLElement} */ (
  document.querySelector("[data-selecct-value]")
);
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
const form = /** @type {HTMLFormElement} */ (
  document.querySelector("[data-form]")
);
/** @type {NodeListOf<HTMLElement>} */
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = /** @type {HTMLElement} */ (
  document.querySelector("[data-form-btn]")
);

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
      const subjectVal = /** @type {HTMLInputElement} */ (
        form.querySelector('[name="subject"]')
      ).value;
      const messageVal = /** @type {HTMLInputElement} */ (
        form.querySelector('[name="body"]')
      ).value;

      // Properly encode to turn spaces into %20 instead of +
      const encodedSubject = encodeURIComponent(subjectVal);
      const encodedBody = encodeURIComponent(messageVal);

      // Redirect cleanly
      window.location.href = `${action}?subject=${encodedSubject}&body=${encodedBody}`;
    });
  });
});
