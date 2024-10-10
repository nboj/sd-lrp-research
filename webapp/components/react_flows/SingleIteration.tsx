'use client'
import { Background, ReactFlow, Controls, useNodesState, useEdgesState } from "@xyflow/react"
import styles from '@/components/react_flows/SingleIteration.module.css'
import { useCallback, useState } from "react"
import { Card, CardBody, CardFooter, CardHeader, ModalBody, ModalHeader, useDisclosure } from "@nextui-org/react"
import Link from 'next/link';
import Image from 'next/image';
import Popup from "@/components/popup/Popup";
import { EDGE_TYPES, NODE_TYPES } from "@/lib/types"

// NOTE: IMAGES
import less_noise_img from '@/public/single_iteration/less_noise.png';
import more_noise_img from '@/public/single_iteration/more_noise.png';
import unet_img from '@/public/single_iteration/unet.png';
import time_embeds_img from '@/public/single_iteration/time_embeds_visual.png';
import sd_overview from '@/public/single_iteration/stable-diffusion-overview.png';
import text_rel_scores from '@/public/single_iteration/text_relevance_scores.png';
import lrp_heatmap from '@/public/single_iteration/lrp_heatmap.png';
import noise_example from '@/public/single_iteration/noise_example.png';


let i = 0;
const incXPos = (factor: number = 350) => {
    return ++i * factor;
}
const getXPos = (factor: number = 350) => {
    return i * factor;
}
const initial_nodes = [
    {
        id: 'prev_pred_img',
        type: 'image',
        data: {
            image: lrp_heatmap,
            text: "LRP Heatmap",
        },
        position: { x: 0, y: 0 },
    },
    {
        id: 'prev_pred_noise',
        type: 'circle',
        data: {
            name: "Previous Pred Noise",
            disable_left: true,
        },
        position: { x: getXPos(), y: 250 }
    },
    {
        id: 'latents',
        type: 'square',
        data: {
            name: "Latent Noisy Image Input Relevance Scores",
            disable_left: true,
            disable_right: true,
        },
        position: { x: incXPos(), y: 0 }
    },
    {
        id: 'rgb',
        type: 'rgb',
        data: {
            disable_right: true,
        },
        position: { x: getXPos() + 30, y: 100 }
    },
    {
        id: 'pixel-1',
        type: 'pixel',
        data: {
            color: '#4D527D',
            name: "B",
            disable_left: true,
        },
        position: { x: 60, y: 280 },
        parentId: 'rgb',
    },
    {
        id: 'pixel-2',
        type: 'pixel',
        data: {
            color: '#4D7D5B',
            name: "G",
            disable_left: true,
        },
        position: { x: 60, y: 160 },
        parentId: 'rgb',
    },
    {
        id: 'pixel-3',
        type: 'pixel',
        data: {
            color: '#7D4D4D',
            name: "R",
            disable_left: true,
        },
        position: { x: 60, y: 40 },
        parentId: 'rgb',
    },
    {
        id: 'title',
        type: 'title',
        data: {
            name: "For a single iteration",
        },
        position: { x: incXPos() - 100, y: -150 }
    },
    {
        id: 'text_embeds_img',
        type: 'image',
        data: {
            image: text_rel_scores,
            text: 'Textual Heatmap',
            width: "300px",
        },
        position: { x: 0, y: 0 }
    },
    {
        id: 'text_embeds',
        type: 'square',
        data: {
            name: "Text Embeddings Relevance Scores",
            disable_left: true,
        },
        position: { x: getXPos(), y: 0 }
    },
    {
        id: 'time_embeds',
        type: 'square',
        data: {
            name: "Time Embeddings Relevance Scores",
            disable_left: true,
        },
        position: { x: getXPos(), y: 450 }
    },
    {
        id: 'unet',
        type: 'square',
        data: {
            name: "Unet"
        },
        position: { x: incXPos(), y: 200 }
    },
    {
        id: 'pred_noise_img',
        type: 'image',
        data: {
            image: noise_example,
            text: 'Final Pred Noise'
        },
        position: { x: 0, y: 0 }
    },
    {
        id: 'pred_noise',
        type: 'circle',
        data: {
            name: "Pred Noise",
            disable_right: true,
        },
        position: { x: incXPos(), y: 150 }
    },
]

const initial_edges = [
    {
        id: "e1-1",
        type: 'image',
        data: {
            node: 'pred_noise_img',
            dur: 2000,
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
            ]
        },
        animated: true,
        source: "pred_noise",
        target: 'unet'
    },
    {
        id: "e2-1",
        type: 'image',
        data: {
            node: 'text_embeds_img',
            keyframes: [
                {
                    offsetDistance: '0%',
                    opacity: 1,
                    transform: `scale(0.4)`
                },
                { opacity: 1, },
                { opacity: 1, },
                {
                    offsetDistance: '100%',
                    opacity: 0,
                    transform: `scale(1)`,
                },
                { opacity: 0, },
            ],
            dur: 2000,
            delay: 700,
        },
        animated: true,
        source: "unet",
        target: 'text_embeds'
    },
    { id: "e2-2", animated: true, source: "unet", target: 'time_embeds' },

    {
        id: "e3-1",
        animated: true,
        type: 'image',
        data: {
            node: 'prev_pred_img',
            dur: 2000,
            delay: 800,
            keyframes: [
                {
                    offsetDistance: '0%',
                    opacity: 1,
                    transform: `scale(0.4)`
                },
                { opacity: 1, },
                { opacity: 1, },
                {
                    offsetDistance: '100%',
                    opacity: 0,
                    transform: `scale(1)`,
                },
                { opacity: 0, },
            ]
        },
        source: "rgb",
        target: 'prev_pred_noise'
    },
    { id: "epixel-1", animated: true, source: "unet", target: 'pixel-1' },
    { id: "epixel-2", animated: true, source: "unet", target: 'pixel-2' },
    { id: "epixel-3", animated: true, source: "unet", target: 'pixel-3' },
]

