import { AnimatedImageEdge } from "@/components/react_flows/edges/AnimatedImageEdge";
import { CircleNode, ImageNode, PixelNode, RGBNode, SquareNode, SubtitleText, TitleText } from "@/components/react_flows/nodes/Nodes";

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

export type Link = {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export const EDGE_TYPES = {
  'image': AnimatedImageEdge
}

export const NODE_TYPES = {
  square: SquareNode,
  circle: CircleNode,
  rgb: RGBNode,
  pixel: PixelNode,
  title: TitleText,
  subtitle: SubtitleText,
  image: ImageNode,
}
