import { Field, FieldType } from "../lib/types";
import USAStates from "./USAStates";

export const schemaFields: Array<Field> = [
  { name: "Name", desc: "Name of the county", type: FieldType.TEXT },
  {
    name: "State",
    desc: "US State name",
    type: FieldType.STRING_ENUM,
    strEnum: USAStates,
  },
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
