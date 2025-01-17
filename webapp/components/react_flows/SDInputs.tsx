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

type FlowContentProps = Readonly<{
    root: FlowNode;
    change_handler_ref: React.RefObject<any>;
    onUpdateNodes: () => void;
}>
const FlowContent = ({ root, onUpdateNodes, change_handler_ref }: FlowContentProps) => {
    const { fitView } = useReactFlow();
    useEffect(() => {
        root
            .insert_node(Direction.RIGHT, {
                type: "square",
                data: {
                    name: "test 1"
                }
            })
        root
            .insert_node(Direction.RIGHT, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    name: "test 2",
                }
            })
        root
            .insert_node(Direction.RIGHT, {
                type: "square",
                data: {
                    name: "test 3"
                }
            })
        const dots = root
            .insert_node(Direction.LEFT, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    text: "Iteration 50",
                }
            })
            .insert_node(Direction.LEFT, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    text: "Iteration 49",
                }
            })
            .insert_node(Direction.LEFT, {
                type: "dots",
                data: {
                },
                offset: { x: -300, y: 0 }
            })
        dots
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "test 1"
                }
            })
        dots
            .insert_node(Direction.DOWN, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    text: "test 2"
                }
            })
        dots
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "test 3"
                }
            })
        dots
            .insert_node(Direction.UP, {
                type: "square",
                data: {
                    name: "test 1"
                }
            })
        dots
            .insert_node(Direction.UP, {
                type: "square",
                data: {
                    name: "test 1"
                }
            })
        dots
            .insert_node(Direction.UP, {
                type: "square",
                data: {
                    name: "test 3"
                }
            })
        dots
        const last_iteration_node = dots
            .insert_node(Direction.LEFT, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    text: "Iteration 1",
                }
            })
            .insert_node(Direction.LEFT, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    text: "Iteration 0",
                }
            })
        last_iteration_node
            .insert_node(Direction.LEFT, {
                type: 'square',
                data: {
                    name: "Text Embeddings Relevance Scores"
                }
            })
        const rgb_node = last_iteration_node
            .insert_node(Direction.LEFT, {
                type: 'rgb',
                data: {
                }
            })
        last_iteration_node
            .insert_node(Direction.LEFT, {
                type: 'square',
                data: {
                    name: "test3"
                }
            })
        rgb_node
            .insert_node(Direction.LEFT, {
                type: 'square',
                data: {
                    name: "Previous Pred Noise"
                }
            })
        onUpdateNodes();
        change_handler_ref.current = () => {
            fitView();
        };
    }, [root])
    return (
        <>
            <Background id="bg-2" />
            <Controls
                showInteractive={false}
                showZoom={false}
                className={styles.controls}
            />
        </>

    )
}

const SDInputs = () => {
    const graph = useMemo(() => new FlowGraph({
        type: 'circle',
        data: {
            name: "Final Pred Noise"
        }
    }), [])
    const [edges, setEdges] = useState<Array<Edge>>([]);
    const [nodes, setNodes] = useState<Array<Node>>([]);
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
        if (changes.length != prev_changes.current.length ||
            changes.every((item, index: number) => item != changes[index])) {
            prev_changes.current = changes;
            graph.set_node_changes(changes);
            setNodes(graph.build_nodes());
            setEdges(graph.build_edges());
        }
    }
    const handleUpdateNodes = () => {
        setNodes(graph.build_nodes())
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
                <FlowContent root={graph.root} change_handler_ref={change_handler_ref} onUpdateNodes={handleUpdateNodes} />
            </ReactFlow>
        </div>
    )
}

export default SDInputs;
