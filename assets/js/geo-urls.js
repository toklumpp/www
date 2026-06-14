/*
Copyright (c) 2025-2026 Tobias Klumpp (https://www.toklumpp.net/)
SPDX-License-Identifier: MIT
*/
'use strict';
// Regular expression pattern to match geo: URLs
const geoUrlPattern = /geo:([\-0-9.]+),([\-0-9.]+)(\?(z=([0-9]+))?)?/;

// Function to detect the platform
function detectPlatform() {
    const userAgent = navigator.userAgent;
    if (userAgent.match(/Android/i)) {
        return "Android";
    } else if (userAgent.match(/CrOS/i)) {
        return "Chrome OS";
    } else if (false) {
        return "Chromium OS";
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

function detectBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.match(/Seamonkey/i)) {
        return "Seamonkey";
    } else if (userAgent.match(/Firefox/i)) {
        return "Firefox";
    } else if (userAgent.match(/Edg/i)) {
        return "Microsoft Edge";
    } else if (userAgent.match(/Chromium/i)) {
        return "Chromium";
    } else if (userAgent.match(/Chrome/i)) {
        return "Google Chrome";
    } else if (userAgent.match(/Safari/i)) {
        return "Safari";
    } else if (userAgent.match(/Opera/i) || userAgent.match(/OPR/i)) {
        return "Opera";
    } else {
        return "Unknown";
    }
}

// Function to replace geo: URLs with platform-specific maps app URLs
function replaceGeoUrl(match, latitude, longitude, zoom, platform, browser) {
    let url = match;
    let clickable = true;
    if(!zoom) {
        zoom = 11;
    }
    switch (platform) {
        case "iOS":
        case "macOS":
            url = `maps://?ll=${latitude},${longitude}&z=${zoom}`;
            break;
        case "Android":
        case "Chrome OS":
        case "Chromium OS":
        case "Linux":
            url = match;
            break;
        case "Windows":
        default:
            url = "";
            clickable = false;
            break;
    }

    return { "url": url, "clickable": clickable };
}

function geoUrls() {
    // Detect the platform
    const platform = detectPlatform();
    const browser = detectBrowser();

    // Get all links with geo: URLs
    const links = document.querySelectorAll('a[href^="geo:"]');

    // Replace the href attribute of each link
    links.forEach(link => {
        const match = link.href.match(geoUrlPattern);
        if (match) {
            let result = replaceGeoUrl(link.href, match[1], match[2], match[5], platform, browser);       
            if (result.clickable) {
                if (link.href.match(/http/i)) {
                    link.rel += " noopener";
                    link.target = "_blank";
                }
                link.href = result.url;
            } else {
                link.className += " no-link";
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', geoUrls);