import { useState, useEffect } from "react";
import { X, Heart, ShoppingBag, ChevronLeft, ChevronRight, CheckCircle2, Play, Pause, ExternalLink, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getInstagramStories, getInstagramPosts, getContentSettings } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/utils";
import logo from "@/assets/logo.png";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";
import heroImg from "@/assets/marketing-hero-3d.png";

export interface StorySlide {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  caption: string;
  tag: string;
  productName: string;
  whatsappText: string;
}

export interface Story {
  id: string;
  title: string;
  avatar: string;
  category: string;
  hasUnseen: boolean;
  slides: StorySlide[];
}

const FALLBACK_STORIES: Story[] = [
  {
    id: "new-drops",
    title: "New Drops",
    avatar: logo,
    category: "✨ 2026 Collection",
    hasUnseen: true,
    slides: [
      {
        id: "nd-1",
        mediaType: "image",
        mediaUrl: lookbook1,
        caption: "Elevate your everyday with 18k PVD Gold layered chains ✦ Water & Sweat proof!",
        tag: "🔥 BESTSELLER",
        productName: "Golden Aurelia Layered Pendant",
        whatsappText: "Hi! I saw the New Drops story on Instagram Status. I want to buy the Golden Aurelia Layered Pendant.",
      },
      {
        id: "nd-2",
        mediaType: "image",
        mediaUrl: lookbook3,
        caption: "Emerald Sparkle Ear Architecture. Light on ears, heavy on elegance ✨",
        tag: "👑 ROYAL EDITION",
        productName: "Emerald Cut Dangle Earrings",
        whatsappText: "Hi! I want to order the Emerald Cut Dangle Earrings from Instagram Stories.",
      },
    ],
  },
  {
    id: "waterproof",
    title: "Water Test",
    avatar: logo,
    category: "🌊 100% Waterproof",
    hasUnseen: true,
    slides: [
      {
        id: "wp-1",
        mediaType: "image",
        mediaUrl: heroImg,
        caption: "No tarnish. No green skin. 316L Surgical Stainless Steel built for daily showers & workouts!",
        tag: "🛡️ GUARANTEED",
        productName: "Waterproof Herringbone Gold Stack",
        whatsappText: "Hi! I am interested in ordering the Waterproof Herringbone Gold Stack featured in your Water Test status.",
      },
    ],
  },
];

const FALLBACK_POSTS = [
  {
    id: "post-1",
    mediaType: "image" as const,
    mediaUrl: lookbook1,
    likes: "1,842",
    comments: "142",
    handle: "elira.luxe",
    caption: "Golden hour glow hits different when your jewellery is 100% water resistant ✨ Tap to shop the look.",
    tag: "Golden Aurelia Stack",
  },
  {
    id: "post-2",
    mediaType: "image" as const,
    mediaUrl: lookbook2,
    likes: "2,190",
    comments: "98",
    handle: "elira.luxe",
    caption: "Clean lines & effortless modern elegance. Designed in Surgical Steel 316L 💼✨",
    tag: "Minimalist Executive Kada",
  },
  {
    id: "post-3",
    mediaType: "image" as const,
    mediaUrl: lookbook3,
    likes: "3,410",
    comments: "215",
    handle: "elira.luxe",
    caption: "Turn heads at every evening gathering with our handcrafted anti-tarnish emerald pieces 💚",
    tag: "Emerald Luxe Statement",
  },
];

