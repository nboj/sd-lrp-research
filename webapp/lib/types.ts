import { AnimatedImageEdge } from "@/components/react_flows/edges/AnimatedImageEdge";
import { CircleNode, Dots, ImageAnimation, ImageNode, PixelNode, RGBNode, SquareNode, SubtitleText, TitleText } from "@/components/react_flows/nodes/Nodes";

export type GridOffset = Readonly<{
  x: number;
  y: number;
}>

export enum Direction {
  UP = 0,
  DOWN,
  LEFT,
  RIGHT
}

export type FlowEdge = Readonly<{

}>

export type Generation = {
  id: number;
  prompt: string[];
  display_image?: Asset;
  display_text?: Asset;
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
  text_relevance: any;
}

export enum AssetType {
  NOISE = 'noise',
  NOISE_PRED = 'noise_pred',
  NOISE_LRP = 'noise_lrp',
  TEXT_SCORES = 'text_scores',
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
  dots: Dots,
  animated_image: ImageAnimation,
}

export type NodeType = Readonly<typeof NODE_TYPES>
export type NodeTypeKey = Readonly<keyof NodeType>
