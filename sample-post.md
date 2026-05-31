---
author: Hari Shankar
title: Creating Markdown Parsers in Node.js
description: A look at how to build a regex-based lightweight markdown compiler in vanilla JavaScript.
tags: Node.js, Markdown, JavaScript, Compilers
github: hshankar08
---

# Creating Markdown Parsers in Node.js

Building a custom markdown compiler in vanilla Node.js is a rewarding exercise in regex parsing and text manipulation. While production sites should use robust libraries like `marked` or `markdown-it`, a simple custom builder can be coded with zero dependencies.

## The Strategy

Our parsing pipeline follows these distinct steps:
- **Protect Block Structures:** Isolate code blocks and other raw HTML from inline regex modifications.
- **Convert Block Elements:** Use regex patterns to identify blockquotes, headings, lists, and paragraphs.
- **Convert Inline Formatting:** Apply inline stylings like bold, italics, and inline code markers.
- **Reassemble:** Inject protected block elements back into the final HTML output.

## Sample Parsing Rules

Here is a look at a regex conversion block for headers:

```javascript
// Matches '## Subheading' and outputs '<h2>Subheading</h2>'
html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
```

> "Regex is powerful, but protect your code blocks first! Otherwise, formatting inside code blocks (like asterisks or backticks) will get mangled by the global inline parsing rules."

With this setup, you can compile clean articles dynamically on the fly!
