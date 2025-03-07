'use client'
import { Handle, Position } from "@xyflow/react";
import { memo, useEffect, useRef, useState } from "react";
import NextImage from 'next/image';
import styles from '@/components/react_flows/nodes/Nodes.module.css';
import { Card, CardBody, CardFooter, Progress } from "@nextui-org/react";

const Handles = memo(({ id, left = 'source', right = 'target', top = 'target', bottom = 'source', disable_left = false, disable_right = false, disable_top = true, disable_bottom = true }: any) => {
    return (
        <>
            {
                !disable_right && (
                    <Handle
                        id={`${id}-right`}
                        type={right}
                        position={Position.Right}
                    />
                )
            }
            {
                !disable_left && (
                    <Handle
                        id={`${id}-left`}
                        type={left}
                        position={Position.Left}
                    />
                )
            }
            {
                !disable_top && (
                    <Handle
                        id={`${id}-top`}
                        type={top}
                        position={Position.Top}
                    />
                )
            }
            {
                !disable_bottom && (
                    <Handle
                        id={`${id}-bottom`}
                        type={bottom}
                        position={Position.Bottom}
                    />
                )
            }
        </>
    )
})
Handles.displayName = 'Handles'

const CircleNode = memo(({ data }: any) => {
    return (
        <div className={`${styles.node} ${styles.circle_node}`}>
            <Handles {...data} />
            <h2>{data.name}</h2>
        </div>
    )
})
CircleNode.displayName = 'CircleNode'

const ImageNode = memo(({ data }: any) => {
    return (
        <Card className={`${styles.node} ${styles.image_node}`} style={{ scale: data.scale, ...data.width && { width: data.width }, ...data.height && { height: data.height } }}>
            <Handles disable_left disable_right {...data} />
            <CardBody>
                <NextImage src={data.image} alt='' className={styles.image_node_image} />
            </CardBody>
            {
                data?.text && (
                    <CardFooter>
                        <p className={styles.text}>{data.text}</p>
                    </CardFooter>
                )
            }
        </Card>
    )
})
ImageNode.displayName = 'ImageNode'

const SquareNode = memo(({ data }: any) => {
    return (
        <div className={`${styles.node} ${styles.square_node}`} style={{ ...data.style }}>
            <h2>{data.name}</h2>
            <Handles {...data} />
        </div>
    )
})
SquareNode.displayName = 'SquareNode'

const SquareNodeWrap = memo(({ data }: any) => {
    return (
        <div className={styles.square_node_wrap}>
            <h2>{data.name}</h2>
            <Handles {...data} />
        </div>
    )
})
SquareNodeWrap.displayName = 'SquareNodeWrap'

const PixelNode = memo(({ data }: any) => {
    return (
        <div className={`${styles.node} ${styles.pixel_node}`} style={{ background: data.color }}>
            {data.name}
            <Handles {...data} />
        </div>
    )
})
PixelNode.displayName = 'PixelNode'

const BoxNode = memo(({ data }: any) => {
    return (
        <div className={`${styles.box_node}`} style={{ width: data.width, height: data.height }}>
            <h1>{data.name}</h1>
            <Handles {...data} />
        </div>
    )
})
BoxNode.displayName = 'BoxNode'
const RGBNode = memo(({ data }: any) => {
    return (
        <div className={`${styles.rgb_node}`}>
            <Handles {...data} />
        </div>
    )
})
RGBNode.displayName = 'RGBNode'

const RGBNodeAlt = memo(({ data }: any) => {
    return (
        <div className={styles.rgb_node_alt}>
            <Handles {...data} />
        </div>
    )
})
RGBNodeAlt.displayName = 'RGBNodeAlt'

const TitleText = memo(({ data }: any) => {
    return (
        <div className={`${styles.title}`}>
            <h1>{data.name}</h1>
            <Handles disable_left disable_right />
        </div>
    )
})
TitleText.displayName = 'TitleText'

