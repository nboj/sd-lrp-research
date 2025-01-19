import { AnimatedImageEdge } from "@/components/react_flows/edges/AnimatedImageEdge";
import { CircleNode, Dots, ImageAnimation, ImageNode, PixelNode, RGBNode, SquareNode, SubtitleText, TitleText } from "@/components/react_flows/nodes/Nodes";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import FlowEdge from "./FlowEdge";

export type Coords = Readonly<{
  x: number;
  y: number;
}>

export enum Direction {
  UP = 0,
  DOWN,
  LEFT,
  RIGHT
}

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

type HandleType = "source" | "target";

type BaseData = {
  id?: string;
  disable_left?: boolean;
  disable_right?: boolean;
  disable_top?: boolean;
  disable_bottom?: boolean;
  left?: HandleType;
  right?: HandleType;
  top?: HandleType;
  bottom?: HandleType;
}
export interface NodeData {
  square: BaseData & {
    name: string;
  };
  circle: BaseData & {
    name: string;
  };
  rgb: BaseData & {};
  pixel: BaseData & {
    name: string;
    color: string;
  };
  title: BaseData & {};
  subtitle: BaseData & {};
  image: BaseData & {
    image: string | StaticImport;
    text?: string;
    width?: string;
    height?: string;
  };
  dots: BaseData & {};
  animated_image: BaseData & {};
}

export type RectPadding = Readonly<{
  top: number;
  right: number;
  bottom: number;
  left: number;
}>

export type NodeType = Readonly<typeof NODE_TYPES>
export type NodeTypeKey = Readonly<keyof NodeType>

export type FlowNodeProps<T extends NodeTypeKey> = Readonly<{
  id?: string;
  type: T;
  data: NodeData[T];
  width?: number;
  height?: number;
  position?: Coords;
  padding?: { top?: number, bottom?: number, left?: number, right?: number };
  offset?: Coords;
  reverse_edge?: boolean;
  disable_left_edge?: boolean;
  disable_right_edge?: boolean;
  disable_top_edge?: boolean;
  disable_bottom_edge?: boolean;
  parent_id?: string;
  edge?: FlowEdge;
}>

