import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";



type EagerFridgebase = {
  readonly pk: string;
  readonly sk: string;
}

type LazyFridgebase = {
  readonly pk: string;
  readonly sk: string;
}

export declare type Fridgebase = LazyLoading extends LazyLoadingDisabled ? EagerFridgebase : LazyFridgebase

export declare const Fridgebase: (new (init: ModelInit<Fridgebase>) => Fridgebase)

type EagerFridgebaseConnection = {
  readonly items?: (Fridgebase | null)[] | null;
  readonly nextToken?: string | null;
}

type LazyFridgebaseConnection = {
  readonly items?: (Fridgebase | null)[] | null;
  readonly nextToken?: string | null;
}

export declare type FridgebaseConnection = LazyLoading extends LazyLoadingDisabled ? EagerFridgebaseConnection : LazyFridgebaseConnection

export declare const FridgebaseConnection: (new (init: ModelInit<FridgebaseConnection>) => FridgebaseConnection)

type EagerItems = {
  readonly pk: string;
  readonly items?: (Item | null)[] | null;
}

type LazyItems = {
  readonly pk: string;
  readonly items: AsyncCollection<Item>;
}

export declare type Items = LazyLoading extends LazyLoadingDisabled ? EagerItems : LazyItems

export declare const Items: (new (init: ModelInit<Items>) => Items)

type EagerItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Item, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly pk?: string | null;
  readonly sk?: string | null;
  readonly UPC?: string | null;
  readonly name?: string | null;
  readonly category?: string | null;
  readonly calories?: string | null;
  readonly img_url?: string | null;
  readonly exp_date?: number | null;
  readonly quantity?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Item, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly pk?: string | null;
  readonly sk?: string | null;
  readonly UPC?: string | null;
  readonly name?: string | null;
  readonly category?: string | null;
  readonly calories?: string | null;
  readonly img_url?: string | null;
  readonly exp_date?: number | null;
  readonly quantity?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Item = LazyLoading extends LazyLoadingDisabled ? EagerItem : LazyItem

export declare const Item: (new (init: ModelInit<Item>) => Item) & {
  copyOf(source: Item, mutator: (draft: MutableModel<Item>) => MutableModel<Item> | void): Item;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly pk: string;
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly pk: string;
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}