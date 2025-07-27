const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
const SPREADSHEET_NAME = "大阪市";
const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SPREADSHEET_NAME);
const logSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("log");

function getTrashByName(keywordsStr) {
  const START = 2;
  const nameCols = sheet.getRange("C" + START + ":C" + sheet.getLastRow()).getValues();
  const foundList = [];

  function isMatch(keywords, target) {
    const count = keywords.filter(word => target.includes(word)).length;
    const thresholdRatio = 0.5;
    const ratio = count / keywords.length;
    return ratio >= thresholdRatio;
  }

  for (let i=0; i<nameCols.length; i++) {
    const cellValue = String(nameCols[i][0]);
    const keywords = keywordsStr.split(",");
    if (isMatch(keywords, cellValue)) {
      const index = i + START;
      const obj = {
        index: index,
        name: cellValue,
        conditions: sheet.getRange(`D${index}`).getValue(),
        classification: sheet.getRange(`E${index}`).getValue()
      }
      foundList.push(obj);
    }
  }
  if (foundList.length <= 0) {
    console.log("見つかりませんでした");
    return {success: false, error: {code: "NOT_FOUND", message: "対応する品目が見つかりませんでした", detail: "SheetManager.gs line34"}};
  } else {
    console.log(foundList.length + "件見つかりました");
    return {success: true, ret: foundList};
  }
}

function testGetTrash() {
  const ret = getTrashByName("ティッシュ,箱,ボックス");
  if (ret) {
    console.log(ret);
  }
}

function appendLog(log) {
  if ('error' in log) {
    const last = logSheet.getLastRow();
    const nextRow = last === 0 ? 1 : last + 1;
    logSheet.getRange(`A${nextRow}:C${nextRow}`).setValues([[log.error.code, log.error.message, log.error.detail]]);
  }
}

function testLog() {
  appendLog({success: false, error: {code: "FAILED_PARSE_TO_JSON", message: "JSONにパースできませんでした", detail: "aa"}});
}
