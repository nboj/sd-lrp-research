import { Node, NodeChange } from "@xyflow/react";
import { NotImplementedError } from "./errors";
import FlowNode from "./FlowNode";
import { Direction, FlowEdge } from "./types";

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
    let final: Array<any> = [this.#build_node(from_node)];
    for (let i = 0; i < from_node.left.length; i++) {
      let [child, _] = from_node.left[i];
      child.position = this.#get_position(child, Direction.LEFT);
      console.log(child.position)
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.right.length; i++) {
      let [child, _] = from_node.right[i];
      child.position = this.#get_position(child, Direction.RIGHT);
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.up.length; i++) {
      let [child, _] = from_node.up[i];
      child.position = this.#get_position(child, Direction.UP);
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.down.length; i++) {
      let [child, _] = from_node.down[i];
      child.position = this.#get_position(child, Direction.DOWN);
      final.push(...this.#build_nodes(child));
    }
    this.#nodes = final;
    return final;
  }
}
