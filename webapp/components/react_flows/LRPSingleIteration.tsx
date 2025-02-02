"use client"
import { Background, Node, ReactFlow, Controls, NodeChange, Edge, ReactFlowInstance } from "@xyflow/react";
import styles from '@/components/react_flows/SDSingleIteration.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Direction, EDGE_TYPES, NODE_TYPES } from "@/lib/types";
import FlowGraph from "@/lib/FlowGraph";
import FlowNode from "@/lib/FlowNode";

const build_unet = (root: FlowNode, graph: FlowGraph) => {
    const box = root
        .insert_node(Direction.DOWN, {
            type: "box",
            data: {
                name: "Unet Backpropagation",
                height: `${100 * 12 + 90}px`,
                width: `${260 * 2 + 60}px`,

            },
            id: "box-container",
            padding: { top: 200 },
        })
    box
        .insert_node(Direction.DOWN, {
            type: "square",
            data: {
                name: "Relevance Scores For Imaage Input Latents"
            }
        })
    const inner_root = new FlowNode({
        type: "square",
        data: {
            name: "Prev Relevance Scores or Final Noise Prediction"
        },
        parent_id: "box-container",
        position: { x: 10, y: 75 },
    });
    let prev = inner_root
        .insert_node(Direction.DOWN, {
            type: "square",
            data: {
                name: "Conv2D Layer"
            },
            parent_id: "box-container",
        })

    for (let i = 0; i < 3; i++) {
        prev = prev
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Cross-Attention Up Block",
                    style: { background: "#312223", padding: "20px 0" }
                },
                parent_id: "box-container",
            })
        prev
            .insert_node(Direction.RIGHT, {
                type: "square",
                data: {
                    name: "Textual Relevance Scores"
                },
                parent_id: "box-container",
            })
    }
    const mid_block = prev
        .insert_node(Direction.DOWN, {
            type: "square",
            data: {
                name: "Regular Up Block",
            },
            parent_id: "box-container",
        })
        .insert_node(Direction.DOWN, {
            type: "square",
            data: {
                name: "Cross-Attention Mid Block",
                style: { background: "#342317", padding: "20px 0" }
            },
            parent_id: "box-container",
        })
    mid_block
        .insert_node(Direction.RIGHT, {
            type: "square",
            data: {
                name: "Textual Relevance Scores"
            },
            parent_id: "box-container",
        })
    prev = mid_block
        .insert_node(Direction.DOWN, {
            type: "square",
            data: {
                name: "Regular Down Block"
            },
            parent_id: "box-container",
        })
    for (let i = 0; i < 3; i++) {
        prev = prev
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Cross-Attention Down Block",
                    style: { background: "#222231", padding: "20px 0" }
                },
                parent_id: "box-container",
            })
        prev
            .insert_node(Direction.RIGHT, {
                type: "square",
                data: {
                    name: "Textual Relevance Scores"
                },
                parent_id: "box-container",
            })
    }
    prev
        .insert_node(Direction.DOWN, {
            type: "square",
            data: {
                name: "Conv2D Layer"
            },
            parent_id: "box-container",
        })
    graph.add_custom_node(inner_root);

    return box;
}

const LRPSingleIteration = () => {
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
                },
                disable_top_edge: true
            })
        const time_embeds = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Time Embeddings",
                    disable_bottom: false,
                },
                disable_top_edge: true
            })
        const prev_scores = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Prev Relevance Scores, or Final Noise Prediction",
                    disable_bottom: false,
                },
                disable_top_edge: true
            })
        const attn_weights = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Attention Weights",
                    disable_bottom: false,
                },
                disable_top_edge: true
            })
        const down_res = root
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "Down Block Residuals",
                    disable_bottom: false,
                },
                disable_top_edge: true
            })
        const box = build_unet(prev_scores, _graph);
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

export default LRPSingleIteration;
