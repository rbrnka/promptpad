/**
 * @module Main
 * @author Radim Brnka
 */

import 'regenerator-runtime/runtime'; // For async/await support if needed
import {loadAssets} from "./assetsLoader.js";
import {
    removeComments,
    scrubSensitive,
    convertMarkdown,
    preserveFormatting,
    fullyMinimize,
    reduceWhitespace,
    countTokens,
    previewTokens
} from "./utils.js";
import {anonymizeNames} from "./anonymize.js";
import {auditSecurity, calculateSecurityScore} from "./audit.js";

// Global history array.
let historyList = [];

// Load external assets.
await loadAssets();

window.onbeforeunload = function () {
    const inputText = document.getElementById('inputText').value.trim();
    const outputText = document.getElementById('outputText').value.trim();
    if (inputText !== "" || outputText !== "") {
        return "Are you sure you want to leave the page?";
    }
};


// Update input stats live.
function updateInputStats() {
    const inputText = document.getElementById('inputText').value;
    const charCount = inputText.length;
    const tokenCount = countTokens(inputText);
    document.getElementById('inputStats').innerHTML = `
    <p>Input Characters: ${charCount} &middot; Input Tokens: ${tokenCount}</p>
  `;
}

function updateOutputButtons() {
    const outputText = document.getElementById('outputText').value;
    const copyBtn = document.getElementById('copyBtn');
    const historyBtn = document.getElementById('saveHistoryBtn');
    if (outputText.trim() === "") {
        copyBtn.disabled = true;
        historyBtn.disabled = true;
    } else {
        copyBtn.disabled = false;
        historyBtn.disabled = false;
    }
}

/**
 * Main prompt processing function.
 */
function processPrompt() {
    let report = {commentsRemoved: 0, sensitiveFound: 0, namesAnonymized: 0, namesMapping: {}};
    let originalText = document.getElementById('inputText').value;
    let processedText = originalText;
    const originalLength = originalText.length;
    const originalTokens = countTokens(originalText);

    if (document.getElementById('removeComments').checked) {
        processedText = removeComments(processedText, report);
    }
    if (document.getElementById('scrubSensitive').checked) {
        processedText = scrubSensitive(processedText, report);
    }
    if (document.getElementById('convertMarkdown').checked) {
        processedText = convertMarkdown(processedText);
    }
    if (document.getElementById('anonymizeNames').checked) {
        processedText = anonymizeNames(processedText, report);
    }
    if (document.getElementById('preserveFormatting').checked) {
        processedText = preserveFormatting(processedText);
    } else {
        processedText = fullyMinimize(processedText);
    }

    if (document.getElementById('reduceWhitespace').checked) {
        processedText = reduceWhitespace(processedText);
    }

    document.getElementById('outputText').value = processedText;
    const minimizedLength = processedText.length;
    const minimizedTokens = countTokens(processedText);
    document.getElementById('outputStats').innerHTML = `
    <p>Output Characters: ${minimizedLength} &middot; Output Tokens: ${minimizedTokens}</p>
  `;

    const charReduction = originalLength > 0 ? (((originalLength - minimizedLength) / originalLength) * 100).toFixed(2) : 0;
    const tokenSavings = originalTokens - minimizedTokens;
    const costPerToken = 0.00002;
    const costSavings = (tokenSavings * costPerToken).toFixed(6);

    let mappingReport = "";
    for (const [name, label] of Object.entries(report.namesMapping)) {
        mappingReport += `<li>${name} → ${label}</li>`;
    }

    // Audit the final (output) text.
    const audit = auditSecurity(processedText);
    let emailReport = audit.emails.length ? audit.emails.map(e => `${e.value} (pos: ${e.index})`).join(", ") : "None";
    let ipReport = audit.ips.length ? audit.ips.map(ip => `${ip.value} (pos: ${ip.index})`).join(", ") : "None";
    let namesReport = audit.names.length ? audit.names.map(n => `${n.value} (pos: ${n.index})`).join(", ") : "None";

    let auditReport = `
    <h3>Security Audit:</h3>
    <ul>
      <li>Emails Found: ${audit.emails.length} (${emailReport})</li>
      <li>IP Addresses Found: ${audit.ips.length} (${ipReport})</li>
      <li>Potential Names Found: ${audit.names.length} (${namesReport})</li>
      <li>Sensitive Info Treated: ${report.sensitiveFound}</li>
      <li>Names Anonymized: ${report.namesAnonymized}</li>
      ${mappingReport ? `<li>Names Mapping:<ul>${mappingReport}</ul></li>` : ""}
      <li>Total Tokens: ${audit.totalTokens}</li>
    </ul>`;

    const securityScore = calculateSecurityScore(audit);
    let scoreReport = `<p><strong>Security Score:</strong> ${securityScore}/100 (higher score indicates lower risk)</p>`;

    document.getElementById('summary').innerHTML = `
<hr>
    <h2>Output:</h2>
    <ul>
      <li>Character Reduction: ${charReduction}%</li>
      <li>Total Tokens (Audit): ${audit.totalTokens}</li>
      <li>Token Cost Savings Est.: $${costSavings}</li>
      <li>Comments Removed: ${report.commentsRemoved}</li>
    </ul>
    ${auditReport}
    ${scoreReport}
  `;

    // Show token preview if the setting checkbox is enabled.
    if (document.getElementById('showTokenPreview').checked) {
        const tokens = previewTokens(processedText);
        document.getElementById('tokens').innerHTML = tokens.map(token => `<span style="background:#e2e8f0; margin:2px; padding:2px 4px; border-radius:4px;">${token}</span>`).join(' ');
        document.getElementById('tokenPreview').style.display = 'block';
    } else {
        document.getElementById('tokenPreview').style.display = 'none';
    }

    updateOutputButtons();

    return processedText;
}

function updateHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '<hr><h3>History</h3>';
    historyList.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
      <p><strong>${item.time}</strong></p>
      <p>${item.text}</p>
      <button onclick="copyHistoryItem(${index})">Copy</button>
    `;
        historyContainer.appendChild(div);
    });
}

function copyHistoryItem(index) {
    const item = historyList[index];
    navigator.clipboard.writeText(item.text)
        .then(() => alert('History item copied!'))
        .catch(err => alert('Error copying history item: ' + err));
}

document.getElementById('inputText').addEventListener('input', updateInputStats);
document.getElementById('minimizeBtn').addEventListener('click', () => {
    document.getElementById('minimizeBtn').addEventListener('click', () => {
        const inputText = document.getElementById('inputText').value;
        if (inputText.trim() === "") {
            // Optionally, you can show a message:
            alert("Please enter some text before processing.");
            return;
        }
        processPrompt();
        if (!document.getElementById('showTokenPreview').checked) {
            document.getElementById('tokenPreview').style.display = 'none';
        }
    });
});
document.getElementById('copyBtn').addEventListener('click', () => {
    const outputText = document.getElementById('outputText');
    outputText.select();
    outputText.setSelectionRange(0, 99999);

    const copyBtn = document.getElementById('copyBtn');
    const originalTitle = copyBtn.textContent;

    navigator.clipboard.writeText(outputText.value)
        .then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalTitle;
            }, 3000);
        })
        .catch(err => {
            copyBtn.textContent = 'Error: ' + err.toString();
            setTimeout(() => {
                copyBtn.textContent = originalTitle;
            }, 3000);
        });
});

document.getElementById('saveHistoryBtn').addEventListener('click', () => {
    const processed = processPrompt();
    const timestamp = new Date().toLocaleString();
    historyList.push({text: processed, time: timestamp});
    updateHistory();
    // Ensure buttons reflect the new output.
    updateOutputButtons();
});

updateInputStats();
