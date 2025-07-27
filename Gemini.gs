/// GeminiAPI3
const GEMINI_API_KEY_NAME = "GEMINI_API_KEY"
function gemini({promptType, userInput, image} = {promptType: "Chat", userInput: ""}) {
  const prompts = {
    "Chat": CHAT_PROMPT,
    "Image": IMAGE_PROMPT,
    "Search": SEARCH_PROMPT
  };
  if (promptType==="Image" && !image) promptType = "Chat";
  if (promptType != "Image" && image) promptType = "Image";
  if (promptType==="Search" && !userInput) return {success: false, error: {code: "INPUT_ERROR", message: "引数がありません", detail: "Gemini.gs line10"}};
  try {
    // APIキーを設定
    const apiKey = PropertiesService.getScriptProperties().getProperty(GEMINI_API_KEY_NAME);
    // リクエストURLを設定
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;
    // リクエストヘッダーを設定
    const objHeaders = {
      'Content-Type': 'application/json'
    };

    
    
    
    if (!(promptType in prompts)) return {success: false, error: {code: "INVALID_PROMPT_TYPE", message: "プロンプトタイプの指定が不適切です", detail: "Gemini.gs line20"}};
    const prompt = prompts[promptType];

    // Geminiに渡すtext
    const textObj = {
      character: {
        name: "ゴミわけるくん",
        age: 1,
        birthplace: "エコ星",
        gender: "boy",
        hobby: "ゴミの分別,きれいな景色を見ること,日常生活を垣間見ること",
        dislike: "ポイ捨て,ゴミの分別をしないこと",
        feature: "標準語尾が**えっぴ～**, キレると語尾が**えっぴ**になる, キレると「それ無駄えっぴ」を使う"
      },
      prompt: prompt,
      input: userInput
    };

    // リクエストボディを設定
    let objPayload = null;
    if (image) {
      objPayload = {
        "contents": [{
          "parts": [
            {"text": JSON.stringify(textObj).replace(/\s+/g, " ")},
            {"inlineData": {
              "mimeType":"image/jpeg",
              "data": image
              }
            },
          ]
        }]
      };
    } else {
      objPayload = {
        "contents": [{
          "parts": [
            {"text": JSON.stringify(textObj).replace(/\s+/g, " ")}
          ]
        }]
      };
    }
    // リクエストオプションを設定
    const objOptions = {
      method: 'post',
      headers: objHeaders,
      payload: JSON.stringify(objPayload)
    };

    // HTTPリクエストを送信
    const response = UrlFetchApp.fetch(url, objOptions);

    // レスポンスをJSON形式に変換してログに出力
    const json = JSON.parse(response.getContentText());
    console.log(json.candidates[0].content.parts[0].text);
    return {success: true, ret: json.candidates[0].content.parts[0].text};
  } catch (e) {
    return {success: false, error: {code: "GEMINI_ERROR", message: "GEMINIでエラーが起きました", detail: e.message}};
  }
}

function testGemini() {
  gemini("Chat", "こんにちは");
}
