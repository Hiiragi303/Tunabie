function predictClassification(detectedObjLst) {
  let replyText = "";
  for (const obj of detectedObjLst) {
    const item = obj["item"];
    const message = obj["message"];
    
    const getTrashResult = getTrashByName(item);
    if (!getTrashResult.success) {
      appendLog(getTrashResult);
      continue;
    }
    const inputs = [obj, getTrashResult.ret];
    const geminiResult = gemini({promptType: "Search", userInput: JSON.stringify(inputs).replace(/\s+/g, " ")});
    if (!geminiResult.success) {
      appendLog(geminiResult);
      continue;
    };
    const parseResult = parseCodeblockToText(geminiResult.ret);
    if (!parseResult.success) {
      appendLog(parseResult);
      continue;
    }
    const index = parseResult.ret["index"];
    const classifiedName = parseResult.ret["name"];
    const classification = parseResult.ret["classification"];
    const note = sheet.getRange(`F${index}`).getValue();
    const text = `
判定されたもの: ${item}
分類されたもの: ${classifiedName}
分類: ${classification}
注意: ${note}

ひとこと: ${message}

`;
    replyText += text;
  }
  if (replyText === "") {
    return {success: false, error: {code: "NOTHING_MATCHED", message: "分類されるものがありませんでした", detail: "ClassPredicter.gs line39"}};
  } else {
    return {success: true, ret: replyText};
  }
}
