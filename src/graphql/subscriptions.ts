/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateFridgebase = /* GraphQL */ `subscription OnCreateFridgebase($pk: String, $sk: String) {
  onCreateFridgebase(pk: $pk, sk: $sk) {
    pk
    sk
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFridgebaseSubscriptionVariables,
  APITypes.OnCreateFridgebaseSubscription
>;
export const onUpdateFridgebase = /* GraphQL */ `subscription OnUpdateFridgebase($pk: String, $sk: String) {
  onUpdateFridgebase(pk: $pk, sk: $sk) {
    pk
    sk
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFridgebaseSubscriptionVariables,
  APITypes.OnUpdateFridgebaseSubscription
>;
export const onDeleteFridgebase = /* GraphQL */ `subscription OnDeleteFridgebase($pk: String, $sk: String) {
  onDeleteFridgebase(pk: $pk, sk: $sk) {
    pk
    sk
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFridgebaseSubscriptionVariables,
  APITypes.OnDeleteFridgebaseSubscription
>;
