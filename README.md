# Ohio Cryptid Atlas

An evidence-first, immersive Jekyll site for traditional static hosting. **The repository is the content management system.** There is no backend, database, user login, server-side application code, or API.

## Quick start

Requirements: Ruby 3.1+ (Ruby 3.2 or 3.3 recommended), Bundler, Git. The Jekyll 4.4 dependency is installed through Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000`.

Production build:

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

Upload **the contents** of `_site/` to your static host's document root. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Where content lives

- `_cryptids/*.md` — cryptid profile pages
- `_investigations/*.md` — individual investigation pages and timelines
- `_data/sightings.yml` — approximate map locations and links
- `_data/evidence.yml` — source metadata and research status
- `assets/css/site.css` — site design
- `assets/js/map.js` — Leaflet map and filters
- `assets/js/evidence.js` — searchable evidence index
- `data/*.json` — Jekyll-generated public indexes

To add a case, create its Markdown file, update the sightings YAML and add evidence records. Ensure `slug` values match across files.

## Research and privacy

All included content is sample research material, **not a fully verified primary-source archive**. No authentic historical scans or witness photographs are bundled. Obtain permission before hosting copyrighted material. Approximate markers must not be mistaken for exact sightings.

## Offline and privacy notes

The site is entirely static but the default map loads Leaflet assets from unpkg and tiles from CARTO/OpenStreetMap, and fonts from Google Fonts. To eliminate external dependencies, vendor the Leaflet CSS/JS and fonts and host your own map tiles (or use a self-hosted map image). No third-party analytics or tracking scripts are included.

## License

Source code is offered as a starter template; review third-party library licenses and obtain rights for any added content and media.

## Version 3 — evidence dossiers

Every evidence record now has its own static URL at `/evidence/e001/`, etc. The dossier shows an archival scan viewer (when a licensed scan is supplied), a verified transcription (when available), provenance, citation, research status, and rights notes. No placeholder artwork is misrepresented as an original scan. See `RESEARCH-STANDARDS.md` for the process of adding verified primary sources.

## Newly linked archival references

See `SOURCES-ADDED.md` for source URLs, corrections, and verification limits. Evidence records are maintained in `_data/evidence.yml`.
