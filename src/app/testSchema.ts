import { FieldBase, FieldType } from "../lib/types";

export const schemaFields: Array<FieldBase> = [
  { name: "Name", desc: "Name of the county", type: FieldType.TEXT },
  { name: "State", desc: "2 Letter code", type: FieldType.STRING_ENUM },
  { name: "Population", desc: "", type: FieldType.INTEGER },
  {
    name: "Is Territory",
    desc: "Whether its a territory or full-state",
    type: FieldType.BOOLEAN,
  },
  {
    name: "Date Added",
    desc: "Date when added to the US",
    type: FieldType.DATE,
  },
];
