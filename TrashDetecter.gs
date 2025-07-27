function detectTrash(messageId) {
  // 引数の確認
  if (!messageId) return {success: false, error: {code: "INPUT_ERROR", message: "引数がありません", detail: "TrashDetecter.gs line2"}};
  // 画像のエンコード
  const encodeResult = getImageBase64(messageId);
  if (!encodeResult.success) return encodeResult;
  // Geminiに画像を渡し物体認識を行わせる
  const geminiResult = gemini({promptType: "Image", image: encodeResult.ret});
  if (!geminiResult.success) return geminiResult;
  // Geminiの出力をパースする
  const parseResult = parseCodeblockToText(geminiResult.ret);
  return parseResult;
}

//Base64でエンコードを行う
function getImageBase64(messageId){
  try {
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const response = UrlFetchApp.fetch(url, {
      "headers":{
        "Content-Type" : "application/json; charset=UTF-8","Authorization": "Bearer " + LINE_TOKEN
      },
      "method":"get"
    });
    const base64 = Utilities.base64Encode(response.getContent());//エンコード
    return {success: true, ret: base64};
  } catch (e) {
    return {success: false, error: {code: "ENCODE_ERROR", message: "画像のエンコードが失敗しました", detail: e.message}};
  }
}
