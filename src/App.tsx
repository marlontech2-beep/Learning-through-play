import React, { useState, useEffect, useRef } from "react";
import {
  CaseSensitive,
  Pencil,
  BookOpen,
  ArrowRight,
  ArrowDown,
  Check,
  X,
  Printer,
  PencilLine,
  Gift,
  ChevronDown,
} from "lucide-react";



interface PageItem {
  src: string;
  alt: string;
  caption: string;
}

interface WorkbookStage {
  id: string;
  label: string;
  color: string;
  description: string;
  extraPill?: string | null;
  pages: PageItem[];
}

const WORKBOOK_STAGES: WorkbookStage[] = [
  {
    id: "letters",
    label: "Stage 1: Letters",
    color: "#1E5AD6",
    description: "Recognise and match every letter of the alphabet.",
    extraPill: null,
    pages: [
      {
        src: "/assets/01-match-uppercase-lowercase.webp",
        alt: "Match uppercase to lowercase",
        caption: "Match uppercase to lowercase",
      },
      {
        src: "/assets/02-alphabet-flashcards.webp",
        alt: "Alphabet flashcards",
        caption: "Alphabet flashcards",
      },
    ],
  },
  {
    id: "writing",
    label: "Stage 2: Writing and Sounds",
    color: "#6A2FC4",
    description: "Trace letters step by step and connect each letter to its sound.",
    extraPill: null,
    pages: [
      {
        src: "/assets/07-alphabet-trace-letter-a.webp",
        alt: "Trace the letter A",
        caption: "Trace the letter A",
      },
      {
        src: "/assets/05-colour-and-trace-carrot.webp",
        alt: "Colour and trace the word",
        caption: "Colour and trace the word",
      },
      {
        src: "/assets/03-match-beginning-sound.webp",
        alt: "Match the beginning sound",
        caption: "Match the beginning sound",
      },
    ],
  },
  {
    id: "reading",
    label: "Stage 3: Reading",
    color: "#2EB872",
    description: "Read the first short words and the most common English words.",
    extraPill: null,
    pages: [
      {
        src: "/assets/04-cvc-a-words.webp",
        alt: "Short CVC words",
        caption: "Short CVC words",
      },
      {
        src: "/assets/06-sight-words.webp",
        alt: "Sight words",
        caption: "Sight words",
      },
    ],
  },
  {
    id: "bonus",
    label: "Bonus",
    color: "#FF8A2B",
    description: "Extra activities for motor skills, concentration and fun.",
    extraPill: "Premium",
    pages: [
      {
        src: "/assets/08-longer-curves-to-trace.webp",
        alt: "Tracing for motor skills",
        caption: "Tracing for motor skills",
      },
    ],
  },
];

const EBOOKS = [
  {
    numero: "1. Frases Cursivas",
    descricao: "Atividades para formar a mão e escrever com mais ritmo e fluidez.",
    capa: "/assets/producao-frases.png",
    alt: "Capa do ebook Frases Cursivas",
    capaBg: "bg-red-pop",
  },
  {
    numero: "2. Produção de Frases",
    descricao: "Estimula a imaginação e o vocabulário de forma criativa.",
    capa: "/assets/silabario-cursivo.png",
    alt: "Capa do ebook Produção de Frases",
    capaBg: "bg-blue-pop",
  },
  {
    numero: "3. Coordenação Motora",
    descricao:
      "Fortalece os músculos das mãos e dedos, essenciais para uma escrita firme e bonita.",
    capa: "/assets/coordenacao-motora.png",
    alt: "Capa do ebook Coordenação Motora",
    capaBg: "bg-yellow",
  },
  {
    numero: "4. Silabário Cursivo",
    descricao: "Desenvolve a leitura e a escrita com mais segurança.",
    capa: "/assets/frases-cursivas.png",
    alt: "Capa do ebook Silabário Cursivo",
    capaBg: "bg-peach",
  },
];

