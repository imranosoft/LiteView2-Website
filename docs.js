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
    });

})();
