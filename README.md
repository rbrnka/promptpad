# 📝 PromptPad
![Release](https://img.shields.io/github/v/release/rbrnka/promptpad)
![Status](https://img.shields.io/badge/Status-stable-darkgreen)
![https://github.com/rbrnka/promptpad?tab=MIT-1-ov-file](https://img.shields.io/github/license/rbrnka/fractal-traveler)
![GitHub Release Date](https://img.shields.io/github/release-date/rbrnka/promptpad)

PromptPad is a privacy-first workspace designed to optimize text and code for language model (LLM) processing. It allows you to quickly clean, minimize, and analyze your input, ensuring that it's concise, efficient, and cost-effective when used in a prompt. Whether you're working with plain text or source code, PromptPad provides a suite of smart tools to clean, anonymize, and audit prompts before you paste them into a chatbot without losing context or meaning.

> _"Prep, Protect, and Paste Smarter"_

---

## 🚀 Why PromptPad?
When you're copy-pasting prompts into ChatGPT, Claude, or another LLM, it's easy to overshare. PromptPad is your sanity check—and gives you a hand to keep your prompts clean, lean, and safe to share, without losing their soul.

## 🔑 Key Features

### 🔢 Token Counter & Stats
- Original input character count vs. Minimized character count
- Estimated token count, great for keeping your prompts under context limits.
- Token Cost Savings Estimate: The number of tokens saved multiplied by a typical cost of $0.00002 per token.

### 🧹 Choose exactly how your prompt gets cleaned:
- Turn on code-style formatting to make your cleaned prompts easier to read or document.
- Remove comments
- Scrub sensitive info
- Convert or flatten Markdown
- Minimize extra characters or preserve formatting

### 🔁 History & Batch Mode
Every processed prompt can be saved to your local history for reuse. Quickly copy from past entries or process multiple prompts at once.

### 🧠 Tokenization Preview
 See exactly how your prompt will be split into tokens.

### 👤 Name Anonymization
Automatically replaces names (e.g., "Alice" → "[A]", "Bob" → "[B]") so you can safely share prompts while keeping distinctions intact for internal decoding.

### Additional Tools
- Copy to Clipboard: Quickly copy the minimized text.
- Save to History: Save the current processed output for future reference.
- Preview Tokenization: Visualize how the text is split into tokens.

# Usage
1. Input Your Text/Code: Paste or type your prompt into the input textarea. Live stats show the current character and token counts.

2. Configure Settings: Use the checkboxes to select options such as comment removal, sensitive data scrubbing, and others.

3. Process Your Prompt: Click the Minimize button to process the input. The output textarea will update with the optimized text, and live stats for the output will be displayed below it.

4. View Summary:
A final summary will display the percentage reduction in characters and estimated token cost savings.

# Future Enhancements
- Highlighting PIIs
- Browser extension
- Integration with common chatbots
- Simple Login
  - to track saved token costs and summary of statistics

_(c) Radim Brnka, 2025_
