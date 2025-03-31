/**
 * @module Audit
 * @author Radim Brnka
 */

import { countTokens } from "./utils.js";
import { cachedNamesSet, cachedKeywordsSet } from "./assetsLoader.js";

// Audit the output text (which contains placeholders)
export function auditSecurity(text) {
    // Count placeholders for each sensitive category.
    const emails = text.match(/\[EMAIL\]/g) || [];
    const ips = text.match(/\[IP\]/g) || [];
    const ssns = text.match(/\[SSN\]/g) || [];
    const phones = text.match(/\[PHONE\]/g) || [];
    const ccs = text.match(/\[CC\]/g) || [];
    const hashes = text.match(/\[HASH\]/gi) || [];
    const tokens = text.match(/\[TOKEN\]/g) || [];
    const passwords = text.match(/\[PASSWORD\]/g) || [];

    // If anonymization is disabled, also capture potential names from the final text.
    let names = [];
    if (!document.getElementById('anonymizeNames').checked) {
        const nameRegex = /\b(\w+)\b/g;
        let match;
        while ((match = nameRegex.exec(text)) !== null) {
            let candidate = match[0];
            if ((/^[A-Z][a-z]+$/.test(candidate) || /^[A-Z]+$/.test(candidate)) && candidate.toLowerCase() !== "found") {
                let token = candidate.toLowerCase();
                if (cachedNamesSet.has(token) && !cachedKeywordsSet.has(token)) {
                    names.push({ value: candidate, index: match.index });
                }
            }
        }
    }

    const totalSensitive = emails.length + ips.length + ssns.length + phones.length + ccs.length +
        hashes.length + tokens.length + passwords.length;

    return {
        emails, ips, ssns, phones, ccs, hashes, tokens, passwords,
        names, totalSensitive, totalTokens: countTokens(text)
    };
}


export function calculateSecurityScore(audit) {
    // Subtracting points based on sensitive info found.
    let score = 100 - (audit.emails.length * 10 + audit.ips.length * 5 + audit.names.length);
    return Math.max(0, score);
}