const PopupBody = ({ node_id }: any) => {
    switch (node_id) {
        case "pred_noise":
            return (
                <>
                    <ModalHeader className="flex flex-col gap-1">Predicted Noise</ModalHeader>
                    <ModalBody>
                        <p>This represents the output prediction from the unet model. This prediction is then used to remove noise from the input which produces a less noisy result. (this example is exaggerated)</p>
                        <div className='flex gap-2'>
                            <Card isFooterBlurred>
                                <CardHeader className="px-4">
                                    <p className='font-bold'>Previous Input</p>
                                </CardHeader>
                                <CardBody className="justify-end">
                                    <Image src={more_noise_img} alt='' className='rounded-xl' />
                                </CardBody>
                            </Card>
                            <Card isFooterBlurred>
                                <CardHeader className="px-4">
                                    <p className='font-bold'>After Noise Removal</p>
                                </CardHeader>
                                <CardBody className="justify-end">
                                    <Image src={less_noise_img} alt='' className='rounded-xl' />
                                </CardBody>
                            </Card>
                        </div>
                        <p>For relevance scores, either the final predicted noise from the generation or the relevance scores from the previous iteration are used as input to the LRP integration in any given iteration.</p>
                        <p>This image is a simplified and imperfect representation of the predicted noise, but it&apos;s the best available given current limitations.</p>
                        <Card isFooterBlurred className="flex-shrink-0" >
                            <CardHeader className="px-4">
                                <p className='font-bold'>Final Predicted Noise</p>
                            </CardHeader>
                            <CardBody>
                                <Image src={noise_example} alt='' className='rounded-xl' />
                            </CardBody>
                        </Card>
                    </ModalBody>
                </>
            )
        case "unet":
            return (
                <>
                    <ModalHeader className="flex flex-col gap-1">Unet</ModalHeader>
                    <ModalBody>
                        <p>This is the beef of the diffusion process. The unet takes the input noisy image, and predicts noise to remove from it.</p>
                        <p>For layer-wise relevance propagation, you can checkout <Link className={`text-blue-500`} href='/unet'>this</Link> where we explain in more detail.</p>
                        <div>
                            <Image src={unet_img} alt='' className={`rounded-[5px]`} />
                        </div>
                    </ModalBody>
                </>
            )
        case "text_embeds":
            return (
                <>
                    <ModalHeader className="flex flex-col gap-1">Text Embeddings</ModalHeader>
                    <ModalBody>
                        <p>The relevance scores for text embeddings are found at each cross-attention layer, for each iteration.</p>
                        <Image src={sd_overview} alt='' className={`rounded-[5px] mx-auto`} />
                        <p>After Each Iteration, the relevance scores are then aggregated in order to create a single representation of the current iteration.</p>
                        <Image src={text_rel_scores} alt='' />
                    </ModalBody>
                </>
            )
        case "time_embeds":
            return (
                <>
                    <ModalHeader className="flex flex-col gap-1">Time Embeddings</ModalHeader>
                    <ModalBody>
                        <p>Time Embeddings are the result of a couple of Linear/Conv2D layers, which transforms the timestamp into a meaningful representation for the <Link className={`text-blue-500`} href='/unet'>Unet</Link> model.</p>
                        <div>
                            <Image src={time_embeds_img} alt='' className={`rounded-[5px]`} />
                        </div>
                    </ModalBody>
                </>
            )
        case "latents":
        case "rgb":
        case "pixel-1":
        case "pixel-2":
        case "pixel-3":
        case "prev_pred_noise":
            return (
                <ModalHeader className="flex flex-col gap-1">{node_id}</ModalHeader>
            )
        default:
            return (
                <ModalHeader className="flex flex-col gap-1">Error.</ModalHeader>
            )
    }
}
PopupBody.displayName = 'PopupBody';

const SingleIteration = () => {
    const [nodes, , onNodesChange] = useNodesState(initial_nodes);
    const [edges, , onEdgesChange] = useEdgesState(initial_edges);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("")
    const handle_click = useCallback((_: any, node: any) => {
        switch (node.id) {
            case "pred_noise":
            case "unet":
            case "text_embeds":
            case "time_embeds":
            case "latents":
            case "rgb":
            case "pixel-1":
            case "pixel-2":
            case "pixel-3":
            case "prev_pred_noise":
                setSelectedId(node.id)
                onOpen()
                break;
            default: break;
        }
    }, [])
    return (
        <div className={styles.wrapper}>
            <Popup
                scrollBehavior={'inside'}//`${selectedId == "text_embeds" ? "outside" : "inside"}`}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <PopupBody node_id={selectedId} />
            </Popup>
            <ReactFlow
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

export default SingleIteration;
