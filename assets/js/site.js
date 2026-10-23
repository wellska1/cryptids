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

	let active = null;
	for (const link of links) {
		const href = link.getAttribute('href');
		if (!href) continue;
		const url = new URL(href, window.location.origin);
		const linkPath = normalize(url.pathname);

		if (linkPath === '/' && pagePath !== '/') continue;
		if (linkPath !== '/' && pagePath.startsWith(linkPath)) {
			active = link;
			break;
		}
		if (linkPath === pagePath) {
			active = link;
			break;
		}
	}

	if (!active && pagePath === '/') {
		active = links.find((a) => normalize(new URL(a.getAttribute('href'), window.location.origin).pathname) === '/');
	}

	if (active) {
		active.classList.add('active');
		active.setAttribute('aria-current', 'page');
	}
})();
