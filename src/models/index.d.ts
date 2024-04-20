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

type Eageringredient = {
  readonly name?: string | null;
  readonly amt?: string | null;
}

type Lazyingredient = {
  readonly name?: string | null;
  readonly amt?: string | null;
}

export declare type ingredient = LazyLoading extends LazyLoadingDisabled ? Eageringredient : Lazyingredient

export declare const ingredient: (new (init: ModelInit<ingredient>) => ingredient)

type EagerRecipe = {
  readonly sk: string;
  readonly recipe_name?: string | null;
  readonly img?: string | null;
  readonly steps?: (string | null)[] | null;
  readonly ingredients?: (ingredient | null)[] | null;
  readonly calories?: string | null;
}

type LazyRecipe = {
  readonly sk: string;
  readonly recipe_name?: string | null;
  readonly img?: string | null;
  readonly steps?: (string | null)[] | null;
  readonly ingredients?: (ingredient | null)[] | null;
  readonly calories?: string | null;
}

export declare type Recipe = LazyLoading extends LazyLoadingDisabled ? EagerRecipe : LazyRecipe

export declare const Recipe: (new (init: ModelInit<Recipe>) => Recipe)

type EagerPrediction = {
  readonly name?: string | null;
  readonly accuracy?: string | null;
}

type LazyPrediction = {
  readonly name?: string | null;
  readonly accuracy?: string | null;
}

export declare type Prediction = LazyLoading extends LazyLoadingDisabled ? EagerPrediction : LazyPrediction

export declare const Prediction: (new (init: ModelInit<Prediction>) => Prediction)

type EagerstoredRecipe = {
  readonly pk: string;
  readonly sk: string;
  readonly recipe_name?: string | null;
  readonly img?: string | null;
  readonly steps?: (string | null)[] | null;
  readonly ingredient_names?: (string | null)[] | null;
  readonly ingredient_amts?: (string | null)[] | null;
  readonly calories?: string | null;
}

type LazystoredRecipe = {
  readonly pk: string;
  readonly sk: string;
  readonly recipe_name?: string | null;
  readonly img?: string | null;
  readonly steps?: (string | null)[] | null;
  readonly ingredient_names?: (string | null)[] | null;
  readonly ingredient_amts?: (string | null)[] | null;
  readonly calories?: string | null;
}

export declare type storedRecipe = LazyLoading extends LazyLoadingDisabled ? EagerstoredRecipe : LazystoredRecipe

export declare const storedRecipe: (new (init: ModelInit<storedRecipe>) => storedRecipe)

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
  readonly added_date?: number | null;
  readonly quantity?: number | null;
  readonly prod_name?: string | null;
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
  readonly added_date?: number | null;
  readonly quantity?: number | null;
  readonly prod_name?: string | null;
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
  readonly email: string;
  readonly name2: string;
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
  readonly email: string;
  readonly name2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}