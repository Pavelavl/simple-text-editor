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
});

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
