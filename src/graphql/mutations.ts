/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const addItem = /* GraphQL */ `mutation AddItem($input: addItemInput!) {
  addItem(input: $input) {
    pk
    sk
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AddItemMutationVariables,
  APITypes.AddItemMutation
>;
export const updateFridgebase = /* GraphQL */ `mutation UpdateFridgebase($input: UpdateFridgebaseInput!) {
  updateFridgebase(input: $input) {
    pk
    sk
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFridgebaseMutationVariables,
  APITypes.UpdateFridgebaseMutation
>;
export const deleteItem = /* GraphQL */ `mutation DeleteItem($input: deleteItemInput!) {
  deleteItem(input: $input) {
    pk
    sk
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteItemMutationVariables,
  APITypes.DeleteItemMutation
>;
