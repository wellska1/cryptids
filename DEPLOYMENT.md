# Traditional static hosting deployment

## 1. Build on your own computer or trusted CI

Install Ruby, Bundler, and a supported compiler toolchain. In the repository:

```bash
bundle install
JEKYLL_ENV=production bundle exec jekyll build
```

For reproducible releases, **commit the generated Gemfile.lock** after the first successful bundle install and use `bundle config set frozen true` in CI. The project archive does not include a lockfile because gem resolution has not been executed here.

## 2. Set the site URL

In `_config.yml`, set `url: "https://your-domain.example"` and `baseurl: ""` for a root-domain deployment. For a subfolder deployment, set `baseurl: "/your-subfolder"` and rebuild. All map and evidence URLs are generated with `relative_url`.

## 3. Upload only the static build

Upload the **contents** of `_site/` to your host's public document root, usually `public_html/`, `htdocs/`, or `www/`. Use SFTP or the host's file manager. Do not upload `_config.yml`, `.git`, `_data`, source Markdown, Gemfile, `vendor/`, or the entire repository.

For a release archive:

```bash
bash scripts/package.sh
```

This packages `_site/` after a successful build.

## 4. Verify

- Homepage, cryptid pages, investigation pages, map, and evidence library load.
- `data/sightings.json` and `data/evidence.json` return JSON.
- Map tiles and Leaflet load in the browser (requires internet access).
- HTTPS is enforced and certificate is valid.
- Unknown URLs return 404; directory listings are disabled by the host.
- Build/source files are not present in the public document root.

## 5. Optional hardening

- Set HTTPS-only redirects and HSTS after verifying HTTPS.
- Add `Content-Security-Policy` headers at your host or CDN; account for tile and font domains. For stricter CSP, vendor assets and avoid inline scripts.
- Use read-only deployment credentials with minimum required permissions.
- Update and audit Ruby gems and client-side libraries periodically.
- Configure backups and deploy to a staging path first.
- Consider a separate build user and never build Jekyll inside the public document root.

## Static hosting caveat

There is no submission form or CMS in this version. New sightings can be submitted through a separate moderated email workflow and added by editing Markdown/YAML. Do not add a public upload endpoint to the static host.