const FAQS = [
  {
    q: "Como recebo o material?",
    a: "Assim que o pagamento é confirmado, és redirecionado automaticamente para a página do produto — o acesso é imediato, sem esperas.",
  },
  {
    q: "Como pago na África do Sul?",
    a: "Aceitamos os métodos de pagamento mais usados na África do Sul: Cartão ZAR, EFT, Capitec Pay, QR Code e Apple Pay. Escolhes o que preferires na página de pagamento e o acesso é liberado assim que o pagamento for confirmado.",
  },
  {
    q: "Quanto tempo demora a receber?",
    a: "O acesso é instantâneo. Assim que o pagamento for confirmado, és redirecionado directamente para o material — não precisas esperar nada nem verificar e-mails.",
  },
  {
    q: "O material é para crianças que ainda não sabem nada ou que já sabem um pouco?",
    a: "Serve para os dois casos. O material começa do zero (traçado de letras, reconhecimento de sons) e avança progressivamente — funciona tanto para crianças que estão a começar como para as que já sabem um pouco mas precisam melhorar a letra e a leitura.",
  },
  {
    q: "Quantas vezes tenho de pagar?",
    a: "Apenas uma vez. Pagas uma única vez e o acesso ao material é teu para sempre — sem mensalidades, sem taxas adicionais.",
  },
];

const PACKAGES_CORE = [
  {
    nome: "Stage 1: Letters.",
    descricao: "Letter Recognition and Activities to Master the Alphabet.",
  },
  {
    nome: "Stage 2: Writing and Sounds.",
    descricao: "Trace and Write, and Beginning Sounds of Words.",
  },
  {
    nome: "Stage 3: Reading.",
    descricao: "Reading Words: Level 1 and Common English Words (Sight Words).",
  },
];

const BONUSES_LIST = [
  "Tracing for Motor Skills",
  "Dot to Dot",
  "Spot the Differences",
  "Colouring Pages",
  "Reward Chart",
];

const ROTATIONS = ["-2deg", "0deg", "2deg"];

