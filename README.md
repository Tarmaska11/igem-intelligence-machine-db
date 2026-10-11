# iGEM Intelligence Machine - database

This repository is the **content** behind https://tarmaska11.github.io/igem-intelligence-machine/

The website itself is frozen (it has to be - iGEM locks competition repositories after the
deadline). Everything you might want to change afterwards lives here instead. Edit a file,
commit, and the live site picks it up within about ten minutes.

> **Do not rename or delete this repository.** Its URL is compiled into the frozen website.
> If it goes away the site still works, but it falls back to the 2008-2025 archive built into
> it and stops seeing anything you publish here.

---

## What you can change, and where

| file | what it controls |
|---|---|
| `site.json` | the headline, the text and search-box hint on the home page, the numbers under the search box, the extra button in the navigation bar, the footer, and the Ask AI chat (its instructions and the services offered) |
| `posts.json` | the blog on the home page |
| `pages/custom.html` | the page that extra button opens - plain HTML and CSS, yours to write |
| `cards / records / index / facets / parts / meta .json.gz` | the search data itself |
| `manifest.json` | version and checksums; the site reads this first |
| `fulltext/` | the wiki-text search index and the saved wiki text |

### `site.json`

```json
{
  "hero":        { "year_range": "", "title": "", "text": "", "placeholder": "" },
  "stats":       { "segments": [] },
  "nav_button":  { "enabled": true, "label": "Database", "page": "pages/custom.html" }
}
```

An empty string keeps the site's built-in wording.

- `year_range` - the highlighted range in "across **2008-2025**". Leave it empty and the site
  shows the range of the data it actually loaded.
- `title` - the big headline, plain text.
- `text` - the paragraph under the headline. HTML is allowed (`b i strong em br a`), e.g.
  `"Find prior teams by idea or failure - across <b>{{year_range}}</b>."`
- `placeholder` - the grey hint inside the search box.
- `stats.segments` - leave as `[]` and the site counts everything itself. Put strings in it
  to override, e.g. `["{{projects}} projects", "{{years}} years", "and counting"]`.
- `nav_button` - set `enabled` to `false` to hide the button, or change its `label` and the
  `page` it opens.
- `footer` - the strip at the bottom of every page:

```json
"footer": {
  "enabled": true,
  "note": "A search over every iGEM project, 2008-2025. Made for future iGEMers.",
  "links": [
    { "prefix": "Creator: ", "label": "@tarmaska_11", "url": "https://www.instagram.com/tarmaska_11/" },
    { "prefix": "Team: ", "label": "Latvia-Riga", "url": "https://www.instagram.com/igemlv/" },
    { "label": "Source code", "url": "https://github.com/Tarmaska11/igem-intelligence-machine" },
    { "label": "MIT licence", "url": "https://opensource.org/licenses/MIT" }
  ],
  "legal": "Code under the MIT licence. Project summaries are derived from each team's own public wiki and belong to those teams.",
  "copyright": "© 2026"
}
```

`note` and `legal` can use the placeholders below. `prefix` is optional plain text shown before the link, so "Creator: @tarmaska_11" has only
the name clickable. Only `http`/`https` URLs become links; anything else shows as plain text.

The footer also shows **Last updated**, taken from this repository's own `Last-Modified`
header. It moves by itself every time anything here is republished - there is nothing to
edit and nothing to keep in sync. Set
`enabled` to `false` to hide the footer. The site ships with this same wording built in, so
it still reads correctly if this repository is unreachable.

### Numbers that update themselves

Anywhere in `site.json` texts, `posts.json` and `pages/custom.html` you can write these, and
the site fills them in from the data it loaded:

| placeholder | becomes |
|---|---|
| `{{projects}}` | the number of projects, e.g. 4,978 |
| `{{year_range}}` | e.g. 2008-2025 (or `hero.year_range` if you set one) |
| `{{first_year}}`, `{{last_year}}` | e.g. 2008 and 2025 |
| `{{years}}` | how many competition years, e.g. 18 |
| `{{molecules}}`, `{{chassis}}`, `{{techniques}}`, `{{parts}}` | distinct names in the summaries |

So after adding a new season nothing has to be edited by hand. An unknown name such as
`{{teams}}` is left as it is.

### `site.json` → `ai`: the Ask AI chat

