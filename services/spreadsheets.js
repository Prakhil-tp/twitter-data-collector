import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from "../client_secret.json";

export default async function () {
  const doc = new GoogleSpreadsheet(
    "1Oo5udsp58zhR9vjMzyLXtj3vEPl4e_Csn_gaSJSe_EU"
  );
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  console.log(`Title: ${doc.title}`);
  const sheet = doc.sheetsByIndex[0];

  const addRows = async (data) => {
    for (let item of data) {
      await sheet.addRow({ Hashtags: item.name });
    }
  };

  return { addRows };
}
