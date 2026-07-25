import Divider from "@/components/Divider";

export const metadata = { title: "Contact — YRK Collections" };

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-4xl text-brown mb-4">Get in touch</h1>
      <Divider className="mb-6" />
      <p className="text-brown/60 leading-relaxed mb-8">
        Questions about an order, a custom piece, or wholesale inquiries — we'd love to hear from you.
      </p>
      <div className="space-y-2 text-brown">
        <p><a href="mailto:yrkkalamkari@gmail.com" className="hover:text-gold">yrkkalamkari@gmail.com</a></p>
        <p><a href="tel:+910000000000" className="hover:text-gold">+91 00000 00000</a></p>
      </div>
    </div>
  );
}
