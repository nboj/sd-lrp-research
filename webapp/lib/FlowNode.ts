import { NotImplementedError } from "./errors";
import { Direction, GridOffset, NodeTypeKey } from "./types";
import FlowEdge from "./FlowEdge";

export default class FlowNode {
  #id: string;
  #type: NodeTypeKey;
  #width: number = -1;
  #height: number = -1;
  #data: any = {};
  #position?: { x: number, y: number };

  #parent?: FlowNode;
  #up: Array<[FlowNode, FlowEdge]>;
  #down: Array<[FlowNode, FlowEdge]>;
  #left: Array<[FlowNode, FlowEdge]>;
  #right: Array<[FlowNode, FlowEdge]>;

  #grid_offset?: GridOffset;
  constructor(type: NodeTypeKey, data?: any, width: number = -1, height: number = -1, position?: { x: number, y: number }) {
    this.#grid_offset = { x: 0, y: 0 };
    this.#up = new Array<[FlowNode, FlowEdge]>();
    this.#down = new Array<[FlowNode, FlowEdge]>();
    this.#left = new Array<[FlowNode, FlowEdge]>();
    this.#right = new Array<[FlowNode, FlowEdge]>();

    this.#id = crypto.randomUUID()
    this.#type = type;
    this.#data = data;
    this.#position = position;
    this.#height = height;
    this.#width = width;
  }
  insert_node(dir: Direction, type: NodeTypeKey, data?: any, width: number = -1, height: number = -1, position?: { x: number, y: number }): FlowNode {
    let new_node = new FlowNode(type, data = data, width = width, height = height, position = position);
    new_node.#set_parent(this);
    this.#add_direction(new_node, dir);
    return new_node;
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
    if (this.#position) {
      return this.#position;
    }
    return { x: 0, y: 0 };
  }
  get parent() {
    return this.#parent;
  }
  #add_direction(node: FlowNode, dir: Direction) {
    switch (dir) {
      case Direction.UP:
        const up_edge = new FlowEdge();
        this.#up.push([node, up_edge]);
        break;
      case Direction.DOWN:
        const down_edge = new FlowEdge();
        this.#down.push([node, down_edge]);
        break;
      case Direction.LEFT:
        const left_edge = new FlowEdge();
        this.#left.push([node, left_edge]);
        break;
      case Direction.RIGHT:
        const right_edge = new FlowEdge();
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
