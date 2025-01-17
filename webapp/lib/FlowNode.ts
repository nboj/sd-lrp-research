import { NotImplementedError } from "./errors";
import { Direction, Coords, NodeTypeKey } from "./types";
import FlowEdge from "./FlowEdge";

type FlowNodeProps = Readonly<{
  id: string;
  type: NodeTypeKey;
  data?: any;
  width?: number;
  height?: number;
  position?: Coords;
}>

export default class FlowNode {
  #id: string;
  #type: NodeTypeKey;
  #width: number = -1;
  #height: number = -1;
  #data: any = {};
  #position?: Coords;

  #parent?: FlowNode;
  #up: Array<[FlowNode, FlowEdge]>;
  #down: Array<[FlowNode, FlowEdge]>;
  #left: Array<[FlowNode, FlowEdge]>;
  #right: Array<[FlowNode, FlowEdge]>;

  #grid_offset?: Coords;
  #node_padding?: Coords;
  constructor(props: FlowNodeProps) {
    this.#grid_offset = { x: 0, y: 0 };
    this.#up = new Array<[FlowNode, FlowEdge]>();
    this.#down = new Array<[FlowNode, FlowEdge]>();
    this.#left = new Array<[FlowNode, FlowEdge]>();
    this.#right = new Array<[FlowNode, FlowEdge]>();

    this.#id = props.id
    this.#type = props.type;
    props.data.id = this.#id;
    this.#data = props.data;
    this.#position = props.position;
    if (props.height) {
      this.#height = props.height;
    }
    if (props.width) {
      this.#width = props.width;
    }
  }
  insert_node(dir: Direction, props: FlowNodeProps): FlowNode {
    let new_node = new FlowNode({ ...props });
    new_node.#set_parent(this);
    this.#add_direction(new_node, dir);
    return new_node;
  }
  set node_padding(padding: Coords) {
    if (!this.#node_padding) {
      this.#node_padding = padding;
    }
  }
  get up() {
    return this.#up;
  }
  get down() {
    return this.#down;
  }
  get left() {
    return this.#left;
  }
  get right() {
    return this.#right;
  }
  get id() {
    return this.#id;
  }
  get type() {
    return this.#type;
  }
  get data() {
    return this.#data;
  }
  get width() {
    return this.#width;
  }
  set width(width: number) {
    this.#width = width;
  }
  get height() {
    return this.#height;
  }
  set height(height: number) {
    this.#height = height;
  }
  set position(position: { x: number, y: number }) {
    this.#position = position
  }
  get position() {
    if (this.#node_padding) {
      if (this.#position) {
        return { x: this.#position.x + this.#node_padding.x, y: this.#position.y + this.#node_padding.y };
      }
      return { x: this.#node_padding.x, y: this.#node_padding.y };
    }
    if (this.#position) {
      return { x: this.#position.x, y: this.#position.y };
    }
    return { x: 0, y: 0 };

  }
  get parent() {
    return this.#parent;
  }
  #add_direction(node: FlowNode, dir: Direction) {
    // { id: "epixel-3", animated: true, source: "unet", target: 'pixel-3' },
    switch (dir) {
      case Direction.UP:
        const up_edge = new FlowEdge({
          source: node.parent!.id,
          sourceHandle: `${node.parent!.id}-top`,
          target: node.id,
          targetHandle: `${node.id}-bottom`,
        });
        node.data.disable_bottom = false
        node.data.bottom = 'target'
        node.parent!.data.disable_top = false
        node.parent!.data.top = 'source'
        this.#up.push([node, up_edge]);
        break;
      case Direction.DOWN:
        const down_edge = new FlowEdge({
          source: node.parent!.id,
          sourceHandle: `${node.parent!.id}-bottom`,
          target: node.id,
          targetHandle: `${node.id}-top`,
        });
        node.data.disable_top = false
        node.data.top = 'target'
        node.parent!.data.disable_bottom = false
        node.parent!.data.bottom = 'source'
        this.#down.push([node, down_edge]);
        break;
      case Direction.LEFT:
        const left_edge = new FlowEdge({
          source: node.parent!.id,
          sourceHandle: `${node.parent!.id}-left`,
          target: node.id,
          targetHandle: `${node.id}-right`,
        });
        node.data.disable_right = false
        node.data.right = 'target'
        node.parent!.data.disable_left = false
        node.parent!.data.left = 'source'
        this.#left.push([node, left_edge]);
        break;
      case Direction.RIGHT:
        const right_edge = new FlowEdge({
          source: node.parent!.id,
          sourceHandle: `${node.parent!.id}-right`,
          target: node.id,
          targetHandle: `${node.id}-left`,
        });
        node.data.left = 'target'
        node.data.disable_left = false
        node.parent!.data.disable_right = false
        node.parent!.data.right = 'source'
        this.#right.push([node, right_edge]);
        break;
      default:
        throw new NotImplementedError();
    }
  }
  #set_parent(node: FlowNode) {
    this.#parent = node;
  }
  #connect_node(other: FlowNode) {
    // attach new edge from this node to other node
    throw new NotImplementedError();
  }
}
