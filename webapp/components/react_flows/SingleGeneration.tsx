'use client'
import { Background, ReactFlow, Controls, useNodesState, useEdgesState } from "@xyflow/react";
import styles from '@/components/react_flows/SingleGeneration.module.css';
import { useCallback, useState } from "react";
import { Card, CardBody, CardHeader, Image, ModalBody, ModalHeader, useDisclosure } from "@nextui-org/react";
import Popup from "@/components/popup/Popup";
import { EDGE_TYPES, NODE_TYPES } from "@/lib/types";

// NOTE: IMAGES
import single_iteration_img from '@/public/single_generation/single_iteration.png';
import noise_example from '@/public/single_generation/noise_example.png';
import lrp1 from '@/public/single_generation/lrp1.png';
import lrp2 from '@/public/single_generation/lrp2.png';
import lrp3 from '@/public/single_generation/lrp3.png';
import lrp4 from '@/public/single_generation/lrp4.png';
import lrp5 from '@/public/single_generation/lrp5.png';
import text_embeds_lrp from '@/public/single_generation/text_relevance_scores.png';

const importAll = (requireContext: any) => {
    return requireContext.keys().map(requireContext);
};

const sortList = (list: any) => {
    list.sort((a: any, b: any) => {
        // Extract the numbers after "lrp1-" and before the next period (.)
        const numA = parseInt(a.match(/-(\d+)/)[1], 10);
        const numB = parseInt(b.match(/-(\d+)/)[1], 10);
        return numB - numA;
    });
}
const lrps = importAll(require.context('../../public/single_generation/lrp_test_results/', false, /\.(png|jpe?g|svg)$/));
const noises = importAll(require.context('../../public/single_generation/noise_test_results/', false, /\.(png|jpe?g|svg)$/));
const lrp_frames = lrps.map((image: any) => image.default.src)
const noise_frames = noises.map((image: any) => image.default.src)
sortList(lrp_frames)
sortList(noise_frames)

const getId = (id: string) => {
    return `single_gen_${id}`;
}

