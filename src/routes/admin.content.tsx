import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentSettings,
  updateContentSettings,
  getUniqueStyles,
  updateUniqueStyle,
  deleteUniqueStyle,
  getInstagramStories,
  updateInstagramStory,
  deleteInstagramStory,
  getInstagramPosts,
  updateInstagramPost,
  deleteInstagramPost,
} from "@/lib/api";
import { resolveMediaUrl } from "@/lib/utils";
import { compressImageFile, processVideoFile } from "@/lib/compress";
import logo from "@/assets/logo.png";
import {
  Save,
  Info,
  Link as LinkIcon,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Video,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  EyeOff,
  Film,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

const CATEGORY_OPTIONS = [
  "Chain Pendants",
  "Earrings",
  "Chain Bracelets",
  "Openable Kada",
  "Rings",
  "Mangalsutra",
  "Bangles",
  "Anklets",
];

function AdminContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "unique_styles" | "insta_stories" | "insta_posts" | "features" | "hero" | "about" | "contact" | "collections"
  >("unique_styles");

  // File Input Refs for local file selection
  const styleFileInputRef = useRef<HTMLInputElement>(null);
  const storyFileInputRef = useRef<HTMLInputElement>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  // Content Settings Query
  const { data: settings, isLoading } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettings(),
  });

  // Unique Styles Query
  const { data: dbUniqueStyles = [] } = useQuery({
    queryKey: ["uniqueStyles"],
    queryFn: () => getUniqueStyles(),
  });

  // Instagram Stories Query
  const { data: dbInstagramStories = [] } = useQuery({
    queryKey: ["instagramStories"],
    queryFn: () => getInstagramStories(),
  });

  // Instagram Posts Query
  const { data: dbInstagramPosts = [] } = useQuery({
    queryKey: ["instagramPosts"],
    queryFn: () => getInstagramPosts(),
  });

  // Form states for Settings
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroTagline, setHeroTagline] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [contactWhatsappCommunity, setContactWhatsappCommunity] = useState("");
  const [contactInstagramCommunity, setContactInstagramCommunity] = useState("");
  const [featuredCollections, setFeaturedCollections] = useState<string[]>([]);
  const [showUniqueStyles, setShowUniqueStyles] = useState(true);
  const [showInstagramStatus, setShowInstagramStatus] = useState(true);
  const [showTrendingLooks, setShowTrendingLooks] = useState(true);
  const [showAIChatbot, setShowAIChatbot] = useState(true);
  const [showPriceTags, setShowPriceTags] = useState(false);

  // Form states for New Unique Style
  const [newStyleTitle, setNewStyleTitle] = useState("");
  const [newStyleSubtitle, setNewStyleSubtitle] = useState("");
  const [newStyleTagline, setNewStyleTagline] = useState("");
  const [newStyleBadge, setNewStyleBadge] = useState("INNOVATION #01");
  const [newStyleImage, setNewStyleImage] = useState("");
  const [newStyleInnovations, setNewStyleInnovations] = useState("Anti-tangle link ratio, 18k PVD Gold, 316L Steel");

  // Form states for New Instagram Story
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [newStoryCategory, setNewStoryCategory] = useState("✨ Live Drop");
  const [newStoryAvatar, setNewStoryAvatar] = useState("");
  const [newSlideMediaType, setNewSlideMediaType] = useState<"image" | "video">("video");
  const [newSlideMediaUrl, setNewSlideMediaUrl] = useState("");
  const [newSlideCaption, setNewSlideCaption] = useState("");
  const [newSlideTag, setNewSlideTag] = useState("🔥 LIVE DROP");
  const [newSlideProductName, setNewSlideProductName] = useState("Signature Jewellery");

  // Form states for New Instagram Post
  const [newPostMediaType, setNewPostMediaType] = useState<"image" | "video">("image");
  const [newPostMediaUrl, setNewPostMediaUrl] = useState("");
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostTag, setNewPostTag] = useState("Daily Luxe");

  useEffect(() => {
    if (settings) {
      setHeroTitle(settings.heroTitle || "");
      setHeroSubtitle(settings.heroSubtitle || "");
      setHeroTagline(settings.heroTagline || "");
      setAboutText(settings.aboutText || "");
      setContactEmail(settings.contactEmail || "");
      setContactPhone(settings.contactPhone || "");
      setContactWhatsapp(settings.contactWhatsapp || "");
      setContactWhatsappCommunity(settings.contactWhatsappCommunity || "");
      setContactInstagramCommunity(settings.contactInstagramCommunity || "https://instagram.com/elira.luxe");
      setFeaturedCollections(settings.featuredCollections || []);
      setShowUniqueStyles(settings.showUniqueStyles !== false);
      setShowInstagramStatus(settings.showInstagramStatus !== false);
      setShowTrendingLooks(settings.showTrendingLooks !== false);
      setShowAIChatbot(settings.showAIChatbot !== false);
      setShowPriceTags(settings.showPriceTags === true);
    }
  }, [settings]);

  // Handle local file selection with automatic image compression & video optimization
  const handleLocalFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrlState: (url: string) => void,
    setMediaTypeState?: (type: "image" | "video") => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("video/")) {
      if (setMediaTypeState) setMediaTypeState("video");
      toast.info(`Processing video "${file.name}"...`);
      try {
        const { dataUrl, videoSize } = await processVideoFile(file);
        setUrlState(dataUrl);
        toast.success(`Video "${file.name}" ready! (${videoSize})`);
      } catch (err) {
        toast.error("Failed to process video file");
      }
    } else if (file.type.startsWith("image/")) {
      if (setMediaTypeState) setMediaTypeState("image");
      toast.info(`Compressing image "${file.name}"...`);
      try {
        const { dataUrl, originalSize, compressedSize } = await compressImageFile(file);
        setUrlState(dataUrl);
        toast.success(`Image compressed! (${originalSize} ➔ ${compressedSize})`);
      } catch (err) {
        toast.error("Failed to compress image file");
      }
    }
  };

  const saveSettingsMutation = useMutation({
    mutationFn: (data: any) => updateContentSettings({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentSettings"] });
      toast.success("Settings & Instagram link saved successfully!");
    },
  });

  const saveUniqueStyleMutation = useMutation({
    mutationFn: (style: any) => updateUniqueStyle({ data: style }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uniqueStyles"] });
      toast.success("Unique Style Card saved!");
      setNewStyleTitle("");
      setNewStyleSubtitle("");
      setNewStyleTagline("");
      setNewStyleImage("");
    },
  });

  const deleteUniqueStyleMutation = useMutation({
    mutationFn: (id: string) => deleteUniqueStyle({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uniqueStyles"] });
      toast.success("Unique Style Card removed!");
    },
  });

  const saveStoryMutation = useMutation({
    mutationFn: (story: any) => updateInstagramStory({ data: story }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagramStories"] });
      toast.success("Instagram Video / Story Reel published!");
      setNewStoryTitle("");
      setNewSlideMediaUrl("");
      setNewSlideCaption("");
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: (id: string) => deleteInstagramStory({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagramStories"] });
      toast.success("Story Reel removed!");
    },
  });

  const savePostMutation = useMutation({
    mutationFn: (post: any) => updateInstagramPost({ data: post }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagramPosts"] });
      toast.success("Instagram Feed Post published!");
      setNewPostMediaUrl("");
      setNewPostCaption("");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => deleteInstagramPost({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instagramPosts"] });
      toast.success("Feed Post removed!");
    },
  });

  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveSettingsMutation.mutate({
      heroTitle,
      heroSubtitle,
      heroTagline,
      aboutText,
      contactEmail,
      contactPhone,
      contactWhatsapp,
      contactWhatsappCommunity,
      contactInstagramCommunity,
      featuredCollections,
      showUniqueStyles,
      showInstagramStatus,
      showTrendingLooks,
      showAIChatbot,
      showPriceTags,
    });
  };

  const handleCollectionToggle = (cat: string) => {
    setFeaturedCollections((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleAddUniqueStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleTitle) return toast.error("Please enter a style title");

    const newStyle = {
      id: "us-" + Date.now(),
      title: newStyleTitle,
      subtitle: newStyleSubtitle || "Modular Craft System",
      tagline: newStyleTagline || "Engineered for 24/7 wear and zero tarnish.",
      badge: newStyleBadge || "NEW INNOVATION",
      image: newStyleImage || "lookbook-1.jpg",
      innovations: newStyleInnovations.split(",").map((s) => s.trim()).filter(Boolean),
      suggestedProducts: [{ name: newStyleTitle + " Stack", category: "Jewellery" }],
    };

    saveUniqueStyleMutation.mutate(newStyle);
  };

  const handleAddInstagramStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle || !newSlideMediaUrl) return toast.error("Please enter story title and select a local media file");

    const newStory = {
      id: "story-" + Date.now(),
      title: newStoryTitle,
      avatar: newStoryAvatar || logo,
      category: newStoryCategory || "✨ Live Drop",
      hasUnseen: true,
      slides: [
        {
          id: "sl-" + Date.now(),
          mediaType: newSlideMediaType,
          mediaUrl: newSlideMediaUrl,
          caption: newSlideCaption || "Check out our live story drop!",
          tag: newSlideTag || "LIVE DROP",
          productName: newSlideProductName || newStoryTitle,
          whatsappText: `Hi! I saw your Instagram story video for ${newStoryTitle}. Please share details.`,
        },
      ],
    };

    saveStoryMutation.mutate(newStory);
  };

  const handleAddInstagramPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostMediaUrl) return toast.error("Please select a local media file for the post");

    const newPost = {
      id: "post-" + Date.now(),
      mediaType: newPostMediaType,
      mediaUrl: newPostMediaUrl,
      likes: "1,850",
      comments: "95",
      handle: "elira.luxe",
      caption: newPostCaption || "New style alert from @eliraluxe ✨",
      tag: newPostTag || "Daily Luxe",
    };

    savePostMutation.mutate(newPost);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground font-display text-lg">Loading CMS Panel...</div>;
  }

  const tabs = [
    { id: "unique_styles", label: "Unique Styles CMS", icon: Sparkles },
    { id: "insta_stories", label: "Instagram Video Stories CMS", icon: Video },
    { id: "insta_posts", label: "Instagram Feed CMS", icon: ImageIcon },
    { id: "features", label: "Feature & Price Toggles", icon: Sliders },
    { id: "hero", label: "Hero Banner CMS", icon: ImageIcon },
    { id: "about", label: "Brand Story CMS", icon: FileText },
    { id: "contact", label: "Contact & Instagram Link", icon: Phone },
    { id: "collections", label: "Featured Categories", icon: Info },
  ] as const;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gold/30 pb-6">
        <div>
          <div className="text-xs uppercase font-bold tracking-[0.3em] text-gold-deep mb-1">
            Elira Luxe Management Console
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Brand CMS & Local Media Panel
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Add Unique Styles, publish Instagram Video Stories, update Official Instagram Link, and pick local media files directly.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-4 shrink-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition duration-300 w-full text-left cursor-pointer ${
                activeTab === tab.id
                  ? "text-primary-foreground bg-gradient-gold shadow-lg shadow-gold/20 scale-[1.02]"
                  : "text-foreground/80 hover:text-gold-deep hover:bg-gold/10 border border-border bg-card"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CMS Forms Area */}
        <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
          
          {/* TAB 1: UNIQUE STYLES CMS */}
          {activeTab === "unique_styles" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2.5 text-foreground">
                    <Sparkles className="h-6 w-6 text-gold-deep" />
                    <span>Unique & Innovative Styles CMS</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload local images and manage unique jewelry craft cards.
                  </p>
                </div>
                <span className="bg-gold/20 text-gold-deep text-xs font-bold px-3.5 py-1.5 rounded-full border border-gold/40">
                  {dbUniqueStyles.length} Active Styles
                </span>
              </div>

              {/* Add New Unique Style Form */}
              <form onSubmit={handleAddUniqueStyle} className="p-6 rounded-2xl bg-secondary/50 border border-border space-y-5">
                <div className="text-xs font-bold text-gold-deep uppercase tracking-[0.2em] flex items-center gap-2">
                  <Plus className="h-4 w-4 text-gold-deep" />
                  <span>Add New Unique Style Card</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Style Title</label>
                    <input
                      type="text"
                      value={newStyleTitle}
                      onChange={(e) => setNewStyleTitle(e.target.value)}
                      placeholder="e.g. Liquid Gold Stacking"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Subtitle / Tech Category</label>
                    <input
                      type="text"
                      value={newStyleSubtitle}
                      onChange={(e) => setNewStyleSubtitle(e.target.value)}
                      placeholder="e.g. Modular Layering System"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Badge Tag</label>
                    <input
                      type="text"
                      value={newStyleBadge}
                      onChange={(e) => setNewStyleBadge(e.target.value)}
                      placeholder="e.g. INNOVATION #01"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                  
                  {/* LOCAL FILE UPLOADER FOR UNIQUE STYLE */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-gold-deep" />
                      <span>Select Local Image File</span>
                    </label>

                    <input
                      ref={styleFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLocalFileUpload(e, setNewStyleImage)}
                      className="hidden"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => styleFileInputRef.current?.click()}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold-deep text-xs font-bold flex items-center justify-center gap-2 transition"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Image File from Computer</span>
                      </button>
                    </div>

                    {newStyleImage && (
                      <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-background border border-border">
                        <img src={resolveMediaUrl(newStyleImage)} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-ink border" />
                        <span className="text-[11px] text-foreground font-medium truncate">Selected Local Image Ready</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-bold uppercase tracking-wider">Tagline Description</label>
                  <textarea
                    value={newStyleTagline}
                    onChange={(e) => setNewStyleTagline(e.target.value)}
                    rows={2}
                    placeholder="Short description of why this style craft is unique..."
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-bold uppercase tracking-wider">Innovations List (Comma Separated)</label>
                  <input
                    type="text"
                    value={newStyleInnovations}
                    onChange={(e) => setNewStyleInnovations(e.target.value)}
                    placeholder="Anti-tangle chain ratio, 18k PVD Gold, 316L Surgical Steel"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saveUniqueStyleMutation.isPending}
                  className="px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>{saveUniqueStyleMutation.isPending ? "Publishing..." : "Publish Unique Style Card"}</span>
                </button>
              </form>

              {/* Active Styles List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-gold-deep tracking-widest">Active Unique Styles:</h3>
                <div className="grid gap-4">
                  {dbUniqueStyles.map((style: any) => {
                    const resolvedImg = resolveMediaUrl(style.image);
                    return (
                      <div
                        key={style.id}
                        className="p-5 rounded-2xl border border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-ink border border-gold/40 flex-shrink-0">
                            <img src={resolvedImg} alt={style.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-foreground leading-tight font-display">{style.title}</div>
                            <div className="text-xs text-gold-deep font-semibold mt-0.5">{style.subtitle} ({style.badge})</div>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{style.tagline}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteUniqueStyleMutation.mutate(style.id)}
                          className="px-4 py-2 rounded-full border border-rose-500/50 text-rose-600 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1.5 self-end md:self-auto transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Style</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTAGRAM STORIES & VIDEO DROPS CMS */}
          {activeTab === "insta_stories" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2.5 text-foreground">
                    <Video className="h-6 w-6 text-rose-500" />
                    <span>Instagram Live Stories & Video Drops CMS</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload local MP4 videos or images to publish story reels.
                  </p>
                </div>
                <span className="bg-rose-500/10 text-rose-600 text-xs font-bold px-3.5 py-1.5 rounded-full border border-rose-500/30">
                  {dbInstagramStories.length} Story Channels
                </span>
              </div>

              {/* INSTAGRAM LINK QUICK SETTINGS BANNER */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                <div className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-rose-500" />
                  <span>Official Instagram Profile Page Link</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={contactInstagramCommunity}
                    onChange={(e) => setContactInstagramCommunity(e.target.value)}
                    placeholder="https://instagram.com/elira.luxe"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-rose-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    disabled={saveSettingsMutation.isPending}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow transition"
                  >
                    Save Instagram Link
                  </button>
                </div>
              </div>

              {/* Add New Story Form */}
              <form onSubmit={handleAddInstagramStory} className="p-6 rounded-2xl bg-secondary/50 border border-border space-y-5">
                <div className="text-xs font-bold text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Publish New Instagram Video / Photo Drop</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Story Title</label>
                    <input
                      type="text"
                      value={newStoryTitle}
                      onChange={(e) => setNewStoryTitle(e.target.value)}
                      placeholder="e.g. Waterproof Sea Test"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Category Tag</label>
                    <input
                      type="text"
                      value={newStoryCategory}
                      onChange={(e) => setNewStoryCategory(e.target.value)}
                      placeholder="e.g. 🌊 100% Waterproof"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Media Format</label>
                    <select
                      value={newSlideMediaType}
                      onChange={(e) => setNewSlideMediaType(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    >
                      <option value="video">🎥 Video File (MP4 / WebM)</option>
                      <option value="image">📷 Image File (JPG / PNG)</option>
                    </select>
                  </div>

                  {/* LOCAL FILE UPLOADER FOR INSTAGRAM STORIES & VIDEOS */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-rose-500" />
                      <span>Select Local Video / Image File</span>
                    </label>

                    <input
                      ref={storyFileInputRef}
                      type="file"
                      accept="video/*,image/*"
                      onChange={(e) => handleLocalFileUpload(e, setNewSlideMediaUrl, setNewSlideMediaType)}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => storyFileInputRef.current?.click()}
                      className="w-full px-4 py-3 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Video or Image File from Computer</span>
                    </button>

                    {newSlideMediaUrl && (
                      <div className="mt-2 p-2 rounded-xl bg-background border border-border flex items-center gap-3">
                        {newSlideMediaType === "video" ? (
                          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-600">
                            <Video className="w-5 h-5" />
                          </div>
                        ) : (
                          <img src={resolveMediaUrl(newSlideMediaUrl)} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-ink border" />
                        )}
                        <span className="text-[11px] text-foreground font-medium truncate">Selected Local Media Ready</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Story Overlay Tag</label>
                    <input
                      type="text"
                      value={newSlideTag}
                      onChange={(e) => setNewSlideTag(e.target.value)}
                      placeholder="e.g. 🔥 BESTSELLER"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Featured Product Name</label>
                    <input
                      type="text"
                      value={newSlideProductName}
                      onChange={(e) => setNewSlideProductName(e.target.value)}
                      placeholder="e.g. Golden Aurelia Layered Pendant"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-bold uppercase tracking-wider">Story Caption Text</label>
                  <textarea
                    value={newSlideCaption}
                    onChange={(e) => setNewSlideCaption(e.target.value)}
                    rows={2}
                    placeholder="Enter video caption shown on story..."
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saveStoryMutation.isPending}
                  className="px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>{saveStoryMutation.isPending ? "Publishing..." : "Publish Video / Photo Story Reel"}</span>
                </button>
              </form>

              {/* Active Stories List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-gold-deep tracking-widest">Active Story Reels:</h3>
                <div className="grid gap-4">
                  {dbInstagramStories.map((story: any) => {
                    const firstSlide = story.slides ? story.slides[0] : null;
                    const resolvedMedia = firstSlide ? resolveMediaUrl(firstSlide.mediaUrl) : logo;
                    return (
                      <div
                        key={story.id}
                        className="p-5 rounded-2xl border border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full border-2 border-gold overflow-hidden bg-ink flex items-center justify-center flex-shrink-0">
                            {firstSlide && firstSlide.mediaType === "video" ? (
                              <Video className="w-6 h-6 text-gold" />
                            ) : (
                              <img src={resolvedMedia} alt={story.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <div className="text-base font-bold text-foreground flex items-center gap-2">
                              <span>{story.title}</span>
                              {firstSlide && firstSlide.mediaType === "video" && (
                                <span className="bg-rose-500/20 text-rose-600 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold">
                                  VIDEO
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gold-deep font-semibold mt-0.5">{story.category}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteStoryMutation.mutate(story.id)}
                          className="px-4 py-2 rounded-full border border-rose-500/50 text-rose-600 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1.5 self-end md:self-auto transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INSTAGRAM POSTS FEED CMS */}
          {activeTab === "insta_posts" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2.5 text-foreground">
                    <ImageIcon className="h-6 w-6 text-sky-500" />
                    <span>Trending Instagram Feed CMS</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload local images or videos to display in the Instagram gallery feed.
                  </p>
                </div>
                <span className="bg-sky-500/10 text-sky-600 text-xs font-bold px-3.5 py-1.5 rounded-full border border-sky-500/30">
                  {dbInstagramPosts.length} Feed Posts
                </span>
              </div>

              {/* INSTAGRAM LINK QUICK SETTINGS BANNER */}
              <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-3">
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-sky-500" />
                  <span>Official Instagram Profile Page Link</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={contactInstagramCommunity}
                    onChange={(e) => setContactInstagramCommunity(e.target.value)}
                    placeholder="https://instagram.com/elira.luxe"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-sky-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    disabled={saveSettingsMutation.isPending}
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold uppercase tracking-wider shadow transition"
                  >
                    Save Instagram Link
                  </button>
                </div>
              </div>

              {/* Add New Post Form */}
              <form onSubmit={handleAddInstagramPost} className="p-6 rounded-2xl bg-secondary/50 border border-border space-y-5">
                <div className="text-xs font-bold text-sky-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Publish New Instagram Feed Post</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Media Format</label>
                    <select
                      value={newPostMediaType}
                      onChange={(e) => setNewPostMediaType(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    >
                      <option value="image">📷 Image File</option>
                      <option value="video">🎥 Video File (MP4)</option>
                    </select>
                  </div>

                  {/* LOCAL FILE UPLOADER FOR INSTAGRAM POSTS */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-sky-500" />
                      <span>Select Local Post Media File</span>
                    </label>

                    <input
                      ref={postFileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleLocalFileUpload(e, setNewPostMediaUrl, setNewPostMediaType)}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => postFileInputRef.current?.click()}
                      className="w-full px-4 py-3 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 text-xs font-bold flex items-center justify-center gap-2 transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Local File from Computer</span>
                    </button>

                    {newPostMediaUrl && (
                      <div className="mt-2 p-2 rounded-xl bg-background border border-border flex items-center gap-3">
                        <img src={resolveMediaUrl(newPostMediaUrl)} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-ink border" />
                        <span className="text-[11px] text-foreground font-medium truncate">Selected Local Media Ready</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-bold uppercase tracking-wider">Post Tag Name</label>
                  <input
                    type="text"
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    placeholder="e.g. Golden Aurelia Stack"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-bold uppercase tracking-wider">Caption Text</label>
                  <textarea
                    value={newPostCaption}
                    onChange={(e) => setNewPostCaption(e.target.value)}
                    rows={2}
                    placeholder="Enter Instagram post caption..."
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savePostMutation.isPending}
                  className="px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>{savePostMutation.isPending ? "Adding..." : "Add Instagram Feed Post"}</span>
                </button>
              </form>

              {/* Active Posts List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-gold-deep tracking-widest">Active Feed Posts:</h3>
                <div className="grid gap-4">
                  {dbInstagramPosts.map((post: any) => {
                    const resolvedImg = resolveMediaUrl(post.mediaUrl);
                    return (
                      <div
                        key={post.id}
                        className="p-5 rounded-2xl border border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <img src={resolvedImg} alt={post.tag} className="w-16 h-16 rounded-xl object-cover bg-ink border border-gold/40 flex-shrink-0" />
                          <div>
                            <div className="text-base font-bold text-foreground">{post.tag}</div>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.caption}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => deletePostMutation.mutate(post.id)}
                          className="px-4 py-2 rounded-full border border-rose-500/50 text-rose-600 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1.5 self-end md:self-auto transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Post</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FEATURE TOGGLES */}
          {activeTab === "features" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-2xl font-bold border-b border-border pb-4 text-foreground flex items-center gap-2.5">
                <Sliders className="h-6 w-6 text-gold-deep" />
                <span>Website Feature Controls & Price Tag Display</span>
              </h2>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-border bg-background flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Sparkles className="h-6 w-6 text-gold-deep flex-shrink-0" />
                    <div>
                      <div className="text-base font-bold text-foreground">Unique & Innovative Styles Section</div>
                      <div className="text-xs text-muted-foreground">Showcase modular jewelry crafts and interactive stack builder.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUniqueStyles(!showUniqueStyles)}
                    className={`w-14 h-7 rounded-full transition p-1 flex items-center ${
                      showUniqueStyles ? "bg-gradient-gold justify-end" : "bg-muted/40 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black shadow-md" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-background flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Video className="h-6 w-6 text-rose-600 flex-shrink-0" />
                    <div>
                      <div className="text-base font-bold text-foreground">Instagram Live Status & Stories Reel</div>
                      <div className="text-xs text-muted-foreground">Enable live video stories and Instagram post gallery feed.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInstagramStatus(!showInstagramStatus)}
                    className={`w-14 h-7 rounded-full transition p-1 flex items-center ${
                      showInstagramStatus ? "bg-gradient-gold justify-end" : "bg-muted/40 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black shadow-md" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-background flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <EyeOff className="h-6 w-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <div className="text-base font-bold text-foreground">Display Numerical Price Tags</div>
                      <div className="text-xs text-muted-foreground">
                        {showPriceTags
                          ? "Numerical prices are currently visible."
                          : "Price tags are hidden; website displays 'Price on Request' with direct WhatsApp inquiry buttons."}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceTags(!showPriceTags)}
                    className={`w-14 h-7 rounded-full transition p-1 flex items-center ${
                      showPriceTags ? "bg-gradient-gold justify-end" : "bg-muted/40 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black shadow-md" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={saveSettingsMutation.isPending}
                  className="px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition"
                >
                  Save Feature Controls
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: HERO */}
          {activeTab === "hero" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-2xl font-bold border-b border-border pb-4 text-foreground">
                Homepage Hero Customizer
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-foreground font-bold">Hero Heading Line 1</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="e.g. Illuminate"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-foreground font-bold">Hero Heading Line 2 (Script Font)</label>
                  <input
                    type="text"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="e.g. Your Elegance"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none font-serif"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-foreground font-bold">Hero Subtitle Copy</label>
                <textarea
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={saveSettingsMutation.isPending}
                  className="px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition"
                >
                  Save Hero Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-2xl font-bold border-b border-border pb-4 text-foreground">Brand Story Editor</h2>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none resize-none leading-relaxed"
              />
              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={saveSettingsMutation.isPending}
                  className="px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition"
                >
                  Save Brand Story
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT & INSTAGRAM LINK */}
          {activeTab === "contact" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-2xl font-bold border-b border-border pb-4 text-foreground flex items-center gap-2.5">
                <Instagram className="h-6 w-6 text-rose-500" />
                <span>Contact Channels & Official Instagram Link</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-rose-500" />
                    <span>Official Instagram Profile Page Link</span>
                  </label>
                  <input
                    type="url"
                    value={contactInstagramCommunity}
                    onChange={(e) => setContactInstagramCommunity(e.target.value)}
                    placeholder="https://instagram.com/elira.luxe"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This link will be opened whenever customers click "Follow @eliraluxe" or Instagram icons on the website.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Contact Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. care@eliraluxe.com"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-bold uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. +91 82174 56264"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-bold uppercase tracking-wider">WhatsApp Community Link</label>
                  <input
                    type="url"
                    value={contactWhatsappCommunity}
                    onChange={(e) => setContactWhatsappCommunity(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={saveSettingsMutation.isPending}
                  className="px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition"
                >
                  Save Contact & Instagram Info
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: COLLECTIONS */}
          {activeTab === "collections" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-2xl font-bold border-b border-border pb-4 text-foreground">Featured Categories</h2>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = featuredCollections.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCollectionToggle(cat)}
                      className={`p-4 rounded-2xl border text-left text-sm font-semibold transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-gold/20 border-gold text-gold-deep font-bold"
                          : "border-border text-muted-foreground bg-background hover:border-gold/40"
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <span className="text-gold-deep font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={saveSettingsMutation.isPending}
                  className="px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition"
                >
                  Save Featured Categories
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
