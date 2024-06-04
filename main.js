const DOMParser = window.DOMParser || require("dom-parser");

const boldRegex = /<b>(.*?)<\/b>/g;
const underlineRegex = /<u>(.*?)<\/u>/g;
const italicRegex = /<i>(.*?)<\/i>/g;

// Цветовые коды ANSI для форматирования
const ansiCodes = {
  bold: "\x1B[1m",
  underline: "\x1B[4m",
  italic: "\x1B[3m",
  reset: "\x1B[0m",
};

document.addEventListener("DOMContentLoaded", function () {
  const boldButton = document.getElementById("bold");
  const underlineButton = document.getElementById("underline");
  const italicButton = document.getElementById("italic");
  const logButton = document.getElementById("log");

  boldButton.addEventListener("click", function () {
    document.execCommand("bold", false, null);
  });

  italicButton.addEventListener("click", function () {
    document.execCommand("italic", false, null);
  });

  underlineButton.addEventListener("click", function () {
    document.execCommand("underline", false, null);
  });

  logButton.addEventListener("click", function () {
    const allText = text.innerHTML;
    if (allText) {
      console.log(htmlToAnsi(allText));
    }
  });

  text.addEventListener("paste", (event) => {
    event.preventDefault();

    const clipboardData = event.clipboardData;
    const pastedHTML = clipboardData.getData("text/html");
    const pastedText = clipboardData.getData("text");
    if (pastedHTML) {
      return document.execCommand("insertHTML", false, filterHTML(pastedHTML));
    }

    document.execCommand("insertText", false, pastedText);
  });
});

function filterHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const allowedTags = ["b", "u", "i", "br"];
  const filteredNodes = [];
  function processNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (allowedTags.includes(node.tagName.toLowerCase())) {
        filteredNodes.push(node);
      } else {
        if (node.hasChildNodes()) {
          for (let child of node.childNodes) {
            processNode(child);
          }
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      filteredNodes.push(node.cloneNode(true));
    }
  }
  processNode(doc.body);
  const filteredHTML = doc.createElement("div");
  filteredNodes.forEach((node) => filteredHTML.appendChild(node));
  return filteredHTML.innerHTML;
}

function htmlToAnsi(html) {
  let ansiString = html;

  ansiString = ansiString.replace(boldRegex, (match, content) => {
    return ansiCodes.bold + content + ansiCodes.reset;
  });

  ansiString = ansiString.replace(underlineRegex, (match, content) => {
    return ansiCodes.underline + content + ansiCodes.reset;
  });

  ansiString = ansiString.replace(italicRegex, (match, content) => {
    return ansiCodes.italic + content + ansiCodes.reset;
  });

  return ansiString;
}
