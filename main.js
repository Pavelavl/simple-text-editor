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
  const allText = text.innerHTML;
  if (allText) {
    console.log(htmlToAnsi(allText));
    console.log(allText);
  }
  const boldButton = document.getElementById("bold");
  const underlineButton = document.getElementById("underline");
  const italicButton = document.getElementById("italic");
  const logButton = document.getElementById("log");

  boldButton.addEventListener("click", function () {
    document.execCommand("bold", false, null);
    text.focus();
  });

  italicButton.addEventListener("click", function () {
    document.execCommand("italic", false, null);
    text.focus();
  });

  underlineButton.addEventListener("click", function () {
    document.execCommand("underline", false, null);
    text.focus();
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
      const decodedHTML = decodeHTMLEntities(pastedHTML);
      return document.execCommand("insertHTML", false, filterHTML(decodedHTML).trimEnd());
    }

    document.execCommand("insertText", false, pastedText);
  });
});

function filterHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const allowedTags = ["b", "u", "i", "br"];

  function traverse(node) {
    let result = "";

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent;
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        allowedTags.includes(child.tagName.toLowerCase())
      ) {
        const element = document.createElement(child.tagName);
        element.innerHTML = traverse(child);
        result += element.outerHTML;
      } else {
        result += traverse(child);
      }
    });

    return result;
  }

  return traverse(doc.body);
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


// helper to avoid &gt, &lt, etc.
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}
