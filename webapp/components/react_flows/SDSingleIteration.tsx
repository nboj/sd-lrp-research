"use client"
import { Background, Node, ReactFlow, Controls, NodeChange, Edge, ReactFlowInstance } from "@xyflow/react";
import styles from '@/components/react_flows/SDSingleIteration.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Direction, EDGE_TYPES, NODE_TYPES } from "@/lib/types";
import FlowGraph from "@/lib/FlowGraph";
import single_iteration_img from '@/public/single_generation/single_iteration.png';
import final_output from '@/public/single_iteration/less_noise.png';
import input_noise from '@/public/single_generation/noise_test_results/noise-0.png';

const SDSingleIteration = () => {
    const graph = useMemo(() => {
        const _graph = new FlowGraph({
            type: 'square',
            data: {
                name: "Retrieve Tensors From Files"
            },
        })
        const root = _graph.root
        const activations = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Activations",
                    disable_bottom: false,
                }
            })
        const time_embeds = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Time Embeddings",
                    disable_bottom: false,
                }
            })
        const prev_scores = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Prev Relevance Scores, or Final Noise Prediction",
                    disable_bottom: false,
                }
            })
        const attn_weights = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Attention Weights",
                    disable_bottom: false,
                }
            })
        const down_res = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Down Block Residuals",
                    disable_bottom: false,
                }
            })
        const box = prev_scores
            .insert_node(Direction.DOWN, {
                type: "rgb",
                data: {}
            })
        box
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Relevance Scores For Imaage Input Latents"
                }
            })
        activations.connect_node(box, Direction.DOWN);
        time_embeds.connect_node(box, Direction.DOWN);
        attn_weights.connect_node(box, Direction.DOWN);
        down_res.connect_node(box, Direction.DOWN);
        return _graph;
    }, [])
    const [edges, setEdges] = useState<Array<Edge>>([]);
    const [nodes, setNodes] = useState<Array<Node>>([]);
    const prev_changes = useRef<NodeChange[]>([]);
    useEffect(() => {
        setEdges(graph.build_edges());
        setNodes(graph.build_nodes());
    }, [graph])
    const handle_click = useCallback((_: any, node: any) => {
        switch (node.id) {
            default: break;
        }
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
            <ReactFlow
                id="flow-3"
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

export default SDSingleIteration;
