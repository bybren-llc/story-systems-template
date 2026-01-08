---
layout: default
title: {{ site.project.title }}
---

# {{ site.project.title }}

{{ site.project.logline }}

---

## About

{{ site.marketing.oneSheet.synopsis }}

---

## Details

- **Status**: {{ site.project.status }}
- **Type**: {{ site.project.type }}
- **Genre**: {{ site.metadata.genres | join: ", " }}

---

## Team

**{{ site.creators.primary.role }}**: {{ site.creators.primary.name }}

---

## Contact

Interested in this project? [Get in touch](mailto:{{ site.platform.contactEmail }}).

---

*Powered by [Words To Film By](https://wordstofilmby.com)*