const SubtitleText = memo(({ data }: any) => {
    return (
        <div className={`${styles.subtitle}`}>
            <h2>{data.name}</h2>
            <Handles disable_left disable_right />
        </div>
    )
})
SubtitleText.displayName = 'SubtitleText'

const Dots = memo(({ data }: any) => {
    return (
        <div className={`${styles.dots}`}>
            <h1>&bull;&bull;&bull;</h1>
            <Handles {...data} />
        </div>
    )
})
Dots.displayName = "Dots"

const ImageAnimation = memo(({ data }: any) => {
    const frameIndex = useRef(0);
    const animationRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef(0);
    const fps = 15; // Desired frames per second
    const frameInterval = 1000 / fps;
    const [progress, setProgress] = useState<number>(0)

    useEffect(() => {
        const canvases = document.querySelectorAll('.anim-canv');
        const ctxs = Array.from(canvases).map((canv: any) => canv.getContext('2d'));

        if (ctxs.some(ctx => !ctx)) return; // Exit if any context is null

        const image_lists: HTMLImageElement[][] = Array.from({ length: data.frames.length }, () => []);
        data.frames.forEach((list: any, idx: number) => {
            return list.forEach((src: any, _: number) => {
                const img = new Image();
                img.src = src;
                image_lists[idx].push(img);
            })
        });

        const renderFrame = (timestamp: number) => {
            let allImagesLoaded = true;

            // Render each frame list to its corresponding canvas
            image_lists.forEach((images, idx: number) => {
                const ctx = ctxs[idx];
                if (!ctx) return;
                // Check if the image is fully loaded before rendering
                if (!images[frameIndex.current]?.complete) {
                    allImagesLoaded = false;
                    return;
                }

                if (timestamp - lastFrameTimeRef.current < frameInterval) {
                    return;
                }

                const img = images[frameIndex.current];
                const { width: imgWidth, height: imgHeight } = img;
                const { clientWidth: canvasWidth, clientHeight: canvasHeight } = canvases[idx];

                const imgAspectRatio = imgWidth / imgHeight;
                const canvasAspectRatio = canvasWidth / canvasHeight;

                let sourceX = 0, sourceY = 0, sourceWidth = imgWidth, sourceHeight = imgHeight;

                if (imgAspectRatio > canvasAspectRatio) {
                    // Image is wider than canvas
                    sourceWidth = imgHeight * canvasAspectRatio;
                    sourceX = (imgWidth - sourceWidth) / 2; // Center horizontally
                } else {
                    // Image is taller than canvas
                    sourceHeight = imgWidth / canvasAspectRatio;
                    sourceY = (imgHeight - sourceHeight) / 2; // Center vertically
                }

                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(
                    img,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    0, 0, canvasWidth, canvasHeight
                );
            });

            if (allImagesLoaded) {
                setProgress(100 - ((frameIndex.current + 1) / image_lists[0].length) * 100);
            }
            if (timestamp - lastFrameTimeRef.current > frameInterval) {
                frameIndex.current = (frameIndex.current + 1) % image_lists[0].length;
                lastFrameTimeRef.current = timestamp;
            }
            animationRef.current = requestAnimationFrame(renderFrame);
        };

        // Start the animation loop
        animationRef.current = requestAnimationFrame(renderFrame);

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [data.frames]);
    return (
        <Card className={`dark`}>
            <CardBody className="flex flex-row gap-2">
                {
                    data.frames.map((_: any, idx: number) => (
                        <canvas className='anim-canv' key={`canv-${idx}`} width={200} height={200} style={{ borderRadius: "12px" }} />
                    ))
                }
            </CardBody>
            <CardFooter>
                <Progress value={progress} disableAnimation aria-label="pgs" />
            </CardFooter>
        </Card>
    )
})
ImageAnimation.displayName = "ImageAnimation";

export { CircleNode, SquareNode, SquareNodeWrap, ImageNode, PixelNode, RGBNode, RGBNodeAlt, TitleText, SubtitleText, Dots, ImageAnimation, BoxNode };
