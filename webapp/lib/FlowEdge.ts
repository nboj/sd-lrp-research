type FlowEdgeProps = Readonly<{
  source: string;
  target: string;
  targetHandle: string;
  sourceHandle: string;
  animated?: boolean;
}>
export default class FlowEdge {
  // { id: "epixel-3", animated: true, source: "unet", target: 'pixel-3' },
  #id: string;
  #source: string;
  #target: string;
  #animated: boolean = true;
  #sourceHandle: string;
  #targetHandle: string;
  constructor(props: FlowEdgeProps) {
    this.#id = crypto.randomUUID();
    this.#source = props.source;
    this.#target = props.target;
    this.#targetHandle = props.targetHandle;
    this.#sourceHandle = props.sourceHandle;
    if (props.animated) {
      this.#animated = props.animated;
    }
  }
  get id() {
    return this.#id;
  }
  get source() {
    return this.#source;
  }
  get target() {
    return this.#target;
  }
  get animated() {
    return this.#animated;
  }
  get targetHandle() {
    return this.#targetHandle;
  }
  get sourceHandle() {
    return this.#sourceHandle;
  }
}
