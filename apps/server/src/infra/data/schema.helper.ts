import { varchar } from "drizzle-orm/pg-core";
import { generateId } from "@/libs/cuid";

export const cuidColumn = (columnName: string) =>
  varchar(columnName, { length: 25 });

export const cuidPrimaryKey = (columnName: string) =>
  cuidColumn(columnName)
    .primaryKey()
    .$defaultFn(() => generateId());
