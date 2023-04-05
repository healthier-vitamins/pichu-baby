import axios from "axios";
import { axiosTo } from "utils/promise";
import Cookies from "universal-cookie";
import GLOBALVARS from "utils/GLOBALVARS";

const cookies = new Cookies();

async function postEntry(succFunc: any, errFunc: any, payload: any) {
  let oriEntryDbId = cookies.get(GLOBALVARS.ENTRY_DB_ID);
  if (oriEntryDbId === "undefined") {
    const { [GLOBALVARS.ENTRY_DB_ID]: id } = await getEntryDbIdAndUrl();
    oriEntryDbId = id;
  }
  payload.ENTRY_ID = oriEntryDbId;
  const [err, res] = await axiosTo(axios.post("api/postEntry", payload));

  if (err) errFunc();
  if (res) succFunc();
}

async function getEntryDbIdAndUrl() {
  let oriEntryDbId = cookies.get(GLOBALVARS.ENTRY_DB_ID);
  let oriDatePageUrl = cookies.get(GLOBALVARS.DATE_PAGE_URL);
  //   console.log(cookies.get(GLOBALVARS.DATE_PAGE_URL));
  //   console.log("here ", typeof oriDatePageUrl);
  if (oriEntryDbId === "undefined") oriEntryDbId = undefined;
  if (oriDatePageUrl === "undefined") oriDatePageUrl = undefined;
  if (!oriEntryDbId || !oriDatePageUrl) {
    const [err, res] = await axiosTo(axios.get("api/getEntryDbId"));
    if (err) {
      alert(GLOBALVARS.ERR_MSG_GET_ENTRY_DB);
    }
    // console.log("Get? ", res);
    const [entryDbId, datePageUrl] = res;
    cookies.set(GLOBALVARS.ENTRY_DB_ID, entryDbId, {
      maxAge: 3600,
      sameSite: "lax",
      path: "/",
    });
    // console.log(datePageUrl);
    cookies.set(GLOBALVARS.DATE_PAGE_URL, datePageUrl, {
      maxAge: 3600,
      sameSite: "lax",
      path: "/",
    });
    oriEntryDbId = entryDbId;
    oriDatePageUrl = datePageUrl;
  }
  return {
    [GLOBALVARS.ENTRY_DB_ID]: oriEntryDbId,
    [GLOBALVARS.DATE_PAGE_URL]: oriDatePageUrl,
  };
}

export { postEntry, getEntryDbIdAndUrl };
