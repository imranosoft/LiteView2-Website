/* ============================================================================
   LiteView2 Object Model Reference — Shared JavaScript
   Sidebar, search, theme toggle, scroll spy, collapsible sections
   ============================================================================ */

(function () {
    'use strict';

    // ── Theme Toggle ────────────────────────────────────────────────────────
    const themeKey = 'lv2-docs-theme';

    function getPreferredTheme() {
        const stored = localStorage.getItem(themeKey);
        if (stored) return stored;
        return 'dark'; // default dark
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const btn = document.querySelector('.theme-toggle');
        if (btn) btn.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(themeKey, next);
        applyTheme(next);
    }

    // Apply theme immediately
    applyTheme(getPreferredTheme());

    // ── DOM Ready ───────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {

        // Theme toggle button
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            btn.addEventListener('click', toggleTheme);
        });

        // ── Mobile Sidebar Toggle ───────────────────────────────────────────
        var hamburger = document.querySelector('.hamburger');
        var sidebar = document.querySelector('.sidebar');
        var overlay = document.querySelector('.sidebar-overlay');

        function openSidebar() {
            if (sidebar) sidebar.classList.add('open');
            if (overlay) overlay.classList.add('open');
        }

        function closeSidebar() {
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('open');
        }

        if (hamburger) hamburger.addEventListener('click', openSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);

        // Close sidebar on nav link click (mobile)
        document.querySelectorAll('.sidebar .nav-link, .sidebar .page-link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 900) closeSidebar();
            });
        });

        // ── Collapsible Nav Groups ──────────────────────────────────────────
        document.querySelectorAll('.nav-group-title').forEach(function (title) {
            title.addEventListener('click', function () {
                this.parentElement.classList.toggle('collapsed');
            });
        });

        // ── Collapsible Content Sections ────────────────────────────────────
        document.querySelectorAll('.section-header').forEach(function (header) {
            header.addEventListener('click', function () {
                this.parentElement.classList.toggle('expanded');
            });
        });

        // ── Sidebar Search / Filter ─────────────────────────────────────────
        var searchInput = document.querySelector('.sidebar-search input');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                var query = this.value.toLowerCase().trim();
                var navLinks = document.querySelectorAll('.sidebar .nav-link');
                var navGroups = document.querySelectorAll('.sidebar .nav-group');

                if (!query) {
                    // Show everything
                    navLinks.forEach(function (l) { l.style.display = ''; });
                    navGroups.forEach(function (g) {
                        g.style.display = '';
                        g.classList.remove('collapsed');
                    });
                    return;
                }

                // Filter grouped nav links
                navGroups.forEach(function (group) {
                    var links = group.querySelectorAll('.nav-link');
                    var anyVisible = false;

                    links.forEach(function (link) {
                        var text = link.textContent.toLowerCase();
                        if (text.indexOf(query) !== -1) {
                            link.style.display = '';
                            anyVisible = true;
                        } else {
                            link.style.display = 'none';
                        }
                    });

                    group.style.display = anyVisible ? '' : 'none';
                    if (anyVisible) group.classList.remove('collapsed');
                });

                // Filter ungrouped nav links (e.g. enums page)
                navLinks.forEach(function (link) {
                    if (link.closest('.nav-group')) return; // already handled above
                    var text = link.textContent.toLowerCase();
                    link.style.display = text.indexOf(query) !== -1 ? '' : 'none';
                });
            });
        }

        // ── Scroll Spy (Active Section Highlighting) ────────────────────────
        var sections = document.querySelectorAll('[data-section-id]');
        var navLinks = document.querySelectorAll('.sidebar .nav-link[href^="#"]');

        if (sections.length > 0 && navLinks.length > 0) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var id = entry.target.getAttribute('data-section-id') ||
                                 entry.target.id;
                        navLinks.forEach(function (link) {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + id) {
                                link.classList.add('active');
                                // Scroll active link into sidebar view
                                link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                            }
                        });
                    }
                });
            }, {
                rootMargin: '-' + (parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--header-height')) || 52) + 'px 0px -60% 0px',
                threshold: 0
            });

            sections.forEach(function (sec) { observer.observe(sec); });
        }

        // ── Back to Top Button ──────────────────────────────────────────────
        var backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 400) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ── Expand section from URL hash ────────────────────────────────────
        if (window.location.hash) {
            var target = document.querySelector(window.location.hash);
            if (target) {
                var section = target.closest('.collapsible-section');
                if (section) section.classList.add('expanded');
                setTimeout(function () {
                    target.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }

        // ── Expand section when clicking sidebar link ───────────────────────
        document.querySelectorAll('.sidebar .nav-link[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var hash = this.getAttribute('href');
                var target = document.querySelector(hash);
                if (target) {
                    var section = target.closest('.collapsible-section');
                    if (section && !section.classList.contains('expanded')) {
                        section.classList.add('expanded');
                    }
                }
            });
        });

        // ── "Expand All" / "Collapse All" Buttons ───────────────────────────
        document.querySelectorAll('.expand-all-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var sections = document.querySelectorAll('.collapsible-section');
                var allExpanded = true;
                sections.forEach(function (s) {
                    if (!s.classList.contains('expanded')) allExpanded = false;
                });
                sections.forEach(function (s) {
                    if (allExpanded) {
                        s.classList.remove('expanded');
                    } else {
                        s.classList.add('expanded');
                    }
                });
                btn.textContent = allExpanded ? 'Expand All' : 'Collapse All';
            });
        });

        // ── Global Search ────────────────────────────────────────────────────
        var globalInput = document.querySelector('.global-search-input');
        var globalResults = document.querySelector('.global-search-results');
        var globalKbd = document.querySelector('.search-kbd');
        var searchIndex = null;
        var activeResultIdx = -1;

        var pageLabels = {
            'iliteview2ctrl.html': 'ILiteView2Ctrl',
            'ibrowserpool.html': 'IBrowserPool',
            'events.html': 'Events',
            'enums.html': 'Enums'
        };

        function loadSearchIndex(cb) {
            if (searchIndex) return cb(searchIndex);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'search-index.json', true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    searchIndex = JSON.parse(xhr.responseText);
                    cb(searchIndex);
                }
            };
            xhr.send();
        }

        function highlightMatch(text, query) {
            var idx = text.toLowerCase().indexOf(query.toLowerCase());
            if (idx === -1) return text;
            return text.substring(0, idx) + '<mark>' + text.substring(idx, idx + query.length) + '</mark>' + text.substring(idx + query.length);
        }

        function renderResults(results, query) {
            activeResultIdx = -1;
            if (results.length === 0) {
                globalResults.innerHTML = '<div class="search-no-results">No results for "' + query.replace(/</g, '&lt;') + '"</div>';
                globalResults.classList.add('visible');
                return;
            }
            var html = '';
            results.forEach(function (r, i) {
                var url = r.p;
                // Build anchor: for same page use hash, for other pages use full URL
                var currentPage = window.location.pathname.split('/').pop() || 'index.html';
                var nameId = r.n.replace(/[^a-zA-Z0-9_]/g, '');
                html += '<a class="search-result" href="' + url + '" data-idx="' + i + '">' +
                    '<span class="search-result-name">' + highlightMatch(r.n, query) + '</span>' +
                    '<span class="search-result-desc">' + highlightMatch(r.d, query) + '</span>' +
                    '<span class="search-result-meta">' + (pageLabels[r.p] || r.p) + ' &rsaquo; ' + r.s + '</span>' +
                    '</a>';
            });
            globalResults.innerHTML = html;
            globalResults.classList.add('visible');
        }

        function doSearch(query) {
            if (!query) {
                globalResults.classList.remove('visible');
                globalResults.innerHTML = '';
                return;
            }
            loadSearchIndex(function (index) {
                var q = query.toLowerCase();
                var nameMatches = [];
                var descMatches = [];
                index.forEach(function (item) {
                    if (item.n.toLowerCase().indexOf(q) !== -1) {
                        nameMatches.push(item);
                    } else if (item.d.toLowerCase().indexOf(q) !== -1) {
                        descMatches.push(item);
                    }
                });
                // Name matches first, then description matches, max 20
                var results = nameMatches.concat(descMatches).slice(0, 20);
                renderResults(results, query);
            });
        }

        if (globalInput) {
            globalInput.addEventListener('input', function () {
                doSearch(this.value.trim());
            });

            globalInput.addEventListener('focus', function () {
                if (globalKbd) globalKbd.style.display = 'none';
                if (this.value.trim()) doSearch(this.value.trim());
            });

            globalInput.addEventListener('blur', function () {
                setTimeout(function () {
                    globalResults.classList.remove('visible');
                    if (globalKbd && !globalInput.value) globalKbd.style.display = '';
                }, 200);
            });

            // Keyboard navigation
            globalInput.addEventListener('keydown', function (e) {
                var items = globalResults.querySelectorAll('.search-result');
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    activeResultIdx = Math.min(activeResultIdx + 1, items.length - 1);
                    items.forEach(function (el, i) { el.classList.toggle('active', i === activeResultIdx); });
                    if (items[activeResultIdx]) items[activeResultIdx].scrollIntoView({ block: 'nearest' });
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    activeResultIdx = Math.max(activeResultIdx - 1, 0);
                    items.forEach(function (el, i) { el.classList.toggle('active', i === activeResultIdx); });
                    if (items[activeResultIdx]) items[activeResultIdx].scrollIntoView({ block: 'nearest' });
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (activeResultIdx >= 0 && items[activeResultIdx]) {
                        items[activeResultIdx].click();
                    } else if (items.length > 0) {
                        items[0].click();
                    }
                } else if (e.key === 'Escape') {
                    globalResults.classList.remove('visible');
                    globalInput.blur();
                }
            });

            // "/" keyboard shortcut to focus search
            document.addEventListener('keydown', function (e) {
                if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    var tag = (e.target.tagName || '').toLowerCase();
                    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
                    e.preventDefault();
                    globalInput.focus();
                }
            });
        }

        // Close results on outside click
        document.addEventListener('click', function (e) {
            if (globalResults && !e.target.closest('.global-search')) {
                globalResults.classList.remove('visible');
            }
        });
    });

})();
