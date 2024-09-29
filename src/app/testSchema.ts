import { Field, FieldType } from "../lib/types";
import USAStates from "./USAStates";

export const schemaFields: Array<Field> = [
  { names: {singular: "Name", plural: 'Names'}, desc: "Name of the county", type: FieldType.TEXT },
  {
    names: {singular: 'State', plural: 'States'},
    desc: "US State name",
    type: FieldType.STRING_ENUM,
    strEnum: USAStates,
  },
  {     names: {singular: 'Population', plural: 'n/a'}
  , desc: "", type: FieldType.INTEGER },
  {
    names: {singular: "Is Territory", plural: 'n/a'},
    desc: "Whether its a territory or full-state",
    type: FieldType.BOOLEAN,
  },
  {
    names: {singular: "Date added", plural: 'n/a'},
    desc: "Date when added to the US",
    type: FieldType.DATE,
  },
];
