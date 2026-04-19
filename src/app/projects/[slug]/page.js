import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import Sections from "./sections";
import {
  Heading,
  Subheading,
  TextBlock,
  VideoBlock,
  ImageBlock,
  CodeBlock,
  GraphBlock,
  TableBlock,
} from "./blocks";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Abiel Kim`,
    description: project.description,
  };
}

const CONTENT = {
  satmap: {
    sections: [
      {
        type: "text",
        heading: "Overview",
        body: "SATMAP-7 is a full-stack, real-time 3D satellite tracker that renders thousands of orbiting satellites to scale. Built with a WebGL-powered globe, server-side propagation via SGP4/SDP4 models, and a Redis-backed caching layer for TLE data freshness.",
      },

      // video demo of what i have so far

      {
        type: "table",
        heading: "Tech Stack",
        headers: ["Layer", "Technology"],
        rows: [
          ["Framework", "Next.js 16, React 19, TypeScript"],
          ["3D Rendering", "Three.js, React Three Fiber, React Three Drei"],
          ["Propagation Calculations", "satellite.js (SGP4/SDP4 propagation)"],
          ["State Management", "Zustand"],
          ["Caching", "Upstash Redis"],
          ["Styling", "Tailwind CSS v4"],
          ["Icons", "Lucide React"],
          ["Fonts", "Space Mono, Syne"],
          [
            "Data Sources",
            "CelesTrak GP API, satcat.com, NASA Blue Marble, WikiMedia",
          ],
          ["Deployment", "Vercel"],
        ],
      },

      {
        type: "text",
        heading: "High-Level Objectives",
        body: `SATMAP-7 is an interactive, almost gamified, satellite tracker visualization application predicated on real, mathematically calculated satellite data. The application enables users to visualize planet Earth alongside thousands of orbiting satellites in real-time, to scale. 
        
        The application principally features a rotatable planet Earth with a smoothly interpolated day/night texture - both textures sourced from NASA. A lat/lon grid is incised on the globe for reference. Orbiting the Earth are thousands of satellites that are members of 7 artificial constellations: Starlink, OneWeb, Space Stations, Weather, Navigation (GPS), Debris, and Other Active. The satellites are interactable. Selecting a satellite provides the user numerical statistics and semantic descriptors, detailing their origin.

        SGP4 satellite propagation calculations are updated every 500ms via satellite.js. In an upcoming v1.0.1 update, calculations will be smoothly interpolated with an originally-conceived, so-called Compute-Ahead-of-Time (CAT) algorithm. The incoming algorithm update is inspired by the double buffering pattern as often seen in graphics programming. But please do not be confused- the so-called CAT algorithm does not optimize graphics rendering but rather optimizes data readiness.

        Furthermore, the application supports toggling visibility. It is simple for the user to toggle the visibility of any one or several artificial constellations by the rightmost category sidebar in the default HUD. The implementation is made doubly simple by leveraging Zustand global state management.

        In addition, a search bar is provided for convenience, enabling the user to search a satellite by either name or NORAD ID. Upon successful search and result selection, a smooth interpolation animation is triggered that gracefully transports the user to the target satellite. The same animation triggers upon manual satellite selection as well.

        The last primary feature is one of performance: Triple-layer caching in order of Next.js fetch cache, Redis, and in-memory fallback. These caches are spread across the tech stack and server. This avoids server-request timeouts and unstable connections to CelesTrak - the primary data source - and additionally improves performance, such as search speed performance.

        Note that the application is mobile and tablet friendly. An entirely separate HUD layout is designed specifically for smaller viewports.
        `,
      },

      {
        type: "table",
        heading: "Feature Roadmap",
        headers: ["Feature", "Status", "Notes"],
        rows: [
          ["3D Globe Textures (custom fragment shaders)", "Done", ""],
          ["Starbox background", "Done", ""],
          ["Starlink constellation acquisition", "Done", ""],
          ["OneWeb constellation acquisition", "Done", ""],
          ["Space Stations acquisition", "Done", ""],
          ["Weather satellites acquisition", "Done", ""],
          ["Navigation / GPS acquisition", "Done", ""],
          ["Debris tracking acquisition", "Done", ""],
          ["Other Active satellites acquisition", "Done", ""],
          ["Render satellite point clouds", "Done", ""],
          ["SGP4 propagation", "Done", ""],
          ["Orbit trail — History mode (90 min)", "Done", ""],
          ["Orbit trail — Full orbit mode", "Done", ""],
          ["Orbit trail — Both mode", "Done", ""],
          ["Satellite hover mechanic", "Done", ""],
          ["Satellite selection mechanic", "Done", ""],
          ["Patch occlusion checks", "Done", ""],
          ["Satellite default mode HUD", "Done", ""],
          ["Satellite selection mode HUD", "Done", ""],
          ["Constellation-specific media", "Done", ""],
          ["Satellite-specific descriptor", "Done", ""],
          ["Constellation visibility toggles", "Done", ""],
          ["Live satellite counts per category", "Done", ""],
          ["Satellite search (name + NORAD ID)", "Done", ""],
          ["Satellite selection animation", "Done", ""],
          ["Satellite selection animation manual override", "Done", ""],
          ["3-layer caching", "Done", ""],
          ["Mobile / tablet HUD Layout Design", "Done", ""],

          [
            "Preemptive TLE record alignment edge case fix",
            "Underway",
            "Rare but theoretically possible record misalignment between Redis and Zustand or between BufferGeometry and Zustand.",
          ],
          [
            "Coverage footprint visualization",
            "Underway",
            "Beam/footprint cone projected per satellite",
          ],
          ["Collision prediction", "Underway", "Will require shorter TTL"],
          [
            "Earth fragment shader revision",
            "Underway",
            "revise fragment shaders to account for an independent sun",
          ],
          [
            "Compute-Ahead-of-Time double propagation",
            "Underway",
            "double propagation algorithm for smooth satellite interpolation animation at 60fps",
          ],
          ["Multi-threading", "Underway", "Optimize satellite propagation"],
          [
            "Significantly increase satellite quantity",
            "Underway",
            "Render at least 10k satellites",
          ],
          [
            "Documentation and Logs",
            "Underway",
            "Currently stubbed - full docs pending",
          ],
          ["API", "Underway", "Currently stubbed - full API docs pending"],
        ],
      },

      {
        type: "text",
        heading: "Approach and Methodology",
        body: `The implementation of SATMAP-7 emphasizes separation of concern between server and client processes. The backend encapsulates all TLE data acquisition, caching, and routing. The client performs all propagation calculations and GPU renders. Note that the Earth textures are stored directly on the Vercel server as static files.`,
      },

      {
        type: "text",
        heading: "Data Pipeline",
        body: `All TLE data is sourced from CelesTrak's General Perturbations (GP) API per constellation group. Each API route passes through three layers of caching as previously mentioned. 
        
        It should be noted the caching TTL. Our Redis holds constellation data for 24 hours, search results for 5 minutes, and satellite-specific semantic descriptors for 7 days. Each TTL is chosen uniquely for its role. Importantly, one may argue that the 24 hour satellite TTL is unnecessary. This is partially true, however, it was observed that requests to CelesTrak are not strongly reliable and so the strategy is to minimize the frequency of requests sent to CelesTrak and rely on stable Redis connections when possible. The tradeoff is that satellite positions are less precise. In fact, the worst case position error for SATMAP-7 is approximately 1 to 3 kilometers assuming that the user accesses 24-hour old TLE data moments before a data refresh. For more information on SGP4 please visit: https://en.wikipedia.org/wiki/Simplified_perturbations_models.
        `,
      },

      {
        type: "text",
        heading: "Rendering Pipeline",
        body: `Each constellation is rendered as a Points object. Satellite position vectors are stored flat in memory in a BufferGeometry. For each 500ms propagation tick, we leverage satellite.js SGP4 to compute new positions for every visible satellite. The computations are fast-acting since the new positons are overwritten directly into the BufferGeometry's flat Float32Array before being fed into the GPU for render. 
        
        One important nuance to consider is a coordinate-space translation that occurs between the output of SGP4 and the buffer overwrite. The SGP4 framework in satellite.js outputs satellite positions in Earth-Centered Inertial (ECI) coordinates, which does not account for Earth's rotation in the propagation calcuations. i.e., The immediate output of satellite.js propagation will correctly compute a satellite position over the globe, but in the time that the satellite has moved, the Earth has also rotated, leading to a discrepancy in where the satellite is positioned relative to the Earth's geography. SATMAP-7 accounts for Earth's rotation by leveraging Greenwich Mean Sidereal Time (GMST).
        
        On a technical tangent, if N represents the number of total satellite records received from CelesTrak, the client machine will hold approximately 3N copies of the satellites. 2 copies are hosted in Zustand corresponding to the initial satellite records dataset and a dynamically updating propagated satellite record dataset. Then, a third set as type Float32Array exists for direct GPU render.`,
      },

      {
        type: "text",
        heading: "Bug Patches",
        body: `Occlusion checks prevent a user from being able to hover over or select a satellite through the planet Earth. Occlusion checks are handled manually in JavaScript. The implementation is a simple intersection check. If the raycast intersects Earth, then the satellite can not be occluded. Otherwise, we compare the distances from the camera to the target satellite and the Earth to determine occlusion.
        
        Note that since we mutate geometry vertices for satellite propagation renders, we must recompute the so called bounding sphere in Three.js, otherwise, satellite hover and select features break down. But since recomputing the bounding sphere every animation frame is expensive, we actually compute the bounding sphere once outside of the animation frame, with a radius comparable to the maximum satellite altitude.`,
      },
    ],
  },

  "youtube-nlp-summarization": {
    sections: [
      {
        type: "text",
        heading: "Overview",
        body: "Replication and extension of a research paper on YouTube user-generated content summarization. The pipeline ingests raw comment data, applies transformer-based extractive and abstractive summarization, and surfaces latent topic distributions.",
      },

      {
        type: "text",
        heading: "Abstract",
        body: `In 1956, George A. Miller proposed his notion of "The Magical Number" regarding an exploration of human memory and its limitations. His paper, titled "The Magical Number Seven, Plus or Minus Two", posits that the human (short term) memory is only able to retain roughly 5 to 9 "chunks" of information at a time. Fast forward to the 21st century, large scale digital platforms offer information at unprecedented volumes, leading to cognitive and information processing problems such as information overload. Our paper explores the notion of information overload with respect to the YouTube platform, and more specifically, deep learning methods and NLP techniques that solve information overload with respect to summarizing and compressing general viewership of a YouTube video comment section. By accessing the comments on any YouTube video, an AI comment section summary can be used to determine what users are talking about in a video. i.e. By taking in large swaths of natural language text, our model attempts to output abstractive summaries of a number of these topics. The model is intended for use on native YouTube comments and is built to replicate the YouTube Topic AI model.`,
      },

      {
        type: "text",
        heading: "Introduction",
        body: ` As the digital age progresses forwards, the amount of information that is available to society is increasing exponentially. Due to population growth, increased ease of access to the internet, and the continued cultural shift towards electronic commerce and electronic communication, social media platforms are being brought to the forefront of communication. While some of these communications are directed towards another, a large amount of communication is intended for the general populace to peruse. Examples of this include tweets, Facebook posts and comments on YouTube videos, as opposed to directly messaging someone.

        Due to the incomprehensible amount of content that is generated on a day-to-day basis, it is impossible for one to watch every video or read through every post on social media. As evidence, YouTube alone receives 500+ new hours of video uploads every minute (YouTube Official Blog). Using summarizer models, which take in large swaths of data and output more easily digestible sentences or phrases, what was previously thought of as unapproachable is now significantly easier to comprehend. Taking inspiration from YouTube’s recent feature currently in beta testing, YouTube Topics, we have attempted a replication of the comment summarization system currently being worked on. By taking the contents of the comment section of any YouTube video and cleansing the data to remove usernames, the transformer-based model we have created first performs k-means clustering in order to determine the number of topics that it should be summarizing, before summarizing each individual cluster in an easy-to-understand sentence or two. In this manner, by taking the closest n comments of each cluster of YouTube comments and appending them together, our model is intended to summarize the topic behind each of the clusters and output a one-line summary of the discussion happening.

        We tested several methods for both the clustering of k-means and the summarizer model. For the k-means clustering, we determined the number of clusters in three ways; the elbow method, the silhouette method, and by matching to the number of topics on a YouTube video in question. With regard to our model, we changed our base model between Google’s T5 base, Google’s T5 small, and Facebook’s BART base.
        `,
      },

      {
        type: "text",
        heading: "Approach",
        body: `The high-level approach and system pipeline remained consistent since the project proposal with heightened details with respect to low-level implementation decisions. To reiterate, the ultimate project objective is to engineer an NLP system that takes in a swath of user-generated comments and outputs a summary of key overlapping topics as a means of communicating general viewership thought or sentiment.
        
        Our proposed system pipeline comprises two primary systems which abstractly factor the project directive into two more tractable tasks. Namely, the identification of key overlapping topics via Kmeans clustering followed by the summarization of each key topic via a deep-learning NLP model.`,
      },

      {
        type: "images",
        columns: 3,
        captions: ["Two Stage Pipeline"],
        images: ["/projects/youtube-nlp-summarization/pipeline.png"],
      },

      {
        type: "text",
        heading: "Sentence-Embedding Projection Method",
        body: `The core idea is to implement take the set of user comments, project them into the embedding space, and then run K-means clustering across the embedding vectors to identify key overlapping topics to which can then be iteratively fed into the summarization model. 
        
        We implemented the mapping of sentence embeddings directly via a popular pretrained model from Hugging Face. As per their description, the transformer-based model, all-mpnetbase-v2, is specifically designed for sentences and paragraphs revolving around tasks like clustering or semantic search which matches the needs of our topic extraction subsystem perfectly. Note that the sentence embeddings have 768 dimensions as opposed to GloVe or Word2Vec’s typical 300.`,
      },

      {
        type: "text",
        heading: "K-Means Clustering: Finding Optimal K",
        body: `Once each comment has been mapped to a 768-dimensional space, we implemented K-means over the sentence-embedding space as a means to find key overlapping topics with respect to general viewer sentiment or thought. However, in order to determine the number of clusters, K, that our system should identify, we implemented 3 main approaches: Predefined K, search K via elbow method, search K via silhouette score. 
        
        The first approach, using a predefined K, is the simplest approach and least computationally costly. We simply manually set the number of clusters K that our system should interpret before running SKLearn’s KMeans algorithm over the set of sentence embeddings.
        
        The second approach searches for an optimal K value via the elbow method. It works by defining a range of K values to try, and picking the optimal K which minimizes the sum of squared distance from a centroid to its member sentence embeddings, called WCSS (Within Cluster Sum of Squares). This approach discovers a more suitable K than the predefined-K approach at the cost of greater computational cost.

        The third approach searches for an optimal K value via leveraging silhouette scores. It works by defining a range of K values to try, and picking the optimal K which maximizes the average silhouette score, which is a global measure of how cohesive clusters are and how well they are separated. The average silhouette score requires computing the silhouette score for all embedding vectors which is calculated by considering how cohesive it is in the context of its associated cluster (average distance to every other vector in the same cluster) and how well separated it is from unassociated clusters (average distance to every other vector in complementary clusters). i.e. Maximizing the average silhouette score sees that every point is highly cohesive (close to every related member point from the same cluster) and well separated (far from every other unrelated point from different clusters).`,
      },

      {
        type: "text",
        heading: "Brief Survey of Baseline Models",
        body: `Once the K-Means subsystem has clustered relevant embeddings {e1, e2, ..., en} together to produce clusters {g1, g2, ..., gk}, we must now construct a generative model that takes in these k clusters as input and outputs k summaries for each comment cluster. The ideal summary is a succinct one-line sentence or phrase that succinctly summarizes the general topic of a cluster gi for i = 1...k.
        
        In order to achieve this, we will select 3 baseline models and fine-tune them with our chosen HuggingFace dataset. In section 5, we will elaborate more on the quantitative results and comparisons between the models. Our proposition is that summarization requires a baseline model that can abstract semantically meaningful ideas from large swaths of text. Therefore we select candidate models predicated on their ability to perform abstractions.
        
        The first model that we chose is the BART model which is a bidirectional encoder, originally pretrained to reconstruct corrupted or missing text (Lewis et al., 2020). Intuitively, we chose BART for its ability to robustly handle variations and unpredictability in input and generate semantically meaningful content. The key idea is that BART was pretrained on noisy input, forcing the model to learn to abstract meaning from verbosity which gives us a solid launchpad to work from in the fine-tuning stage. 
        
        The second and third models that we chose are T5-base and T5-small. The intuition for using these T5 variants follows a similar train of thought for our reasoning of BART insofar that both T5-base and T5-small were originally pretrained to reconstruct text from span-corrupted, noisy inputs, which aligns with our proposition that the model may perform abstractions of noisy syntax to learn and generate semantic meaning (Raffel et al., 2020).`,
      },

      {
        type: "images",
        columns: 3,
        captions: [
          "BART Architecture",
          "T5-Base Architecture",
          "T5-Small Architecture",
        ],
        images: [
          "/projects/youtube-nlp-summarization/bart.png",
          "/projects/youtube-nlp-summarization/t5_base.png",
          "/projects/youtube-nlp-summarization/t5_small.png",
        ],
      },

      {
        type: "text",
        heading: "Model Training Environment",
        body: `Each of the 3 baseline models were fine-tuned on our chosen HuggingFace dataset with the same hyper parametric configuration as outlined below. The training-validation split was 80% to 20% for all fine-tunings training cycles. Note that the predict_with_generate flag in the HuggingFace library configures the models to generate output sequences during evaluation which enables us to compute ROUGE scores. 
        
        A single total training cycle for the T5-Small took ~30 minutes whereas the T5-Base and BART models took ~1 hour and ~35 minutes respectively while remotely connected to CSIL’s Intel Device a780 and NVIDIA Corporation Device 2684 GPUs. During training, roughly 6GB of VRAM out of 24GB were used per training cycle across all 3 models.`,
      },
      {
        type: "images",
        columns: 2,
        captions: ["Hyperparametric Configuration"],
        images: ["/projects/youtube-nlp-summarization/training.png"],
      },
      {
        type: "code",
        language: "python",
        code: `
      #####################
      ### Train Excerpt ###
      #####################

      training_args = Seq2SeqTrainingArguments(
        output_dir="my_awesome_billsum_model",
        eval_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        weight_decay=0.01,
        save_total_limit=3,
        num_train_epochs=4,
        predict_with_generate=True,
        fp16=True, #change to bf16=True for XPU
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        eval_dataset=tokenized_dataset["test"],
        processing_class=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )

    trainer.train()

    ########################
    ### Evaluation Excerpt ###
    #########################

    def compute_metrics(eval_pred):
      predictions, labels = eval_pred
      decoded_preds = tokenizer.batch_decode(predictions, skip_special_tokens=True)
      labels = np.where(labels != -100, labels, tokenizer.pad_token_id)
      decoded_labels = tokenizer.batch_decode(labels, skip_special_tokens=True)

      result = rouge.compute(predictions=decoded_preds, references=decoded_labels, use_stemmer=True)

      prediction_lens = [np.count_nonzero(pred != tokenizer.pad_token_id) for pred in predictions]
      result["gen_len"] = np.mean(prediction_lens)

      return {k: round(v, 4) for k, v in result.items()}
        `,
      },

      {
        type: "text",
        heading: "Data",
        body: `In the making of this model, it was necessary for there two be two different types of data presented to the model, one for training and one for testing. Although the models designed are built off of existing models, the fine-tuning of these models was still a requirement. To begin this fine-tuning, a dataset with summaries attached to each piece of data was required. The summary could then be provided as feedback for the models during training. Once the models had been trained, the model required the YouTube comments input as another source of data. The model could then be tested in the scenario it was designed for. For the fine-tuning dataset, our dataset of choice was Context Based Chat Summary Plus, by Prithiv Sakthi and hosted on HuggingFace (Prithiv Sakthi (prithivMLmods)). 
        
        The dataset is a collection of newspaper articles, organized by their headlines and bodies. Using this dataset, the model was finetuned using the headline as a summary of the information enclosed in the bodies. For the real-world data, it was imperative for the model to be tested on a wide variety of comment types. In this manner, videos with intentionally spread demographics were selected. Due to the nature of the YouTube Topics AI still being in development, this feature was not available on every video, so only comments on videos that were selected for this feature were able to be tested. YouTube’s Topics AI, while not explicitly stated, appears to avoid videos with polarizing views, depictions of violence, and sexual content. The first choice for a model trained on the newspaper dataset would be the comment section of a video that would be similar in nature; a comment section on a news report uploaded to YouTube would be optimal. However, YouTube’s Topics AI appears to avoid these comment sections to a great degree. Additionally, many news channels turn off comments on their videos to avoid brigading and counter-narratives. 
        
        There were two videos that ended up being selected for testing purposes. The first video selected was an informational video by Stand-Up Maths titled The 10,000 Domino Computer (Stand-up Maths). This dataset represented a slightly more scholarly video on YouTube, with the hope that it would align similarly to the testing data. The second dataset selected was a segment from a comedy game show hosted by Dropout, with the video titled Sam Tortures Brennan With a Bird Trivia Contest He Cannot Win (Dropout). This dataset was selected to be the contrast to the previous dataset, where the summarizer would be run on words it had likely never heard before and inside jokes about the Dropout show.`,
      },

      {
        type: "text",
        heading: "Results and Evaluation",
        body: `The primary evaluation metric we use for comparison purposes are 4 variants of the ROUGE score (Recall-Oriented Understudy for Gisting Evaluation). ROUGE scores compare structural similarities between our model’s generated summarizations and the dataset’s reference summaries via computing n-gram overlaps using precision, recall, and F1 scores. More concretely we used: ROUGE-1 which measures the overlap of unigrams and ROUGE-2 which measures the overlap of bigrams. We also used ROUGE-L and ROUGE-LSUM which compute measures of n-gram overlap of the longest common subsequences between texts. The key difference is that ROUGE-LSUM considers an entire document as a single LCS whereas ROUGE-L computes the average n-gram overlap of the LCS for each pairwise sentence. i.e. Split the document into sentences based on newlines, then compare sentences pairwise.`,
      },

      {
        type: "text",
        heading: "Topic Extraction: K-Means Evaluation and Methods Comparisons",
        body: `In order to determine the most suitable approach to determining or approximating the optimal number of clusters K in our K-means clustering subsystem, we first compared the reported optimal k values between the K-means approaches over 984 samples from our dataset. That is, compute the reported optimal k values from leveraging the elbow method vs computing average silhouette scores and analyze their behaviors for varying ranges of candidate K values. 
        
        In order to reason about what approach we should take in order to find the optimal number of clusters, K, in our embedding space, we decided to investigate and answer the following 3 questions: Do the approaches yield a similar K value? If both approaches converge to similar K values, then we could leverage this as evidence on deciding upon the method to find the optimal K dynamically during inference, say by leveraging a hybrid approach of the two methods.`,
      },

      {
        type: "text",
        heading: "Elbow Method Analysis",
        body: `The elbow method converges to an optimal K of 10 as we test a greater number of candidate clusters over the 984 samples. Conversely, the elbow method decreases its optimal K count as the number of tested candidate clusters decrease (we lose the optimal K of 10 at around Kmax = 50). This finding suggests that, across the 984 sample space, the elbow method requires a certain upper bound of candidate Ks in order to identify a clear elbow of the WCSS vs K-Clusters plot. Otherwise, the distance curve becomes too flat and the inflection point becomes less apparent. It therefore follows that the elbow method is a stable and promising approach that yields the optimal K (likely around or equal to 10) but only when provided a sufficient Kmax.`,
      },

      {
        type: "text",
        heading: "Silhouette Method Analysis",
        body: `Typically, a well-clustered dataset should see the average silhouette score peak at an optimal K with its scores degrading in value for varying candidate Ks diverging from the optimal. Interestingly, in the context of our 984 sample, the silhouette score approach favors K = 4 clusters when testing smaller ranges of candidate Ks, Kmax < 50 but diverges for large ranges of K, Kmax > 50. In fact, the data tends to yield optimal K = Kmax − 1 for large Kmax. This finding suggests that as we scale the upper bound threshold of our K range, the K-Means model overfits to the 984 sample with clusters reducing to singleton clusters where each embedding vector becomes its own centroid. In the limit, one can realize this by imagining the uniform distribution across all sentence embeddings in 768 dimensions. This aligns with the theoretical literature underpinning the behavior of the average silhouette score where a rough upper bound threshold is suggested at about: Kmax ≈ sqrt(N/2) Where N represents the sample size. Consequentially, the silhouette score approach reveals that a clustering structure indeed emerges with an optimal K around 4 when testing comparatively lower upper bounds thresholds, but loses stability and over fits as we scale Kmax.`,
      },

      {
        type: "text",
        heading: "K-Means Final Verdict",
        body: `A standalone implementation of the elbow method is promising, but requires a sufficient K upper bound threshold in order to identify a clear inflection point and hence optimal K. That is, comparatively larger compute costs are required to recognize a clear convergent optimal K, otherwise the WCSS vs K-clusters curve becomes too flat - likely a function of the underlying dataset’s complexity. Thus, the standalone elbow method is eliminated. The standalone silhouette approach empirically suggests the requirement of a relatively smaller upper bound threshold using our aforementioned rule of thumb formula which is promising. A hybrid approach that combines the silhouette score and elbow methods are also promising i.e. consider taking the arithmetic average between both approaches. Therefore, by process of elimination, we decided that the final K-means approach to be either a standalone implementation of the average silhouette score method or a hybrid combination of both the average silhouette score approach and elbow method.`,
      },

      {
        type: "text",
        heading: "Generative Summarization Models: Evaluation and Comparisons",
        body: `The key finding with respect to the ROUGE score evaluation comparisons is that the BART model outperforms both T5 variants across all ROUGE metrics and validation loss, with the T5-Base marginally outperforming the T5-Small. All models had similar generation lengths, with the BART model averaging between 16.1 to 16.3 tokens, the T5-Base producing around 15.8 to 16.0 tokens, and the T5-Small averaging the lowest summary text generation length at 15.7 to 15.9. When measuring our models’ fine-tuning metrics, every model was found to decrease in training and validation loss as the epochs progressed. With regards to the Rouge1 score, the T5-small model approached a value of 0.54, the BART model approached a value of 0.60, and the T5-base model approached a value of 0.57. Despite these promising scores, all of the models underperformed when concentrated on real-world data. With output significantly longer than the intended length, and incomprehensible summaries, there was not a meaningful output produced. Some outputs were one of the comments on YouTube with the middle of the sentence taken out, while others were one comment stitched on top of another.`,
      },
      {
        type: "images",
        columns: 3,
        captions: [
          "BART: epoch vs RougeLSum",
          "T5-Base: epoch vs RougeLSum",
          "T5-Small: epoch vs RougeLSum",
        ],
        images: [
          "/projects/youtube-nlp-summarization/bart_graph.png",
          "/projects/youtube-nlp-summarization/t5_base_eval.png",
          "/projects/youtube-nlp-summarization/t5_small_eval.png",
        ],
      },

      {
        type: "text",
        heading: "Analysis",
        body: `Some changes were made during testing to the YouTube comments being input to the models. It was determined that many comments that were replies to other comments had no meaning, and were emojis only or otherwise not useful to a summarizer model. After noticing this, the data fed into the models had replies removed, which showed a marginal improvement in the summarization, with significantly less usernames present in the output. However, there were still a significant number of shortcomings in the summarized results. 
        
        Upon review, there are a number of reasons that accumulate to these failures. With regards to the selected training dataset, it does not fit well to the realworld implementation of our model. Our results indicate issues in the datasets, both with the selected training dataset and with the YouTube comments. The text of a newspaper article is significantly different from that of YouTube comments in three major ways. Due to the nature of a newspaper article being a report on an event, and YouTube comments being a reaction to the media presented, the perceptive used is very different. In newspapers, it is common to refer to third person events, without using first person language. In YouTube comments, first person perspective is significantly more prevalent, with many users commenting on how they enjoyed a certain part of the video or their own impressions on it. 
        
        Another discrepancy between the two is the formality of the language used. As internet culture has evolved, so has informal messages and slang. Words used in YouTube comments may never be seen in previously printed newspaper articles. Finally, the presence of references to other users in YouTube comments occurs in a manner dissimilar to that of newspaper articles. In newspaper articles, named entities are very often accompanied by a description of their occupation or relation to the article. However, due to the anonymous nature of the internet, many users refer to one another without referencing their relation to the media at hand, based solely on their reaction to it. 
        
        Additionally, references such as those along the lines of ’but can it run Doom’ that were commonly seen in the The 10,000 Domino Computer video’s comments expect the viewer to understand the relation of the named entity to the video without explicitly stating it. Our summarizer model was not trained on data of this nature, and fails to understand the meaning behind these comments.`,
      },

      {
        type: "images",
        columns: 2,
        captions: [
          "BART fine-tuning metrics",
          "T5-Base fine-tuning metrics",
          "T5-Small fine-tuning metrics",
        ],
        images: [
          "/projects/youtube-nlp-summarization/bart_metrics.png",
          "/projects/youtube-nlp-summarization/t5_base_metrics.png",
          "/projects/youtube-nlp-summarization/t5_small_metrics.png",
        ],
      },
    ],
  },

  "ovarian-cancer-classification": {
    sections: [
      {
        type: "text",
        heading: "Overview",
        body: "As the designated team lead of 5, I spearheaded the technical development of OCSC-NET, a high-accuracy deep learning model and pipeline for early-stage diagnosis of overian cancer. This work was completed as the final course project for SFU CMPT 340 Biomedical Computing.",
      },
      {
        type: "video",
        heading: "Presentation",
        src: "/projects/ovarian-cancer-classification/ocsc-net.mp4",
      },

      {
        type: "text",
        heading: "Introduction",
        body: `Ovarian cancer (OC) is the fifth most common cause of cancer-related death in women and is often diagnosed at a later stage, particularly in postmenopausal patients. The disease affects approximately 40 out of every 100,000 women annually over the age of 50 years. Early detection is critical; the five-year survival rate increases drastically from 3% in Stage IV to 90% in Stage I. Therefore, accurate and early classification of ovarian cancer subtypes is essential to improve diagnosis, treatment planning, and overall patient outcomes (Ghoniem et al., 2021).

        This project presents a deep learning application designed to classify five different subtypes of ovarian cancer: high-grade serous carcinoma (HGSC), clear cell carcinoma (CC), endometrioid carcinoma (EC), low-grade serous carcinoma (LGSC), and mucinous carcinoma (MC), based on histopathological images. Our application aims to help medical professionals and researchers in oncology—the field of medicine that focuses on the study and treatment of cancer—by automating the identification of these subtypes, which can be challenging due to the overlap of morphological features, meaning the visual characteristics and structure of cancer cells. It is intended for use by oncologists, medical researchers, hospitals, and clinical practitioners, providing valuable support in diagnosis and second opinion scenarios.

        To build and train our model, we use a publicly available dataset extracted from the UBC-OCEAN ovarian cancer subtype classification challenge. The dataset includes over 25,000 JPEG images across the five subtypes, with each image formatted as a 3-channel RGB tensor. Our application aims to assist cancer physicians and researchers in automating the identification of these subtypes, which can be challenging due to overlapping morphological features and the subjective nature of manual analysis. Accurate subtype classification is crucial not only for diagnosis, but also for determining appropriate treatment plans and predicting patient outcomes. By applying deep learning techniques to histopathological image data, our tool can reduce diagnostic variability, improve consistency, and potentially accelerate workflows in clinical settings. It is intended for use by oncologists, medical researchers, hospitals, and clinical practitioners, providing valuable support in diagnosis, research, training, and second opinion scenarios where expert consensus is needed.

        Several previous studies have explored this dataset using a variety of machine learning and deep learning techniques. One recent study used EfficientNet-B0 for feature extraction combined with a fine-tuned k-nearest neighbor (KNN) classifier, achieving exceptional accuracy on a subset of 725 images (Behera et al., 2024). Another study evaluated attention-based multiple instance learning classifiers and histopathology foundation models trained on more than 1,800 whole slide images, reaching balanced accuracies of up to 89% to 97% depending on the model and evaluation setup (Breen et al., 2025). These studies highlight both the potential and ongoing challenges in this domain, particularly in the construction of generalizable models with efficient computation and robust classification accuracy.
        `,
      },
      {
        type: "text",
        heading: "Training Data",
        body: `The data used in this project consists of pre-extracted 500x500 pixel image patches derived from the UBC-OCEAN Ovarian Cancer Subtype Classification and Outlier Detection Dataset, hosted on Kaggle, and its associated supplemental masks dataset. The original data set was developed for a competition aimed at improving the machine learning-based classification of ovarian cancer subtypes to support more accessible and reliable clinical diagnostics.`,
      },
      {
        type: "images",
        columns: 3,
        captions: [
          "Clear Cell Carcinoma (CC)",
          "Endometrioid Carcinoma (EC)",
          "High-Grade Serous Carcinoma (HGSC)",
          "Low-Grade Serous Carcinoma (LGSC)",
          "Mucinous Carcinoma (MC)",
        ],
        images: [
          "/projects/ovarian-cancer-classification/CC.jpg",
          "/projects/ovarian-cancer-classification/EC.jpg",
          "/projects/ovarian-cancer-classification/HGSC.jpg",
          "/projects/ovarian-cancer-classification/LGSC.jpg",
          "/projects/ovarian-cancer-classification/MC.jpg",
        ],
      },

      {
        type: "text",
        body: `Each image patch used in this study is an RGB image in the format of (Height, Width), specifically 500x500. These patches were extracted from larger histopathological Whole Slide Images (WSIs) and Tissue Microarrays (TMAs), but only the patches were used for analysis. Importantly, regions marked as cancerous (red) and normal (green) in the supplemental tissue masks were excluded during the extraction process. This filtering was performed to focus on other tissue regions, such as necrotic areas or unannotated zones, which can help reduce class imbalance and bias in the training data.`,
      },

      {
        type: "text",
        heading: "Model Architecture and Transfer Learning",
        body: `We employed the use of ResNet-18, a type of convolutional neural network (CNN) architecture, as the base model. ResNet-18 was chosen for its ability to balance depth, performance, and computational efficiency (He et al., 2015). This was especially important in our case, as we had a smaller dataset size and limited GPU resources that could be utilized.

        The model was initialized using ImageNet-pretrained weights. This refers to parameters that have been trained on the ImageNet dataset, which is used to capture general visual features (Russakovsky et al., 2015). We used these pretrained weights to take advantage of learned low- and mid-level features. Some low-level features include edges in the image, texture, and color contrast, which are detected in the first few layers of the model using small convolutional filters (Boureau et al., 2010). In the intermediate layers, some of the features correspond to the shape of the cell nuclei, cytoplasm texture, and cell organization. At this stage, the images are not yet associated with a specific subtype of cancer. The model was then modified to fit our goal of classifying between five different ovarian cancer cell subtypes by implementing a final fully connected layer. The original fully connected layer was replaced with a linear layer with five output neurons. This layer was randomly initialized and trained from scratch. Furthermore, the earlier layers were fine-tuned to improve the accuracy of recognizing specific details within the images.`,
      },

      {
        type: "text",
        heading: "Model Training and Optimization",
        body: `The model was trained for 25 epochs using a batch size of 32. Since this task involves classifying images into multiple ovarian cancer subtypes, we used Cross Entropy Loss, which is well-suited for multiclass classification problems. This loss function measures how different the predicted probability distribution is from the actual labels and encourages the model to assign high confidence to the correct class.

        For optimization, we used the Adam optimizer, which is widely used in deep learning because it combines the strengths of two popular methods: momentum and adaptive learning rates. Adam automatically adjusts the learning rate for each parameter during training, helping the model converge faster and more reliably, especially when working with complex image data.

        To further improve learning, we used a Cosine Annealing LR Scheduler that gradually decreases the learning rate over time. Starting with a higher learning rate allows the model to explore a wide range of possible solutions, while reducing it later in training helps fine-tune the model for better accuracy. This approach helps the model to converge more effectively and avoid getting stuck in suboptimal solutions.`,
      },

      {
        type: "code",
        language: "python",
        code: `
    ...

    #################################
    ### DATA PREPROCESSING snippet ###
    #################################
    mean = [0.8078, 0.6700, 0.8138]
    std = [0.0925, 0.1142, 0.0710]

    train_transform = transforms.Compose([
        # transforms.Grayscale(num_output_channels=1),
        transforms.Resize((496, 496)),
        transforms.RandomCrop(480),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])
    test_transform = transforms.Compose([
        # transforms.Grayscale(num_output_channels=1),
        transforms.Resize((496, 496)),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])

    ...

    ########################
    ### MODEL DEFINITION ###
    ########################
    from torchvision.models import resnet18
    model = resnet18(pretrained=True)
    model = model.to(device)

    models_dir = os.path.join(output_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    model_save_path = os.path.join(models_dir, 'best_model_complete.pth')

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate, weight_decay=0.00025)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=num_epochs)
        
        `,
      },

      {
        type: "images",
        heading: "Results and Evaluation",
        columns: 3,
        captions: [
          "Training loss over epochs",
          "Validation and test accuracy over epochs",
          "Confusion matrix on test set",
        ],
        images: [
          "/projects/ovarian-cancer-classification/loss.png",
          "/projects/ovarian-cancer-classification/accuracy.png",
          "/projects/ovarian-cancer-classification/confusion_matrix.png",
        ],
      },

      {
        type: "text",
        body: `The training loss shows a smooth and steady decline over 25 epochs, dropping from above 0.7 to nearly 0. This consistent decrease indicates stable convergence, which confirms that the model successfully minimized the classification errors in the training set.
        
        The second figure shows the accuracy on both validation sets and test in all training epochs. Accuracy improves quickly within the first 10 epochs and gradually increases to almost 99\%. The close tracking between validation and test curves suggests strong generalization with minimal overfitting.

        The confusion matrix illustrates the performance of the model in the five subtypes of ovarian cancer. The majority of predictions lie along the diagonal, indicating high accuracy for all classes. In particular, CC had 1,103 tests, with 1,097 correctly predicted (99.46\% accuracy), EC correctly classified 1,276 out of 1,284 samples (99.38\% accuracy), HGSC which is the most represented class with 1,679 test samples, correctly predicted 1,673 samples (99.64\%), and LGSC and MC both had 99.24\% and 99.02\% accuracy respectively.
        `,
      },
    ],
  },

  ossad: {
    sections: [
      {
        type: "text",
        heading: "Overview",
        body: "OSSAD-9 is a networks intelligence platform designed for network engineers, IT specialists, and penetration testers. It provides real-time monitoring, anomaly detection, and a comprehensive tool suite for network analysis — available for both local and remote access.",
      },

      // video demo of what i have so far

      {
        type: "table",
        heading: "Tech Stack",
        headers: ["Layer", "Technology"],
        rows: [
          ["Framework", "Next.js 16 (App Router), React 19, TypeScript"],
          ["Styling", "Tailwind CSS v4, custom CSS design tokens"],
          ["State Management", "Zustand"],
          ["Data Validation", "Zod"],
          ["Charts", "Recharts"],
          ["Icons", "Lucide React"],
          ["Fonts", "Geist Sans, IBM Plex Mono"],
          ["Network Tools", "nmap (system CLI, spawned server-side)"],
          ["Transport", "Server-Sent Events (SSE) for live scan streaming"],
          [
            "Database",
            "None — Firestore-compatible types prepared for future integration",
          ],
          [
            "Deployment",
            "Vercel (demo mode) + local / self-hosted (full functionality)",
          ],
        ],
      },

      {
        type: "text",
        heading: "High Level Objectives",
        body: `OSSAD-9 is organized around 7 toolkits accessible from a persistent sidebar: Topology, Monitor, Probe, Intel, Threat, References, and Dev Tools.
      
        The Topology toolkit is the most complete. The Host Map tool performs live subnet discovery by spawning an nmap ping scan on a user-provided CIDR range, streaming discovered hosts back to the client in real time over Server-Sent Events. Each host is rendered in a star topology graph with latency-based color coding, MAC address resolution, vendor identification, and device type classification. The Network Inventory tool aggregates data across the Host Map, Route Trace, and ARP tools — deduplicating by IP address and merging fields from each source into a unified device table.
        
        The Route Trace tool provides hop-by-hop path visualization with TTL, IP, hostname, ASN, and RTT per hop. The ARP / Layer 2 Inspector displays MAC-to-IP mappings, OUI vendor lookups, conflict detection (duplicate IP, duplicate MAC, static violations), and interface selection. Both tools have complete frontends with simulated data — their backend implementations are pending.
        
        All scanning tools share a consistent control model: run, pause, resume, and reset. Each tool displays a real-time scan log. RFC compliance badges are shown on every tool, referencing the relevant standards. The platform detects Vercel deployment automatically and switches to mock mode with a clear warning, since raw socket operations are blocked on serverless infrastructure.`,
      },

      {
        type: "table",
        heading: "Feature Roadmap",
        headers: ["Toolkit", "Tool", "Status", "Notes"],
        rows: [
          [
            "Topology",
            "Host Map",
            "Done",
            "nmap -sn ping scan, SSE streaming, star topology visualization",
          ],
          [
            "Topology",
            "Network Inventory",
            "Done",
            "Cross-tool aggregation, deduplication by IP",
          ],
          [
            "Topology",
            "Route Trace",
            "Frontend Only",
            "Simulated backend — real traceroute subprocess pending",
          ],
          [
            "Topology",
            "ARP / Layer 2 Inspector",
            "Frontend Only",
            "Simulated backend — real arp parsing pending",
          ],
          [
            "Topology",
            "Route Trace — backend",
            "Underway",
            "Wire real traceroute / tracert via SSE",
          ],
          [
            "Topology",
            "ARP Inspector — backend",
            "Underway",
            "Wire real arp -a / ip neigh parsing",
          ],
          [
            "Topology",
            "Network Inventory — export",
            "Underway",
            "JSON/CSV export — UI buttons exist, handlers stubbed",
          ],
          [
            "Monitor",
            "Latency Monitor",
            "Underway",
            "ICMP ping loop with charted RTT over time",
          ],
          [
            "Monitor",
            "HTTP / Service Probe",
            "Underway",
            "HTTP/HTTPS reachability and status code tracking",
          ],
          [
            "Monitor",
            "DNS Health",
            "Underway",
            "Resolver checks, propagation validation",
          ],
          [
            "Monitor",
            "Throughput Estimator",
            "Underway",
            "Bandwidth estimation via timed data transfer",
          ],
          [
            "Probe",
            "Port Scanner",
            "Underway",
            "nmap-based TCP/UDP port scanning with range input",
          ],
          [
            "Probe",
            "Service Fingerprinting",
            "Underway",
            "nmap -sV service version detection",
          ],
          ["Probe", "OS Detection", "Underway", "nmap -O OS fingerprinting"],
          [
            "Probe",
            "SSL / TLS Inspector",
            "Underway",
            "Certificate chain, expiry, cipher suite inspection",
          ],
          [
            "Intel",
            "WHOIS / RDAP",
            "Underway",
            "RDAP API lookup for IP and domain ownership",
          ],
          [
            "Intel",
            "BGP / ASN Lookup",
            "Underway",
            "BGP routing info, ASN details",
          ],
          [
            "Intel",
            "DNS Intelligence",
            "Underway",
            "Full DNS record enumeration (A, MX, TXT, NS, etc.)",
          ],
          [
            "Intel",
            "Geolocation",
            "Underway",
            "IP-to-location via free GeoIP API",
          ],
          [
            "Threat",
            "CVE Lookup",
            "Underway",
            "NVD API integration for CVE search",
          ],
          [
            "Threat",
            "Port Risk Audit",
            "Underway",
            "Cross-reference open ports against known CVEs",
          ],
          [
            "Threat",
            "IP & Domain Reputation",
            "Underway",
            "AbuseIPDB / VirusTotal API lookup",
          ],
          [
            "Threat",
            "Security Header Audit",
            "Underway",
            "HTTP response header analysis",
          ],
          [
            "References",
            "Port Directory",
            "Underway",
            "Static reference table of common ports",
          ],
          [
            "References",
            "Protocol Reference",
            "Underway",
            "Static reference content",
          ],
          [
            "References",
            "Subnet & CIDR Tables",
            "Underway",
            "Static reference content",
          ],
          [
            "References",
            "RFC Quick Reference",
            "Underway",
            "Static reference content",
          ],
          ["Dev Tools", "Subnet Calculator", "Underway", "CIDR math utilities"],
          [
            "Dev Tools",
            "IP Utilities",
            "Underway",
            "IP conversion and range tools",
          ],
          [
            "Dev Tools",
            "MAC & OUI Tools",
            "Underway",
            "OUI lookup, MAC generation",
          ],
          ["Dev Tools", "Data & Bandwidth", "Underway", "Unit conversion"],
          [
            "Dev Tools",
            "Encode & Hash",
            "Underway",
            "Base64, hex, MD5, SHA tools",
          ],
          [
            "Dev Tools",
            "Timestamp & Uptime",
            "Underway",
            "Time conversion utilities",
          ],
          [
            "Other",
            "Console",
            "Frontend Only",
            "Terminal UI exists — no backend command execution",
          ],
          [
            "Other",
            "Overview / Dashboard",
            "Frontend Only",
            "Shell only — all stats hardcoded empty",
          ],
          [
            "Other",
            "Database persistence",
            "Underway",
            "Firestore-compatible types already prepared",
          ],
          [
            "Other",
            "Projects page",
            "Underway",
            "Saved scan session management",
          ],
        ],
      },

      {
        type: "text",
        heading: "Approach & Methodology",
        body: `OSSAD-9 is designed as a local-first network intelligence platform. The core premise is that serious network tooling requires privileged system access — port scanning, ARP inspection, raw socket operations — which cannot be safely or legitimately run on shared cloud infrastructure. The platform is built to run locally or on self-hosted infrastructure, with Vercel as an optional demo-mode deployment that falls back to simulated data with explicit warnings to the user.
      
      The architecture separates concerns cleanly: the frontend handles all user interaction, visualization, and state — the backend is responsible only for executing system-level operations and streaming their output. No business logic lives in the API routes. This makes each tool independently testable and allows frontend development to proceed ahead of backend implementation, which is how the Route Trace and ARP tools reached a complete UI state before their backends were wired.
      
      Every tool is designed around a streaming-first model. Rather than running a scan to completion and returning a bulk result, the server streams incremental updates to the client via Server-Sent Events as they become available. This gives the interface a live, real-time character — hosts appear on the map as they are discovered, not all at once after a wait.`,
      },

      {
        type: "text",
        heading: "Backend Architecture",
        body: `Real network operations are performed by spawning system CLI tools as child processes from Next.js API routes. The Host Map tool, for example, spawns nmap with a ping scan flag and a user-provided CIDR range. The process output is read line by line, parsed for host data (IP, MAC, vendor, hostname, latency), and dispatched to the client as Server-Sent Events in a structured JSON format.
      
      Each SSE event has a type field — host_discovered, log, complete, or error — which the client uses to update its Zustand store accordingly. This pattern is designed to extend uniformly across all future tool implementations: Route Trace will stream one hop at a time, Port Scanner will stream one open port at a time, and so on.
      
      Vercel deployment is detected at runtime. Since Vercel's serverless functions cannot spawn processes or open raw sockets, the API routes fall back to returning mock data with a warning flag. The frontend renders this warning prominently so the distinction between real scan results and simulated data is never ambiguous.`,
      },

      {
        type: "text",
        heading: "State Architecture",
        body: `Each tool has a dedicated Zustand store managing its scan state, results, simulation data, and control flags. The stores are intentionally isolated — the Host Map store knows nothing about the Route Trace store, and so on. The Network Inventory tool is the one exception: it reads from all three topology stores and merges their data into a unified view.
      
      Every store includes built-in timing infrastructure to support both real streaming data and mock simulation with realistic delays. This means a tool whose backend is not yet implemented can still be run in the UI with believable timing — hosts or hops appear at plausible intervals, not all at once. Pause and resume are implemented at the store level by tracking dispatched event counts and pending timeout references, allowing the simulation to be interrupted and continued cleanly.
      
      All stores expose a consistent interface: run, pause, resume, reset, and a logs array that the ScanLog component reads from directly. This uniformity means the layout shell and control buttons are fully reusable across tools with no per-tool wiring.`,
      },

      {
        type: "text",
        heading: "Data Model",
        body: `All TypeScript types are designed to be Firestore-compatible from day one. Every ID field is a string, there are no undefined values anywhere in the schema (null is used instead), and all models are flat enough to serialize cleanly to Firestore documents without transformation.
      
      This was a deliberate forward-compatibility decision. Adding persistent storage in the future — saving scan sessions, tagging hosts across scans, building a project history — requires no type changes. Only new API endpoints and a database connection need to be added. The schema already describes what a persisted scan session, discovered host, or inventory record looks like.
      
      Currently all data is in-memory only, held in Zustand stores for the duration of a browser session. A page refresh clears everything. The types file includes a comment noting the Firestore compatibility intention explicitly, so future contributors understand the design constraint.`,
      },
    ],
  },

  "eeg-brain-computer-interface": {
    sections: [
      {
        type: "text",
        heading: "Overview",
        body: "A real-time brain-computer interface system that simulates telepathy. EEG brain waves are extracted non-invasively using the OpenBCI Mark-IV 8-channel headset. TensorFlow neural networks classify preprocessed FFT data streams to enable real-time game control — I played Flappy Bird using only my thoughts.",
      },

      {
        type: "text",
        heading: "Demos",
        body: 'See the 2 demos below to watch me operate the headset to play the legendary game Flappy Bird using just my thoughts. The demo below features a custom recreation of Flappy Bird, Tensorflow for model inference, and OpenBCI\'s GUI and SDK. I generate more data on the fly with each data generation session that I run for either motor action "UP" or "DOWN".',
      },
      {
        type: "video",
        src: "https://www.youtube.com/watch?v=VDQbfN8cseo",
      },
      {
        type: "video",
        src: "https://www.youtube.com/watch?v=z71WdvkCPH8",
      },

      {
        type: "text",
        heading: "Neural Network Architecture",
        body: `
        the diagram below depicts the architecture of the neural network currently used in the recorded demos. As I have not yet had the chance to formally learn about neural networks - as I am just finishing up my second year - this project has given me great insight on the topic.

        This architecture was created primarily via experimentation. I experimented with different numbers of hidden layers and the amount of neurons within each layer. Throughout my experimentation process, I found the following general cases:

          1. models with minimal hidden layers AND minimal hidden neurons did not perform well
          2. models with multiple hidden layers AND minimal hidden neurons did not perform well
          3. models with multiple hidden layers AND multiple hidden neurons did perform adequately
          4. models with minimal hidden layers AND multiple hidden neurons did ??? (next experiment)
        
        for case 3 however, it must be noted that when the number of hidden neurons were exaggerated and each uniformly distributed hidden layer approached N neurons (N = size of input) the architecture appeared to extrapolate my motor functions less precisely; presumably it worked more like a memory bank and buffered all of my data's features.

        When I decreased the number of hidden neurons across each layer, that is when it tended to process the data more actively, discovering key consistencies across the data.
        `,
      },

      {
        type: "images",
        columns: 1,
        captions: ["Neural Network Abstract"],
        images: ["/projects/eeg-brain-computer-interface/network.png"],
      },

      {
        type: "text",
        heading: "Experimental Neural Network Architecture",
        body: `
        As I gained more knowledge and understanding on the topics of neural networks (from sources online), I recreated the next neural network architecture that I would like to experiment with. The greatest concern I had in the previous neural network architecture was that there were too many hidden layers and hence would decrease my model's accuracy.

        In the next model, I plan on decreasing the number of hidden layers (which worked against me before), but in exchange I will increase the number of hidden neurons, testing my previous hypothesis that more hidden layers were not redundant.
        `,
      },

      {
        type: "images",
        columns: 1,
        captions: ["Experimental Neural Network Abstract"],
        images: [
          "/projects/eeg-brain-computer-interface/experimental_network.png",
        ],
      },

      {
        type: "text",
        heading: "Data Pipeline",
        body: 'The data creation process is a 2-prong pipeline in order to separate the concerns of generating the base data and new subsequent data. When I first mapped out the architecture of this project, I wanted to be able to continuously generate new data as I operated the headset. However, in the beginning, there was no data. I therefore architected a preliminary data-creation pipeline for both motor actions "UP" and "DOWN". The flappy-bird game remake simulated the character flying upwards or downwards dependent on the target motory action. All data chunks were divided into 10-second simulation windows to avoid burnout.',
      },
      {
        type: "images",
        columns: 1,
        captions: ["generate_base_data.py"],
        images: [
          "/projects/eeg-brain-computer-interface/generate_base_data.png",
        ],
      },

      {
        type: "text",
        heading: "Data Pipeline",
        body: "Once a sufficient amount of base data was generated, the model could inference with a non-random accuracy in real-time. The diagram below depicts the integration of generating data on-the-fly into the game loop enabling me to operate the hardware and play the video game all while generating new data as I do so.",
      },
      {
        type: "images",
        columns: 1,
        captions: ["generate_new_data.py"],
        images: [
          "/projects/eeg-brain-computer-interface/generate_new_data.png",
        ],
      },

      {
        type: "text",
        heading: "Game Engine",
        body: "The core visualization engine was a recreation of the legendary mobile game, Flappy bird. Integrating the OpenBCI SDK (data stream) and Tensorflow (inference) to my custom game engine was vital for receiving immediate visual feedback in real-time. This allowed me to qualitatively gauge model accuracy.",
      },
      {
        type: "images",
        columns: 1,
        captions: ["Game loop architecture"],
        images: ["/projects/eeg-brain-computer-interface/game.png"],
      },

      {
        type: "text",
        heading: "Hardware & Setup",
        body: "This project would not have been possible without the excellent suite of tools and products provided by OpenBCI. After browsing through their inventory, I ended up going with the 8-channel mark IV headset. I placed my order and a couple weeks later, I got started. Note that the headset skeleton was not included in the shipment- just the electrodes and cyton board kit. The chassis itself was 3D printed here at a local shop in Vancouver, downtown as I did not - and still don't - own a 3D printing machine.",
      },
      {
        type: "images",
        columns: 3,
        captions: [
          "8-channel electrode Mark-IV headset",
          "Cyton board",
          "Cyton board kit with USB dongle",
        ],
        images: [
          "/projects/eeg-brain-computer-interface/mark_4.jpg",
          "/projects/eeg-brain-computer-interface/cyton.webp",
          "/projects/eeg-brain-computer-interface/cyton_kit.webp",
        ],
      },

      {
        type: "text",
        heading: "Signal Processing Pipeline",
        body: "Some important housekeeping items- unless specified otherwise, the game loop runs at 30fps 120 max frequency (nyquist), and all data generation chunks are 10 seconds long. Enforicing a 10 second window of operation per session was somewhat arbitrary, but it helped me avoid burnout from operating the headset for too long. It also greatyl simplified data preprocessing. See the excerpt below.",
      },
      {
        type: "code",
        language: "python",
        code: `
    def load_data(data_dir='data'):
      # objective: load all snapshots recorded ever, for each action.
      # resulting shape should yield --> (x, 8, 120) for each action
      # where x is some large number of snapshots divisible by 300 to get number of session files.
      action_datas = {
          'down': [],
          'up': []
      }
      label_vectors = {
      'down': [1, 0],
      'up': [0, 1]
      }
      combined_data = []
      
      # save all snapshots for each session file into corresponding action array
      for action in ACTIONS:
          data_path = os.path.join(data_dir, action)
          for session_file in os.listdir(data_path):
              session_file_data = np.load(os.path.join(data_path, session_file))
              for snapshot in session_file_data: # each session file should yield 300 of (8 by 120) arrays
                  action_datas[action].append(snapshot)
          
          np.random.shuffle(action_datas[action]) # shuffle each action data array
      
      # since numbers of snapshots between action data folders may not be equal.
      min_length = min([len(action_datas[action]) for action in ACTIONS])
      for action in ACTIONS:
          action_datas[action] = action_datas[action][:min_length]
          for snapshot in action_datas[action]:
              combined_data.append([snapshot, label_vectors[action]]) # pair each snapshot X with feature Y
      
      np.random.shuffle(combined_data) # shuffle the combined action data arrays
      
      return combined_data

    `,
      },
    ],
  },

  "plagiarism-detection": {
    sections: [
      {
        type: "text",
        heading: "Overview",
        body: "A plagiarism detection system that combines multiple language recognition tools — ANTLR and Tree-Sitter — for robust lexical analysis. The system tokenizes source code, builds abstract syntax trees, and applies winnowing algorithms to compute structural similarity scores.",
      },

      {
        type: "text",
        heading: "Background",
        body: `Plagiarism detection in source code has been a significant focus of attention in computer science education. However, most existing tools are based on specific algorithms and parsing techniques, often lacking flexibility for educators to adapt the tools to different use cases or languages. By utilizing different language specification tools such as ANTLR, Tree-sitter, JavaCC, and J-Flex + CUP, we can explore how these tools impact the design and performance of plagiarism detection systems.`,
      },

      {
        type: "text",
        heading: "Problem Statement",
        body: `Despite the availability of various plagiarism detection tools, there is limited research evaluating the effectiveness of different language specification tools in building plagiarism detection systems. This project seeks to create three custom plagiarism detection systems, each based on a different language specification tool, and compare their effectiveness in detecting various types of plagiarism.`,
      },

      {
        type: "text",
        heading: "Objectives",
        body: `1. Develop a (or multiple) custom plagiarism detection systems, each built using a different language specification tool.
        2. Implement variants using ANTLR and Tree-sitter.
        3. Evaluate the effectiveness of each system in detecting code plagiarism, focusing on different types of code manipulation (e.g., direct copying, obfuscation, formattin. 
        4. Analyze the strengths and limitations of each language specification tool in terms of precision, recall, false positive rate, and false negative rate.`,
      },

      {
        type: "text",
        heading: "Issues and Significance",
        body: `Plagiarism in computer science-related education has posed a major challenge for educators in recent years due to the increased access to information and software tools online that have made it easier to copy code. As a result, this practice has compromised the integrity of academic assessments and does not accurately reflect students’ understanding and comprehension of the material taught.`,
      },

      {
        type: "text",
        heading: "Methodology",
        body: `This project implements three versions of a plagiarism detection tool for source code. The first version uses the winnowing algorithm for comparing files; This serves as a control group. The second version integrates ANTLR (ANother Tool for Language Recognition) with the winnowing algorithm for more structured code analysis. The third version leverages the Tree-Sitter framework to parse and abstract source files much like ANTLR, but with some key differences that shall be elaborated upon later.`,
      },
      {
        type: "images",
        columns: 2,
        captions: [""],
        images: ["/projects/plagiarism-detection/abstraction.png"],
      },
      {
        type: "text",
        body: `At a high level, variants of the detection system will be developed by reconfiguring the parser layer, which can also be interpreted as the layer that feeds into the winnow algorithm. Note that the winnowing algorithm is the central algorithm of all configurations, including the null parser (no parser nor syntax tree; winnowing over raw text only).`,
      },

      {
        type: "text",
        heading: "Winnowing",
        body: `Winnowing is an algorithm that is often used in plagiarism detection to find similarities between files by identifying common substrings. The algorithm identifies common substrings by generating "fingerprints" from a sequence of hashes derived from k-grams, which are contiguous sequences of characters [1]. The main idea behind the winnowing algorithm is to hash substrings of text (k-grams) and then select a subset of hashes (fingerprints) that provides a concise representation of the text. These fingerprints are then compared throughout to detect potential plagiarism between files.`,
      },
      {
        type: "images",
        columns: 1,
        captions: [""],
        images: ["/projects/plagiarism-detection/pipeline.png"],
      },
      {
        type: "text",
        body: `NORMALIZATION: Before we use the winnowing algorithm to generate k-grams, the input source code undergoes a normalization process. This step removes comments, unnecessary whitespaces, and converts the code to lowercase. Doing so eliminates irrelevant differences that could interfere during the detection  process for potential similarities and ensures a more accurate comparison of the logic and structure of the code.
        
        K-GRAM: The winnowing algorithm is used to generate k-grams from the input source code. K-grams are contiguous substrings of length k that are used to break down the code into smaller, manageable parts to be processed [2]. The value of the k-gram selected highly impacts the result of the plagiarism detection process as the substring size defines the fingerprint granularity. A finer granularity (smaller k-gram value) makes the fingerprint more prone to false matches, whereas a coarser granularity (larger k-gram value) increases the fingerprint's sensitivity to changes [3]. The plagiarism detection software uses 20 as the value for k-gram size, which creates 20-character long substrings, and calculates hashes for each substring.

        HASHING: Each k-gram is hashed using a hash function (SHA-1), to convert the string into a fixed-size hash value. This step helps to create a compact representation of the code, which allows for efficiency during the comparison phase later on. 
        
        SLIDING WINDOW: For fingerprint generating, which we will mention below, we use a fixed-size sliding window across the code and select fingerprints from the hashes of k-gram. A smaller window size increases detection sensitivity by capturing more granular patterns, but it results in more hashes, leading to higher storage requirements and reduced efficiency. On the other hand, a larger window size reduces the number of hashes and improves processing efficiency but may decrease sensitivity to smaller instances of plagiarism [4]. The plagiarism detection software uses 3 as the value for window size, which means that it examines every consecutive group of 3 k-grams and selects the minimum hash value from each group to form the file’s fingerprint.

        FINGERPRINTING: Using a winnowing algorithm, only one chunk is selected as a fingerprint from each winnowing window. This involves applying a sliding window of size 3 across the hashes of the k-grams, with the window selecting the minimum hash value from each group of 3 consecutive hashes [4]. The hash value chosen will serve as the fingerprint for that particular window. 

        FINGERPRINT COMPARISON: The final step in the winnowing process is to compare the fingerprints between files to identify similarities. By identifying common fingerprints between the two files, the algorithm can determine the percentage of similarity. Files with a higher number of common fingerprints are more likely to be plagiarized and will have a higher plagiarism percentage in the output.
        `,
      },

      {
        type: "code",
        heading: "Algorithm",
        language: "pseudocode",
        code: `
        Algorithm Winnow(k, w, d1, d2) {
          INPUT:
          k := length of a singular substring gram
          w := length of sliding window during fingerprinting stage
          d1 and d2 := document 1 and document 2 containing java sources

          OUTPUT:
          m := a similarity metric between d1 and d2

          d1*, d2* <-- Preprocess d1 and d2
          h1, h2 <-- Hash k-grams of d1* and d2*
          f1, f2 <-- Select fingerprints from h1 and h2 hashes
          m <-- Compute similarity metric for f1 and f2

          Return m
        }`,
      },

      {
        type: "text",
        heading: "ANTLR + Winnowing",
        body: `ANTLR, short for ANother Tool for Language Recognition (formerly known as PCCTS), is a language processing tool designed to build recognizers, compilers, and translators. It enables developers to define grammatical descriptions that include actions written in Java, C++, or C#, providing a flexible framework for various language-based applications [5]. ANTLR’s ability to generate parsers and lexers from grammar definitions simplifies the process of analyzing and transforming text and/or code. The software supports a wide range of advanced features, such as syntax tree generation, error handling, and language-specific actions, making it a powerful tool for developers in creating tailored language analyzers or translators.
        
        GRAMMAR DEFINITION: A grammar file for ANTLR defines the syntax rules of a programming language. It outlines how the language’s tokens and structures are formed. This file allows the parser to recognize and process source code written in that language by breaking it down into a structured representation [6]. By using grammar files, it becomes easier to extend clone detection tools to support multiple programming languages without having to rewrite the core detection logic. In our program, we define the syntax rules for the plagiarism detection software inside srcANTLR/PlagiarismTool.g4. 
        
        NORMALIZING AND PARSING WITH ANTLR: Once the grammar is defined, ANTLR’s parser processes the source code by first tokenizing it with the lexer, then generating a parse tree that represents the syntactic structure of the code. The lexer breaks the source code into tokens, and the parser analyzes these tokens according to the grammar rules defined in the grammar file. In the software, the parseWithANTLR method generates this parse tree and normalizes it into a string representation, which is then used in subsequent analysis steps, such as generating k-grams and comparing fingerprints for plagiarism detection.
        
        ANTLR PARSE TREE: A parse tree is an ordered structure that represents the syntactical organization of the code, generated by the ANTLR parser based on formal grammar. The method parseWithANTLR generates the parse tree using the ANTLR lexer and parser. It tokenizes the input code using PlagiarismToolLexer.java and applies grammatical rules defined in the PlagiarismToolParser.java. The parse tree is then transformed into a textual representation using toStringTree where it is then compared and analysed for similarities.`,
      },

      {
        type: "text",
        heading: "Tree-Sitter + Winnowing",
        body: `As per the official documentation of Tree-Sitter, the Tree-Sitter library is both a parser generator tool and incremental parsing library. In short, a parser generator is a framework that configures various parser programs for different formal grammars, typically producing variants of a syntax tree for structural analysis. Tree-Sitter is also an incremental parsing library, meaning that it can produce and edit these syntax trees in real time, thus enabling the production of efficient text editors, compilers, interpreters, and so forth. In fact, Tree-Sitter is the underlying framework that drives many text editors like Atom and GNU Emacs amongst others. 
        
        STRINGIFYING TREE-SITTER: The parser module is the interface that invokes the Tree-Sitter library. It auto generates distinct syntax trees for each test sample pair and then stringifies them. It should be noted that, unlike ANTLR, TreeSitter does not offer a method to stringify a tree; Hence, the method to stringify a given tree was manually implemented by walking through a particular syntax tree in preorder traversal. 
        
        A NOTICE ON TREE-SITTER'S SYNTAX TREE: The syntax tree generated by Tree-Sitter’s Java parser follows a fundamentally different format than ANTLR’s LISP format. By inspection, Tree-Sitter appears to formulate a more compactified representation than its more verbose ANTLR counterpart. As per their official documentation, TreeSitter generates a DOM-style type structure that is composed of syntax nodes.`,
      },

      {
        type: "text",
        heading: "Program Architecture",
        body: `The project utilizes the dataset available from the Zenodo repository titled “Supplementary Material for ‘Detecting Automatic Software Plagiarism via Token Sequence Normalization’” [7]. This dataset contains various forms of plagiarism, showcasing different code manipulation techniques such as insertion, white spacing, reordering, and other modifications. All code samples in the dataset are written in Java, providing a consistent programming language for analysis.`,
      },
      {
        type: "images",
        columns: 1,
        captions: [""],
        images: ["/projects/plagiarism-detection/architecture.png"],
      },

      {
        type: "text",
        heading: "Similarity Metrics",
        body: `COSINE: The cosine similarity coefficient is a measure of similarity that computes the dot product between 2 vectors in an n-dimensional space. As per the formula, the vector dot product is divided by the product of their norms. We leveraged the cosine similarity coefficient by formulating 2 vectors - A and B - as the vector of the generated fingerprints from the winnow pipeline. 
        
        JACCARD: The jaccard coefficient is another measure of similarity that compares the ratio of cardinalities between the intersection over union between 2 sets. Similarly, the jaccard coefficient was implemented by formulating vectors A and B as the sets of fingerprints generated from the winnow pipeline.
        
        DICE-SORENSEN: The Dice-Sorensen coefficient is another powerful similarity metric with a similar idea to the jaccard coefficient. Its formulation is as below; Again, we formulate sets A and B as the sets of fingerprints generated from the winnow pipeline.`,
      },

      {
        type: "text",
        heading: "Data",
        body: `The following 9 tables report a non-exhaustive snippet of similarity metric calculations between data files from our referenced data repository. Each data table is a configuration of 2 architectural parameters: detection algorithm (Winnow, ANTLR + Winnow, Tree-Sitter + Winnow) and similarity metric (cosine, jaccard, dice). 
        
        The columns Insert, Insert after Reorder, and Reorder correspond to different modifications to a shared java file which serves as a control group. “Insert-only” modifications correspond to changes to the original source characterized by adding new lines of code. “Reorder-only” modifications correspond to changes to the original source where a number of lines are swapped in place. “Insert after Reorder” changes simply represent those modified files that swap lines in the original source followed by insertions of new java code. For instance, using the pure winnow algorithm (with no parser), we found that our system detected a 40.61% cosine similarity between the first data file and its corresponding modified “Insert-Only” mock; This corresponds to cell 1.`,
      },

      {
        type: "images",
        columns: 2,
        captions: [
          "Winnow with Cosine similarity",
          "Winnow with Jaccard similarity",
          "Winnow with Dice similarity",

          "ANTLR with Cosine similarity",
          "ANTLR with Jaccard similarity",
          "ANTLR with Dice similarity",

          "Tree-sitter with Cosine similarity",
          "Tree-sitter with Jaccard similarity",
          "Tree-sitter with Dice similarity",
        ],
        images: [
          "/projects/plagiarism-detection/winnow_cosine.png",
          "/projects/plagiarism-detection/winnow_jaccard.png",
          "/projects/plagiarism-detection/winnow_dice.png",

          "/projects/plagiarism-detection/antlr_cosine.png",
          "/projects/plagiarism-detection/antlr_jaccard.png",
          "/projects/plagiarism-detection/antlr_dice.png",

          "/projects/plagiarism-detection/tree_sitter_cosine.png",
          "/projects/plagiarism-detection/tree_sitter_jaccard.png",
          "/projects/plagiarism-detection/tree_sitter_dice.png",
        ],
      },

      {
        type: "text",
        heading: "Discussion",
        body: `Across all data configurations we found that detecting plagiarism from Reorders-Only were superior in detection accuracy compared to Insert-Only and Insertions after Reorders. Observe the following boxplot that graphs the detection accuracies of the previous data tables for winnow algorithm only.`,
      },
      {
        type: "images",
        columns: 1,
        captions: [
          "Comparison of Detection Accuracy vs Modification Operation using Pure Winnow",
        ],
        images: ["/projects/plagiarism-detection/winnow_graph.png"],
      },

      {
        type: "text",
        body: `In particular, the winnow-only distribution yields an arithmetic average of 0.41, 0.37, and 0.81 detection strengths for Insert-Only, Insert-after-Reorder, and Reorder-Only operations across all similarity metrics. With respect to our detection strength classifications, this corresponds to adequate detection strengths for all but Reorder-Only operations. 
        
        It should be noted that detection distributions follow a similar trend for detection configurations that leverage parsers and syntax trees. The box plot representations for ANTLR and Tree-Sitter detection-strength distributions are given below in their respective order:`,
      },
      {
        type: "images",
        columns: 1,
        captions: [
          "Comparison of Detection Accuracy vs Modification Operation using ANTLR + Winnow",
        ],
        images: ["/projects/plagiarism-detection/antlr_graph.png"],
      },

      {
        type: "images",
        columns: 1,
        captions: [
          "Comparison of Detection Accuracy vs Modification Operation using Tree-Sitter + Winnow",
        ],
        images: ["/projects/plagiarism-detection/tree_sitter_graph.png"],
      },

      {
        type: "text",
        body: `Notice by inspection, that the best overall detection configuration appears to be Tree-Sitter + Winnow. We’ve arrived at the conclusion that the reasons for this are likely multi-fold, with implementation details playing a key factor in outcome success. More specifically, detection strength is almost certainly dependent on the how a particular parser is generated with respect to what grammar file is used, whether a language binding was utilized to interface the specification tool, and so forth. 
        
        We investigated the detection performance of the Tree-Sitter + Winnow system configuration by implementing 2 different versions of it. One implementation leveraged a community-developed JavaScript binder, and another implementation scripted the Tree-Sitter implementation in the framework’s native Rust. All data results corresponding to the Tree-Sitter implementation thus far report the performance of our Rust implementation. 
        
        To our surprise, we found that the JavaScript implementation of Tree-Sitter + Winnow performed similarly to the ANTLR implementation whilst taking orders of magnitude longer to run. In particular, the Rust implementation took <3000ms to process all data files whereas the JavaScript version took an average of 7 minutes on our local machine. Such a vast discrepancy likely stems from differences in native optimizations, considering that Tree-Sitter was constructed in Rust.`,
      },

      {
        type: "text",
        heading: "False Negative Rate",
        body: `Surprisingly, or rather not surprisingly, the Tree-Sitter + Winnow configuration implemented in Rust never dropped below a 50% detection threshold across all metrics and modification operations. On the other hand, the detection accuracies of pure Winnow and ANTLR + Winnow comparatively fell behind. Observe the summary statistics below:`,
      },
      {
        type: "images",
        columns: 1,
        captions: ["Summary Statistics"],
        images: ["/projects/plagiarism-detection/metrics.png"],
      },
      {
        type: "text",
        body: `The false negative rate is defined as the equiprobability across all metrics and modification operations of a given detection threshold to be classified as weak. Then note that Tree-Sitter was the strongest in terms of its false negative rate with ANTLR trailing closely behind. Tree-Sitter also reigned superior in its average accuracy over Winnow and ANTLR. Interestingly, ANTLR did not fair significantly better than the pure Winnow algorithm which upon investigation we hypothesize is due to the grammar file used to construct the ANTLR parser. Moving forward, a reinvestigation of ANTLR’s performance should be done by using a community-generated or official Java grammar file to construct the parser instead of writing it from scratch. 
        
        One final insight to note is that across all system configurations, the Jaccard similarity metric was the most optimistic in terms of failing to report plagiarism. On the other hand, the Dice metric appears to be the most pessimistic in terms of reporting plagiarism. However, this is an incomplete analysis as we are unable to test false positives with the given data repository. Thus, an improvement that should be considered for future analyses is to include datasets that are not plagiarized in order to test false positive rates.`,
      },

      {
        type: "text",
        heading: "Conclusion",
        body: `In our analysis, we ultimately found that leveraging language specification tools to generate syntax trees as input to the winnowing pipeline generally increased detection accuracy. We observed this phenomenon by hosting a control group of test samples using the pure winnowing framework against detection system configurations that leveraged parsers. 
        
        By every metric of similarity, those configurations that leveraged parsers outperformed the pure winnow algorithm. It should be noted however, that although leveraging Tree-Sitter’s parser offered a significant advantage -26.96% increase in expected detection accuracy – over the control dataset, the ANTLR configuration only mildly outperformed the pure winnow system – a 5.73% increase in expected accuracy. 
        
        Although both the ANTLR and Tree-Sitter frameworks leverage syntax trees to generate logical representations of our source files, we do not necessarily believe that the Tree-Sitter framework is inherently more efficient or accurate than ANTLR with respect to detection strength and false negative rating despite their statistical disparities. Further investigation must be done in order to claim such a conclusion, as we noted several potential confounding variables in our limited analysis. 
        
        Such confounding variables include differences in implementation, language, and grammar files. A future report that aims to unify such variables would fare better in analysing the differences between any plagiarism detection systems that leverage lexical specification tools. But for our purposes, it appears to be the case that leveraging AST structures in a plagiarism detection system generally outperforms those that do not. 
        
        One would hypothesize that applying the winnow algorithm over stringified source files would lead to more accurate outcomes over winnowing raw strings of text. Intuitively, this makes sense, as leveraging such AST structures would allow the tokenization and fingerprinting process within the winnow algorithm to focus more on relationships between nodal structures and not just local regions. That is not to say that winnowing does not provide context on relationships between local regions in the text, because it does particularly during the fingerprint computations and similarity metric calculations, but incorporating a layer of explicit connections via an AST structure between local structures in the text provides the winnow algorithm even greater context between regions in the document. Fascinatingly, our findings provide confirming evidence for this hypothesis.`,
      },
    ],
  },

  "gravitational-nbody-simulation": {
    sections: [
      {
        type: "text",
        heading: "Overview",
        body: "A high-performance N-body gravitational simulation engine computing real-time particle interactions using Newtonian physics. Written in C++ with OpenGL rendering, the engine supports variable particle counts and demonstrates gravitational clustering, orbital mechanics, and chaotic multi-body dynamics.",
      },

      {
        type: "text",
        heading: "Simulating Gravitational Forces and Initial Position-Vectors",
        body: `N = 750 bodies; the initial spawnpoint for each star is a randomized position-vector p within a 3-dimensional sphere around origin such that each coordinate of position p is in the range [0,1]: initial_p = {p | p.x, p.y, p.z is in range [0,1]} This compact spawnpoint structure allows us to immediately see the strong gravitational attractions between those n arbitrary stars. For example, the 'slingshot effect' prominently takes place when stars orbit in close proximity.
        
        It must be noted that some manipulations were made when calculating the force vector between 2 arbitrary stars. Namely, the cubic term of a softening factor: e_soft^3=0.005^3 was added to the denominator when calculating the gravitational forces between 2 bodies such that: f_ij = (G * m_1 * m_2 * r_ij) / (r_ij_norm^3 + e_soft^3); where f_ij is the force-vector between 2 bodies i and j and r_ij is the displacement vector between bodies i and j.
        
        This was necessary, as our simulation does not account for star collision, and therefore without this softening factor, an unbounded growth in the gravitational calculations was produced. The detrimental implications of this were exaggerated 'slingshot effects' inconsistent with reality.`,
      },
      {
        type: "video",
        src: "/projects/gravitational-nbody-simulation/demo.mp4",
      },

      {
        type: "video",
        heading: "Initial Spawning of Stars",
        src: "/projects/gravitational-nbody-simulation/demo_1.5.mp4",
      },
      {
        type: "video",
        src: "/projects/gravitational-nbody-simulation/demo_2.mp4",
      },

      {
        type: "video",
        heading: "Camera Movement Around Star Cluster",
        src: "/projects/gravitational-nbody-simulation/demo_camera.mp4",
      },

      {
        type: "text",
        heading: "Star Geometry and Space-Time Complexity",
        body: `In order to make rendering bodies cheap, some minimal optimizations were made. Below you can see that - although our simulation has the ability to produce complex spheric models of any size - when rendering stars of large N, we actually use small diamond shapes! The algorithm is still quadratic in time and linear in space complexity, but the simplification drastically optimizes our performance.`,
      },
      {
        type: "images",
        columns: 3,
        captions: ["Spherical", "polyhedron", "diamond"],
        images: [
          "/projects/gravitational-nbody-simulation/geometry.png",
          "/projects/gravitational-nbody-simulation/geometry_simple.png",
          "/projects/gravitational-nbody-simulation/geometry_simple_2.png",
        ],
      },

      {
        type: "text",
        heading: "Demo of Optimized Performance",
        body: `N = 200 bodies; we render less stars to get a smoother visual experience. We also step up from the diamond model and render a polyhedron that better approaches a sphere; we allow this since N is small.`,
      },
      {
        type: "video",
        src: "/projects/gravitational-nbody-simulation/demo_small.mp4",
      },

      {
        type: "code",
        heading: "Force Calculation",
        language: "cpp",
        code: `
  // Galaxy class design and implementation
  class Galaxy {
    private:
        std::vector<StarDescriptions> s_desc;
        std::vector<StarVertices> s_vert;
        StarIndices s_indc;
    public:
        void generateStar()
        {
            StarDescriptions s_d;
            s_desc.push_back(s_d);
    
            StarVertices s_v;
            s_vert.push_back(s_v);
            glm::vec3 randomVector = glm::vec3(generateRandomNormal(), generateRandomNormal(), generateRandomNormal());
            stepUTIL(s_vert.size() - 1, randomVector);
        }
    
        // POST: return a reference to i'th model matrix,
        // so glm::value_ptr will get get the address of the
        // referent matrix.
        glm::mat4& getIthModelMat4(unsigned int i)
        {
            return s_desc[i].model;
        }
    
        // POST: returns a pointer to the i'th vertex data struct;
        // to be used when we re-buffer each vertex data, for each step;
        float* getIthVertexData(unsigned int i)
        {
            return &s_vert[i].sphereVertices[0];
        }
    
        int* getIndexData()
        {
            return &s_indc.sphereIndices[0];
        }
    
        GLsizeiptr vertSize()
        {
            return s_vert[0].sphereVertices.size() * sizeof(float);
            //return Y_SEGMENTS * X_SEGMENTS * 3 * sizeof(float);
        }
    
        GLsizeiptr indcSize()
        {
            return s_indc.sphereIndices.size() * sizeof(int);
            //return Y_SEGMENTS * X_SEGMENTS * 6 * sizeof(int);
        }
    
        void step(float dt)
        {
            // 1) calculate Fnet for each star
            for (unsigned int i = 0; i < N; i++)
            {
                for (unsigned int j = 0; j < N; j++)
                {
                    if (i == j) continue;
    
                    float m_1 = s_desc[i].m;
                    float m_2 = s_desc[j].m;
    
                    glm::vec3 r_ij = glm::vec3(0.0f);
                    r_ij.x = s_vert[j].sphereVertices[0] - s_vert[i].sphereVertices[0];
                    r_ij.y = s_vert[j].sphereVertices[1] - s_vert[i].sphereVertices[1];
                    r_ij.z = s_vert[j].sphereVertices[2] - s_vert[i].sphereVertices[2];
    
                    float r_ij_norm = sqrt(pow(r_ij.x, 2) + pow(r_ij.y, 2) + pow(r_ij.z, 2));
    
                    // softening factor eliminates radical slingshot effects; we do not account for star collisions
                    glm::vec3 f_ij = (G * m_1 * m_2 * r_ij) / (pow(r_ij_norm, 3) + pow(e_soft, 3));
    
                    s_desc[i].fnet += f_ij;
                }
            }
    
            // 2) calculate velocity for each star
            for (unsigned int i = 0; i < N; i++)
            {
                s_desc[i].v += s_desc[i].fnet / s_desc[i].m * dt;
            }
    
            // 3) calculate final position for each star
            for (unsigned int i = 0; i < N; i++)
            {
                glm::vec3 dlta_s = s_desc[i].v * dt;
                stepUTIL(i, dlta_s);
            }
    
            // clean up
            for (unsigned int i = 0; i < N; i++)
            {
                s_desc[i].fnet = glm::vec3(0.0f);
            }
        }
    
        void stepUTIL(unsigned int i, glm::vec3 vec)
        {
            //s_desc[i].model = glm::translate(s_desc[i].model, vec);
    
            
            for (unsigned int ii = 0; ii < s_vert[i].sphereVertices.size(); ii += 3)
            {
                s_vert[i].sphereVertices[ii] += vec.x;
                s_vert[i].sphereVertices[ii + 1] += vec.y;
                s_vert[i].sphereVertices[ii + 2] += vec.z;
            }
        }
    };
        `,
      },
    ],
  },

  "crystal-clear": {
    sections: [
      {
        type: "text",
        heading: "Overview",
        body: "Crystal Clear is an advanced photo sharing and social media platform with a broad feature set. Inspired by Pinterest, Instagram, Twitch, and YouTube — featuring real-time messaging, threaded comments, content recommendation algorithms, and a custom async search engine with server integration and query prediction.",
      },

      // video demo of what i have so far

      {
        type: "table",
        heading: "Tech Stack",
        headers: ["Layer", "Technology"],
        rows: [
          ["Framework", "Next.js 16, React 19, JavaScript"],
          ["Styling", "Tailwind CSS v4, Roboto Mono (Google Fonts)"],
          ["Database", "MongoDB Atlas (via Mongoose ODM)"],
          ["Authentication", "NextAuth v4 (Google OAuth 2.0)"],
          ["Image Hosting", "Cloudinary (upload, CDN serving, metadata)"],
          ["Gallery Layout", "Masonic (masonry grid)"],
          ["Notifications", "React Toastify"],
          ["Icons", "Heroicons, Lucide React, Phosphor React, React Icons"],
          ["Utilities", "Lodash"],
        ],
      },

      {
        type: "text",
        heading: "High-Level Objectives",
        body: `The overarching goal of Crystal Clear is to deploy an ambitious, complete, and highly optimized social media platform spanning multiple integrated features such as:
        
        --> user account registration and login
        --> ability to post multi-media
        --> comment section threads with reply and like capabilities
        --> a real-time user-to-user messaging system
        --> search engines with history recording and query prediction capabilities
        --> content recommendation algorithms based on previously viewed or liked items
        --> and personal library or portfolio management
        --> Content sharing
        --> Customizable user profiles
        --> All wrapped in a beautiful, responsive UI.
        
        The application is currently undergoing significant revisions.
        
        As of v1.0.0, most major features are implemented and working as a proof of concept. See the feature roadmap below for details.`,
      },

      {
        type: "table",
        heading: "Feature Roadmap",
        headers: ["Feature", "Status", "Notes"],
        rows: [
          ["Google OAuth authentication", "Done", ""],
          ["Fragment creation (image upload, tags, location)", "Done", ""],
          ["Crystal creation and management", "Done", ""],
          [
            "Masonry home feed with infinite scroll",
            "Done",
            "Cursor-based pagination",
          ],
          ["Explore page (featured content)", "Done", ""],
          ["Fragment likes (toggle, per-user tracking)", "Done", ""],
          ["Fragment view tracking", "Done", ""],
          ["Save to library (fragments + crystals)", "Done", ""],
          ["Threaded comments + replies", "Done", ""],
          ["Comment likes", "Done", ""],
          ["Soft delete for comments", "Done", ""],
          ["Direct messaging (1-to-1)", "Done", ""],
          ["Read receipts on messages", "Done", ""],
          ["Search (name, description, tags)", "Done", ""],
          ["Search history + autocomplete", "Done", ""],
          [
            "Content recommendations",
            "Done",
            "Temporally-driven, based on recent likes and views",
          ],
          ["Public user profiles", "Done", ""],
          ["Personal library management", "Done", ""],
          ["Cloudinary image CDN integration", "Done", ""],
          [
            "Real-time messaging (WebSocket / SSE)",
            "Underway",
            "Currently requires page refresh to see new messages",
          ],
          [
            "Notification system",
            "Underway",
            "Likes, comments, follows, messages",
          ],
          [
            "User follow / follower graph",
            "Underway",
            "No follow model exists yet",
          ],
          [
            "Following feed",
            "Underway",
            "Feed filtered to followed users only",
          ],
          [
            "Comment pagination",
            "Underway",
            "Currently loads all comments at once",
          ],
          ["Video fragment support", "Underway", "Currently image-only"],
          ["Fragment editing", "Underway", "No edit flow exists post-creation"],
          [
            "Crystal reordering",
            "Underway",
            "Drag-and-drop fragment order within crystals",
          ],
          [
            "Advanced search filters",
            "Underway",
            "Filter by location, date, tags, user",
          ],
          [
            "Fragment analytics dashboard",
            "Underway",
            "Views and likes over time per creator",
          ],
          [
            "Content moderation tools",
            "Underway",
            "Report, flag, admin review queue",
          ],
          ["Push notifications", "Underway", ""],
          ["UI Redesign", "Underway", ""],
          ["Mobile app (React Native)", "Underway", "Long-term"],
        ],
      },

      {
        type: "text",
        heading: "Fragments and Crystals",
        body: `Crystal Clear is a full-stack social photo platform built around a thematized content model with two levels of hierarchy: Fragments (individual images or short videos) and Crystals (curated collections of Fragments). This mirrors the way photographers or videographers naturally think: individual shots, and the albums they belong to.`,
      },

      {
        type: "text",
        heading: "Application Routing Design",
        body: `Infinitely browse through the fragment database via seemless inter-connected routes. This application's routes are explicitly designed to enable coherent content navigation. To be more specific, one can imagine that there are 2 fundamental routes (base cases) which enable pagination content browse. They correspond to the home page and dynamic fragment details page:
        
        1. "/" (fetch paginated content)
        2. "/fragment/[fragmentId]" (fragment details + fetch paginated content)
        
        The application route set can then be interpreted as a cyclical graph. Some route transitions are presented below which allow for infinite, paginated scrolling behaviour:
        
        - "/" -> "/fragment/[fragmentId]"
        - "/fragment/[fragmentId]" -> "/fragment/[fragmentId]"
        - "/crystal/[crystalId]" -> "/fragment/[fragmentId]"
        - "/library" -> "/fragment/[fragmentId]"
        - "/library" -> "/library/[crystalId]" -> "/fragment/[fragmentId]"
        - etc.
        
        This application implements pagination, enabling browse at scale. i.e., each page, or chunk, loads 20 fragments at a time. By default, we deploy our simplest pagination algorithm which sorts by latest-created-fragment. For more information on the pagination algorithm and/or upcoming updates, visit the developer notes.

        For browsing crystals directly, head to the explore page to browse featured crystals. Featured crystals are system-recognized crystals. Observe that all routes or components in "/explore" eventually lead to paginated, infinite scroll.`,
      },

      {
        type: "text",
        heading: "Manage Your Collection",
        body: `Manage your saved or created work primarily through your profile (library) dashboard. Your profile dashboard is split into 2 tabs: Created and Saved.

        FRAGMENT DELETION: In your Created tab, we display a grid of Crystal Cards and a Masonry Gallery of Fragment Cards. The Fragment Cards displayed here are unique to this page insofar that they enable the deletion operation of a Fragment. Fragment deletion by its creator is available through this route only. To delete a Fragment, find the "Delete" button in the top left of the on-hover top toolbar.

        It should be noted that this variant of the Fragment Card displayed in "/library?tab=created" enables "Save", like all other variants of the Fragment Card. However, saving a Fragment that you created will not appear in the Saved tab (/library?tab=saved). We distinguish between created and saved fragments in the UI by creator ID and save status. This avoids redundant rendering by defining mutually exclusive sets. i.e., in a mathematical notation:

        Let S = set of saved fragments to display and C = set of created fragments to display
        S = { All fragments s.t. you are not the creator AND status is saved }
        C = { All fragments s.t. you are the creator }

        Fragment deletion is permanent. Once deletion of a fragment is confirmed by the user, the system cascades deletion across the database. This means that in addition to the deletion of the fragment and image meta data, all records of likes, views, comments, comment likes, comment threads, are removed from the database. Likewise, all records of crystals and/or users that reference the fragment are also pulled from the system.

        EDITING CRYSTALS: The operation to remove a fragment from the crystal is made accessible from the profile (library dashboard). There are only 2 steps to removing a fragment from a crystal:

        1. From the library page, select your desired crystal card
        --> This navigates you to the route: "/library/[crystalId]"
        --> NOT to be confused with the distinct route: "/crystal/[crystalId]"
        2. Hover over any Fragment you wish to remove, and select the "Remove" button
        --> The "Remove" button is located in the top left of the hover toolbar
        --> Removal of a fragment from the crystal can only be achieved here`,
      },

      {
        type: "text",
        heading: "Search",
        body: `There are actually 2 implementations of search in this application. The header search bar + modal and the user search bar in the messages modal. Both search features have distinct purposes and are outlined below.
        
        HEADER SEARCH BAR + MODAL: The search engine in the header is more complex than the specialized search bar in the messages modal. The header search bar is paired with a modal UI that displays selectable, realtime query autocompletes (predictions) as you enter your query. Actually, the query predictions are loaded every 250 milliseconds so as to avoid server process overload. It is important to note that the query predictions are a function of your realtime query input, and are fetched from stored records of past queries by you or other users. Therefore, the more you (or another user) enter queries, the larger the query prediction pool becomes.

        When the search query input is empty, the header search modal defaults to the initial state, which displays (selectable) personalized and recommended content. The personalized recommendations are based on your user activity, therefore, it is possible that no personalized content exists, and the default UI modal state is empty. For now, the default state recommends both "Recommended Crystals" and "Similar Users".

        RECOMMENDED CRYSTALS ALGORITHM: How do the recommendation algorithms work? The backend function that processes Recommended Crystals take your user profile, and searches the database for your most recently viewed and liked fragments. Then, a reverse fragment membership search is executed to find which crystals, if any, they belong to. It is these crystals, and at most 10 of them, which are then fetched for the recommendations. The point of the algorithm is to account for recent browsing activity.

        SIMILAR USERS ALGORITHM: The similar users algorithm works by taking your user profile and building a weighted distribution of other users, each assigned a positive-integer score. For any given user, the scoring works by computing the intersection set of liked fragments between the given user and yourself. Add the cardinality of the liked intersection set to the score. Next, we compute a second set - the intersection set of all saved fragments between the given user and yourself - Add the cardinality of the saved intersection set multiplied by 2 to the running score. We have now computed the final similarity score between a given user and yourself. The point of the algorithm is to build a score distribution of users with mutual interest.

        One important distinction to make is that the implementation of the similar users algorithm builds the user distribution by processing your liked and saved fragments first in order to induce the discovery of similar users. We do NOT, for instance, run a linear pass through all users. This would be a highly inefficient use of server resources.

        MESSAGES MODAL, USER SEARCH BAR: The second search feature of this application is located in the Messages modal. You can navigate to the messages modal by selecting the Messages Icon tab in the Side Navigation Bar (tablet + desktop view) or Footer Navigation Bar (mobile view). This second search bar is specialized for searching users only.`,
      },

      {
        type: "text",
        heading: "Recommendation Algorithm",
        body: `The recommendation engine is temporally-driven — it looks at the user's recently liked and viewed fragments, traces back to their parent Crystals, and surfaces other fragments from those crystals. This approach requires no ML infrastructure and produces contextually relevant results from pure relational queries.`,
      },

      {
        type: "text",
        heading: "Views, Likes, and Comment Threads",
        body: `Once a fragment has been uploaded to the server, it is shared with the general public. It is imperative to store records of user engagement for purposes of content personalization (such as our crystal recommendations algorithm in the previous section) and maximizing user interactability. This application implements and maintains 3 types of user engagement records for a given (public) fragment: Views, Likes, and Comments.

        VIEWS & LIKES: A View is the most primitive form of user-to-fragment engagement. They are recorded automatically the moment that a user clicks a Fragment Card and navigates to the corresponding Fragment Details Page (route: "/fragment/[fragmentId]"). Once a fragment view is recorded, it is stored permanently on the server. In addition, the system also maintains a user-fragment-specific count of views. This count field accomplishes 2 goals: Avoid counting duplicate views of a fragment (each Fragment view corresponds to a distinct user) and supplies nuance to the usage of the view metric. i.e., a single view of a fragment likely indicates mundance user browsing whereas multiple views of the same fragment may indicate intrigue of the art.

        A Like is a strong form of user-to-fragment engagement. They are recorded the moment that a user presses the Heart icon of a Fragment in the corresponding Fragment Details page. A Like may be toggled on or off depending on the previous state. Typically, likes are weighted more strongly than views in this application with respect to user engagement or interest.

        COMMENTS: Comments are the most complex form of user-to-fragment engagement. This application implements a comment section system that enables creating entire comment threads by organizing multiple chains of top level comments and corresponding replies for any given fragment. You can comment, or reply to a comment, on a fragment by clicking the Comment Bubble Icon on the bottom toolbar of the Fragment Details Card in the Fragment Details Page. This opens a Comments Modal. For a more technical or detailed dive into how the comments section was implemented, visit the developer notes.

        COMMENT LIKES: This application supports liking comments, in addition to liking fragments. To like a comment, navigate to the comments section of a given fragment, find any comment, or reply, that you like and click its Heart Icon. Much like a typical Fragment Like, you can toggle a Comment Like on or off depending on the previous state. As of now, the system does not leverage a Comment Like in any of its backend routines or algorithms, but its a cheap and effective way to give user-to-user feedback.`,
      },

      {
        type: "text",
        heading: "User Messaging",
        body: `The messages feature can be accessed by clicking the Messages Icon in the Side Navigation Bar (tablet + desktop view) or the Footer Navigation Bar (mobile view). Selecting the Messages Icon triggers a Messages Modal. The content of the Messages Modal is split into 2 columns. The column on the right displays the current, active Conversation. The column on the left features your previous, recent Conversations and a specialized User Search feature.

        When the Search Bar query input is empty, the left column defaults to the initial state, which renders your previous and recent Conversations that you've had. As you type your query input into the Messages Modal Search Bar, the left column replaces your Conversations list with a distinct list of candidate User matches. This mental model aligns with the Header Search Bar + Modal feature. Note that the Messages Search feature processes your query and searches the User database collection only.

        A couple clarifications to make:

        1. Search engine will discover all users that match your query, regardless if you have a stored conversation with them or not
        2. Selecting a matched user from your search dropdown does not automatically create a conversation record. A message must be sent between a pair of users in order for a conversation to be instantiated in the system`,
      },

      {
        type: "text",
        heading: "CRUD Architecture",
        body: `11 MongoDB collections cover the full social graph — users (User), content (Fragment, Crystal), user engagement (Like, View, CommentLike), comment threads (Thread, Comment), and messaging (Message, Conversation). Junction models (Like, View, CommentLike, Conversation) enforce uniqueness at the database level with compound indexes, which enables toggle-on-duplicate-key patterns without requiring a read-before-write.`,
      },
    ],
  },
};

