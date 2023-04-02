import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";
import { entrySchema } from "../../src/utils/schemas/entrySchema";
import { dateSchema } from "../../src/utils/schemas/dateSchema";
// const moment = require("moment");

const { NOTION_KEY, NOTION_MAIN_DB_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  let { TITLE, AMOUNT, DATE_TIME, MEAL_TYPE } = JSON.parse(event.body);
  DATE_TIME = new Date(DATE_TIME).toLocaleDateString("en-sg", {
    hour12: false,
    timeZone: "Asia/Singapore",
  });
  //   DATE_TIME = moment(DATE_TIME).format("MMMM Do YYYY, h:mm:ss a");
  const finalDate = new Date(DATE_TIME).toISOString();
  let parentId, entryId;

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
                content: DATE_TIME,
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
    console.log("parent res |||||||||| ", response);
    parentId = response.id;
  } catch (err: any) {
    console.log("notion's err ", err);
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
            content: "DATES",
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
    entryId = response.id;
    console.log("child res ||||||||||| ", response);
  } catch (err: any) {
    console.log("notion's err ", err);
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: entryId,
        type: "database_id",
      },
      properties: {
        [entrySchema.TITLE]: {
          title: [
            {
              text: {
                content: TITLE,
              },
            },
          ],
        },
        [entrySchema.AMOUNT]: {
          select: {
            name: AMOUNT,
          },
        },
        [entrySchema.DATE_TIME]: {
          date: {
            start: finalDate,
          },
        },
        [entrySchema.MEAL_TYPE]: {
          select: {
            name: MEAL_TYPE,
          },
        },
        [entrySchema.STATUS]: {
          select: {
            name: "LIVE",
          },
        },
      },
    });
    console.log("parent res |||||||||| ", response);
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    console.log("notion's err ", err);
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }
};
