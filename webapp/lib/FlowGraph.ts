import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { NotImplementedError } from "./errors";
import FlowNode from "./FlowNode";
import FlowEdge from './FlowEdge';
import { Coords, Direction, FlowNodeProps, NodeTypeKey } from "./types";

export default class FlowGraph {
  #root_node: FlowNode;
  #custom_nodes: Array<FlowNode>;
  #gap: Coords;
  constructor(props: FlowNodeProps<NodeTypeKey>) {
    this.#root_node = new FlowNode({ ...props });
    this.#gap = { x: 20, y: 20 }
    this.#custom_nodes = [];
  }
  set_node_changes(changes: any[]) {
    for (let i = 0; i < changes.length; i++) {
      const node = this.#find_node(changes[i].id, this.#root_node);
      if (!node) {
        console.error(`Cannot find node: ${changes[i].id}`);
        continue
      }
      node.height = changes[i].dimensions.height
      node.width = changes[i].dimensions.width
    }
  }
  build_nodes(): Array<Node> {
    this.#root_node.position = { x: this.#root_node.position.x + this.#root_node.offset.x, y: this.#root_node.position.y + this.#root_node.offset.y };
    let nodes = this.#build_nodes(this.#root_node);
    for (let i = 0; i < this.#custom_nodes.length; i++) {
      this.#custom_nodes[i].position = { x: this.#custom_nodes[i].position.x + this.#custom_nodes[i].offset.x, y: this.#custom_nodes[i].position.y + this.#custom_nodes[i].offset.y };
      nodes.push(...this.#build_nodes(this.#custom_nodes[i]));
    }
    let final: Array<Node> = []
    for (let i = 0; i < nodes.length; i++) {
      final.push(this.#build_node(nodes[i]));
    }
    return final
  }
  build_edges(): Array<Edge> {
    let edges = this.#build_edges(this.#root_node);
    for (let i = 0; i < this.#custom_nodes.length; i++) {
      edges.push(...this.#build_edges(this.#custom_nodes[i]))
    }
    return edges;
  }
  add_custom_node(node: FlowNode) {
    this.#custom_nodes.push(node);
  }
  get root() {
    return this.#root_node;
  }
  #find_node(id: string, from_node: FlowNode): FlowNode | null {
    let found = null;
    for (let i = 0; i < this.#custom_nodes.length; i++) {
      found = this.#_find_node(id, this.#custom_nodes[i]);
      if (found) {
        return found;
      }
    }
    return this.#_find_node(id, from_node);
  }
  #_find_node(id: string, from_node: FlowNode): FlowNode | null {
    if (from_node.id == id) {
      return from_node;
    }
    for (let i = 0; i < from_node.left.length; i++) {
      const [child, _] = from_node.left[i];
      const res = this.#_find_node(id, child);
      if (res) {
        return res;
      }
    }
    for (let i = 0; i < from_node.right.length; i++) {
      const [child, _] = from_node.right[i];
      const res = this.#_find_node(id, child);
      if (res) {
        return res;
      }
    }
    for (let i = 0; i < from_node.up.length; i++) {
      const [child, _] = from_node.up[i];
      const res = this.#_find_node(id, child);
      if (res) {
        return res;
      }
    }
    for (let i = 0; i < from_node.down.length; i++) {
      const [child, _] = from_node.down[i];
      const res = this.#_find_node(id, child);
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
      parentId: from_node.parent_id,
    }
  }
  #get_previous_sibling(of_node: FlowNode, dir: Direction): FlowNode | null {
    const parent = of_node.parent;
    if (parent) {
      switch (dir) {
        case Direction.LEFT: {
          const current_index = parent.left.findIndex(([node, _], _1: number) => node.id == of_node.id);
          if (current_index <= 0) {
            return null
          }
          return parent.left[current_index - 1][0]
        }
        case Direction.RIGHT: {
          const current_index = parent.right.findIndex(([node, _], _1: number) => node.id == of_node.id);
          if (current_index <= 0) {
            return null
          }
          return parent.right[current_index - 1][0]
        }
        case Direction.UP: {
          const current_index = parent.up.findIndex(([node, _], _1: number) => node.id == of_node.id);
          if (current_index <= 0) {
            return null
          }
          return parent.up[current_index - 1][0]
        }
        case Direction.DOWN: {
          const current_index = parent.down.findIndex(([node, _], _1: number) => node.id == of_node.id);
          if (current_index <= 0) {
            return null
          }
          return parent.down[current_index - 1][0]
        }
      }
    }
    return null
  }
  #get_position(of_node: FlowNode, dir: Direction) {
    const parent = of_node.parent;
    let position = of_node.position;

