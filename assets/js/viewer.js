(() => {
	'use strict';
	const img = document.getElementById('scan-image');
	if (!img) return;

	const viewer = img.closest('.scan-viewer');
	let scale = 1;

	const parseFocus = () => {
		const raw = img.getAttribute('data-focus');
		if (!raw) return null;
		const parts = raw.split(',').map((v) => Number(v.trim()));
		if (parts.length !== 4 || parts.some((v) => Number.isNaN(v))) return null;
		const [x, y, w, h] = parts;
		if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > 1 || y + h > 1) return null;
		return { x, y, w, h };
	};

	const focus = parseFocus();

	const apply = () => {
		img.style.transform = `scale(${scale})`;
		img.style.transformOrigin = 'top left';
	};

	const applyFocus = () => {
		if (!viewer || !focus || !img.naturalWidth || !img.naturalHeight) {
			scale = 1;
			apply();
			if (viewer) {
				viewer.scrollLeft = 0;
				viewer.scrollTop = 0;
			}
			return;
		}

		const targetWidth = img.naturalWidth * focus.w;
		const targetHeight = img.naturalHeight * focus.h;

		// Fit the clipping box to the viewer with a small margin.
		const scaleX = (viewer.clientWidth * 0.92) / targetWidth;
		const scaleY = (viewer.clientHeight * 0.88) / targetHeight;
		scale = Math.max(0.5, Math.min(4, Math.min(scaleX, scaleY)));
		apply();

		const targetLeft = img.naturalWidth * focus.x * scale;
		const targetTop = img.naturalHeight * focus.y * scale;
		const padX = 16;
		const padY = 16;
		viewer.scrollLeft = Math.max(0, targetLeft - padX);
		viewer.scrollTop = Math.max(0, targetTop - padY);
	};

	document.getElementById('zoom-in')?.addEventListener('click', () => {
		scale = Math.min(4, scale + 0.25);
		apply();
	});

	document.getElementById('zoom-out')?.addEventListener('click', () => {
		scale = Math.max(0.5, scale - 0.25);
		apply();
	});

	document.getElementById('zoom-reset')?.addEventListener('click', () => {
		applyFocus();
	});

	if (img.complete) {
		applyFocus();
	} else {
		img.addEventListener('load', applyFocus, { once: true });
	}
})();
