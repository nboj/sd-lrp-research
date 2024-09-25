export type Generation = {
  id: number;
  prompt: string;
}

export type Iteration = {
  id: number;
  index: number;
  generation_id: number;
}

export type Asset = {
  id: number;
  iteration_id: number;
  pathname: string;
  asset_type: AssetType;
}

export enum AssetType {
  NOISE = 'noise',
  LRP1 = 'lrp1',
  LRP2 = 'lrp2'
}

export type FullGeneration = {
  generation: Generation;
  iterations: FullIteration[];
}

export type FullIteration = {
  iteration: Iteration;
  assets: Asset[]
}
