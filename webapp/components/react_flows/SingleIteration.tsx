'use client'
import { Background, Handle, Position, ReactFlow, Controls } from "@xyflow/react"
import styles from '@/components/react_flows/SingleIteration.module.css'
import { memo, useCallback, useState } from "react"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import Link from 'next/link';
import Image from 'next/image';
import less_noise_img from '@/public/single_iteration/less_noise.png';
import more_noise_img from '@/public/single_iteration/more_noise.png';
import unet_img from '@/public/single_iteration/unet.png';
import time_embeds_img from '@/public/single_iteration/time_embeds_visual.png';
import sd_overview from '@/public/single_iteration/stable-diffusion-overview.png';
import text_rel_scores from '@/public/single_iteration/text_relevance_scores.png';
import lrp_heatmap from '@/public/single_iteration/lrp_heatmap.png';
import AnimatedImageEdge from "./edges/AnimatedImageEdge"

const Handles = memo(({ left = 'source', right = 'target', disable_left = false, disable_right = false }: any) => {
    return (
        <>
            {
                !disable_right && (
                    <Handle
                        type={right}
                        position={Position.Right}
                    />
                )
            }
            {
                !disable_left && (
                    <Handle
                        type={left}
                        position={Position.Left}
                    />
                )
            }
        </>
    )
})
Handles.displayName = 'Handles'

const CircleNode = memo(({ data }: any) => {
    return (
        <div className={styles.circle_node}>
            <Handles {...data} />
            <h2>{data.name}</h2>
        </div>
    )
})
CircleNode.displayName = 'CircleNode'
const SquareNode = memo(({ data }: any) => {
    return (
        <div className={styles.square_node}>
            <h2>{data.name}</h2>
            <Handles {...data} />
        </div>
    )
})
SquareNode.displayName = 'SquareNode'
const PixelNode = memo(({ data }: any) => {
    return (
        <div className={styles.pixel_node} style={{ background: data.color }}>
            {data.name}
            <Handles {...data} />
        </div>
    )
})
PixelNode.displayName = 'PixelNode'
const RGBNode = memo(({ data }: any) => {
    return (
        <div className={styles.rgb_node}>
            <Handles {...data} />
        </div>
    )
})
RGBNode.displayName = 'RGBNode'
const TitleText = memo(({ data }: any) => {
    return (
        <div className={styles.title}>
            <h1>{data.name}</h1>
            <Handles disable_left disable_right />
        </div>
    )
})
TitleText.displayName = 'TitleText'
const SubtitleText = memo(({ data }: any) => {
    return (
        <div className={styles.subtitle}>
            <h2>{data.name}</h2>
            <Handles disable_left disable_right />
        </div>
    )
})
SubtitleText.displayName = 'SubtitleText'

const node_types = {
    square: SquareNode,
    circle: CircleNode,
    rgb: RGBNode,
    pixel: PixelNode,
    title: TitleText,
    subtitle: SubtitleText,
}
let i = 0;
const incXPos = (factor: number = 350) => {
    return ++i * factor;
}
const getXPos = (factor: number = 350) => {
    return i * factor;
}
const initial_nodes = [
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
        id: 'pred_noise',
        type: 'circle',
        data: {
            name: "Pred Noise",
            disable_right: true,
        },
        position: { x: incXPos(), y: 150 }
    },
]
const edge_types = {
    'image': AnimatedImageEdge,
}
const initial_edges = [
    {
        id: "e1-1",
        type: 'image',
        data: {
            image: less_noise_img.src,
            dur: 4,
        },
        animated: true,
        source: "pred_noise",
        target: 'unet'
    },
    {
        id: "e2-1",
        type: 'image',
        data: {
            image: text_rel_scores.src,
            width: 300,
            height: 300,
            offsetY: '-100%',
            offsetX: '-50%',
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
            image: lrp_heatmap.src,
            scale: 2,
            offsetY: "20%",
            offsetX: "-15%",
            dur: 4,
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
                        <div>
                            <div className={`${styles.pred_noise_popup_images}`}>
                                <p className={`${styles.pred_noise_popup_label}`}>Previous Input</p>
                                <p className={`${styles.pred_noise_popup_label}`}>After Noise Removal</p>
                            </div>
                            <div className={`${styles.pred_noise_popup_images}`}>
                                <Image src={more_noise_img} alt='' className={`${styles.pred_noise_popup_image}`} />
                                <Image src={less_noise_img} alt='' className={`${styles.pred_noise_popup_image}`} />
                            </div>
                        </div>
                        <p>For relevance scores, either the final predicted noise from the generation or the relevance scores from the previous iteration are used as input to the LRP integration in any given iteration.</p>
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
                        <div>
                            <Image src={sd_overview} alt='' className={`rounded-[5px] mx-auto`} />
                        </div>
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
        default:
            return (
                <ModalHeader className="flex flex-col gap-1">Error.</ModalHeader>
            )
    }
}
PopupBody.displayName = 'PopupBody';

type PopupProps = Readonly<{
    isOpen: boolean;
    onOpenChange: any;
    children: React.ReactNode;
    scrollBehavior: 'normal' | 'inside' | 'outside';
}>
const Popup = ({ isOpen, onOpenChange, children, scrollBehavior }: PopupProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="bottom-center"
            scrollBehavior={scrollBehavior}
        >
            <ModalContent className="bg-[var(--background)]">
                {(onClose) => (
                    <>
                        {children}
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
Popup.displayName = 'Popup';

const SingleIteration = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("")
    const handle_click = useCallback((_: any, node: any) => {
        setSelectedId(node.id)
        onOpen()
    }, [])
    return (
        <div className={styles.wrapper}>
            <Popup
                scrollBehavior={`${selectedId == "text_embeds" ? "outside" : "inside"}`}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <PopupBody node_id={selectedId} />
            </Popup>
            <ReactFlow
                nodeTypes={node_types}
                edgeTypes={edge_types}
                nodes={initial_nodes}
                edges={initial_edges}
                fitView
                nodesDraggable={false}
                zoomOnScroll={false}
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
