"use client"
import { Background, Node, ReactFlow, Controls, useNodesState, useEdgesState, OnNodesChange, NodeChange, EdgeChange, useReactFlow, Edge, useUpdateNodeInternals } from "@xyflow/react";
import styles from '@/components/react_flows/SingleGeneration.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalHeader } from "@nextui-org/react";
import { Direction, EDGE_TYPES, NODE_TYPES } from "@/lib/types";
import FlowNode from "@/lib/FlowNode";
import FlowGraph from "@/lib/FlowGraph";
import single_iteration_img from '@/public/single_generation/single_iteration.png';

const PopupBody = ({ node_id }: any) => {
    switch (node_id) {
        default:
            return (
                <ModalHeader className="flex flex-col gap-1">Error.</ModalHeader>
            )
    }
}
PopupBody.displayName = 'PopupBody3';

const root = new FlowNode({
    id: "node0",
    type: "circle",
    data: {
        name: "test"
    },
})
root
    .insert_node(Direction.DOWN, {
        id: "node1",
        type: "square",
        data: {
            name: "hello",
            image: single_iteration_img,
            width: '400px'
        }
    })
    .insert_node(Direction.RIGHT, {
        id: "node2",
        type: "square",
        data: {
            name: "hello",
            image: single_iteration_img,
        }
    })
    .insert_node(Direction.DOWN, {
        id: "node3",
        type: "square",
        data: {
            name: "hello",
            image: single_iteration_img,
        }
    })
    .insert_node(Direction.DOWN, {
        id: "node4",
        type: "square",
        data: {
            name: "hello",
            image: single_iteration_img,
        }
    })
    .insert_node(Direction.LEFT, {
        id: "node5",
        type: "square",
        data: {
            name: "hello",
            image: single_iteration_img,
        }
    })
    .insert_node(Direction.UP, {
        id: "node6",
        type: "square",
        data: {
            name: "hello",
            image: single_iteration_img,
        }
    })
    .insert_node(Direction.LEFT, {
        id: "node7",
        type: "square",
        data: {
            name: "hello",
            image: single_iteration_img,
        }
    })
    .insert_node(Direction.DOWN, {
        id: "node8",
        type: "square",
        data: {
            name: "hello",
            image: single_iteration_img,
        }
    })
const graph = new FlowGraph(root)
const initial_nodes = graph.build_nodes()
const initial_edges = graph.build_edges()
console.log(initial_nodes)
console.log(initial_edges)
const SDInputs = () => {
    const [edges, setEdges] = useState<Array<Edge>>(initial_edges);
    const [nodes, setNodes] = useState<Array<Node>>(initial_nodes);
    const prev_changes = useRef<NodeChange[]>([]);
    const change_handler_ref = useRef<any>(null);
    const handle_click = useCallback((_: any, node: any) => {
        switch (node.id) {
            default: break;
        }
    }, [])
    const onNodesChange = (changes: NodeChange[]) => {
        if (change_handler_ref.current) {
            change_handler_ref.current();
        }
        if (changes.length != prev_changes?.current.length || changes.every((item, index: number) => item != changes[index])) {
            prev_changes.current = changes;
            graph.set_node_changes(changes);
            setNodes(graph.build_nodes());
        }
    }
    return (
        <div className={styles.wrapper}>
            <ReactFlow
                id="flow-3"
                nodeTypes={NODE_TYPES}
                edgeTypes={EDGE_TYPES}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                nodesDraggable={false}
                zoomOnScroll={true}
                nodesConnectable={false}
                elementsSelectable={false}
                onNodeClick={handle_click}
                zoomOnDoubleClick={false}
                fitView
            >
                <Background id="bg-2" />
                <Controls
                    showInteractive={false}
                    showZoom={false}
                    className={styles.controls}
                />
            </ReactFlow>
        </div>
    )
}

export default SDInputs;
