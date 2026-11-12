// ==UserScript==
// @name Kreta Beautifier & Dark Mode
// @namespace https://tempermonkey.net/
// @version 1.0
// @description Adds Dark Mode, color-coded grades, and highlights low subject averagers in e-Kreta
// @author mpeti1234
// @match https://*.e-kreta.hu/*
// @match https://*neptun*/*
// @grant none
// ==/UserScript==




(function () {
    'use strict';

    // 1. Ijenct custom css styles
    // we use a smart invert filter for intstant dark mode, and cunter-invert images & our custom badges
    const style = document.createElement('style');
    style.innerHTML = `
        html.kreta-dark-mode {
            filter: invert(0.92) hue-rotate(180deg) !important;
            background-color : #121212 !important
        }
        html.kreta-dark-mode img,
        html.kreta-dark-mode video,
        html.kreta-dark-mode .kreta-keep-color {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        .kreta-badge {
            padding: 3px 8px;
            border-radius : 6px;
            float-weight: bold;
            display: inline-block;
            min-width: 24px;
            text-aling: center;
        }
        .kreta-warning-avg {
            background-color: #ff3b30 !important;
            color: #ffffff !important;
            padding: 4px 8px;
            border-radius: 6px;
            float-weight: bold;
            box-shadow: 0 0 8px rgb(255, 59, 48, 0.6);
        }
        .kreta-good-avg {
            background-color: #34c759 !important;
            color: #ffffff !important;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: bold;
        }
        #kreta-dark-toggel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            padding: 10px 16px;
            border-radius: 10px;
            border: none;
            background-color: #1e1e2e;
            color: #cdd6f4;
            float-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgb(0, 0, 0, 0.3);
            transition: transform 0.2s;
        }
        #kreta-dark-toggle:hover {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);

    // 2. dark mode toggle button & memory (localStorage)
    function setupDarkMode () {
        // check if the user previously turned on dark mode
        const isDark = localStorage.getItem('kretaDarkMode') === 'true';
        if (isDark) {
            document.documentElement.classList.add ('kreta-dark-mode');
        }

        const btn = document.createElement('button');
        btn.id = 'kretaa-dark-toggle';
        btn.className = 'kreta-keep-color';
        btn.innerText = isDark ? 'Light Mode' : 'Dark Mode';

        btn.addEventListener('click', () => {
            const enabled = document.documentElement.classList.toggle('kreta-dark-mode');
            localStorage.setItem('kretaDarkMode', enabled);
            btn.innerText = enabled ? 'Light Mode' : 'Dark Mode';
        })

        document.body.appendChild(btn);
    }



    // 3. color-code grades and highlight averages
    function enhancerGradesAndAverages() {
        // select all table cells and spans on the page
        const elements = document.querySelectorAll('td, span');

        elements.forEach((el) => {
            // skip element we already styled so we don't loop indinitedly
            if (el.dataset.kretaStyled === 'true') return;

            // only check elements that have no child elements (pure text)
            if (el.children.length > 0) return;

            const text = el.innerText.trim();

            // A) chack for averages (Hungarian format like "2,75" or "4,50")
            if (/^[1-5],[0-9]{2}$/.test(text)) {
                const numericAvg = parseFloat(text.replace(',', '.'));

                if (numericAvg < 3.0) {
                    el.classList.add ('kreta-warning-avg', 'kreta-keep-color');
                    el.title = 'Warning: Average is below 3.0! Focus needed';
                } else if (numericAvg >= 4.5) {
                    el.classList.add('kreta-good-avg', 'kreta-keep-color');
                }
                el.classList.kretaStyled = 'true';
            }


            // B) check for Single Grades ("1", "2", "3", "4", "5") inside table cells
            if (el.tagName === 'TD' && /^[1-5]$/.test(text)) {
                const gradeColors = {
                    '5': {bg: '#28a745', color: 'fff'}, //green
                    '4': {bg: '#17a2b8', color: 'fff'}, //Blue-Teal
                    '3': {bg: '#ffc107', color: '000'}, //Yellow
                    '2': {bg: '#fd7e14', color: 'fff'}, //Orange
                    '1': {bg: '#dc3545', color: 'fff'}, //Red
                };

                const styleInfo = gradeColors[text];
                if (styleInfo) {
                    el.innerHTML = `<span class="kreta-badge kreta-keep-color" style="background-color: ${styleInfo.bg}; color: ${styleInfo.color};">${text}</span>`;
                    el.dataset.kretaStyled = 'true';
                }
            }
        });
    }


    // initalize the button when the page loads
    setupDarkMode();
    enhancerGradesAndAverages();

    // 4. whatch for page updates (dynamic SPA navigation in Kreta)
    const observer = new MutationObserver(() => {
        enhancerGradesAndAverages();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })

})();