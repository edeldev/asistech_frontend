export const Capitalize = (string) => {
  if (string === undefined) return "";

  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const CapitalizeNames = (string) => {
  if (string === undefined) return "";
  if (!string) return "";

  let words = string.split(" ");

  let finalString = "";
  let words2 = "";

  words.map((word, i) => {
    if (i !== 0 && i !== words.length) {
      finalString += " ";
    }
    if (word.includes(".") || word.includes("/")) {
      finalString += word.toUpperCase();
    }

    if (word.includes("-")) {
      words2 = word.split("-");
      words2.map((item, j) => {
        if (j !== 0 && j !== words2.length) {
          finalString += "-";
        }
        finalString +=
          item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        return false;
      });
    } else {
      finalString += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return false;
  });

  return finalString;
};
