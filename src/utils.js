/**
 * @module Utils
 * @author Radim Brnka
 */

export function removeComments(text, report) {
    let comments1 = text.match(/\/\/.*$/gm) || [];
    let comments2 = text.match(/#.*$/gm) || [];
    let comments3 = text.match(/\/\*[\s\S]*?\*\//g) || [];
    let count = comments1.length + comments2.length + comments3.length;
    report.commentsRemoved = count;
    return text.replace(/\/\/.*$/gm, "").replace(/#.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

export function scrubSensitive(text, report) {
    let emailMatches = [];
    let emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    let match;
    while ((match = emailRegex.exec(text)) !== null) {
        emailMatches.push({value: match[0], index: match.index});
    }

    let ipMatches = [];
    let ipRegex = /\b\d{1,3}(?:\.\d{1,3}){3}\b/g;
    while ((match = ipRegex.exec(text)) !== null) {
        ipMatches.push({value: match[0], index: match.index});
    }

    let ssnMatches = [];
    let ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    while ((match = ssnRegex.exec(text)) !== null) {
        ssnMatches.push({value: match[0], index: match.index});
    }

    let phoneMatches = [];
    let phoneRegex = /\b(\+?\d{1,2}[ -]?)?(\(?\d{3}\)?[ -]?)?\d{3}[ -]?\d{4}\b/g;
    while ((match = phoneRegex.exec(text)) !== null) {
        phoneMatches.push({value: match[0], index: match.index});
    }

    let ccMatches = [];
    let ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
    while ((match = ccRegex.exec(text)) !== null) {
        ccMatches.push({value: match[0], index: match.index});
    }

    let hashMatches = [];
    let hashRegex = /\b[a-f0-9]{32,64}\b/gi;
    while ((match = hashRegex.exec(text)) !== null) {
        hashMatches.push({value: match[0], index: match.index});
    }

    let tokenMatches = [];
    let tokenRegex = /\b(?=[A-Za-z0-9]{20,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9]+\b/g;
    while ((match = tokenRegex.exec(text)) !== null) {
        tokenMatches.push({value: match[0], index: match.index});
    }

    // Detect complex/unusual strings (a mix of uppercase, lowercase, digits, symbols) with at least 12 characters.
    let passwordMatches = [];
    // This regex looks for any sequence of 12 or more characters that includes at least one uppercase letter, one lowercase letter, one digit, and one symbol.
    let complexPasswordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{12,}/g;
    while ((match = complexPasswordRegex.exec(text)) !== null) {
        passwordMatches.push({ value: match[0], index: match.index });
    }

    // Update the report with the total count of sensitive items.
    report.sensitiveFound =
        emailMatches.length +
        ipMatches.length +
        ssnMatches.length +
        phoneMatches.length +
        ccMatches.length +
        hashMatches.length +
        tokenMatches.length +
        passwordMatches.length;

    // Replace sensitive data with placeholders.
    return text
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]")
        .replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "[IP]")
        .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN]")
        .replace(/\b(\+?\d{1,2}[ -]?)?(\(?\d{3}\)?[ -]?)?\d{3}[ -]?\d{4}\b/g, "[PHONE]")
        .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[CC]")
        .replace(/\b[a-f0-9]{32,64}\b/gi, "[HASH]")
        .replace(/\b(?=[A-Za-z0-9]{20,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9]+\b/g, "[TOKEN]")
        .replace(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{12,}/g, "[PASSWORD]")
}


export function convertMarkdown(text) {
    return text.replace(/[#_*~`>!-]/g, "");
}

export function preserveFormatting(text) {
    return text.split("\n").map(line => line.trim().replace(/\s+/g, " ")).join("\n");
}

export function fullyMinimize(text) {
    return text.trim().replace(/\s+/g, " ");
}

export function getLabel(index) {
    let label = "";
    do {
        label = String.fromCharCode(65 + (index % 26)) + label;
        index = Math.floor(index / 26) - 1;
    } while (index >= 0);
    return label;
}

export function countTokens(text) {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
}

export function previewTokens(text) {
    const tokens = [];
    const rawTokens = text.match(/\S+/g) || [];
    rawTokens.forEach(token => {
        if (token.length > 6) {  // If the token is longer than 6 characters, split it
            const subTokens = token.match(/.{1,4}/g);  // Split into chunks of up to 4 characters
            tokens.push(...subTokens);
        } else {
            tokens.push(token);
        }
    });
    return tokens;
}

export function reduceWhitespace(text) {
    return text.replace(/\s+/g, " ");
}