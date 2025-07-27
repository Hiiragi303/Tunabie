/**
 * @param {string} target
 */
function parseCodeblockToText(target) {
  //　正規表現
  let cleaned = target
    .replace(/```(?:json)?/g, "")  // ```json削除
    .replace(/```/g, "")  // ```削除
    .replace(/[\u3000\u00A0\u200B]/g, "")  // 不可視文字削除
    .trim();  // 先頭、末尾の空白や改行削除
  
  const brackets = {
    "{": "}",
    "[": "]"
  }
  const startIndex = cleaned.search(/[\[\{]/);
  if (startIndex === -1) return {success: false, error: {code: "INVALID_JSON_FORMAT", message: "リクエストがJSON形式ではありません", detail: "Parse.gs line17"}};

  const stack = [];
  for (let i = startIndex; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (char in brackets) {
      stack.push(brackets[char]); // 対応する括弧閉じを格納
    } else if (Object.values(brackets).includes(char)) {
      const expected = stack.pop();
      if (char !== expected) {
        return {success: false, error: {code: "INVALID_JSON_FORMAT", message: "括弧が対応していません", detail: "Parse.gs line28"}}; // 括弧が対応してない
      }
      if (stack.length === 0) {
        cleaned = cleaned.slice(startIndex, i + 1);
      }
    }
  }

  try {
    if (!cleaned) return {success: false, error: {code: "FAILED_EXTRACT_JSON", message: "JSON形式の抽出に失敗しました", detail: "Parse.gs line37"}};
    return {success: true, ret: JSON.parse(cleaned)};
  } catch (e) {
    return {success: false, error: {code: "FAILED_PARSE_TO_JSON", message: "JSONにパースできませんでした", detail: e.message}};
  }
}

function testParse() {
  const text = `
  \`\`\`json
    [
     {
       "item": "帽子",
       "material": "布製",
       "features": "ベイマックスの帽子, 白色",
       "size": "約20cm",
       "message": "この帽子を捨てるなんて、もったいないえっぴ！"
     }
    ]
    \`\`\`
  `;
  let ret = undefined;
  try {
    ret = parseCodeblockToText(text);
  } catch (e) {
    console.log(e.message);
  }
  console.log(ret);
}
