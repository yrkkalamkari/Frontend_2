import Divider from "@/components/Divider";
import Link from "next/link";

export const metadata = { title: "Blog — YRK Collections" };

export default function BlogPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-4xl text-brown mb-4">Journal</h1>
      <Divider className="mb-6" />
      <p className="text-brown/60 leading-relaxed">
        Stories from the workshop — dyeing techniques, artisan profiles, and the history
        behind Kalamkari motifs — are coming soon.
      </p>
      <Link href="/products" className="inline-block mt-8 bg-brown text-cream px-8 py-3 rounded-lg font-semibold hover:bg-brownDark transition-colors">
        Shop the collection
      </Link>
    </div>
  );
}
