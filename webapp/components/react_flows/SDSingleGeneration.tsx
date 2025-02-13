"use client"
import { Background, Node, ReactFlow, Controls, NodeChange, Edge, ReactFlowInstance } from "@xyflow/react";
import styles from '@/components/react_flows/SDSingleGeneration.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Direction, EDGE_TYPES, NODE_TYPES, NodeTypeKey } from "@/lib/types";
import FlowGraph from "@/lib/FlowGraph";
import single_iteration_img from '@/public/single_generation/single_iteration.png';
import final_output from '@/public/single_iteration/less_noise.png';
import input_noise from '@/public/single_generation/noise_test_results/noise-0.png';
import FlowNode from "@/lib/FlowNode";
import { Card, CardBody, CardHeader, Image, ModalBody, ModalHeader, useDisclosure } from "@nextui-org/react";
import Popup from "../popup/Popup";
import SingleGenerationRemake from "./SingleGenerationRemake";


const PopupBody = ({ node_id }: any) => {
    switch (node_id) {
        default:
            return (
                <>
                    <ModalHeader className="flex flex-col gap-1">Predicted Noise</ModalHeader>
                    <ModalBody>
                        {/*@ts-ignore*/}
                        <SingleGenerationRemake />
                    </ModalBody>
                </>
            )
    }
}

const add_row = (root: FlowNode, dir: Direction, starting_index: number, type?: NodeTypeKey, data?: any, props?: any): FlowNode => {
    let prev = root
        .insert_node(Direction.DOWN, {
            type: type ?? "image",
            data: data ?? {
                text: `Iteration ${starting_index}`,
                image: single_iteration_img
            },
            ...props,
            id: `${props.id}-0`,
        })
    for (let i = 0; i < 4; i++) {
        prev = prev
            .insert_node(dir, {
                type: type ?? "image",
                data: data ?? {
                    text: `Iteration ${i + starting_index + 1}`,
                    image: single_iteration_img
                },
                ...props,
                id: `${props.id}-${i + 1}`,
                offset: { x: 0, y: 0 }
            })
    }
    return prev;
}

const SDSingleGeneration = () => {
    const graph = useMemo(() => {
        const _graph = new FlowGraph({
            type: 'square',
            data: {
                name: "Inputs"
            },
            id: "inputsssss",
            padding: { top: 0 }
        })
        const root = _graph.root
        root
            .insert_node(Direction.UP, {
                type: 'image',
                data: {
                    text: "Initial Noise Latent Input",
                    image: input_noise,
                    width: "300px",
                    height: "200px",
                },
                id: "inputs-display",
                disable_bottom_edge: true,
            })
        let prev = add_row(root, Direction.RIGHT, 1, undefined, undefined, { id: "row_1" });
        prev = add_row(prev, Direction.LEFT, 6, undefined, undefined, { id: "row_2" });
        //prev = add_row(prev, Direction.RIGHT, 0, "dots", {}, { padding: { right: 45 }, offset: { x: 50, y: 0 } });
        prev = prev
            .insert_node(Direction.DOWN, {
                type: "dots",
                data: {},
                offset: { x: 400, y: 0 },
                id: "dots"
            })
        prev = add_row(prev, Direction.LEFT, 41, undefined, undefined, { offset: { x: 365, y: 0 }, id: "row_3" });
        prev = add_row(prev, Direction.RIGHT, 46, undefined, undefined, { id: "row_4" });
        prev
            .insert_node(Direction.DOWN, {
                type: "image",
                data: {
                    text: "Final Generated Image",
                    image: final_output,
                    width: "300px",
                    height: '200px',
                },
                id: "outputsyyyr"
            })
        return _graph;
    }, [])
    const [edges, setEdges] = useState<Array<Edge>>([]);
    const [nodes, setNodes] = useState<Array<Node>>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("");
    const prev_changes = useRef<NodeChange[]>([]);
    useEffect(() => {
        setEdges(graph.build_edges());
        setNodes(graph.build_nodes());
    }, [graph])
    const handle_click = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedId(node.id);
        onOpen()
    }, [])
    const handleNodesChange = useCallback((changes: NodeChange[]) => {
        if (changes.length != prev_changes.current.length ||
            changes.every((item, index: number) => item != changes[index])) {
            prev_changes.current = changes;
            graph.set_node_changes(changes);
            setNodes(graph.build_nodes());
            setEdges(graph.build_edges());
        }
    }, [])
    const handleInit = (instance: ReactFlowInstance<Node, Edge>) => {
        instance.fitView();
    }
    return (
        <div className={styles.wrapper}>
            <Popup
                scrollBehavior={'inside'}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <PopupBody node_id={selectedId} />
            </Popup>
            <ReactFlow
                id="flow-4"
                nodeTypes={NODE_TYPES}
                edgeTypes={EDGE_TYPES}
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onInit={handleInit}
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

export default SDSingleGeneration;
