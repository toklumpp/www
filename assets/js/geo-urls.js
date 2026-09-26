/*
Copyright (c) 2025-2026 Tobias Klumpp (https://www.toklumpp.net/)
SPDX-License-Identifier: MIT
*/
"use strict";
// Regular expression pattern to match geo: URLs
/** @type {RegExp} */
const geoUrlPattern = /geo:([-0-9.]+),([-0-9.]+)(\?(z=([0-9]+))?)?/;

/**
 * Function to detect the platform from the user agent.
 * @returns {string} The detected platform name.
 */
function detectPlatform() {
  const userAgent = navigator.userAgent;
  if (userAgent.match(/Android/i)) {
    return "Android";
  } else if (userAgent.match(/CrOS/i)) {
    return "Chrome OS";
  } else if (userAgent.match(/Linux/i)) {
    return "Linux";
  } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
    return "iOS";
  } else if (userAgent.match(/Mac OS X/i)) {
    return "macOS";
  } else if (userAgent.match(/Windows/i)) {
    return "Windows";
  } else {
    return "Unknown";
  }
}

/**
 * Function to replace geo: URLs with platform-specific maps app URLs.
 * @param {string} match - The original geo: URL.
 * @param {string} latitude - The latitude capture group.
 * @param {string} longitude - The longitude capture group.
 * @param {string | number | undefined} zoom - The optional zoom capture group.
 * @param {string} platform - The detected platform name.
 * @returns {{url: string, clickable: boolean}} The replacement URL and whether the link stays clickable.
 */
function replaceGeoUrl(match, latitude, longitude, zoom, platform) {
  /** @type {string} */
  let url;
  /** @type {boolean} */
  let clickable = true;
  if (!zoom) {
    zoom = 11;
  }
  switch (platform) {
    case "iOS":
    case "macOS":
      url = `maps://?ll=${latitude},${longitude}&z=${zoom}`;
      break;
    case "Windows":
      url = "";
      clickable = false;
      break;
    case "Android":
    case "Chrome OS":
    case "Chromium OS":
    case "Linux":
    default:
      url = match;
      break;
  }

  return { url: url, clickable: clickable };
}

/**
 * Rewrites all geo: links on the page to platform-appropriate map URLs,
 * or converts them to plain spans when no mapping is available.
 * @returns {void}
 */
function geoUrls() {
  // Detect the platform
  const platform = detectPlatform();

  // Get all links with geo: URLs
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const links = document.querySelectorAll('a[href^="geo:"]');

  // Replace the href attribute of each link
  links.forEach((link) => {
    const match = link.href.match(geoUrlPattern);
    if (match) {
      let result = replaceGeoUrl(
        link.href,
        match[1],
        match[2],
        match[5],
        platform,
      );
      if (result.clickable) {
        if (link.href.match(/http/i)) {
          link.rel += " noopener";
          link.target = "_blank";
        }
        link.href = result.url;
      } else {
        const span = document.createElement("span");
        for (const attr of link.attributes) {
          if (attr.name !== "href") {
            span.setAttribute(attr.name, attr.value);
          }
        }
        span.classList.add("no-link");
        while (link.firstChild) {
          span.appendChild(link.firstChild);
        }
        link.parentNode.replaceChild(span, link);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", geoUrls);
