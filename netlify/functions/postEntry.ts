import { Client } from "@notionhq/client";
import { HttpStatusCode } from "axios";
import { dateSchema } from "../../src/utils/schemas/dateSchema";
import { entrySchema } from "../../src/utils/schemas/entrySchema";
// import { dateSchema } from "../../src/utils/schemas/dateSchema";
const moment = require("moment");

const { NOTION_KEY, NOTION_MAIN_DB_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event: any, context: any) {
  let {
    TITLE,
    AMOUNT,
    DATE_TIME,
    MEAL_TYPE,
    ENTRY_ID,
    OTHER_MEAL_TYPE,
    OTHER_AMOUNT,
  } = JSON.parse(event.body);
  MEAL_TYPE = OTHER_MEAL_TYPE ? OTHER_MEAL_TYPE : MEAL_TYPE;
  AMOUNT = OTHER_AMOUNT ? OTHER_AMOUNT : AMOUNT;

  const dateTitle = new Date(DATE_TIME).toLocaleDateString("en-SG", {
    hour12: true,
    timeZone: "Asia/Singapore",
  });

  const dateEntry = new Date(DATE_TIME).toLocaleDateString("en-SG", {
    hour12: true,
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const finalDate = moment(dateEntry).format("MMMM Do YYYY, h:mm:ss a");
  //   const parsedDate = new Date(Date.parse(DATE_TIME))

  let parentId, entryId;

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
    }
  } catch (err) {
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }

  if (parentId) {
    try {
      const response = await notion.blocks.children.list({
        block_id: parentId,
      });
      if (response.results[0]?.id) {
        entryId = response.results[0].id;
      }
    } catch (err) {
      return {
        statusCode: HttpStatusCode.BadRequest,
        body: err.message,
      };
    }
  }

  if (!parentId) {
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
      parentId = response.id;
    } catch (err: any) {
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
            type: "rich_text",
            rich_text: {},
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
    } catch (err: any) {
      return {
        statusCode: HttpStatusCode.BadRequest,
        body: err.message,
      };
    }
  }

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: entryId ? entryId : ENTRY_ID,
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
          rich_text: [
            {
              text: {
                content: finalDate,
              },
            },
          ],
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
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(response),
    };
  } catch (err: any) {
    return {
      statusCode: HttpStatusCode.BadRequest,
      body: err.message,
    };
  }
};