export default function App() {
  const [selectedImage, setSelectedImage] = useState<PageItem | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Countdown timer: 2 hours (7200 seconds)
  const [timeLeft, setTimeLeft] = useState(7200);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  // Vturb script loader
  useEffect(() => {
    const vturbScriptUrl =
      "https://scripts.converteai.net/6d36d673-ab71-49e1-b71a-cb8e19abf1dd/players/6adf4fbde27e3fac959fea3c/v4/player.js";
    if (!document.querySelector(`script[src="${vturbScriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = vturbScriptUrl;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Modal escape key handler
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <main className="overflow-x-hidden font-sans">
      {/* ========================================================
          SECTION 1: HERO
          ======================================================== */}
      <section className="relative bg-teal px-4 py-14 text-center text-white">
        <div className="pointer-events-none absolute inset-0 text-white/10 dot-pattern"></div>
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-xs font-bold tracking-widest uppercase">
            Coleção Letrinha
          </span>
          <h1 className="mt-6 text-4xl leading-tight font-extrabold sm:text-5xl">
            A Coleção que Ensina sua Criança a Ler, Escrever e Ter uma Letra
            Bonita — Passo a Passo, do Zero
          </h1>
          <p className="mt-5 text-lg font-bold text-lime-soft">
            Atividades completas para crianças do 1º ao 9º ano
          </p>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/95">
            São <strong className="text-lime-soft">+400 páginas</strong> com
            tudo que o seu pequeno(a) precisa para escrever com mais rapidez e
            eficiência.
          </p>

          <div className="mt-8">
            {React.createElement(
              "vturb-smartplayer",
              {
                id: "vid-6adf4fbde27e3fac959fea3c",
                style: {
                  display: "block",
                  margin: "0 auto",
                  width: "100%",
                  maxWidth: "400px",
                },
              },
              <div
                className="vturb-player-placeholder"
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "163.75%",
                  zIndex: 0,
                  backgroundColor: "black",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              ></div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <a href="#pacotes" className="btn-3d active:btn-3d-active">
              Adquirir Agora!
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: 3 SIMPLE STAGES
          ======================================================== */}
      <section className="bg-background px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-3xl font-bold text-teal italic sm:text-4xl">
            Your child's path to reading in 3 simple stages
          </h2>
          <p className="mt-3 text-center text-lg text-muted-foreground">
            Follow the stages in order and watch your child grow in confidence.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 md:flex-row md:gap-0">
            {/* Stage 1 */}
            <article className="flex flex-1 flex-col items-center rounded-2xl bg-card px-6 py-8 text-center shadow-md">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-2xl font-extrabold text-white shadow-[0_4px_0_0_var(--lime-dark)]">
                1
              </span>
              <CaseSensitive className="mt-3 h-8 w-8 text-lime-dark" />
              <h3 className="mt-4 text-xl font-extrabold text-ink">
                Stage 1: Letters
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                Your child learns to recognise every letter of the alphabet
                through fun, simple activities.
              </p>
            </article>

            {/* Arrow */}
            <div className="flex items-center justify-center md:hidden">
              <ArrowDown className="h-5 w-5 text-lime-dark" />
            </div>
            <div className="hidden items-center justify-center px-1 md:flex">
              <ArrowRight className="h-6 w-6 shrink-0 text-lime-dark" />
            </div>

            {/* Stage 2 */}
            <article className="flex flex-1 flex-col items-center rounded-2xl bg-card px-6 py-8 text-center shadow-md">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-2xl font-extrabold text-white shadow-[0_4px_0_0_var(--lime-dark)]">
                2
              </span>
              <Pencil className="mt-3 h-8 w-8 text-lime-dark" />
              <h3 className="mt-4 text-xl font-extrabold text-ink">
                Stage 2: Writing and Sounds
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                Guided tracing builds a steady hand, and beginning sounds connect
                each letter to how it sounds.
              </p>
            </article>

            {/* Arrow */}
            <div className="flex items-center justify-center md:hidden">
              <ArrowDown className="h-5 w-5 text-lime-dark" />
            </div>
            <div className="hidden items-center justify-center px-1 md:flex">
              <ArrowRight className="h-6 w-6 shrink-0 text-lime-dark" />
            </div>

            {/* Stage 3 */}
            <article className="flex flex-1 flex-col items-center rounded-2xl bg-card px-6 py-8 text-center shadow-md">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-2xl font-extrabold text-white shadow-[0_4px_0_0_var(--lime-dark)]">
                3
              </span>
              <BookOpen className="mt-3 h-8 w-8 text-lime-dark" />
              <h3 className="mt-4 text-xl font-extrabold text-ink">
                Stage 3: Reading
              </h3>
              <p className="mt-2 text-base text-muted-foreground">
                The first short words and the most common English words, so your
                child reads with confidence.
              </p>
            </article>
          </div>

          <div className="mt-8 flex justify-center">
            <a href="#pacotes" className="btn-3d active:btn-3d-active">
              See the packages
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: BENEFÍCIOS
          ======================================================== */}
      <section className="bg-background px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-4xl font-bold text-teal italic sm:text-5xl">
            Benefícios
          </h2>
          <div className="section-rule bg-lime"></div>
          <ul className="mt-10 space-y-4">
            {[
              "Escrita mais rápida e legível",
              "Aumento da concentração e foco",
              "Acelera o desenvolvimento da coordenação motora",
              "Melhor capacidade de raciocínio",
              "Ajuda no desenvolvimento da fala",
            ].map((beneficio) => (
              <li
                key={beneficio}
                className="flex items-center gap-3 rounded-xl bg-muted px-5 py-4 text-lg text-ink"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-check">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </span>
                {beneficio}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: REAL WORKBOOK PAGES PREVIEW & COUNTDOWN TIMER
          ======================================================== */}
      <section className="bg-background px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">
            See real pages from inside the workbooks
          </h2>
          <p className="mt-3 text-center text-lg text-muted-foreground">
            Fun, colourful activities that follow the 3 stages, from first
            letters to independent reading.
          </p>

          <div className="mt-10 space-y-12">
            {WORKBOOK_STAGES.map((stage) => (
              <div key={stage.id}>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="rounded-full px-5 py-2 text-sm font-extrabold tracking-widest text-white uppercase shadow-md"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.label}
                  </span>
                  {stage.extraPill && (
                    <span className="rounded-full border-2 border-orange bg-orange/10 px-4 py-1.5 text-xs font-extrabold tracking-widest text-orange uppercase">
                      {stage.extraPill}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-center text-muted-foreground">
                  {stage.description}
                </p>

                <div className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden">
                  {stage.pages.map((page, idx) => (
                    <figure
                      key={page.alt}
                      className="w-[80%] shrink-0 snap-center bg-white shadow-lg md:w-auto"
                      style={{
                        borderRadius: "10px",
                        padding: "8px",
                        transform: `rotate(${ROTATIONS[idx % ROTATIONS.length]})`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedImage(page)}
                        aria-label={`Open larger: ${page.caption}`}
                        className="mx-auto block cursor-zoom-in"
                      >
                        <img
                          src={page.src}
                          alt={page.alt}
                          loading="lazy"
                          className="h-64 w-auto object-contain md:h-80"
                        />
                      </button>
                      <figcaption className="pt-2 text-center text-xs text-muted-foreground">
                        {page.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <div className="mt-3 flex justify-center gap-1.5 md:hidden">
                  {stage.pages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 w-6 rounded-full transition-colors ${
                        idx === 0 ? "bg-teal" : "bg-ink/20"
                      }`}
                    ></span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Countdown timer */}
          <div className="mt-10">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-5">
              <p className="text-center text-sm font-bold tracking-wide text-destructive uppercase">
                ⏰ Oferta termina em
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="min-w-[58px] rounded-xl bg-ink px-3 py-2 text-3xl font-extrabold text-white tabular-nums">
                      {pad(hours)}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Horas
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-ink/40">:</span>
                  <div className="text-center">
                    <div className="min-w-[58px] rounded-xl bg-ink px-3 py-2 text-3xl font-extrabold text-white tabular-nums">
                      {pad(minutes)}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Min
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-ink/40">:</span>
                  <div className="text-center">
                    <div className="min-w-[58px] rounded-xl bg-ink px-3 py-2 text-3xl font-extrabold text-white tabular-nums">
                      {pad(seconds)}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Seg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <a href="#pacotes" className="btn-3d active:btn-3d-active">
              Adquirir Agora!
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-lg"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-[10px] bg-white p-2 shadow-2xl"
          />
        </div>
      )}

      {/* ========================================================
          SECTION 5: CONTEÚDO
          ======================================================== */}
      <section className="bg-yellow px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-4xl font-extrabold text-white sm:text-5xl">
            Conteúdo
          </h2>
          <div className="section-rule bg-white"></div>
          <p className="mx-auto mt-5 max-w-xl text-center text-lg text-white">
            4 cadernos digitais, prontos para imprimir e usar em casa ou na sala
            de aula.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {EBOOKS.map((ebook) => (
              <article
                key={ebook.numero}
                className="overflow-hidden rounded-2xl bg-card shadow-lg"
              >
                <div
                  className={`flex items-center justify-center p-6 ${ebook.capaBg}`}
                >
                  <img
                    src={ebook.capa}
                    alt={ebook.alt}
                    loading="lazy"
                    className="h-64 object-contain transition-transform hover:scale-105 duration-200"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-ink">{ebook.numero}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {ebook.descricao}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: COMO FUNCIONA?
          ======================================================== */}
      <section className="bg-background px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">
            Como Funciona?
          </h2>
          <div className="section-rule bg-orange"></div>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-4 rounded-2xl border-2 border-dashed border-orange/60 bg-orange/5 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-light">
                <Printer className="h-6 w-6 text-white" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-widest text-orange uppercase">
                  Passo 1
                </p>
                <h3 className="mt-1 text-xl font-bold text-ink">
                  Baixe as atividades
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Baixe para o seu PC ou celular. Você pode imprimir quantas
                  vezes desejar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border-2 border-dashed border-orange/60 bg-orange/5 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-light">
                <PencilLine className="h-6 w-6 text-white" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-widest text-orange uppercase">
                  Passo 2
                </p>
                <h3 className="mt-1 text-xl font-bold text-ink">
                  Realizar as atividades
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Mão na massa. A hora de realizá-las com o seu pequeno(a) fica
                  divertida — faça as atividades no seu tempo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: PACOTES
          ======================================================== */}
      <section id="pacotes" className="relative scroll-mt-4 bg-navy px-4 py-16">
        <div className="pointer-events-none absolute inset-0 text-white/10 dot-pattern"></div>
        <div className="relative mx-auto max-w-4xl">
          <div className="flex justify-center">
            <span className="rounded-full bg-lime px-6 py-3 text-sm font-extrabold tracking-widest text-white uppercase shadow-md">
              ESCOLHA O PACOTE IDEAL
            </span>
          </div>

          <div className="mt-12 grid items-stretch gap-8 sm:grid-cols-2">
            {/* Basic Package */}
            <article className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-lg sm:order-1">
              <h3 className="text-center text-2xl font-extrabold text-ink">
                Basic Package
              </h3>
              <p className="mt-3 text-center text-4xl font-extrabold text-green-check">
                R69.90
              </p>
              <p className="mt-1 text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                One-time payment
              </p>
              <div aria-hidden="true" className="mt-2 h-7"></div>

              <ul className="flex-1 space-y-3">
                {PACKAGES_CORE.map((item) => (
                  <li
                    key={item.nome}
                    className="flex items-start gap-3 text-ink"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-check">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </span>
                    <span>
                      <strong className="font-bold">{item.nome}</strong>{" "}
                      {item.descricao}
                    </span>
                  </li>
                ))}

                <li className="flex min-h-[11rem] items-center gap-3 rounded-xl bg-muted/70 px-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted-foreground/25">
                    <X className="h-4 w-4 text-muted-foreground" strokeWidth={3} />
                  </span>
                  <span className="text-muted-foreground/80">All 5 bonuses</span>
                </li>

                <li className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-check">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                  Lifetime access
                </li>
              </ul>

              <div className="mt-8 flex justify-center">
                <a
                  href="https://checkout.escalepay.com/2752817"
                  className="inline-flex w-full max-w-md items-center justify-center rounded-[calc(var(--radius)+4px)] border-2 border-green-check bg-card px-8 py-4 text-base font-extrabold tracking-wide text-green-check uppercase transition-transform duration-150 active:translate-y-[2px]"
                >
                  I Want the Basic Package
                </a>
              </div>
            </article>

            {/* Premium Package */}
            <article className="relative z-10 flex h-full flex-col rounded-2xl border-[3px] border-green-check bg-card p-6 shadow-[0_0_45px_-8px_color-mix(in_oklab,var(--green-check)_55%,transparent)] sm:order-2 sm:scale-[1.04]">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-lime px-4 py-1 text-[11px] font-extrabold tracking-widest text-white uppercase shadow-md">
                Most Chosen
              </span>
              <h3 className="text-center text-2xl font-extrabold text-ink">
                Premium Package
              </h3>
              <p className="mt-3 text-center text-4xl font-extrabold text-green-check">
                R99.90
              </p>
              <p className="mt-1 text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                One-time payment
              </p>
              <div className="mt-2 flex h-7 items-center justify-center">
                <span className="rounded-full bg-green-check px-3 py-1 text-center text-xs font-bold text-white">
                  Only R30 more for all 5 bonuses
                </span>
              </div>

              <ul className="flex-1 space-y-3">
                {PACKAGES_CORE.map((item) => (
                  <li
                    key={item.nome}
                    className="flex items-start gap-3 text-ink"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-check">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </span>
                    <span>
                      <strong className="font-bold">{item.nome}</strong>{" "}
                      {item.descricao}
                    </span>
                  </li>
                ))}

                <li className="min-h-[11rem] rounded-xl bg-green-check/10 p-4">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 shrink-0 text-green-check" />
                    <p className="font-bold text-ink">All 5 bonuses included</p>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {BONUSES_LIST.map((bonus) => (
                      <li
                        key={bonus}
                        className="flex items-center gap-2 text-sm text-ink"
                      >
                        <Check
                          className="h-3.5 w-3.5 shrink-0 text-green-check"
                          strokeWidth={3}
                        />
                        {bonus}
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-check">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                  Lifetime access
                </li>
              </ul>

              <div className="mt-8 flex justify-center">
                <a
                  href="https://checkout.escalepay.com/9382075"
                  className="inline-flex w-full max-w-md items-center justify-center rounded-[calc(var(--radius)+4px)] bg-green-check px-8 py-5 text-lg font-extrabold tracking-wide text-white uppercase shadow-[0_6px_0_0_color-mix(in_oklab,var(--green-check)_68%,black),0_12px_24px_-8px_rgb(0_0_0/0.35)] transition-transform duration-150 active:translate-y-[3px] [text-shadow:0_1px_2px_rgb(0_0_0/0.2)]"
                >
                  I Want the Premium Package
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8: PERGUNTAS FREQUENTES (FAQ)
          ======================================================== */}
      <section className="bg-background px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">
            Perguntas Frequentes
          </h2>
          <div className="section-rule bg-teal"></div>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border-b rounded-xl border-none bg-muted px-5 transition-colors"
                >
                  <h3 className="flex">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className={`flex flex-1 items-center justify-between cursor-pointer py-4 text-left text-base font-bold text-ink hover:no-underline transition-colors ${
                        isOpen ? "text-teal" : ""
                      }`}
                    >
                      {faq.q}
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="pb-4 text-sm text-muted-foreground animate-fadeIn">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: GARANTIA & ACESSO IMEDIATO
          ======================================================== */}
      <section className="bg-background px-4 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
            O pagamento é único? Tenho garantia?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Sim! O pagamento é único e você ainda tem{" "}
            <strong className="text-ink">
              7 dias de garantia incondicional
            </strong>
            . Se por qualquer motivo não estiver satisfeito(a), basta enviar uma
            mensagem e devolvemos 100% do valor — sem perguntas.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-yellow text-white shadow-[0_0_0_10px_rgba(255,185,0,0.25)]">
              <span className="border-b border-dashed border-white/70 px-6 pb-1 text-5xl font-extrabold">
                7
              </span>
              <span className="mt-2 text-xs font-bold tracking-widest uppercase">
                Dias de
              </span>
              <span className="text-xl font-extrabold tracking-wide uppercase">
                Garantia
              </span>
            </div>
          </div>

          <h3 className="mt-12 text-2xl font-extrabold text-ink sm:text-3xl">
            Em quanto tempo eu irei receber meu acesso?
          </h3>
          <p className="mt-4 text-lg font-bold text-teal">IMEDIATAMENTE...</p>
          <p className="mt-2 text-muted-foreground">
            Logo após a confirmação do pagamento, você receberá o acesso
            completo a todos os materiais.
          </p>

          <img
            src="/assets/banner-colecao.png"
            alt="Coleção Letrinha - Banner da coleção de cadernos de atividades"
            loading="lazy"
            className="mt-8 w-full rounded-xl shadow-lg"
          />

          <div className="mt-8 flex justify-center">
            <a href="#pacotes" className="btn-3d active:btn-3d-active">
              Adquirir Agora!
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER
          ======================================================== */}
      <footer className="bg-ink px-4 py-6 text-center text-sm text-white/80">
        © 2026 Letrinha — Todos os direitos reservados
      </footer>

      {/* ========================================================
          STICKY BOTTOM CTA
          ======================================================== */}
      <a
        href="#pacotes"
        className="fixed right-4 bottom-4 left-4 z-50 mx-auto flex max-w-md items-center justify-center rounded-xl bg-lime px-6 py-4 text-base font-extrabold tracking-wide text-white uppercase shadow-[0_6px_0_0_var(--lime-dark),0_12px_24px_-8px_rgb(0_0_0/0.35)] transition-transform duration-150 active:translate-y-[3px]"
      >
        Adquirir Agora
      </a>
    </main>
  );
}
