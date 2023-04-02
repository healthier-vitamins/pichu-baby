const entrySchema: EntrySchema = {
  TITLE: "MEAL",
  STATUS: "STATUS",
  MEAL_TYPE: "MEAL_TYPE",
  AMOUNT: "AMOUNT",
  CREATED_TIME: "CREATED_TIME",
  DATE_TIME: "DATE_TIME",
};

interface EntrySchema {
  TITLE: string;
  STATUS: string;
  MEAL_TYPE: string;
  AMOUNT: string;
  CREATED_TIME: string;
  DATE_TIME: string;
}

export { entrySchema };