function renderSection(section, i) {
  return (
    <div key={i}>
      {section.heading && <Heading>{section.heading}</Heading>}

      {section.type === "text" && <TextBlock>{section.body}</TextBlock>}

      {section.type === "video" && (
        <VideoBlock src={section.src} placeholder={section.placeholder} />
      )}

      {section.type === "images" && (
        <ImageBlock
          images={section.images}
          captions={section.captions}
          columns={section.columns}
        />
      )}
      {section.type === "code" && (
        <CodeBlock language={section.language} code={section.code} />
      )}
      {section.type === "graph" && (
        <GraphBlock placeholder={section.placeholder} />
      )}
      {section.type === "table" && (
        <TableBlock headers={section.headers} rows={section.rows} />
      )}
    </div>
  );
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const content = CONTENT[slug];
  const isRecent = project.year === "2026";
  const isOngoing =
    project.status?.toLowerCase().includes("ongoing") ||
    project.status?.toLowerCase().includes("underway");
  const isLegacyBuild = project?.isLegacyBuild === true;

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-white/[0.04] px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/#projects"
            className="font-mono text-xs tracking-wider text-white/40 transition-colors hover:text-white/70"
          >
            &larr; Back to projects
          </Link>
        </div>
      </nav>

      <Sections>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
            {project.category}
          </span>

          {isRecent && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-accent/70">
              {project.year}
            </span>
          )}

          {project.status && (
            <span
              className={`flex items-center gap-1 font-mono text-[10px] tracking-wider ${
                isOngoing ? "text-accent/50" : "text-white/25"
              }`}
            >
              {isOngoing && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent/60" />
                </span>
              )}

              {isLegacyBuild ? (
                <span style={{ color: "var(--color-gold)", opacity: 0.66 }}>
                  this project is legacy - included for context with plans to
                  reimplement this year
                </span>
              ) : (
                project.status
              )}
            </span>
          )}
        </div>

        <h1 className="mb-6 font-mono text-3xl font-light tracking-tight text-white/90 sm:text-4xl md:text-5xl">
          {project.title}
        </h1>

        <p className="mb-8 max-w-2xl text-base leading-[1.8] text-white/50">
          {project.description}
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 font-mono text-xs text-white/40"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mb-16 flex flex-wrap gap-3">
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-xs tracking-wider text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.08]"
            >
              View on GitHub
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 font-mono text-xs font-medium tracking-wider text-black transition-all hover:bg-white"
            >
              Visit Live URL
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          )}
        </div>

        <div className="mb-16 h-px w-full bg-white/[0.04]" />

        {content ? (
          <div className="space-y-14">
            {content.sections.map((section, i) => renderSection(section, i))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.06] p-8 text-center">
            <p className="font-mono text-sm text-white/25">
              Detailed project write-up coming soon.
            </p>
          </div>
        )}
      </Sections>
    </div>
  );
}
