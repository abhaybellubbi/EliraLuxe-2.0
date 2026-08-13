import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

import { useQuery } from "@tanstack/react-query";
import { getContentSettings } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Elira Luxe" },
      {
        name: "description",
        content: "Get in touch with Elira Luxe for orders, styling and enquiries.",
      },
      { property: "og:title", content: "Contact — Elira Luxe" },
      {
        property: "og:description",
        content: "Get in touch with Elira Luxe for orders, styling and enquiries.",
      },
      { name: "twitter:title", content: "Contact — Elira Luxe" },
      {
        name: "twitter:description",
        content: "Get in touch with Elira Luxe for orders, styling and enquiries.",
      },
    ],
  }),
});

function Contact() {
  const {
    data: settings = {
      contactEmail: "ayeshachinnur@gmail.com",
      contactPhone: "+91 82174 56264",
      contactWhatsapp: "918217456264",
      contactWhatsappCommunity: "https://chat.whatsapp.com/E7J2Ow2RFVcCbJI5huTemq",
    },
  } = useQuery({
    queryKey: ["contentSettings"],
    queryFn: () => getContentSettings(),
  });

  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-deep mb-3">Say Hello</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Get in Touch</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            For orders, styling advice, or wholesale enquiries — we'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href={`mailto:${settings.contactEmail}`}
            className="group p-8 rounded-2xl border border-border bg-card hover:border-gold hover:shadow-xl hover:shadow-gold/10 transition"
          >
            <div className="text-gold-deep text-2xl mb-3">✉</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Email
            </div>
            <div className="font-display text-2xl text-foreground group-hover:text-gold-deep transition">
              {settings.contactEmail}
            </div>
          </a>
          <a
            href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
            className="group p-8 rounded-2xl border border-border bg-card hover:border-gold hover:shadow-xl hover:shadow-gold/10 transition"
          >
            <div className="text-gold-deep text-2xl mb-3">☏</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Phone
            </div>
            <div className="font-display text-2xl text-foreground group-hover:text-gold-deep transition">
              {settings.contactPhone}
            </div>
          </a>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a
            href={`https://wa.me/${settings.contactWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex justify-center items-center px-8 py-3 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-xl shadow-gold/20 hover:scale-105 transition"
          >
            Chat on WhatsApp
          </a>
          <a
            href={settings.contactWhatsappCommunity}
            target="_blank"
            rel="noreferrer"
            className="inline-flex justify-center items-center px-8 py-3 rounded-full border-2 border-gold text-gold-deep font-medium hover:bg-gold/10 hover:scale-105 transition"
          >
            Join WhatsApp Community
          </a>
        </div>

        <div className="mt-12 p-8 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-2">
            Exclusive Access
          </div>
          <h2 className="font-display text-2xl md:text-3xl mb-3">Join Our WhatsApp Community</h2>
          <p className="text-muted-foreground mb-5 max-w-lg mx-auto">
            Be the first to see new arrivals, member-only drops, and styling tips from the Elira
            Luxe atelier.
          </p>
          <a
            href={settings.contactWhatsappCommunity}
            target="_blank"
            rel="noreferrer"
            className="inline-flex px-8 py-3 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-xl shadow-gold/20 hover:scale-105 transition"
          >
            Join the Community
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
