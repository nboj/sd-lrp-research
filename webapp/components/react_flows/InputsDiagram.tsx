'use client'
import { Background, ReactFlow, Controls, useNodesState, useEdgesState } from "@xyflow/react";
import { useCallback, useState } from "react"
import { EDGE_TYPES, NODE_TYPES } from "@/lib/types"
import { Card, CardBody, CardHeader, ModalBody, ModalHeader, useDisclosure } from "@nextui-org/react"
import Image from 'next/image';
import Popup from "@/components/popup/Popup";
import styles from '@/components/react_flows/InputsDiagram.module.css';

import noise from '@/public/inputs_diagram/noise.png';
import text_embeddings from '@/public/inputs_diagram/text_embeddings.png';
import time_embeddings from '@/public/inputs_diagram/time_embeddings.png';
import rgb_popup_img from '@/public/inputs_diagram/noise.png';


const initial_nodes = [
    {
        id: 'title',
        type: 'title',
        data: {
            name: "Inputs",
        },
        position: { x: 135, y: -220 }
    },
    {
        id: 'rgbAlt_img',
        type: 'image',
        data: {
            image: noise,
            text: 'Initial Noise',
            width: "300px",
        },
        position: { x: 0, y: 0 }
    },
    {
        id: 'rgbAlt',
        type: 'rgbAlt',
        data: {
            disable_left: true,
            disable_right: true,
            disable_bottom: false
        },
        position: { x: 0, y: 0 }
    },
    {
        id: 'pixel-1',
        type: 'pixel',
        data: {
            color: '#4D527D',
            name: "B",
            disable_left: true,
            disable_right: true,
        },
        position: { x: 280, y: 60 },
        parentId: 'rgbAlt',
    },
    {
        id: 'pixel-2',
        type: 'pixel',
        data: {
            color: '#4D7D5B',
            name: "G",
            disable_left: true,
            disable_right: true,
        },
        position: { x: 160, y: 60 },
        parentId: 'rgbAlt',
    },
    {
        id: 'pixel-3',
        type: 'pixel',
        data: {
            color: '#7D4D4D',
            name: "R",
            disable_left: true,
            disable_right: true,

        },
        position: { x: 40, y: 60 },
        parentId: 'rgbAlt',
    },
    {
        id: 'text_input_embeds_img',
        type: 'image',
        data: {
            image: text_embeddings,
            text: 'Textual Heatmap',
            width: "300px",
        },
        position: { x: 0, y: 0 }
    },
    {
        id: 'text_input_embeds',
        type: 'squareWrap',
        data: {
            name: "Text Input\nEmbeddings",
            disable_left: true,
            disable_right: true,
            disable_bottom: false
        },
        position: { x: -250, y: 50 }
    },
    {
        id: 'time_input_embeds_img',
        type: 'image',
        data: {
            image: time_embeddings,
            text: 'Textual Heatmap',
            width: "300px",
        },
        position: { x: 0, y: 0 }
    },
    {
        id: 'time_input_embeds',
        type: 'squareWrap',
        data: {
            name: "Time Input\nEmbeddings",
            disable_left: true,
            disable_right: true,
            disable_bottom: false
        },
        position: { x: 450, y: 50 }
    },
    {
        id: 'Init_Rand',
        type: 'square',
        data: {
            name: "Initial Random Noise Latent Input",
            disable_left: true,
            disable_right: true,
        },
        position: { x: 70, y: -120 }
    },
    {
        id: 'Unet',
        type: 'square',
        data: {
            name: "Unet",
            disable_left: true,
            disable_right: true,
            disable_top: false,
        },
        position: { x: 70, y: 600 }
    },
]

const initial_edges = [
    {
        id: "etext_input_embeds-unet",
        type: 'image',
        data: {
            node: 'text_input_embeds_img',
            keyframes: [
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
                { opacity: 0, },
            ],
            dur: 2000,
            delay: 700,
        },
        animated: true,
        source: "text_input_embeds",
        target: 'Unet'
    },
    {
        id: "etime-unet",
        type: 'image',
        data: {
            node: 'time_input_embeds_img',
            keyframes: [
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
                { opacity: 0, },
            ],
            dur: 2000,
            delay: 700,
        },
        animated: true,
        source: "time_input_embeds",
        target: 'Unet'
    },
    {
        id: "ergb-unet",
        type: 'image',
        data: {
            node: 'rgbAlt_img',
            keyframes: [
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
                { opacity: 0, },
            ],
            dur: 2000,
            delay: 700,
        },
        animated: true,
        source: "rgbAlt",
        target: 'Unet'
    },
]

const PopupBody = ({ node_id }: any) => {
    switch (node_id) {
        case "Unet":
            return (
                <>
                </>
            )
        case "text_input_embeds":
            return (
                <>
                    <ModalHeader className="flex flex-col gap-1">Text Input Embeddings</ModalHeader>
                    <ModalBody>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique.
                            Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna.
                        </p>
                        <div>
                            <Image src={text_embeddings} alt='' className={'rounded-[5px] mx-auto'} />
                        </div>
                    </ModalBody>
                </>
            )
        case "time_input_embeds":
            return (
                <>
                    <ModalHeader className="flex flex-col gap-1">Time Input Embeddings</ModalHeader>
                    <ModalBody>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique.
                            Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna.
                        </p>
                        <div>
                            <Image src={time_embeddings} alt='' className={'rounded-[5px] mx-auto'} />
                        </div>
                    </ModalBody>
                </>
            )
        case "Init_Rand":
        case "rgbAlt":
        case "pixel-1":
        case "pixel-2":
        case "pixel-3":
            return (
                <>
                    <ModalHeader className="flex flex-col gap-1">Initial Random Noise Latent Input</ModalHeader>
                    <ModalBody>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique.
                            Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna.
                        </p>
                        <div>
                            <Image src={rgb_popup_img} alt='' className={'rounded-[5px] mx-auto'} />
                        </div>
                    </ModalBody>
                </>
            )
        default:
            return (
                <ModalHeader className="flex flex-col gap-1">Error.</ModalHeader>
            )
    }
}
PopupBody.displayName = 'PopupBody';

const InputsDiagram = () => {
    const [nodes, , onNodesChange] = useNodesState(initial_nodes);
    const [edges, , onEdgesChange] = useEdgesState(initial_edges);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("")
    const handle_click = useCallback((_: any, node: any) => {
        switch (node.id) {
            //case "Init_Rand":
            //case "Unet":
            //case "text_input_embeds":
            //case "time_input_embeds":
            //case "rgbAlt":
            //case "pixel-1":
            //case "pixel-2":
            //case "pixel-3":
            //    setSelectedId(node.id)
            //    onOpen()
            //    break;
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
                id='flow-3'
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
                <Background id="bg-1" />
                <Controls
                    showInteractive={false}
                    showZoom={false}
                    className={styles.controls}
                />

            </ReactFlow>
        </div>
    );
};
export default InputsDiagram;
