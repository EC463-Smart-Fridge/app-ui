// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ModelAttributeTypes = {
  "BINARY": "binary",
  "BINARY_SET": "binarySet",
  "BOOL": "bool",
  "LIST": "list",
  "MAP": "map",
  "NUMBER": "number",
  "NUMBER_SET": "numberSet",
  "STRING": "string",
  "STRING_SET": "stringSet",
  "NULL": "_null"
};

const ModelSortDirection = {
  "ASC": "ASC",
  "DESC": "DESC"
};

const { Fridgebase, FridgebaseConnection, Item, Items, User } = initSchema(schema);

export {
  ModelAttributeTypes,
  ModelSortDirection,
  Fridgebase,
  FridgebaseConnection,
  Item,
  Items,
  User
};