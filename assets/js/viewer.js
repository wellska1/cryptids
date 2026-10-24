(() => {
	'use strict';
	const img = document.getElementById('scan-image');
	if (!img) return;

	const stage = img.closest('.scan-stage') || img.closest('.scan-viewer');
	let scale = 1;
	const MIN_SCALE = 0.5;
	const MAX_SCALE = 2.25;

	const getFitScale = () => {
		if (!stage || !img.naturalWidth) return 1;
		const available = Math.max(1, stage.clientWidth - 24);
		return Math.min(1, available / img.naturalWidth);
	};

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
		if (!stage || !focus || !img.naturalWidth || !img.naturalHeight) {
			scale = getFitScale();
			apply();
			if (stage) {
				stage.scrollLeft = 0;
				stage.scrollTop = 0;
			}
			return;
		}

		const targetWidth = img.naturalWidth * focus.w;
		const targetHeight = img.naturalHeight * focus.h;

		// Fit the clipping box to the viewer with a small margin.
		const scaleX = (stage.clientWidth * 0.92) / targetWidth;
		const scaleY = (stage.clientHeight * 0.9) / targetHeight;
		scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min(scaleX, scaleY)));
		apply();

		const targetLeft = img.naturalWidth * focus.x * scale;
		const targetTop = img.naturalHeight * focus.y * scale;
		const padX = 20;
		const padY = 20;
		stage.scrollLeft = Math.max(0, targetLeft - padX);
		stage.scrollTop = Math.max(0, targetTop - padY);
	};

	document.getElementById('zoom-in')?.addEventListener('click', () => {
		scale = Math.min(MAX_SCALE, scale + 0.2);
		apply();
	});

	document.getElementById('zoom-out')?.addEventListener('click', () => {
		scale = Math.max(MIN_SCALE, scale - 0.2);
		apply();
	});

	document.getElementById('zoom-reset')?.addEventListener('click', () => {
		applyFocus();
	});

	const runInitialFocus = () => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				applyFocus();
			});
		});
	};

	if (img.complete) {
		runInitialFocus();
	} else {
		img.addEventListener('load', runInitialFocus, { once: true });
	}
})();
