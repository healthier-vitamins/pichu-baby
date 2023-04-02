import { Client } from "@notionhq/client";

const { NOTION_KEY, NOTION_MAIN_DB_KEY } = process.env;
const notion = new Client({
  auth: NOTION_KEY,
});

exports.handler = async function (event, context) {
  console.log(NOTION_MAIN_DB_KEY);
  try {
    // const response = await notion.blocks.children.list({
    const response = await notion.databases.retrieve({
      database_id: "c00f02139afa424abcba51c236327fd9",
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
};