`instructions` is what the AI is told before the project's material, e.g. "You answer
questions about one iGEM team project, using only the material below." Leave it empty for the
built-in text.

The services in the chat's **Provider** list, their models, the line under the list and the
ⓘ "how to get a key" text all come from here. If a service changes its free tier or shuts
down, edit or remove its entry - the site itself never has to change.

```json
"ai": {
  "default": "gemini",
  "instructions": "",
  "providers": [
    { "id": "gemini", "label": "Google Gemini", "format": "gemini",
      "base": "https://generativelanguage.googleapis.com/v1beta",
      "models": ["gemini-2.5-flash", "gemini-2.5-pro"],
      "note": "Uses your own Google AI Studio key, free tier.",
      "key_placeholder": "Paste your Google AI Studio API key",
      "help": "<b>Get a free key:</b><br>1. Open <a href='https://aistudio.google.com/apikey'>aistudio.google.com/apikey</a> …",
      "context_chars": 120000 }
  ]
}
```

- `format` - how the site talks to the service. Only three exist, and the frozen site can't
  learn new ones, but between them they cover almost everything:
  - `gemini` - Google's Gemini API.
  - `openai` - any service with an OpenAI-style `/chat/completions` endpoint: OpenAI, Groq,
    OpenRouter, Mistral, DeepSeek, Together, a local LM Studio and many more.
  - `anthropic` - Anthropic's Claude API.
- `base` - the API address without the last part (`/chat/completions`, `/messages` or
  `/models/...`). It has to start with `https://`. The service must accept requests sent
  straight from a web page. The big ones do; check before adding a new one.
- `models` - the choices in the Model list. Visitors can always type another name under
  **Other model…**, so a renamed model never locks them out.
- `context_chars` - how much of the wiki text is sent (default 120000 characters, roughly
  30 000 tokens). Lower it for services with small limits; Groq's free tier is set to 20000.
- `help` - HTML for the ⓘ box. Allowed: `b i strong em br a p ul ol li`. Links must be
  `https`, and anything else (scripts, `onclick`, …) is removed.
- `note`, `label`, `key_placeholder` - plain text.
- `default` - the `id` picked for a first-time visitor.
- `custom: true` marks the **Other** entry, where the visitor types their own API address.
  It is added automatically unless `"allow_custom": false` is set next to `providers`.

Every service gets exactly the same material: the project's summary, problem, approach, key
results and failure modes, then its full saved wiki text. Entries with an unknown `format` or
a bad address are skipped, and if none are left the site falls back to its built-in list.
Visitors' keys are stored in their own browser, separately for each service address, so
changing an entry here can never send a key to a different service.

### `posts.json`

```json
{ "posts": [
  { "title": "…", "author": "…", "date": "2026-09-13",
    "image": "", "abstract": "one or two sentences",
    "pinned": false,
    "body": "<p>HTML. Allowed: p h3 h4 ul ol li b i strong em blockquote a code pre br hr img figure figcaption.</p>" }
] }
```

Newest first. `pinned: true` floats a post to the top whatever its date. Leave `image` empty
for a generated lab-paper placeholder. Pictures can go in `posts/` and be linked with their
full address, e.g. `https://tarmaska11.github.io/igem-intelligence-machine-db/posts/name.webp`. Anything outside the allowed tag list is stripped when
the page renders it, so a broken post cannot break the site.

---

## Adding a new competition year

The search data is generated, not hand-edited. In the website repository:

```
python pipeline/build.py --fulltext      # rebuild everything from the raw sources
python pipeline/lsa.py                   # the concept-search model (numpy + scipy)
```

To rebuild from this repository instead (same output, nothing else needed), add
`--from-db <path to this repository>` to both commands.

then copy `dist-data/` over this repository and commit. Two rules:

1. **Copy all of it together.** `fulltext/` and `lsa.json.gz` refer to records by position, so
   mixing a new index with old bundles would point results at the wrong teams. `manifest.json`
   records the record count and the site refuses a mismatch - but do not rely on that.
2. **Do not change `schema` in `manifest.json`.** The frozen site only accepts the shape it was
   built for; a different number makes it ignore this repository entirely and use its built-in
   archive. That is the safety net, and it is deliberate.

## Licence

MIT for the code that reads this data. The wiki content summarised here belongs to the
respective iGEM teams.
