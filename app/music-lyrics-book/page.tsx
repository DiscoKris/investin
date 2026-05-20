import Image from "next/image";
import { ContinueButton } from "@/components/continue-button";
import { Reveal } from "@/components/reveal";
import { SoundtrackModal } from "@/app/music-lyrics-book/soundtrack-modal";

const creators = [
  {
    name: "John Farrar",
    role: "Music & Lyrics",
    imageSrc: "/assets/john.jpg",
    imageAlt: "Portrait of John Farrar",
    placeholder: false,
    placement: "lg:col-span-2",
  },
  {
    name: "Kara DioGuardi",
    role: "Music & Lyrics",
    imageSrc: "/assets/kara.jpeg",
    imageAlt: "Portrait of Kara DioGuardi",
    placeholder: false,
    placement: "lg:col-span-2",
  },
  {
    name: "Kristopher Lythgoe",
    role: "Book",
    imageSrc: "/assets/kris.jpeg",
    imageAlt: "Portrait of Kristopher Lythgoe",
    placeholder: false,
    placement: "lg:col-span-2",
  },
  {
    name: "Don Black",
    role: "Original Title Song Lyrics",
    imageSrc: "/assets/don.png",
    imageAlt: "Portrait of Don Black",
    placeholder: false,
    placement: "lg:col-start-2 lg:col-span-2",
  },
  {
    name: "Mark London",
    role: "Original Title Song Music",
    imageSrc: "/assets/mark.png",
    imageAlt: "Portrait of Mark London",
    placeholder: false,
    placement: "lg:col-span-2",
  },
];

const johnFarrarBio =
  "John Farrar, the Grammy Award-winning songwriter and producer behind some of the most iconic music in film and pop culture history.\n\nFarrar is best known for writing and producing the global hits from Grease, including You're the One That I Want, Hopelessly Devoted to You, and Magic from Xanadu. His collaborations with Olivia Newton-John produced multiple platinum-selling albums and helped define the sound of an era.\n\nAcross an extraordinary career spanning decades, Farrar has written and produced numerous international chart-topping hits, earning Grammy and Academy Award nominations while selling millions of records worldwide.\n\nRenowned for crafting emotionally resonant melodies with timeless commercial appeal, John Farrar brings legendary musical pedigree and unforgettable songwriting to To Sir, With Love.";

const karaDioGuardiBio =
  "Kara DioGuardi is one of the most successful and influential hit songwriters in modern music.\n\nA Grammy-nominated songwriter and producer, DioGuardi has written or produced songs for global superstars including Pink, Kelly Clarkson, Christina Aguilera, Carrie Underwood, Celine Dion, and Gwen Stefani. Her songs have sold over 160 million records worldwide, helping shape the sound of contemporary pop music for more than two decades.\n\nBeyond her songwriting success, DioGuardi became a household name as a judge and mentor on American Idol, where she championed authentic storytelling and artist development. She is also the co-founder of Arthouse Entertainment, one of the music industry’s leading songwriting and artist development companies.\n\nKnown for combining emotional honesty with undeniable commercial appeal, Kara DioGuardi brings contemporary edge, hit-making instincts, and world-class songwriting pedigree to To Sir, With Love.";

