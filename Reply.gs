const LINE_TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_TOKEN");
const LINE_URL = 'https://api.line.me/v2/bot/message/reply';

//Lineへの返信処理
function replyToLine({replyToken, message} = {message: "内容が無いようえっぴ～"}) {
  if (!replyToken) return {success: false, error: {code: "INPUT_ERROR", message: "引数がありません", detail: "Reply.gs line6"}};
  UrlFetchApp.fetch(LINE_URL, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${LINE_TOKEN}`,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': [{
          'type': 'text',
          'text': message,
        }],
      }),
  });
}

const ERROR_REPLY = `ごめんえっぴ
エラーが起きちゃったえっぴ...`;
