'use client'
import { Background, ReactFlow, Controls, useNodesState, useEdgesState } from "@xyflow/react";
import styles from '@/components/react_flows/SingleGeneration.module.css';
import { useCallback, useState } from "react";
import { Card, CardBody, CardHeader, ModalBody, ModalHeader, useDisclosure } from "@nextui-org/react";
import Link from 'next/link';
import Image from 'next/image';
import Popup from "@/components/popup/Popup";
import { EDGE_TYPES, NODE_TYPES } from "@/lib/types";

// NOTE: IMAGES
import single_iteration_img from '@/public/single_generation/single_iteration.png';

const getId = (id: string) => {
    return `single_gen_${id}`;
}

let i = 0;
const incXPos = (factor: number = 250) => {
    return ++i * factor;
}
const getXPos = (factor: number = 200) => {
    return i * factor;
}
const getIteration = (id: string, image: any, text: string, x: number = 0, y: number = 0, ...props: any) => {
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
        position: { x: incXPos() + x, y: y },
        ...props
    }
}
const initial_nodes = [
    {
        id: getId('latents'),
        type: 'square',
        data: {
            name: "Latent Noisy Image Input Relevance Scores",
            disable_left: true,
            disable_right: true,
        },
        position: { x: incXPos(), y: 0 }
    },
    {
        id: getId('rgb'),
        type: 'rgb',
        data: {
            disable_right: true,
        },
        position: { x: getXPos() + 30, y: 100 }
    },
    {
        id: getId('pixel-1'),
        type: 'pixel',
        data: {
            color: '#4D527D',
            name: "B",
            disable_left: true,
        },
        position: { x: 60, y: 280 },
        parentId: getId('rgb'),
    },
    {
        id: getId('pixel-2'),
        type: 'pixel',
        data: {
            color: '#4D7D5B',
            name: "G",
            disable_left: true,
        },
        position: { x: 60, y: 160 },
        parentId: getId('rgb'),
    },
    {
        id: getId('pixel-3'),
        type: 'pixel',
        data: {
            color: '#7D4D4D',
            name: "R",
            disable_left: true,
        },
        position: { x: 60, y: 40 },
        parentId: getId('rgb'),
    },
    getIteration(getId('iter_0'), single_iteration_img, 'Iteration 0'),
    getIteration(getId('iter_1'), single_iteration_img, 'Iteration 1'),
    {
        id: getId('dots'),
        type: 'dots',
        position: { x: incXPos() + 50, y: 0 },
    },
    getIteration(getId('iter_49'), single_iteration_img, 'Iteration 49'),
    getIteration(getId('iter_50'), single_iteration_img, 'Iteration 50'),
    {
        id: getId('final_pred_noise'),
        type: "circle",
        data: {
            name: "Final Pred Noise",
            disable_right: true,
        },
        position: { x: incXPos(), y: 0 },
    },
]

const initial_edges = [
    {
        id: getId("final_pred_noise <- iter_50"),
        source: getId('final_pred_noise'),
        target: getId('iter_50'),
        animated: true,
    },
    {
        id: getId("iter_49 <- iter_50"),
        source: getId('iter_50'),
        target: getId('iter_49'),
        animated: true,
    },
    {
        id: getId('dots <- iter_49'),
        source: getId('iter_49'),
        target: getId('dots'),
        animated: true,
    },
    {
        id: getId('iter_1 <- dots'),
        source: getId('dots'),
        target: getId('iter_1'),
        animated: true,
    },
    {
        id: getId('iter_0 <- iter_1'),
        source: getId('iter_1'),
        target: getId('iter_0'),
        animated: true,
    }

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

const SingleGeneration = () => {
    const [edges, , onEdgesChange] = useEdgesState(initial_edges);
    const [nodes, , onNodesChange] = useNodesState(initial_nodes);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("")
    const handle_click = useCallback((_: any, node: any) => {
        switch (node.id) {
            case "prev_pred_noise2":
                setSelectedId(node.id)
                onOpen()
                break;
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

export default SingleGeneration;
