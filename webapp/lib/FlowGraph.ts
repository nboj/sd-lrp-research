import { Edge, Node, NodeChange } from "@xyflow/react";
import { NotImplementedError } from "./errors";
import FlowNode from "./FlowNode";
import FlowEdge from './FlowEdge';
import { Direction } from "./types";

export default class FlowGraph {
  #root_node: FlowNode;
  #nodes: Array<any> | null = null;
  #edges: Array<any> | null = null;
  constructor(root_node: FlowNode) {
    this.#root_node = root_node;
  }
  set_node_changes(changes: any[]) {
    for (let i = 0; i < changes.length; i++) {
      const node = this.#find_node(changes[i].id, this.#root_node);
      if (!node) {
        console.error(`Cannod find node: ${changes[i].id}`);
        continue
      }
      node.height = changes[i].dimensions.height
      node.width = changes[i].dimensions.width
      console.log(node.width)
    }
  }
  build_nodes(): Array<Node> {
    return this.#build_nodes(this.#root_node);
  }
  build_edges(): Array<Edge> {
    return this.#build_edges(this.#root_node);
  }
  #find_node(id: string, from_node: FlowNode): FlowNode | null {
    if (from_node.id == id) {
      return from_node;
    }
    for (let i = 0; i < from_node.left.length; i++) {
      const [child, _] = from_node.left[i];
      const res = this.#find_node(id, child);
      if (res) {
        return res;
      }
    }
    for (let i = 0; i < from_node.right.length; i++) {
      const [child, _] = from_node.right[i];
      const res = this.#find_node(id, child);
      if (res) {
        return res;
      }
    }
    for (let i = 0; i < from_node.up.length; i++) {
      const [child, _] = from_node.up[i];
      const res = this.#find_node(id, child);
      if (res) {
        return res;
      }
    }
    for (let i = 0; i < from_node.down.length; i++) {
      const [child, _] = from_node.down[i];
      const res = this.#find_node(id, child);
      if (res) {
        return res;
      }
    }
    return null;
  }
  #build_node(from_node: FlowNode): Node {
    console.log(from_node.position, from_node.node_padding)
    return {
      id: from_node.id,
      type: from_node.type,
      data: from_node.data,
      width: from_node.width,
      height: from_node.height,
      position: from_node.position,
    }
  }
  #get_position(of_node: FlowNode, dir: Direction) {
    const parent = of_node.parent;
    let position = of_node.position;

    if (parent) {
      switch (dir) {
        case Direction.LEFT:
          position = { x: parent.position.x - of_node.width, y: parent.position.y + parent.height / 2 - of_node.height / 2 }
          break;
        case Direction.RIGHT:
          position = { x: parent.position.x + parent.width, y: parent.position.y + parent.height / 2 - of_node.height / 2 }
          break;
        case Direction.UP:
          position = { x: parent.position.x + parent.width / 2 - of_node.width / 2, y: parent.position.y - of_node.height }
          break;
        case Direction.DOWN:
          position = { x: parent.position.x + parent.width / 2 - of_node.width / 2, y: parent.position.y + parent.height }
          break
        default:
          throw new NotImplementedError();
      }
    }
    return position;
  }
  #build_nodes(from_node: FlowNode): Array<Node> {
    let final: Array<Node> = [this.#build_node(from_node)];
    for (let i = 0; i < from_node.left.length; i++) {
      let [child, _] = from_node.left[i];
      child.position = this.#get_position(child, Direction.LEFT);
      child.node_padding = { x: -40, y: 0 }
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.right.length; i++) {
      let [child, _] = from_node.right[i];
      child.position = this.#get_position(child, Direction.RIGHT);
      child.node_padding = { x: 40, y: 0 }
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.up.length; i++) {
      let [child, _] = from_node.up[i];
      child.position = this.#get_position(child, Direction.UP);
      child.node_padding = { x: 0, y: -40 }
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.down.length; i++) {
      let [child, _] = from_node.down[i];
      child.position = this.#get_position(child, Direction.DOWN);
      child.node_padding = { x: 0, y: 40 }
      console.log(child.position, child.node_padding)
      final.push(...this.#build_nodes(child));
    }
    this.#nodes = final;
    return final;
  }
  #build_edge(edge: FlowEdge): Edge {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated,
      targetHandle: edge.targetHandle,
      sourceHandle: edge.sourceHandle,
    }
  }
  #build_edges(from_node: FlowNode): Array<Edge> {
    let final: Array<Edge> = [];
    for (let i = 0; i < from_node.left.length; i++) {
      let [child, edge] = from_node.left[i];
      final.push(this.#build_edge(edge), ...this.#build_edges(child));
    }
    for (let i = 0; i < from_node.right.length; i++) {
      let [child, edge] = from_node.right[i];
      final.push(this.#build_edge(edge), ...this.#build_edges(child));
    }
    for (let i = 0; i < from_node.up.length; i++) {
      let [child, edge] = from_node.up[i];
      final.push(this.#build_edge(edge), ...this.#build_edges(child));
    }
    for (let i = 0; i < from_node.down.length; i++) {
      let [child, edge] = from_node.down[i];
      final.push(this.#build_edge(edge), ...this.#build_edges(child));
    }
    console.log(final)
    return final;
  }
}
