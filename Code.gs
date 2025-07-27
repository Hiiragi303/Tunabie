function doPost(e) {
  const json = JSON.parse(e.postData.contents);
  //replyToken…イベントへの応答に使用するトークン(Messaging APIリファレンス)
  // https://developers.line.biz/ja/reference/messaging-api/#message-event
  const replyToken = json.events[0].replyToken;
  const messageId = json.events[0].message.id;
  const messageType = json.events[0].message.type;
  const messageText = json.events[0].message.text;
  if (!replyToken) {
    const tokenCheckResult = {success: false, error: {code: "NO_TOKEN", message: "トークンがありません", detail: "Code.gs line10"}};
    appendLog(tokenCheckResult);
    return;
  }
  
  // チャット
  if (messageType === "text") {
    const chatResult = gemini({promptType: "Chat", userInput: messageText});
    if (!chatResult.success) {
      appendLog(chatResult);
      replyToLine({replyToken: replyToken, message: ERROR_REPLY});
      return;
    }
    replyToLine({replyToken: replyToken, message: chatResult.ret.replace(/\\n/g, '\n')});
    return;
  }

  //画像かどうかチェック
  if(messageType != "image") {
    const failedLoadImage = {success: false, error: {code: "TYPE_ERROR", message: "画像ではありません", detail: "Code.gs line25"}};
    appendLog(failedLoadImage);
    replyToLine({replyToken: replyToken, message: "画像を認識できなかったえっぴ～"});
    return;
  }
  // 画像から物体認識
  const detectTrashResult = detectTrash(messageId);
  if (!detectTrashResult.success) {
    appendLog(detectTrashResult);
    replyToLine({replyToken: replyToken, message: ERROR_REPLY});
    return;
  }

  // 認識した物の分類
  const detectedObjLst = detectTrashResult.ret;
  const predictResult = predictClassification(detectedObjLst);
  if (!predictResult.success) {
    appendLog(predictResult);
    replyToLine({replyToken: replyToken, message: ERROR_REPLY});
    return;
  }

  // Lineに結果を返信
  const text = predictResult.ret;
  replyToLine({replyToken: replyToken, message: text});
  return;
}



