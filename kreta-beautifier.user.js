// ==UserScript==
// @name Kreta Beautifier & Dark Mode
// @namespace https://tempermonkey.net/
// @version 1.0
// @description Adds Dark Mode, color-coded grades, and highlights low subject averagers in e-Kreta
// @author mpeti1234
// @metch https://*.e-kreta.hu/*
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

    
}
)