import styles from '@/app/page.module.css';
import Image from 'next/image';
import lrp_heatmap from '@/public/lrp_heatmap_example.png';
import SingleIteration from '@/components/react_flows/SingleIteration';
import SingleGeneration from '@/components/react_flows/SingleGeneration';
import ExampleFlowDiagram from '@/components/react_flows/ExampleFlowDiagram';
import SDSingleGeneration from '@/components/react_flows/SDSingleGeneration';
import LRPSingleIteration from '@/components/react_flows/LRPSingleIteration';
import TestingExample from '@/components/react_flows/TestingExample';

type BlockProps = Readonly<{
  children: React.ReactNode;
}>
const Block = ({ children }: BlockProps) => {
  return (
    <div className={styles.block}>
      {children}
    </div>
  )
}

const About = () => {
  return (
    <main className={styles.wrapper}>
      <div className={styles.inner_wrapper}>
        <header className={styles.header}>
          <h1>Stable Diffusion &amp; LRP</h1>
          <h2>Integrating Layer-wise Relevance Propagation with Stable Diffusion <br /> for Enhanced Interpretability</h2>
        </header>
        <Block>
          <h3>What is Stable Diffusion?</h3>
          <p>
            Stable Diffusion is a generative AI model that transforms random noise into a coherent image through iterative denoising steps.
            In each step, the model predicts and removes some portion of noise, leveraging a text prompt to guide the visual composition
            via cross-attention. Over multiple iterations, the noise converges into a refined image that reflects the prompt’s content.
          </p>
          <p>
            In this process, text embeddings interact with the model’s latent representation, enabling flexible and often highly creative
            image generation. By conditioning on textual information, Stable Diffusion provides a controllable and powerful approach to
            create high-fidelity images ranging from photorealistic scenes to abstract art. The procedure’s iterative nature is key:
            each step incrementally improves the alignment between the prompt and the emergent image.
          </p>
        </Block>
        <Block>
          <h3>Why LRP?</h3>
          <div className={styles.why_lrp_container}>
            <p>
              Layer-wise Relevance Propagation (LRP) offers a systematic way to backtrack the model’s outputs to the most influential parts
              of the input data. Traditionally used for classifier explanations, LRP helps demystify how deep neural networks allocate
              attention or “relevance” to different features. In the case of Stable Diffusion, applying LRP can highlight which tokens in
              the text prompt and which areas in the noisy latent space are most critical to generating a specific feature or object in
              the final image.
            </p>
            <div className={styles.lrp_heatmap_example}>
              <Image src={lrp_heatmap} fill alt='LRP heatmap example.' sizes={"100cqw"} />
            </div>
          </div>
        </Block>
        <Block>
          <h3>How Propagation Flows in Stable Diffusion</h3>
          <p>
            During generation, Stable Diffusion applies a U-Net to iteratively remove noise from a latent representation, guided by a
            text prompt. Each iteration refines the intermediate latent, gradually bringing it closer to a visually coherent image.
            The cross-attention mechanism in the U-Net helps the model focus on specific parts of the prompt, ensuring that details
            mentioned in the text are reflected in the evolving image.
          </p>
          <SingleIteration />
          <p>
            In the illustration above, each denoising step harnesses the cross-attention maps to align the latent representation with
            the context of your prompt. Over multiple iterations, the model balances retaining global structure with injecting finer
            details. The single-iteration diagram highlights how noise is predicted and subtracted in a single pass, revealing the
            underlying shape and composition.
          </p>
          <SingleGeneration />
          <p>
            When you combine these iterations, you get the complete generation process, transitioning from pure noise to a polished
            result. Each step in this chain is essential: the model “remembers” previously denoised features while continuing to
            cross-reference the prompt for additional context. This synergy between iterative refinement and textual guidance drives
            the adaptability and robustness of Stable Diffusion.
          </p>
        </Block>
        <Block>
          <h3>Internal Architecture for LRP Integration</h3>
          <p>
            To integrate Layer-wise Relevance Propagation into Stable Diffusion, we modify the internal architecture—particularly the
            U-Net and cross-attention blocks—to propagate relevance scores back through every denoising step. By tracking the flow of
            relevance, we can identify which latent features and prompt tokens most significantly impact the model’s decisions at each
            stage of the process.
          </p>
          <SDSingleGeneration />
          <p>
            The diagram above shows how relevance is accounted for in both the forward pass (generation) and the backward pass (LRP).
            Special care is taken to handle skip connections and residual layers so that the LRP signal can travel unimpeded through
            various network components. This ensures that every relevant element—be it a specific word in the prompt or a particular
            region in the latent space—is visibly highlighted in our final explanations.
          </p>
          <LRPSingleIteration />
        </Block>
        {/*<Block>
          <h3>Example Flow Diagram</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in.</p>
          <ExampleFlowDiagram />
          <TestingExample />
        </Block>*/}
      </div>
    </main>
  );
}

export default About
