"use client"
import { Background, Node, ReactFlow, Controls, NodeChange, Edge, ReactFlowInstance } from "@xyflow/react";
import styles from '@/components/react_flows/TestingExample.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Direction, EDGE_TYPES, NODE_TYPES } from "@/lib/types";
import FlowGraph from "@/lib/FlowGraph";

const TestingExample = () => {
    const graph = useMemo(() => {
        const _graph = new FlowGraph({
            type: 'circle',
            data: {
                name: "Testing Root"
            },
        })
        const root = _graph.root;
        root.insert_node(Direction.DOWN, {
            type: "square",
            data: {
                name: "Node 1"
            }
        })
        root.insert_node(Direction.LEFT, {
            type: "square",
            data: {
                name: "Node 1"
            }
        })
        root.insert_node(Direction.LEFT, {
            type: "square",
            data: {
                name: "Node 1"
            }
        })
        root.insert_node(Direction.LEFT, {
            type: "square",
            data: {
                name: "Node 1"
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
                id="flow-5"
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
                <Background />
                <Controls
                    showInteractive={false}
                    showZoom={false}
                    className={styles.controls}
                />
            </ReactFlow>
        </div>
    )
}

export default TestingExample;
