'use client'
import { Background, ReactFlow, Controls, useNodesState, useEdgesState } from "@xyflow/react";
import styles from '@/components/react_flows/SingleGeneration.module.css';
import { useCallback, useState } from "react";
import { Card, CardBody, CardHeader, Image, ModalBody, ModalHeader, useDisclosure } from "@nextui-org/react";
import Popup from "@/components/popup/Popup";
import { EDGE_TYPES, NODE_TYPES } from "@/lib/types";

const getId = (id: string) => {
    return `full_overview_${id}`;
}

let x = 0;
const incXPos = (factor: number = 260) => {
    return x += factor;
}
const getXPos = () => {
    return x;
}
const getIteration = (id: string, image: any, text: string, x: number = incXPos(), y: number = 0, ...props: any) => {
    return {
        id: id,
        type: 'image',
        data: {
            image: image,
            text: text,
            width: '200px',
            disable_left: false,
            disable_right: false,
        },
        position: { x: x, y: y },
        ...props
    }
}
let kf = 5;
const getDur = () => {
    return 5000;
}
const addNode = () => { }
const getKeyframes = () => {
    const delay = kf;
    return [
        ...Array.from({ length: 7 - delay }).map(() => ({ opacity: 0 })),
        ...Array.from({ length: 7 - delay }).map(() => ({ opacity: 0 })),
        ...Array.from({ length: 7 - delay }).map(() => ({ opacity: 0 })),
        ...Array.from({ length: 7 - delay }).map(() => ({ opacity: 0 })),
        {
            offsetDistance: '0%',
            opacity: 1,
            transform: `scale(1)`
        },
        { opacity: 1, },
        { opacity: 1, },
        {
            offsetDistance: '100%',
            opacity: 0,
            transform: `scale(0.4)`,
        },
        ...Array.from({ length: delay }).map(() => ({ opacity: 0 })),
        ...Array.from({ length: delay }).map(() => ({ opacity: 0 })),
        ...Array.from({ length: delay }).map(() => ({ opacity: 0 })),
        ...Array.from({ length: delay }).map(() => ({ opacity: 0 })),
    ]
}

const incKeyframes = () => {
    const keyframes = getKeyframes();
    kf--;
    return keyframes;
}

const initial_nodes: any = [
    {
        id: getId('text_input'),
        type: 'square',
        data: {
            name: "Text Input",
            disable_left: true,
            disable_right: true,
            disable_bottom: false
        },
        position: { x: getXPos(), y: 0 },
    },
    {
        id: getId('text_encoder'),
        type: 'square',
        data: {
            name: "Text Encoder",
            disable_left: true,
            disable_right: true,
            disable_top: false,
            disable_bottom: false
        },
        position: { x: getXPos(), y: 100 },
    },
    {
        id: getId('initial_input_latents'),
        type: 'square',
        data: {
            name: "Initial Input Latents",
        },
        position: { x: incXPos(), y: 0 },
    },
    {
        id: getId('timestep'),
        type: 'square',
        data: {
            name: "Timestep",
        },
        position: { x: incXPos(), y: 0 },
    },
]

const initial_edges: any = [
    {
        id: getId("e1-1"),
        animated: true,
        source: getId("text_input"),
        target: getId('text_encoder')
    },
]

const PopupBody = ({ node_id }: any) => {
    switch (node_id) {
        default:
            return (
                <ModalHeader className="flex flex-col gap-1">Error.</ModalHeader>
            )
    }
}
PopupBody.displayName = 'PopupBody2';

const FullDiagram = () => {
    const [edges, , onEdgesChange] = useEdgesState(initial_edges);
    const [nodes, , onNodesChange] = useNodesState(initial_nodes);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("")
    const handle_click = useCallback((_: any, node: any) => {
        switch (node.id) {
            default: break;
        }
    }, [])
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
                id="flow-2"
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

export default FullDiagram;