    if (parent) {
      const prev_sibling = this.#get_previous_sibling(of_node, dir);
      switch (dir) {
        case Direction.LEFT:
          position = { x: parent.position.x - of_node.width - of_node.padding.right - parent.padding.left, y: parent.position.y + parent.height / 2 - of_node.height / 2 }
          if (prev_sibling) {
            position.y = prev_sibling.position.y + prev_sibling.height + prev_sibling.padding.bottom + of_node.padding.top;
          }
          break;
        case Direction.RIGHT:
          position = { x: parent.position.x + parent.width + parent.padding.right + of_node.padding.left, y: parent.position.y + parent.height / 2 - of_node.height / 2 }
          if (prev_sibling) {
            position.y = prev_sibling.position.y + prev_sibling.height + prev_sibling.padding.bottom + of_node.padding.top;
          }
          break;
        case Direction.UP:
          position = { x: parent.position.x + parent.width / 2 - of_node.width / 2, y: parent.position.y - of_node.height - of_node.padding.bottom - parent.padding.top }
          if (prev_sibling) {
            position.x = prev_sibling.position.x + prev_sibling.width + prev_sibling.padding.right + of_node.padding.left;
          }
          break;
        case Direction.DOWN:
          position = { x: parent.position.x + parent.width / 2 - of_node.width / 2, y: parent.position.y + parent.height + parent.padding.bottom + of_node.padding.top }
          if (prev_sibling) {
            position.x = prev_sibling.position.x + prev_sibling.width + prev_sibling.padding.right + of_node.padding.left;
          }
          break
        default:
          throw new NotImplementedError();
      }
    }
    //position = { x: position.x + of_node.offset.x, y: position.y + of_node.offset.y }
    return position;
  }
  #center_children(from_node: FlowNode) {
    if (from_node.left.length > 0) {
      const first_node = from_node.left[0][0];
      const last_node = from_node.left[from_node.left.length - 1][0];
      const diff = last_node.position.y - first_node.position.y;
      let widest = 0;
      for (let i = 0; i < from_node.left.length; i++) {
        const [node, _] = from_node.left[i];
        node.position = { x: node.position.x, y: node.position.y - diff / 2 };
        if (node.width > widest) {
          widest = node.width;
        }
      }
      for (let i = 0; i < from_node.left.length; i++) {
        const [node, _] = from_node.left[i]
        node.position = { x: node.position.x - widest / 2 + node.width / 2 + node.offset.x, y: node.position.y + node.offset.y };
      }
    }
    if (from_node.down.length > 0) {
      const first_node = from_node.down[0][0];
      const last_node = from_node.down[from_node.down.length - 1][0];
      const diff = last_node.position.x - first_node.position.x;
      let tallest = 0;
      for (let i = 0; i < from_node.down.length; i++) {
        const [node, _] = from_node.down[i];
        node.position = { x: node.position.x - diff / 2, y: node.position.y };
        if (node.height > tallest) {
          tallest = node.height;
        }
      }
      for (let i = 0; i < from_node.down.length; i++) {
        const [node, _] = from_node.down[i];
        node.position = { x: node.position.x + node.offset.x, y: node.position.y + tallest / 2 - node.height / 2 + node.offset.y }
      }
    }
    if (from_node.up.length > 0) {
      const first_node = from_node.up[0][0]
      const last_node = from_node.up[from_node.up.length - 1][0]
      const diff = last_node.position.x - first_node.position.x;
      let tallest = 0;
      for (let i = 0; i < from_node.up.length; i++) {
        const [node, _] = from_node.up[i];
        node.position = { x: node.position.x - diff / 2, y: node.position.y };
        if (node.height > tallest) {
          tallest = node.height;
        }
      }
      for (let i = 0; i < from_node.up.length; i++) {
        const [node, _] = from_node.up[i];
        node.position = { x: node.position.x + node.offset.x, y: node.position.y - tallest / 2 + node.height / 2 + node.offset.y }
      }
    }
    if (from_node.right.length > 0) {
      const first_node = from_node.right[0][0];
      const last_node = from_node.right[from_node.right.length - 1][0];
      const diff = last_node.position.y - first_node.position.y;
      let widest = 0;
      for (let i = 0; i < from_node.right.length; i++) {
        const [node, _] = from_node.right[i];
        node.position = { x: node.position.x, y: node.position.y - diff / 2 };
        if (node.width > widest) {
          widest = node.width;
        }
      }
      for (let i = 0; i < from_node.right.length; i++) {
        const [node, _] = from_node.right[i];
        node.position = { x: node.position.x + widest / 2 - node.width / 2 + node.offset.x, y: node.position.y + node.offset.y }
      }
    }
  }
  #build_nodes(from_node: FlowNode): Array<FlowNode> {
    let final: Array<FlowNode> = [from_node];
    for (let i = 0; i < from_node.left.length; i++) {
      let [child, _] = from_node.left[i];
      child.position = this.#get_position(child, Direction.LEFT);
    }
    for (let i = 0; i < from_node.right.length; i++) {
      let [child, _] = from_node.right[i];
      child.position = this.#get_position(child, Direction.RIGHT);
    }
    for (let i = 0; i < from_node.up.length; i++) {
      let [child, _] = from_node.up[i];
      child.position = this.#get_position(child, Direction.UP);
    }
    for (let i = 0; i < from_node.down.length; i++) {
      let [child, _] = from_node.down[i];
      child.position = this.#get_position(child, Direction.DOWN);
    }
    this.#center_children(from_node)

    // recursively build children
    for (let i = 0; i < from_node.left.length; i++) {
      let [child, _] = from_node.left[i];
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.right.length; i++) {
      let [child, _] = from_node.right[i];
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.up.length; i++) {
      let [child, _] = from_node.up[i];
      final.push(...this.#build_nodes(child));
    }
    for (let i = 0; i < from_node.down.length; i++) {
      let [child, _] = from_node.down[i];
      final.push(...this.#build_nodes(child));
    }
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
      hidden: edge.disabled,
    }
  }
  #build_edges(from_node: FlowNode): Array<Edge> {
    let final: Array<Edge> = [];
    for (let i = 0; i < from_node.custom_edges.length; i++) {
      const edge = from_node.custom_edges[i]
      if (edge) {
        final.push(this.#build_edge(edge))
      }
    }
    for (let i = 0; i < from_node.left.length; i++) {
      let [child, edge] = from_node.left[i];
      if (edge) {
        final.push(this.#build_edge(edge), ...this.#build_edges(child));
      } else {
        final.push(...this.#build_edges(child))
      }
    }
    for (let i = 0; i < from_node.right.length; i++) {
      let [child, edge] = from_node.right[i];
      if (edge) {
        final.push(this.#build_edge(edge), ...this.#build_edges(child));
      } else {
        final.push(...this.#build_edges(child))
      }
    }
    for (let i = 0; i < from_node.up.length; i++) {
      let [child, edge] = from_node.up[i];
      if (edge) {
        final.push(this.#build_edge(edge), ...this.#build_edges(child));
      } else {
        final.push(...this.#build_edges(child))
      }
    }
    for (let i = 0; i < from_node.down.length; i++) {
      let [child, edge] = from_node.down[i];
      if (edge) {
        final.push(this.#build_edge(edge), ...this.#build_edges(child));
      } else {
        final.push(...this.#build_edges(child))
      }
    }
    return final;
  }
}
