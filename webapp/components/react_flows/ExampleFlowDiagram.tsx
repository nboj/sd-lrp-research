"use client"
import { Background, Node, ReactFlow, Controls, NodeChange, Edge, ReactFlowInstance } from "@xyflow/react";
import styles from '@/components/react_flows/SingleGeneration.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Direction, EDGE_TYPES, NODE_TYPES } from "@/lib/types";
import FlowGraph from "@/lib/FlowGraph";
import FlowNode from "@/lib/FlowNode";
import single_iteration_img from '@/public/single_generation/single_iteration.png';

const build_rgb = (root: FlowNode, graph: FlowGraph) => {
    root
        .insert_node(Direction.LEFT, {
            type: 'square',
            data: {
                name: "Latent Noisy input Image Relevance Scores"
            },
            disable_right_edge: true,
            offset: { x: -300, y: 0 },
            padding: { bottom: 0 },
        })
    const rgb = root
        .insert_node(Direction.LEFT, {
            id: "test_rgb_node",
            type: "rgb",
            data: {
            },
            offset: { x: -300, y: 0 },
            disable_right_edge: true,
        })
    const red_node = new FlowNode({
        type: "pixel",
        data: {
            name: "R",
            color: '#7D4D4D',
            disable_right: false,
        },
        position: { x: 60, y: 40 },
        parent_id: "test_rgb_node"
    })
    const green_node = red_node
        .insert_node(Direction.DOWN, {
            type: "pixel",
            data: {
                name: "G",
                color: '#4D7D5B',
                disable_right: false,
            },
            disable_top_edge: true,
            parent_id: "test_rgb_node"
        })
    const blue_node = green_node
        .insert_node(Direction.DOWN, {
            type: "pixel",
            data: {
                name: "B",
                color: '#4D527D',
                disable_right: false,
            },
            disable_top_edge: true,
            parent_id: "test_rgb_node"
        })
    graph.add_custom_node(red_node);
    root.connect_node(red_node, Direction.LEFT);
    root.connect_node(green_node, Direction.LEFT);
    root.connect_node(blue_node, Direction.LEFT);
    return rgb;
}
const ExampleFlowDiagram = () => {
    const graph = useMemo(() => {
        const _graph = new FlowGraph({
            type: 'circle',
            data: {
                name: "Final Pred Noise"
            }
        })
        const root = _graph.root
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
                id: "testtsss",
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
                //offset: { x: -300, y: 0 }
            })
        dots
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "test 1"
                },
            })
        dots
            .insert_node(Direction.DOWN, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    text: "test 2"
                },
            })
        dots
            .insert_node(Direction.DOWN, {
                type: "square",
                data: {
                    name: "test 3"
                },
            })
        dots
            .insert_node(Direction.UP, {
                type: "square",
                data: {
                    name: "test 1"
                },
                offset: { x: 0, y: -50 }
            })
        dots
            .insert_node(Direction.UP, {
                type: "square",
                data: {
                    name: "test 1"
                },
                offset: { x: 0, y: -50 }
            })
        const test1 = dots
            .insert_node(Direction.UP, {
                type: "square",
                data: {
                    name: "test 3"
                },
                offset: { x: 0, y: -50 }
            })
        test1
            .insert_node(Direction.UP, {
                type: "square",
                data: {
                    name: "test"
                },
                reverse_edge: true,
            })
        test1
            .insert_node(Direction.UP, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    text: "test"
                },
                offset: { x: 0, y: -20 },
                reverse_edge: true
            })
        test1
            .insert_node(Direction.UP, {
                type: "image",
                data: {
                    image: single_iteration_img,
                    text: "test"
                },
                offset: { x: 0, y: -20 },
                reverse_edge: true
            })
        test1
            .insert_node(Direction.UP, {
                type: "square",
                data: {
                    name: "test"
                },
                reverse_edge: true
            })
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
                },
                offset: { x: 0, y: 120 }
            })
        const rgb_node = build_rgb(last_iteration_node, _graph);
        last_iteration_node
            .insert_node(Direction.LEFT, {
                type: 'square',
                data: {
                    name: "test3"
                },
                offset: { x: 0, y: -120 }
            })
        rgb_node
            .insert_node(Direction.LEFT, {
                type: 'square',
                data: {
                    name: "Previous Pred Noise"
                }
            })
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
                id="flow-100"
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

export default ExampleFlowDiagram;
