// Progressive enhancements only. Site pages remain navigable without JavaScript.
(function(){
	'use strict';

	const links = Array.from(document.querySelectorAll('header nav a[href]'));
	if (!links.length) return;

	const normalize = (input) => {
		let path = String(input || '/');
		path = path.replace(/\/index\.html$/i, '/');
		if (!path.endsWith('/')) path += '/';
		return path.toLowerCase();
	};

	const pagePath = normalize(window.location.pathname);
	const navItems = links
		.map((link) => {
			const href = link.getAttribute('href');
			if (!href) return null;
			const url = new URL(href, window.location.origin);
			return {link, path: normalize(url.pathname)};
		})
		.filter(Boolean);

	let active = null;

	// 1) Prefer exact path matches.
	const exact = navItems.find((item) => item.path === pagePath);
	if (exact) {
		active = exact.link;
	} else {
		// 2) Otherwise, choose the longest non-root prefix match.
		let best = null;
		for (const item of navItems) {
			if (item.path === '/') continue;
			if (pagePath.startsWith(item.path) && (!best || item.path.length > best.path.length)) {
				best = item;
			}
		}
		if (best) active = best.link;
	}

	if (!active) {
		// 3) Fallback to the shortest nav path (typically Home/base section).
		const fallback = navItems.slice().sort((a, b) => a.path.length - b.path.length)[0];
		if (fallback) active = fallback.link;
	}

	if (active) {
		active.classList.add('active');
		active.setAttribute('aria-current', 'page');
	}
})();
