"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function Spotlight() {
  const ref = useRef(null);
  const overlayRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });

      tl.from(".spot-label", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      })
        .from(
          ".spot-title",
          { y: 40, opacity: 0, duration: 0.9, ease: "power3.out" },
          "-=0.2"
        )
        .from(
          ".spot-sub",
          { y: 15, opacity: 0, duration: 0.5, ease: "power3.out" },
          "-=0.5"
        )
        .from(
          ".spot-theorem",
          { x: -30, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .from(
          ".spot-code",
          { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5"
        )
        .from(
          ".spot-body > *",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          ".spot-cta",
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3"
        );
    },
    { scope: ref }
  );

  useGSAP(
    () => {
      const textEls = ref.current.querySelectorAll(
        ".spot-label, .spot-title, .spot-sub, .spot-body p"
      );
      const theoremEls = ref.current.querySelectorAll(".spot-theorem p");
      const codeEls = ref.current.querySelectorAll(".spot-code");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Timeline layout (total = 4 units mapped linearly to scroll):
      //   pos 0 → 1  : enter (fade to white bg + dark text)   ~ 25% of scroll
      //   pos 1 → 3  : HOLD in the illuminated state          ~ 50% of scroll
      //   pos 3 → 4  : exit (fade back to dark bg + light text)~ 25% of scroll
      tl.to(overlayRef.current, { opacity: 1, duration: 1, ease: "none" }, 0)
        .to(
          textEls,
          { color: "rgba(10,10,10,0.85)", duration: 1, ease: "none" },
          0
        )
        .to(
          theoremEls,
          { color: "rgba(10,10,10,0.7)", duration: 1, ease: "none" },
          0
        )
        .to(
          codeEls,
          {
            color: "rgba(10,10,10,0.75)",
            backgroundColor: "rgba(0,0,0,0.04)",
            borderColor: "rgba(0,0,0,0.07)",
            duration: 1,
            ease: "none",
          },
          0
        )
        .to(overlayRef.current, { opacity: 0, duration: 1, ease: "none" }, 3)
        .to(
          textEls,
          { color: "rgba(255,255,255,0.85)", duration: 1, ease: "none" },
          3
        )
        .to(
          theoremEls,
          { color: "rgba(255,255,255,0.6)", duration: 1, ease: "none" },
          3
        )
        .to(
          codeEls,
          {
            color: "rgba(255,255,255,0.65)",
            backgroundColor: "rgba(255,255,255,0.015)",
            borderColor: "rgba(255,255,255,0.04)",
            duration: 1,
            ease: "none",
          },
          3
        );
    },
    { scope: ref }
  );

  return (
    <section
      id="spotlight"
      ref={ref}
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,
          background:
            "radial-gradient(ellipse 120% 100% at 50% 40%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.15) 60%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <span className="spot-label mb-3 block font-mono text-xs tracking-[0.25em] uppercase text-white/50">
          Spotlight
        </span>

        <h2 className="spot-title mb-2 font-mono text-3xl font-light tracking-tight text-white/90 sm:text-4xl md:text-5xl">
          A Special Case of Quadratic Extrapolation Under the Neural Tangent
          Kernel
        </h2>

        <p className="spot-sub mb-12 font-mono text-sm text-white/30 md:mb-16">
          arXiv:2512.15749 &middot; over-parameterized ReLU networks admit a
          nonlinear extrapolation regime at the origin of the RKHS.
        </p>

        <div className="spot-theorem mb-6 py-1">
          <p className="text-sm leading-[1.9] text-white/60 md:text-base">
            <span className="font-mono text-xs font-medium tracking-wider text-white/50">
              PROBLEM SETUP.
            </span>{" "}
            Let &#x1D4B3; &sub; &#x211D;&#x1D48; be a Euclidean input space and
            let &phi; = {"{𝐱ᵢ}"}
            <sup>n</sup>
            <sub>i=1</sub> denote a training realization. Translating by
            &minus;t&#x1D42F;<sub>&phi;</sub> yields &phi;
            <sup>&infin;</sup> = {"{𝐱ᵢ − t𝐯_φ : 𝐱ᵢ ∈ φ}"}, with labels y
            <sub>i</sub>
            <sup>&infin;</sup> = g(𝐱<sub>i</sub>
            <sup>&infin;</sup>). We train a two-layer ReLU MLP f<sub>NTK</sub> :
            &#x1D4B3; &rarr; &#x211D; in the NTK regime under squared loss and
            evaluate at 𝐱<sub>0</sub> = 𝟎 as t &rarr; &infin;.
          </p>
        </div>

        <pre className="spot-code mb-6 overflow-x-auto rounded-lg border border-white/[0.04] bg-white/[0.015] px-5 py-4 font-mono text-xs leading-relaxed text-white/65 md:text-sm">
          {
            "NTK(𝐱ᵢ, 𝐱ⱼ) = 𝔼_{θ∼𝒩} ⟨∇_θ f(θ⁽⁰⁾, 𝐱ᵢ), ∇_θ f(θ⁽⁰⁾, 𝐱ⱼ)⟩\nf_NTK(𝐱) = ϕ(𝐱)ᵀ β_NTK,   β_NTK = argmin_β ‖β‖²   s.t.  ϕ(𝐱ᵢ)ᵀ β = yᵢ   ∀ i ∈ [n]"
          }
        </pre>

        <div className="spot-theorem mb-6 py-1">
          <p className="text-sm leading-[1.9] text-white/60 md:text-base">
            <span className="font-mono text-xs font-medium tracking-wider text-white/50">
              REMARK 1.
            </span>{" "}
            If all n inputs of &phi;<sup>&infin;</sup> lie infinitely far from
            the origin along a single direction, the Tikhonov pseudo-inverse of
            the otherwise-singular asymptotic NTK gram matrix &kappa;t&sup2;𝐉
            collapses to a difference of the identity and all-ones matrices:
          </p>
        </div>

        <pre className="spot-code mb-6 overflow-x-auto rounded-lg border border-white/[0.04] bg-white/[0.015] px-5 py-4 font-mono text-xs leading-relaxed text-white/65 md:text-sm">
          {
            "(κt²𝐉 + Γ)⁻¹   ⟶   (1/δ) 𝐈 − (t²κ) / ( δ (nκt² + δ) ) 𝐉,   δ → 0,  t → ∞"
          }
        </pre>

        <div className="spot-theorem mb-6 py-1">
          <p className="text-sm leading-[1.9] text-white/60 md:text-base">
            <span className="font-mono text-xs font-medium tracking-wider text-white/50">
              LEMMA 1.
            </span>{" "}
            The feature map of the z-th directional derivative of f
            <sub>NTK</sub> along any direction 𝐯<sub>0</sub> admits a closed
            form in the z-th and (z&minus;1)-th derivatives of the Heaviside
            indicator 𝐈<sup>(k)</sup>:
          </p>
        </div>

        <pre className="spot-code mb-6 overflow-x-auto rounded-lg border border-white/[0.04] bg-white/[0.015] px-5 py-4 font-mono text-xs leading-relaxed text-white/65 md:text-sm">
          {
            "D_𝐯₀^z  f_NTK(𝐱₀) = β_NTKᵀ [  𝐱̂₀ᵀ · D_𝐯₀^z 𝐈⁽ᵏ⁾  −  z 𝐯̂₀ᵀ · D_𝐯₀^(z−1) 𝐈⁽ᵏ⁾,\n                           𝐰⁽ᵏ⁾ 𝐱̂₀ᵀ · D_𝐯₀^z 𝐈⁽ᵏ⁾  −  z 𝐰⁽ᵏ⁾ 𝐯̂₀ᵀ · D_𝐯₀^(z−1) 𝐈⁽ᵏ⁾,  ⋯ ]ᵀ"
          }
        </pre>

        <div className="spot-theorem mb-6 py-1">
          <p className="text-sm leading-[1.9] text-white/60 md:text-base">
            <span className="font-mono text-xs font-medium tracking-wider text-white/50">
              LEMMA 2.
            </span>{" "}
            Under the coordinate-shifted realization &phi;<sup>&infin;</sup>,
            the components of &beta;<sub>NTK</sub> induced by the training
            inputs are constant with respect to the bias weight w<sub>d+1</sub>{" "}
            of any given feature direction for every order z &ge; 1:
          </p>
        </div>

        <pre className="spot-code mb-6 overflow-x-auto rounded-lg border border-white/[0.04] bg-white/[0.015] px-5 py-4 font-mono text-xs leading-relaxed text-white/65 md:text-sm">
          {"∂ᶻ β₁ᵂ / ∂ w_{d+1}ᶻ  ,   ∂ᶻ β₂ᵂ / ∂ w_{d+1}ᶻ    ⟶    0     ∀ z ≥ 1"}
        </pre>

        <div className="spot-theorem mb-10 py-1">
          <p className="text-sm leading-[1.9] text-white/60 md:text-base">
            <span className="font-mono text-xs font-medium tracking-wider text-white/50">
              THEOREM 1.
            </span>{" "}
            An over-parameterized two-layer ReLU MLP f<sub>NTK</sub> : &#x211D;
            <sup>d</sup> &rarr; &#x211D; trained on {"{(𝐱ᵢ^∞, yᵢ^∞)}"}
            <sup>n</sup>
            <sub>i=1</sub> with 𝐱<sub>i</sub>
            <sup>&infin;</sup> = 𝐱<sub>i</sub> &minus; t𝐯<sub>&phi;</sub> in the
            NTK regime minimizing squared loss converges to a quadratic
            extrapolator when evaluated near the origin 𝟎 as t &rarr; &infin;.
            The first and second directional derivatives exist; all higher-order
            terms vanish.
          </p>
        </div>

        <div className="spot-body mb-8 space-y-4 text-sm leading-[1.9] text-white/40 md:text-[15px]">
          <p>
            The infinite-dimensional feature map induced by the neural tangent
            kernel is rotation-invariant but not translation-invariant
            &nbsp;&mdash; the origin of the RKHS is therefore a geometrically
            distinct special case. While Xu et al. (2021) establish linear
            extrapolation for points arbitrarily far from the origin, the
            coordinate-shifted setup here pushes the training realization to
            infinity and exposes a second canonical regime that is fundamentally
            nonlinear.
          </p>
          <p>
            The proof leverages the Dirac-delta sifting property through the
            distributional derivative of the Heaviside indicator (Lemma 1) and
            the vanishing-bias structure of &beta;<sub>NTK</sub> (Lemma 2).
            Together they force a non-zero second-order Taylor term and
            annihilate every derivative beyond it &mdash; a quadratic regime of
            NTK extrapolation absent from the prior literature.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div
            className="spot-cta"
            style={{ opacity: 0, transform: "translateY(15px)" }}
          >
            <MagneticButton
              as="a"
              href="https://arxiv.org/abs/2512.15749"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-black/90 px-5 py-2 font-mono text-xs font-medium tracking-wider text-white transition-all hover:bg-black"
            >
              arXiv
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
            </MagneticButton>
          </div>
          <div
            className="spot-cta"
            style={{ opacity: 0, transform: "translateY(15px)" }}
          >
            {/* <MagneticButton
              as="a"
              className="rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-2 font-mono text-xs tracking-wider text-white/50 transition-all hover:border-white/[0.15] hover:text-white/70"
            >
              YouTube (coming soon)
            </MagneticButton> */}
          </div>
        </div>
      </div>
    </section>
  );
}
