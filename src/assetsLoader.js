/**
 * @module AssetsLoader
 * @author Radim Brnka
 */

export let cachedNames = [];
export let cachedNamesSet = new Set();
export let cachedKeywords = [];
export let cachedKeywordsSet = new Set();

export async function loadAssets() {
    return Promise.all([
        fetch('assets/first-names.txt').then(res => res.text()).then(text =>
            text.split(/\r?\n/).map(name => name.trim()).filter(name => name)
        ),
        fetch('assets/last-names.txt').then(res => res.text()).then(text =>
            text.split(/\r?\n/).map(name => name.trim()).filter(name => name)
        ),
        fetch('assets/keywords.txt').then(res => res.text()).then(text =>
            text.split(/\r?\n/).map(keyword => keyword.trim().toLowerCase()).filter(keyword => keyword)
        )
    ]).then(([firstNames, lastNames, keywords]) => {
        cachedNames = [...firstNames, ...lastNames].map(name => name.toLowerCase());
        cachedNamesSet = new Set(cachedNames);
        cachedKeywords = keywords;
        cachedKeywordsSet = new Set(cachedKeywords);
        console.log("Loaded names:", cachedNames);
        console.log("Loaded keywords:", cachedKeywords);
    }).catch(error => {
        console.error("Error loading assets", error);
        cachedNames = ["john", "jane", "michael", "sarah"];
        cachedNamesSet = new Set(cachedNames.map(n => n.toLowerCase()));
        cachedKeywords = [];
        cachedKeywordsSet = new Set();
    });
}