let x = 0;
const incXPos = (factor: number = 250) => {
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
const edge_nodes = [
    {
        id: getId("final_pred_noise_edge_6"),
        type: 'image',
        data: {
            image: noise_example,
        },
        position: { x: 0, y: 0 }
    },
    {
        id: getId("final_pred_noise_edge_5"),
        type: 'image',
        data: {
            image: lrp1,
        },
        position: { x: 0, y: 0 }
    },
    {
        id: getId("final_pred_noise_edge_4"),
        type: 'image',
        data: {
            image: lrp2,
        },
        position: { x: 0, y: 0 }
    },
    {
        id: getId("final_pred_noise_edge_3"),
        type: 'image',
        data: {
            image: lrp3,
        },
        position: { x: 0, y: 0 }
    },
    {
        id: getId("final_pred_noise_edge_2"),
        type: 'image',
        data: {
            image: lrp4,
        },
        position: { x: 0, y: 0 }
    },
    {
        id: getId("final_pred_noise_edge_1"),
        type: 'image',
        data: {
            image: lrp5,
        },
        position: { x: 0, y: 0 }
    },
    {
        id: getId("final_pred_noise_edge_0"),
        type: 'image',
        data: {
            image: text_embeds_lrp,
            width: 300,
        },
        position: { x: 0, y: 0 }
    },
]
const initial_nodes = [
    {
        id: getId('text_embeds'),
        type: 'square',
        data: {
            name: "Text Embeddings Relevance Scores",
            disable_left: true,
        },
        position: { x: getXPos(), y: -250 }
    },
    {
        id: getId('time_embeds'),
        type: 'square',
        data: {
            name: "Time Embeddings Relevance Scores",
            disable_left: true,
        },
        position: { x: getXPos(), y: 375 }
    },
    {
        id: getId('latents'),
        type: 'square',
        data: {
            name: "Latent Noisy Image Input Relevance Scores",
            disable_left: true,
            disable_right: true,
        },
        position: { x: getXPos(), y: -150 }
    },
    {
        id: getId('rgb'),
        type: 'rgb',
        data: {
            disable_right: false,
            disable_left: true,
        },
        position: { x: getXPos() + 30, y: -50 }
    },
    {
        id: getId('pixel-1'),
        type: 'pixel',
        data: {
            color: '#4D527D',
            name: "B",
            disable_left: true,
            disable_right: true,
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
            disable_right: true,
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
            disable_right: true,
            disable_left: true,
        },
        position: { x: 60, y: 40 },
        parentId: getId('rgb'),
    },
    getIteration(getId('iter_0'), single_iteration_img, 'Iteration 0', incXPos(400)),
    getIteration(getId('iter_1'), single_iteration_img, 'Iteration 1'),
    {
        id: getId('dots'),
        type: 'dots',
        position: { x: incXPos() + 50, y: 0 },
    },
    {
        id: getId('title'),
        type: 'title',
        position: { x: getXPos() - 150, y: -200 },
        data: {
            name: 'For a single generation',
        },
    },
    {
        id: getId('lrp_timeline'),
        type: 'animated_image',
        data: {
            frames: [lrp_frames, noise_frames]
        },
        position: { x: getXPos() - 125, y: 200 }
    },
    {
        id: getId('subtitle'),
        type: 'subtitle',
        position: { x: getXPos(), y: -130 },
        data: {
            name: '50 iterations',
        },
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
    ...edge_nodes,
]

const initial_edges = [
    {
        id: getId("final_pred_noise <- iter_50"),
        source: getId('final_pred_noise'),
        target: getId('iter_50'),
        animated: true,
        type: 'image',
        data: {
            node: getId('final_pred_noise_edge_6'),
            keyframes: incKeyframes(),
            dur: getDur(),
            easing: 'linear',
        },
    },
    {
        id: getId("iter_49 <- iter_50"),
        source: getId('iter_50'),
        target: getId('iter_49'),
        animated: true,
        type: 'image',
        data: {
            node: getId('final_pred_noise_edge_5'),
            keyframes: incKeyframes(),
            dur: getDur(),
            easing: 'linear',
        },
    },
    {
        id: getId('dots <- iter_49'),
        source: getId('iter_49'),
        target: getId('dots'),
        animated: true,
        type: 'image',
        data: {
            node: getId('final_pred_noise_edge_4'),
            keyframes: incKeyframes(),
            dur: getDur(),
            easing: 'linear',
        },
    },
    {
        id: getId('iter_1 <- dots'),
        source: getId('dots'),
        target: getId('iter_1'),
        animated: true,
        type: 'image',
        data: {
            node: getId('final_pred_noise_edge_3'),
            keyframes: incKeyframes(),
            dur: getDur(),
            easing: 'linear',
        },
    },
    {
        id: getId('iter_0 <- iter_1'),
        source: getId('iter_1'),
        target: getId('iter_0'),
        animated: true,
        type: 'image',
        data: {
            node: getId('final_pred_noise_edge_2'),
            keyframes: incKeyframes(),
            dur: getDur(),
            easing: 'linear',
        },
    },
    {
        id: getId('time_embeds <- iter_0'),
        source: getId('iter_0'),
        target: getId('time_embeds'),
        animated: true,
    },
    {
        id: getId('rgb <- iter_0'),
        source: getId('iter_0'),
        target: getId('rgb'),
        type: 'image',
        data: {
            node: getId('final_pred_noise_edge_1'),
            keyframes: incKeyframes(),
            dur: getDur(),
            easing: 'linear',
        },
        animated: true,
    },
    {
        id: getId('text_embeds <- iter_0'),
        source: getId('iter_0'),
        target: getId('text_embeds'),
        type: 'image',
        data: {
            node: getId('final_pred_noise_edge_0'),
            keyframes: getKeyframes(),
            dur: getDur(),
            easing: 'linear',
        },
        animated: true,
    }

]

const PopupBody = ({ node_id }: any) => {
    switch (node_id) {
        case getId("final_pred_noise"):
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
                                    <Image src={lrp1.src} alt='' className='rounded-xl' />
                                </CardBody>
                            </Card>
                            <Card isFooterBlurred>
                                <CardHeader className="px-4">
                                    <p className='font-bold'>After Noise Removal</p>
                                </CardHeader>
                                <CardBody className="justify-end">
                                    <Image src={lrp1.src} alt='' className='rounded-xl' />
                                </CardBody>
                            </Card>
                        </div>
                        <p>For relevance scores, either the final predicted noise from the generation or the relevance scores from the previous iteration are used as input to the LRP integration in any given iteration.</p>
                        <p>(This image is a simplified and imperfect representation of the predicted noise)</p>
                        <Card isFooterBlurred className="flex-shrink-0" >
                            <CardHeader className="px-4">
                                <p className='font-bold'>Final Predicted Noise</p>
                            </CardHeader>
                            <CardBody>
                                <Image src={lrp1.src} alt='' className='rounded-xl' />
                            </CardBody>
                        </Card>
                    </ModalBody>
                </>
            )
        case getId("iter_49"):
        case getId("iter_50"):
        case getId("iter_1"):
        case getId("iter_0"):
        case getId("text_embeds"):
        case getId("time_embeds"):
        case getId("latents"):
        case getId("rgb"):
        case getId("pixel-1"):
        case getId("pixel-2"):
        case getId("pixel-3"):
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
            case getId("final_pred_noise"):
            case getId("iter_49"):
            case getId("iter_50"):
            case getId("iter_1"):
            case getId("iter_0"):
            case getId("text_embeds"):
            case getId("time_embeds"):
            case getId("latents"):
            case getId("rgb"):
            case getId("pixel-1"):
            case getId("pixel-2"):
            case getId("pixel-3"):
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
