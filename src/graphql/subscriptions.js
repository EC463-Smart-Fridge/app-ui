/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFridgebase = /* GraphQL */ `
  subscription OnCreateFridgebase($pk: String, $sk: String) {
    onCreateFridgebase(pk: $pk, sk: $sk) {
      pk
      sk
      __typename
    }
  }
`;
export const onUpdateFridgebase = /* GraphQL */ `
  subscription OnUpdateFridgebase($pk: String, $sk: String) {
    onUpdateFridgebase(pk: $pk, sk: $sk) {
      pk
      sk
      __typename
    }
  }
`;
export const onDeleteFridgebase = /* GraphQL */ `
  subscription OnDeleteFridgebase($pk: String, $sk: String) {
    onDeleteFridgebase(pk: $pk, sk: $sk) {
      pk
      sk
      __typename
    }
  }
`;
export const onCreateItem = /* GraphQL */ `
  subscription OnCreateItem($filter: ModelSubscriptionItemFilterInput) {
    onCreateItem(filter: $filter) {
      pk
      sk
      UPC
      name
      category
      calories
      img_url
      exp_date
      quantity
      prod_name
      __typename
    }
  }
`;
export const onUpdateItem = /* GraphQL */ `
  subscription OnUpdateItem($filter: ModelSubscriptionItemFilterInput) {
    onUpdateItem(filter: $filter) {
      pk
      sk
      UPC
      name
      category
      calories
      img_url
      exp_date
      quantity
      prod_name
      __typename
    }
  }
`;
export const onDeleteItem = /* GraphQL */ `
  subscription OnDeleteItem($filter: ModelSubscriptionItemFilterInput) {
    onDeleteItem(filter: $filter) {
      pk
      sk
      UPC
      name
      category
      calories
      img_url
      exp_date
      quantity
      prod_name
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      pk
      username
      email
      name2
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      pk
      username
      email
      name2
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      pk
      username
      email
      name2
      __typename
    }
  }
`;
