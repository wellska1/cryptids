# Source and citation standards

Every public evidence record must have a unique ID, associated investigation, citation, source type, research status, provenance notes, and rights assessment. Bibliographic leads are not verified original scans.

## Attaching an original document

1. Obtain an original scan from a library, public archive, or rights holder. Check reuse permissions before adding the file to `assets/documents/`.
2. Confirm title, author (if known), newspaper, publication date, edition and page directly against the original. Replace any generic publisher link with a stable item-level URL.
3. Update `_data/evidence.yml`: set `media_path` to the public relative path; `original_document_verified: true` only after inspection; set `citation_status` to `Verified against original`; add `rights`, `access_note`, and `annotations`.
4. Add a transcription only when verified against the original. Preserve uncertainty and indicate illegible passages. Do not silently reconstruct missing text.
5. Link any specific claim to its evidence ID in the investigation Markdown, e.g. `[Newspaper report]({{ '/evidence/e001/' | relative_url }})` (Liquid links work in Jekyll Markdown).
6. Use a **separate** evidence record for each independent newspaper, interview, photograph, or official report. Syndicated reprints are not independent eyewitnesses.

## Citation conventions

Newspapers: Author (if known), “Headline,” *Newspaper*, city, full date, page, stable archive URL and access date.
Interviews: Witness (consent permitting), interviewer, date, format, holding archive, and consent/rights terms.
Photos: Photographer, date, place, original file or negative provenance, modifications, license and chain of custody.
Folklore: Earliest traceable publication or explicitly mark oral tradition as undated.

**Publication policy:** Never label a creature as scientifically confirmed; never present generated illustrations as evidence; redact precise private locations and personal data. Do not embed third-party images without permission.
