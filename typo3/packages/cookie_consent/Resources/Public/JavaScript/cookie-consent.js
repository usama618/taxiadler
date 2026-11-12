(function () {
    "use strict";

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

    function init() {
        var root = document.querySelector("[data-cookie-consent]");
        if (!root) return; // Fail closed: no banner configuration means no optional scripts.
        var cookieName = root.dataset.cookieName || "site_cookie_consent";
        if (!/^[a-zA-Z0-9_-]+$/.test(cookieName)) return;
        var version = String(root.dataset.cookieVersion || "1");
        var maxAge = 60 * 60 * 24 * 180;
        var panel = root.querySelector(".dpf-cookie__panel");
        var options = root.querySelector("[data-cookie-options]");
        var saveButton = root.querySelector("[data-cookie-save]");
        var settingsButton = root.querySelector("[data-cookie-settings]");
        var acceptButton = root.querySelector("[data-cookie-accept]");
        var necessaryButton = root.querySelector("[data-cookie-necessary]");
        var openButton = root.querySelector("[data-cookie-open]");
        var inputs = Array.from(root.querySelectorAll("[data-cookie-category]"));
        var categories = inputs.map(function (input) { return input.dataset.cookieCategory; })
            .filter(function (category) { return ["external_media", "statistics", "marketing"].includes(category); });
        var consent = readConsent();

        root.hidden = false;
        updateCheckboxes(consent);
        if (consent) {
            hidePanel(false);
            activateScripts(consent);
        } else {
            showPanel(false);
        }

        openButton.addEventListener("click", function () { showPanel(true); });
        settingsButton.addEventListener("click", function () {
            options.hidden = false;
            saveButton.hidden = false;
            settingsButton.setAttribute("aria-expanded", "true");
            (inputs[0] || saveButton).focus({ preventScroll: true });
        });
        necessaryButton.addEventListener("click", function () { persist(emptyConsent()); });
        if (acceptButton) {
            acceptButton.addEventListener("click", function () {
                var value = emptyConsent();
                categories.forEach(function (category) { value[category] = true; });
                persist(value);
            });
        }
        saveButton.addEventListener("click", function () {
            var value = emptyConsent();
            inputs.forEach(function (input) {
                if (categories.includes(input.dataset.cookieCategory)) value[input.dataset.cookieCategory] = input.checked;
            });
            persist(value);
        });
        root.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && consent) hidePanel(true);
        });

        function emptyConsent() {
            return { version: version, necessary: true, external_media: false, statistics: false, marketing: false };
        }

        function readConsent() {
            var match = document.cookie.match(new RegExp("(?:^|; )" + cookieName + "=([^;]*)"));
            if (!match) return null;
            try {
                var stored = JSON.parse(decodeURIComponent(match[1]));
                if (!stored || stored.version !== version || stored.necessary !== true) return null;
                if (["external_media", "statistics", "marketing"].some(function (key) { return typeof stored[key] !== "boolean"; })) return null;
                var value = emptyConsent();
                categories.forEach(function (category) { value[category] = stored[category]; });
                return value;
            } catch (error) {
                return null;
            }
        }

        function persist(value) {
            var revoked = consent && categories.some(function (category) { return consent[category] && !value[category]; });
            document.cookie = cookieName + "=" + encodeURIComponent(JSON.stringify(value)) + "; Max-Age=" + maxAge + "; Path=/; SameSite=Lax" + (window.location.protocol === "https:" ? "; Secure" : "");
            consent = value;
            updateCheckboxes(consent);
            hidePanel(true);
            document.dispatchEvent(new CustomEvent("dpf:consent-changed", { detail: {
                externalMedia: consent.external_media,
                statistics: consent.statistics,
                marketing: consent.marketing
            } }));
            // Removing a script element cannot stop executed code. Reload with the revoked consent saved.
            if (revoked) window.location.reload();
            else activateScripts(consent);
        }

        function showPanel(focus) {
            root.dataset.panelOpen = "true";
            document.documentElement.dataset.cookiePanelOpen = "true";
            panel.hidden = false;
            openButton.setAttribute("aria-expanded", "true");
            updateCheckboxes(consent);
            if (focus) necessaryButton.focus({ preventScroll: true });
        }

        function hidePanel(focus) {
            root.dataset.consentSaved = "true";
            root.dataset.panelOpen = "false";
            document.documentElement.dataset.cookiePanelOpen = "false";
            panel.hidden = true;
            openButton.setAttribute("aria-expanded", "false");
            if (focus) openButton.focus({ preventScroll: true });
        }

        function updateCheckboxes(value) {
            inputs.forEach(function (input) { input.checked = Boolean(value && value[input.dataset.cookieCategory]); });
        }

        function activateScripts(value) {
            document.querySelectorAll('script[type="text/plain"][data-cookieconsent]').forEach(function (script) {
                var required = (script.getAttribute("data-cookieconsent") || "").split(/[,\s]+/).filter(Boolean);
                if (!required.length || !required.every(function (category) { return categories.includes(category) && value[category] === true; })) return;
                var replacement = document.createElement("script");
                Array.from(script.attributes).forEach(function (attribute) {
                    if (!["type", "data-src", "data-cookieconsent"].includes(attribute.name)) replacement.setAttribute(attribute.name, attribute.value);
                });
                if (script.getAttribute("data-src")) replacement.src = script.getAttribute("data-src");
                replacement.text = script.text || script.textContent || "";
                script.parentNode.replaceChild(replacement, script);
            });
        }
    }
}());
