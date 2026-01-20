---
layout: default
title: Sponsor {{ site.project.title }}
permalink: /sponsor/
---

# Sponsor {{ site.project.title }}

{{ site.marketing.tagline }}

---

## What Your Support Enables

- **Multi-AI Harness Development** - Claude, Gemini, Codex integration
- **11-Agent Team** - Specialized agents for screenwriting, novels, film production
- **Pattern Libraries** - Story structure, scene, dialogue, character patterns
- **Template Maintenance** - Keeping the template current and well-documented
- **Community Support** - Helping creators use these tools effectively

---

## Monthly Sponsorship

Become an ongoing supporter and get recognition plus benefits.

| Tier | Amount | Benefits |
|------|--------|----------|
{% for tier in site.funding.monthly_tiers -%}
| **{{ tier.name }}** | ${{ tier.amount }}/mo | {{ tier.description }} |
{% endfor %}

<a href="{{ site.social.github_sponsors }}" class="btn btn-primary">Become a Sponsor on GitHub</a>

---

## One-Time Donations

Make a one-time contribution to support development.

| Tier | Amount | Benefits |
|------|--------|----------|
{% for tier in site.funding.onetime_tiers -%}
| **{{ tier.name }}** | ${{ tier.amount }} | {{ tier.description }} |
{% endfor %}

### Payment Options

- **PayPal**: [paypal.me/wordstofilmby]({{ site.social.paypal }})
- **Ko-fi**: [ko-fi.com/wordstofilmby]({{ site.social.kofi }})

---

## Current Sponsors

*Be the first sponsor and have your name here!*

---

## Enterprise & Custom Sponsorship

For enterprise sponsorship, custom integrations, or partnership opportunities:

**Email**: [{{ site.platform.contactEmail }}](mailto:{{ site.platform.contactEmail }})

---

## What We're Building

{{ site.marketing.oneSheet.synopsis }}

The WTFB ecosystem includes:

- **[story-systems-template](https://github.com/bybren-llc/story-systems-template)** - Multi-AI harness for creative projects
- **[wtfb-claude-marketplace](https://github.com/bybren-llc/wtfb-claude-marketplace)** - Plugin system for Claude Code
- **[wordstofilmby.com](https://wordstofilmby.com)** - Platform for creative project discovery

Your sponsorship directly supports open-source development that helps writers, filmmakers, and creative professionals work more effectively with AI tools.

---

<p align="center">
  <strong>Thank you for supporting creative technology!</strong><br>
  <em>{{ site.creators.primary.name }}</em>
</p>
