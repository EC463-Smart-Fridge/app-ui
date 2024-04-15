/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type addItemInput = {
  pk: string,
  UPC?: string | null,
  name: string,
  category?: string | null,
  calories?: string | null,
  img_url?: string | null,
  exp_date?: number | null,
  quantity?: number | null,
};

export type Fridgebase = {
  __typename: "Fridgebase",
  pk: string,
  sk: string,
};

export type UpdateFridgebaseInput = {
  pk: string,
  sk: string,
};

export type ingredient = {
  name: string | null,
  amt: string | null,
}
export type Recipe = {
	name: String,
	img: String | null,
	steps: String[],
	ingredients: ingredient[],
	calories: String | null,
}



export type deleteItemInput = {
  pk: string,
  sk: string,
};

export type Item = {
  __typename: "Item",
  pk?: string | null,
  sk?: string | null,
  UPC?: string | null,
  name?: string | null,
  category?: string | null,
  calories?: string | null,
  img_url?: string | null,
  exp_date?: number | null,
  quantity?: number | null,
  prod_name?: string | null,
  added_date?: string | null
};

export type TableFridgebaseFilterInput = {
  pk?: TableStringFilterInput | null,
  sk?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type FridgebaseConnection = {
  __typename: "FridgebaseConnection",
  items?:  Array<Fridgebase | null > | null,
  nextToken?: string | null,
};

export type AddItemMutationVariables = {
  input: addItemInput,
};

export type AddItemMutation = {
  addItem?:  {
    __typename: "Fridgebase",
    pk: string,
    sk: string,
  } | null,
};

export type UpdateFridgebaseMutationVariables = {
  input: UpdateFridgebaseInput,
};

export type UpdateFridgebaseMutation = {
  updateFridgebase?:  {
    __typename: "Fridgebase",
    pk: string,
    sk: string,
  } | null,
};

export type DeleteItemMutationVariables = {
  input: deleteItemInput,
};

export type DeleteItemMutation = {
  deleteItem?:  {
    __typename: "Fridgebase",
    pk: string,
    sk: string,
  } | null,
};

export type GetUserItemsQueryVariables = {
  pk: string,
};

export type GetUserItemsQuery = {
  getUserItems?:  Array< {
    __typename: "Item",
    pk?: string | null,
    sk?: string | null,
    UPC?: string | null,
    name?: string | null,
    category?: string | null,
    calories?: string | null,
    img_url?: string | null,
    exp_date?: number | null,
    quantity?: number | null,
  } | null > | null,
};

export type GetFridgebaseQueryVariables = {
  pk: string,
  sk: string,
};

export type GetFridgebaseQuery = {
  getFridgebase?:  {
    __typename: "Fridgebase",
    pk: string,
    sk: string,
  } | null,
};

export type ListFridgebasesQueryVariables = {
  filter?: TableFridgebaseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFridgebasesQuery = {
  listFridgebases?:  {
    __typename: "FridgebaseConnection",
    items?:  Array< {
      __typename: "Fridgebase",
      pk: string,
      sk: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateFridgebaseSubscriptionVariables = {
  pk?: string | null,
  sk?: string | null,
};

export type OnCreateFridgebaseSubscription = {
  onCreateFridgebase?:  {
    __typename: "Fridgebase",
    pk: string,
    sk: string,
  } | null,
};

export type OnUpdateFridgebaseSubscriptionVariables = {
  pk?: string | null,
  sk?: string | null,
};

export type OnUpdateFridgebaseSubscription = {
  onUpdateFridgebase?:  {
    __typename: "Fridgebase",
    pk: string,
    sk: string,
  } | null,
};

export type OnDeleteFridgebaseSubscriptionVariables = {
  pk?: string | null,
  sk?: string | null,
};

export type OnDeleteFridgebaseSubscription = {
  onDeleteFridgebase?:  {
    __typename: "Fridgebase",
    pk: string,
    sk: string,
  } | null,
};