export function InstagramStatus() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const { data: settings } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettings(),
  });

  const { data: dbStories = [] } = useQuery({
    queryKey: ["instagramStories"],
    queryFn: () => getInstagramStories(),
  });

  const { data: dbPosts = [] } = useQuery({
    queryKey: ["instagramPosts"],
    queryFn: () => getInstagramPosts(),
  });

  const instagramUrl = settings?.contactInstagramCommunity || "https://instagram.com/elira.luxe";
  const stories: Story[] = dbStories.length > 0 ? (dbStories as any) : FALLBACK_STORIES;
  const posts = dbPosts.length > 0 ? (dbPosts as any) : FALLBACK_POSTS;

  // Auto advance story progress
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const currentStory = stories[activeStoryIndex];
    if (!currentStory || !currentStory.slides || currentStory.slides.length === 0) return;

    const timer = setTimeout(() => {
      if (activeSlideIndex < currentStory.slides.length - 1) {
        setActiveSlideIndex((prev) => prev + 1);
      } else if (activeStoryIndex < stories.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
        setActiveSlideIndex(0);
      } else {
        setActiveStoryIndex(null);
        setActiveSlideIndex(0);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeStoryIndex, activeSlideIndex, isPaused, stories]);

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setActiveSlideIndex(0);
    setIsPaused(false);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setActiveSlideIndex(0);
  };

  const handleNextSlide = () => {
    if (activeStoryIndex === null) return;
    const currentStory = stories[activeStoryIndex];
    if (!currentStory || !currentStory.slides) return;

    if (activeSlideIndex < currentStory.slides.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
    } else if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setActiveSlideIndex(0);
    } else {
      closeStory();
    }
  };

  const handlePrevSlide = () => {
    if (activeStoryIndex === null) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
    } else if (activeStoryIndex > 0) {
      const prevStory = stories[activeStoryIndex - 1];
      setActiveStoryIndex(activeStoryIndex - 1);
      setActiveSlideIndex(prevStory.slides.length - 1);
    }
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;
  const currentSlide = currentStory && currentStory.slides ? currentStory.slides[activeSlideIndex] : null;

  return (
    <section className="py-12 bg-gradient-to-b from-background via-cream/40 to-background dark:via-secondary/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header (Removed requested tagline) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              Instagram Status & Live Drops
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold">
              @eliraluxe <span className="font-script shimmer-gold">Live Stories</span>
            </h2>
          </div>
        </div>

        {/* Story Circles Bar */}
        <div className="flex items-center gap-6 overflow-x-auto pb-6 scrollbar-none snap-x">
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => openStory(idx)}
              className="flex flex-col items-center gap-2.5 group cursor-pointer flex-shrink-0 focus:outline-none snap-start"
            >
              {/* Outer Ring */}
              <div
                className={`relative p-[3px] rounded-full transition-all duration-300 group-hover:scale-105 ${
                  story.hasUnseen !== false
                    ? "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 animate-pulse shadow-lg shadow-rose-500/20"
                    : "bg-border group-hover:bg-gold"
                }`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-background bg-ink flex items-center justify-center relative">
                  {story.slides && story.slides[0] ? (
                    story.slides[0].mediaType === "video" ? (
                      <video
                        src={story.slides[0].mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={resolveMediaUrl(story.slides[0].mediaUrl)}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )
                  ) : (
                    <img src={resolveMediaUrl(story.avatar)} alt={story.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition" />
                  
                  {story.slides && story.slides[0] && story.slides[0].mediaType === "video" && (
                    <div className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full">
                      <Video className="w-3 h-3 text-gold" />
                    </div>
                  )}

                  <span className="absolute bottom-1 right-1 bg-gold text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                    LIVE
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-foreground group-hover:text-gold-deep transition block">
                  {story.title}
                </span>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {story.category.split(" ")[0]}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Instagram Posts Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl md:text-2xl font-bold">Trending Instagram Feed</h3>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-widest text-gold-deep hover:underline flex items-center gap-1.5 font-bold"
            >
              <span>Follow @eliraluxe</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => {
              return (
                <div
                  key={post.id}
                  className="group relative bg-card border border-border/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-gold/40 transition-all duration-300 flex flex-col"
                >
                  {/* Image/Video container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                    {post.mediaType === "video" ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={resolveMediaUrl(post.mediaUrl)}
                        alt={post.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-cream">
                      <div className="flex justify-between items-center">
                        <span className="bg-gold/90 text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          {post.tag}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-cream/90 line-clamp-2 mb-3">
                          {post.caption}
                        </p>
                        <a
                          href={`https://wa.me/918217456264?text=${encodeURIComponent(
                            `Hi! I saw this Instagram post on your site (${post.tag}). Please share details.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2 rounded-full bg-gradient-gold text-primary-foreground text-xs font-semibold flex items-center justify-center gap-2 shadow-lg"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Enquire Post
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Post Footer */}
                  <div className="p-4 flex items-center justify-between text-xs border-t border-border bg-card">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <img src={logo} alt="Elira" className="w-5 h-5 rounded-full object-contain" />
                      <span>{post.handle}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500/20" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">
                      {post.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FULLSCREEN INSTAGRAM STORY MODAL WITH FIXED TAP/CLICK NAVIGATION */}
      {activeStoryIndex !== null && currentStory && currentSlide && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 md:p-4 animate-fade-in select-none">
          {/* Backdrop click close */}
          <div className="absolute inset-0 z-10" onClick={closeStory} />

          {/* Main Story Container */}
          <div className="relative w-full max-w-md h-full md:h-[90vh] md:max-h-[820px] bg-ink rounded-none md:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between z-20 border border-gold/30">
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 z-40 p-3 bg-gradient-to-b from-black/80 to-transparent flex gap-1.5 pointer-events-none">
              {currentStory.slides.map((slide, sIdx) => {
                let widthClass = "w-0";
                if (sIdx < activeSlideIndex) widthClass = "w-full";
                if (sIdx === activeSlideIndex) widthClass = isPaused ? "w-1/2" : "w-full transition-all duration-[5000ms] ease-linear";
                return (
                  <div key={slide.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div className={`h-full bg-gold ${widthClass}`} />
                  </div>
                );
              })}
            </div>

            {/* Story Header */}
            <div className="absolute top-5 left-0 right-0 z-40 px-4 py-2 flex items-center justify-between text-white bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Elira Luxe" className="w-10 h-10 rounded-full border-2 border-gold object-contain bg-background" />
                <div>
                  <div className="flex items-center gap-1 font-semibold text-sm">
                    <span>elira.luxe</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                  </div>
                  <div className="text-[11px] text-white/70">{currentStory.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={closeStory}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Media (Video or Image) */}
            <div className="relative w-full h-full flex-1">
              {currentSlide.mediaType === "video" ? (
                <video
                  src={currentSlide.mediaUrl}
                  autoPlay
                  loop
                  muted={isPaused}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={resolveMediaUrl(currentSlide.mediaUrl)}
                  alt={currentSlide.caption}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

              {/* Tap Left 50% to Go Previous */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                className="absolute left-0 top-16 bottom-40 w-1/2 z-30 cursor-pointer"
                title="Previous Story / Slide"
              />

              {/* Tap Right 50% to Go Next */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="absolute right-0 top-16 bottom-40 w-1/2 z-30 cursor-pointer"
                title="Next Story / Slide"
              />

              {/* Desktop Arrow Buttons */}
              {activeStoryIndex > 0 || activeSlideIndex > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevSlide();
                  }}
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/60 text-white hover:bg-gold hover:text-black transition shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              ) : null}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/60 text-white hover:bg-gold hover:text-black transition shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Story Content & Action Overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-40 p-6 text-white bg-gradient-to-t from-black via-black/85 to-transparent">
              <div className="mb-3">
                <span className="bg-gold text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {currentSlide.tag}
                </span>
              </div>
              <p className="text-sm md:text-base font-medium text-cream mb-4 leading-snug">
                {currentSlide.caption}
              </p>

              {/* Tagged Product Box */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-gold font-semibold uppercase tracking-wider">
                    FEATURED PIECE
                  </div>
                  <div className="text-sm font-semibold text-white">{currentSlide.productName}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] uppercase font-semibold text-gold tracking-wider">Price on Request</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/918217456264?text=${encodeURIComponent(currentSlide.whatsappText || "Hi! I saw your story.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Enquire
                </a>
              </div>

              {/* Bottom Quick Reply & Like */}
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/918217456264?text=${encodeURIComponent(
                    `Hi @eliraluxe! Saw your story "${currentStory.title}".`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-full bg-white/15 border border-white/20 text-xs text-white/90 focus:outline-none hover:bg-white/20 transition flex items-center justify-between"
                >
                  <span>Send a message...</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold" />
                </a>
                <button
                  onClick={() => toggleLike(currentSlide.id)}
                  className={`p-3 rounded-full border transition ${
                    likedMap[currentSlide.id]
                      ? "bg-rose-500 border-rose-500 text-white"
                      : "bg-white/15 border-white/20 text-white hover:bg-white/25"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedMap[currentSlide.id] ? "fill-white" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
