# Security model

The public site consists solely of generated HTML, CSS, JavaScript, JSON, and media. No database, dynamic web server framework, Ruby interpreter, login system, or upload handler is required on the public host.

Threats that remain: compromised deployment credentials, vulnerable third-party JS/CDN assets, malicious content in edited files, XSS introduced through unsafe templates, build-pipeline compromise, host misconfiguration, and copyright/privacy exposure. Maintain a lockfile, review dependency updates, and keep the build separate from the public host.

External assets currently used: Google Fonts, Leaflet CSS/JS from unpkg with integrity hashes, and CARTO tiles. For stronger privacy and reliability, self-host static assets and consider a locally hosted map alternative.

Do not publish exact addresses of private witnesses or copyrighted images without permission. Original document uploads should be curated offline and committed only after rights review.
