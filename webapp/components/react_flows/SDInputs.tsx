"use client"
import { Background, Node, ReactFlow, Controls, useNodesState, useEdgesState, OnNodesChange, NodeChange, EdgeChange } from "@xyflow/react";
import styles from '@/components/react_flows/SingleGeneration.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardBody, CardHeader, Image, ModalBody, ModalHeader, useDisclosure } from "@nextui-org/react";
import Popup from "@/components/popup/Popup";
import { Direction, EDGE_TYPES, NODE_TYPES } from "@/lib/types";
import FlowNode from "@/lib/FlowNode";
import FlowGraph from "@/lib/FlowGraph";
import single_iteration_img from '@/public/single_generation/single_iteration.png';

const initial_edges: any[] = []
const PopupBody = ({ node_id }: any) => {
    switch (node_id) {
        default:
            return (
                <ModalHeader className="flex flex-col gap-1">Error.</ModalHeader>
            )
    }
}
PopupBody.displayName = 'PopupBody3';

const SDInputs = () => {
    const root: FlowNode = useMemo(() => new FlowNode('circle', {
        name: "Stable Diffusion Inputs",
    }), [])
    const graph: FlowGraph = useMemo(() => new FlowGraph(root), [])
    const [edges, , onEdgesChange] = useEdgesState(initial_edges);
    const [nodes, setNodes] = useState<Array<Node>>([]);
    const prev_changes = useRef<NodeChange[]>([]);
    useEffect(() => {
        root
            .insert_node(Direction.DOWN, 'image', {
                image: single_iteration_img,
                name: 'hello',
                text: "hello",
                width: "400px"
            })
            .insert_node(Direction.DOWN, 'image', {
                image: single_iteration_img,
                name: 'hello',
                text: "hello",
            })
            .insert_node(Direction.DOWN, 'image', {
                image: single_iteration_img,
                name: 'hello',
                text: "hello",
            })
            .insert_node(Direction.RIGHT, 'image', {
                image: single_iteration_img,
                name: 'hello',
                text: "hello",
            })
            .insert_node(Direction.RIGHT, 'image', {
                image: single_iteration_img,
                name: 'hello',
                text: "hello",
            })
            .insert_node(Direction.RIGHT, 'image', {
                image: single_iteration_img,
                name: 'hello',
                text: "hello",
            })
        setNodes(graph.build_nodes());
    }, [])
    const handle_click = useCallback((_: any, node: any) => {
        switch (node.id) {
            default: break;
        }
    }, [])
    const onNodesChange = (changes: NodeChange[]) => {
        console.log('changes', changes)
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
                onEdgesChange={onEdgesChange}
                fitView
                nodesDraggable={false}
                zoomOnScroll={true}
                nodesConnectable={false}
                elementsSelectable={false}
                onNodeClick={handle_click}
                zoomOnDoubleClick={false}
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
