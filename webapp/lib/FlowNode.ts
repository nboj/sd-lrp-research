import { NotImplementedError } from "./errors";
import { Direction, Coords, NodeTypeKey, NodeData, FlowNodeProps, RectPadding } from "./types";
import FlowEdge from "./FlowEdge";


export default class FlowNode {
  #id: string;
  #parent_id?: string;
  #type: NodeTypeKey;
  #width: number;
  #height: number;
  #data: NodeData[NodeTypeKey];
  #edge?: FlowEdge;
  #reverse_edge: boolean;
  #disable_left_edge: boolean;
  #disable_right_edge: boolean;
  #disable_top_edge: boolean;
  #disable_bottom_edge: boolean;
  #position?: Coords;

  #parent?: FlowNode;
  #up: Array<[FlowNode, FlowEdge | undefined]>;
  #down: Array<[FlowNode, FlowEdge | undefined]>;
  #left: Array<[FlowNode, FlowEdge | undefined]>;
  #right: Array<[FlowNode, FlowEdge | undefined]>;

  #node_padding: RectPadding;
  #offset: Coords
  #custom_edges: Array<FlowEdge | undefined>;
  constructor(props: FlowNodeProps<NodeTypeKey>) {
    this.#up = new Array<[FlowNode, FlowEdge | undefined]>();
    this.#down = new Array<[FlowNode, FlowEdge | undefined]>();
    this.#left = new Array<[FlowNode, FlowEdge | undefined]>();
    this.#right = new Array<[FlowNode, FlowEdge | undefined]>();

    this.#custom_edges = [];
    this.#id = props.id ?? crypto.randomUUID();
    this.#type = props.type;
    this.#data = { ...props.data, id: this.#id, disable_top: props.data.disable_top ?? true, disable_bottom: props.data.disable_bottom ?? true, disable_left: props.data.disable_left ?? true, disable_right: props.data.disable_right ?? true };
    this.#edge = props.edge;
    this.#position = props.position;
    this.#height = props.height ?? -1;
    this.#width = props.width ?? -1;
    this.#node_padding = { top: props.padding?.top ?? 20, bottom: props.padding?.bottom ?? 20, left: props.padding?.left ?? 20, right: props.padding?.right ?? 20 };
    this.#offset = props.offset ?? { x: 0, y: 0 }
    this.#reverse_edge = props.reverse_edge ?? false;
    this.#disable_left_edge = props.disable_left_edge ?? false;
    this.#disable_right_edge = props.disable_right_edge ?? false;
    this.#disable_top_edge = props.disable_top_edge ?? false;
    this.#disable_bottom_edge = props.disable_bottom_edge ?? false;
    this.#parent_id = props.parent_id;
  }
  insert_node(dir: Direction, props: FlowNodeProps<NodeTypeKey>): FlowNode {
    const new_node = new FlowNode({ ...props });
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
  get parent_id() {
    return this.#parent_id;
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
  get custom_edges() {
    return this.#custom_edges;
  }
  set position(position: { x: number, y: number }) {
    this.#position = position
  }
  get position() {
    if (this.#position) {
      return { x: this.#position.x, y: this.#position.y };
    }
    return { x: 0, y: 0 };

  }
  get parent() {
    return this.#parent;
  }
  get padding() {
    return this.#node_padding;
  }
  get offset() {
    return this.#offset;
  }
  #get_edge(node: FlowNode, dir: Direction) {
    let edge;
    switch (dir) {
      case Direction.UP:
        edge = !node.#disable_bottom_edge ? new FlowEdge({
          source: node.#reverse_edge ? node.id : this.id,
          sourceHandle: node.#reverse_edge ? `${node.id}-bottom` : `${this.id}-top`,
          target: node.#reverse_edge ? node.parent!.id : node.id,
          targetHandle: node.#reverse_edge ? `${this.id}-top` : `${node.id}-bottom`,
        }) : undefined;
        node.data.disable_bottom = node.#disable_bottom_edge ?? false
        this.data.disable_top = node.#disable_bottom_edge ?? false
        node.data.bottom = node.#reverse_edge ? 'source' : 'target'
        this.data.top = node.#reverse_edge ? 'target' : 'source'
        break;
      case Direction.DOWN:
        edge = !node.#disable_top_edge ? new FlowEdge({
          source: this.id,
          sourceHandle: `${this.id}-bottom`,
          target: node.id,
          targetHandle: `${node.id}-top`,
        }) : undefined;
        node.data.disable_top = node.#disable_top_edge ?? false
        this.data.disable_bottom = node.#disable_top_edge ?? false
        node.data.top = 'target'
        this.data.bottom = 'source'
        break;
      case Direction.LEFT:
        edge = !node.#disable_right_edge ? new FlowEdge({
          source: this.id,
          sourceHandle: `${this.id}-left`,
          target: node.id,
          targetHandle: `${node.id}-right`,
        }) : undefined;
        node.data.disable_right = node.#disable_right_edge ?? false
        this.data.disable_left = node.#disable_right_edge ?? false
        node.data.right = 'target'
        this.data.left = 'source'
        break;
      case Direction.RIGHT:
        edge = !node.#disable_left_edge ? new FlowEdge({
          source: this.id,
          sourceHandle: `${this.id}-right`,
          target: node.id,
          targetHandle: `${node.id}-left`,
        }) : undefined;
        node.data.disable_left = node.#disable_left_edge ?? false
        this.data.disable_right = node.#disable_left_edge ?? false
        node.data.left = 'target'
        this.data.right = 'source'
        break;
      default:
        throw new NotImplementedError();
    }
    return edge
  }
  #add_direction(node: FlowNode, dir: Direction) {
    const edge = this.#get_edge(node, dir)
    switch (dir) {
      case Direction.UP:
        this.#up.push([node, !node.#disable_top_edge ? node.#edge ?? edge : undefined]);
        break;
      case Direction.DOWN:
        this.#down.push([node, !node.#disable_bottom_edge ? node.#edge ?? edge : undefined]);
        break;
      case Direction.LEFT:
        this.#left.push([node, !node.#disable_left_edge ? node.#edge ?? edge : undefined]);
        break;
      case Direction.RIGHT:
        this.#right.push([node, !node.#disable_right_edge ? node.#edge ?? edge : undefined]);
        break;
      default:
        throw new NotImplementedError();
    }
  }
  #set_parent(node: FlowNode) {
    this.#parent = node;
  }
  connect_node(other: FlowNode, dir: Direction, edge?: FlowEdge) {
    this.#custom_edges.push(edge ?? this.#get_edge(other, dir));
  }
}
