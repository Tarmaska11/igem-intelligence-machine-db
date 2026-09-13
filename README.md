# iGEM Intelligence Machine — database

This repository is the **content** behind https://tarmaska11.github.io/igem-intelligence-machine/

The website itself is frozen (it has to be — iGEM locks competition repositories after the
deadline). Everything you might want to change afterwards lives here instead. Edit a file,
commit, and the live site picks it up within about ten minutes.

> **Do not rename or delete this repository.** Its URL is compiled into the frozen website.
> If it goes away the site still works, but it falls back to the 2008-2025 archive built into
> it and stops seeing anything you publish here.

---

## What you can change, and where

| file | what it controls |
|---|---|
| `site.json` | the year range in the headline, the numbers under the search box, and the extra button in the navigation bar |
| `posts.json` | the blog on the home page |
| `pages/custom.html` | the page that extra button opens — plain HTML and CSS, yours to write |
| `cards / records / index / facets / parts / meta .json.gz` | the search data itself |
| `manifest.json` | version and checksums; the site reads this first |
| `fulltext/` | the wiki-text search index and the saved wiki text |

### `site.json`

```json
{
  "hero":        { "year_range": "2008-2025" },
  "stats":       { "segments": [] },
  "nav_button":  { "enabled": true, "label": "Database", "page": "pages/custom.html" },
  "parts_button": false
}
```

- `year_range` — the highlighted range in "across **2008-2025**".
- `stats.segments` — leave as `[]` and the site counts everything itself. Put strings in it
  to override, e.g. `["4 978 projects", "18 years", "and counting"]`.
- `nav_button` — set `enabled` to `false` to hide the button, or change its `label` and the
  `page` it opens.
- `parts_button` — set `true` to show the biological-parts registry in the navigation bar.

### `posts.json`

```json
{ "posts": [
  { "title": "…", "author": "…", "date": "2026-09-13",
    "image": "", "abstract": "one or two sentences",
    "pinned": false,
    "body": "<p>HTML. Allowed: p h3 h4 ul ol li strong em blockquote a code pre br hr img.</p>" }
] }
```

Newest first. `pinned: true` floats a post to the top whatever its date. Leave `image` empty
for a generated lab-paper placeholder. Anything outside the allowed tag list is stripped when
the page renders it, so a broken post cannot break the site.

---

## Adding a new competition year

The search data is generated, not hand-edited. In the website repository:

```
python pipeline/build.py --fulltext      # rebuild everything
python pipeline/lsa.py                   # optional: the concept-search model
```

then copy `dist-data/` over this repository and commit. Two rules:

1. **Copy all of it together.** `fulltext/` and `lsa.json.gz` refer to records by position, so
   mixing a new index with old bundles would point results at the wrong teams. `manifest.json`
   records the record count and the site refuses a mismatch — but do not rely on that.
2. **Do not change `schema` in `manifest.json`.** The frozen site only accepts the shape it was
   built for; a different number makes it ignore this repository entirely and use its built-in
   archive. That is the safety net, and it is deliberate.

## Licence

MIT for the code that reads this data. The wiki content summarised here belongs to the
respective iGEM teams.
