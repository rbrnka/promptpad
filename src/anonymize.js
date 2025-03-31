/**
 * @module Anonymize
 * @author Radim Brnka
 */

import {getLabel} from "./utils.js";
import {cachedKeywordsSet, cachedNamesSet} from "./assetsLoader.js";

function isName(token) {
    return /^[A-Z][a-z]+$/.test(token) || /^[A-Z]+$/.test(token);
}

export function anonymizeNames(text, report) {
    const mapping = {};
    let nextIndex = 0;

    // Split text while preserving whitespace.
    let parts = text.split(/(\s+)/);
    let resultParts = [];
    let currentGroup = [];

    for (let part of parts) {
        if (/^\s+$/.test(part)) {
            if (currentGroup.length > 0) {
                let groupKey = currentGroup.join(" ").toLowerCase();
                if (!(groupKey in mapping)) {
                    mapping[groupKey] = getLabel(nextIndex);
                    nextIndex++;
                }
                resultParts.push(mapping[groupKey]);
                currentGroup = [];
            }
            resultParts.push(part);
        } else {
            if (isName(part) && cachedNamesSet.has(part.toLowerCase()) && !cachedKeywordsSet.has(part.toLowerCase())) {
                currentGroup.push(part);
            } else {
                if (currentGroup.length > 0) {
                    let groupKey = currentGroup.join(" ").toLowerCase();
                    if (!(groupKey in mapping)) {
                        mapping[groupKey] = getLabel(nextIndex);
                        nextIndex++;
                    }
                    resultParts.push(mapping[groupKey]);
                    currentGroup = [];
                }
                resultParts.push(part);
            }
        }
    }
    if (currentGroup.length > 0) {
        let groupKey = currentGroup.join(" ").toLowerCase();
        if (!(groupKey in mapping)) {
            mapping[groupKey] = "[" + getLabel(nextIndex) + "]";
        }
        resultParts.push(mapping[groupKey]);
    }
    report.namesAnonymized = Object.keys(mapping).length;
    report.namesMapping = mapping;
    return resultParts.join("");
}