export default function MusicLyricsBookPage() {
  return (
    <div className="section-shell py-6 sm:py-8 lg:py-10">
      <section className="relative flex min-h-[calc(100svh-8rem)] items-center">
        <div className="relative w-full overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.44)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,233,188,0.08),transparent_24%),radial-gradient(circle_at_88%_78%,rgba(186,224,255,0.05),transparent_16%),linear-gradient(180deg,rgba(255,250,239,0.03),rgba(8,13,10,0.08))]" />

          <Reveal className="relative z-10">
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7.5rem] sm:w-[8.5rem] lg:absolute lg:left-0 lg:top-0 lg:w-[9rem]"
              />
              <h1 className="pt-1 text-[2.15rem] font-bold uppercase leading-none tracking-[-0.04em] sm:text-[2.9rem] lg:text-[4.15rem]">
                <span className="text-[var(--color-ivory)]">Music, Lyrics & </span>
                <span className="text-[var(--color-gold)]">Book</span>
              </h1>
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:mt-10 lg:grid-cols-6 lg:gap-x-4 lg:gap-y-7 xl:px-8">
            {creators.map((creator, index) => (
              <Reveal
                key={creator.name}
                delay={index * 0.05}
                className={`flex flex-col items-center text-center ${creator.placement}`}
              >
                <div className="group">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-[rgba(214,180,103,0.92)] bg-[rgba(8,13,10,0.24)] shadow-[0_16px_36px_rgba(0,0,0,0.2)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_44px_rgba(0,0,0,0.26)] sm:h-44 sm:w-44 lg:h-40 lg:w-40 xl:h-44 xl:w-44">
                    <Image
                      src={creator.imageSrc}
                      alt={creator.imageAlt}
                      fill
                      className="object-cover object-center brightness-[1.04] contrast-[1.04] saturate-[1.06] opacity-95 transition duration-300 group-hover:scale-[1.03]"
                      sizes="(min-width: 1280px) 11rem, (min-width: 1024px) 10rem, 11rem"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.16),transparent_24%),linear-gradient(180deg,transparent,rgba(7,15,11,0.22))]" />
                    {creator.placeholder ? (
                      <div className="absolute inset-x-4 bottom-4 rounded-full border border-[rgba(232,222,203,0.12)] bg-[rgba(8,13,10,0.56)] px-3 py-1">
                        <p className="text-[0.56rem] font-medium uppercase tracking-[0.18em] text-[var(--color-gold)]">
                          Replace Image
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
                <p className="mt-4 text-[1.05rem] font-semibold leading-[1.18] text-[var(--color-ivory)] sm:text-[1.12rem]">
                  {creator.name}
                </p>
                <p className="mt-1 max-w-[13rem] text-[0.92rem] leading-[1.25] text-[var(--color-cream)] sm:text-[0.96rem]">
                  {creator.role}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="relative z-10 mt-10 flex flex-col items-center text-center lg:mt-8">
            <Reveal className="flex flex-col items-center text-center">
              <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-ivory)] sm:text-[1.08rem]">
                Click below to hear soundtrack samples
              </p>
              <div className="mt-5">
                <SoundtrackModal />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <ContinueButton
                href="#why-these-songwriters"
                label="MEET THE SONG WRITERS"
                className="mt-8"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="why-these-songwriters"
        className="scroll-mt-28 py-8 sm:py-10 lg:py-12"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(232,222,203,0.08)] bg-[rgba(34,56,35,0.34)] px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:px-8 sm:py-10 lg:rounded-[2.4rem] lg:px-10 lg:py-11">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(255,233,188,0.07),transparent_22%),linear-gradient(180deg,rgba(255,250,239,0.02),rgba(8,13,10,0.06))]" />

          <Reveal className="relative z-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <Image
                src="/assets/tswllogo.png"
                alt="To Sir, With Love logo"
                width={991}
                height={590}
                className="h-auto w-[7rem] sm:w-[8rem] lg:absolute lg:left-0 lg:top-0 lg:w-[8.5rem]"
              />
              <h2 className="text-[2rem] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--color-gold)] sm:text-[2.5rem] lg:text-[3.4rem]">
                Why These Songwriters
              </h2>
            </div>
          </Reveal>

          <div className="relative z-10 mt-8 grid gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <div className="max-w-[34rem]">
                <h3 className="text-[1.7rem] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-ivory)] sm:text-[1.95rem] lg:text-[2.35rem]">
                  John Farrar - Music & Lyrics
                </h3>
                <p className="mt-6 whitespace-pre-line text-[1.02rem] leading-[1.8] text-[var(--color-cream)] sm:text-[1.08rem]">
                  {johnFarrarBio}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="max-w-[34rem]">
                <h3 className="text-[1.7rem] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-ivory)] sm:text-[1.95rem] lg:text-[2.35rem]">
                  Kara DioGuardi - Music & Lyrics
                </h3>
                <p className="mt-6 whitespace-pre-line text-[1.02rem] leading-[1.8] text-[var(--color-cream)] sm:text-[1.08rem]">
                  {karaDioGuardiBio}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative z-10">
            <ContinueButton href="/sets-costumes" className="lg:mt-12" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
