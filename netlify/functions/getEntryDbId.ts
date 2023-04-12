import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";
import { dateSchema } from "../../src/utils/schemas/dateSchema";
import { entrySchema } from "../../src/utils/schemas/entrySchema";
import GLOBALVARS from "../../src/utils/GLOBALVARS";
import moment from "moment-timezone";

const { NOTION_KEY, NOTION_MAIN_DB_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  // const dateTitle = new Date().toLocaleDateString("en-SG", {
  //   hour12: true,
  //   timeZone: "Asia/Singapore",
  // });
  const dateTitle = moment().format("DD/MM/YYYY");
  // console.log("TIME ZONE |||||| ", moment.tz.guess(true));

  let parentId,
    parentUrl,
    pageExists = false;

  try {
    const response = await notion.databases.query({
      database_id: NOTION_MAIN_DB_KEY ? NOTION_MAIN_DB_KEY : "",
      filter: {
        and: [
          {
            property: "DATE",
            title: {
              equals: "TITLE " + dateTitle,
            },
          },
        ],
      },
    });
    if (response.results[0]?.id) {
      parentId = response.results[0].id;
      parentUrl = response.results[0]["url"];
      pageExists = true;
    }
  } catch (err) {
    console.log("query err ||||||||||||| ", err);
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }

  if (pageExists) {
    try {
      const response = await notion.blocks.children.list({
        block_id: parentId,
      });

      const payload = [response.results[0].id, parentUrl];
      return {
        statusCode: HttpStatusCode.Ok,
        body: JSON.stringify(payload),
      };
    } catch (err) {
      console.log(err);
      console.log(err.message);
      return {
        statusCode: HttpStatusCode.NotFound,
        body: GLOBALVARS.ERR_MSG_GET_ENTRY_DB,
      };
    }
  }

  // create date page with entries DB
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_MAIN_DB_KEY ? NOTION_MAIN_DB_KEY : "",
        type: "database_id",
      },
      properties: {
        [dateSchema.TITLE]: {
          title: [
            {
              text: {
                content: "TITLE " + dateTitle,
              },
            },
          ],
        },
        [dateSchema.STATUS]: {
          status: {
            name: "LIVE",
          },
        },
      },
    });
    console.log("Created date res ||||||||||||| ", response);
    parentId = response.id;
    parentUrl = response["url"];
  } catch (err: any) {
    console.log("create date err ||||||||||| ", err);
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }

  try {
    const response = await notion.databases.create({
      parent: {
        page_id: parentId,
        type: "page_id",
      },
      is_inline: true,
      title: [
        {
          type: "text",
          text: {
            content: "DIETARY ENTRIES",
          },
        },
      ],
      properties: {
        [entrySchema.TITLE]: {
          type: "title",
          title: {},
        },
        [entrySchema.STATUS]: {
          type: "status",
          status: {},
        },
        [entrySchema.AMOUNT]: {
          type: "select",
          select: {},
        },
        [entrySchema.MEAL_TYPE]: {
          type: "select",
          select: {},
        },
        [entrySchema.DATE_TIME]: {
          type: "date",
          date: {},
        },
        [entrySchema.STATUS]: {
          type: "select",
          select: {
            options: [
              {
                name: "LIVE",
                color: "green",
              },
              {
                name: "DELETED",
                color: "red",
              },
            ],
          },
        },
        [entrySchema.CREATED_TIME]: {
          type: "created_time",
          created_time: {},
        },
      },
    });

    console.log("child res ||||||||||| ", response);
    const payload = [response.id, parentUrl];

    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(payload),
    };
  } catch (err: any) {
    console.log("notion's err ", err);
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }
};
