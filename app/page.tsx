// ...keep existing imports
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail } from "lucide-react";
import Cookies from "js-cookie";
import { LogoutButton } from "@/components/LogoutButton";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setIsLoggedIn(data.loggedIn);
    }
    checkLogin();
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-black via-zinc-900 to-black overflow-hidden">
      {isLoggedIn && (
        <div className="absolute top-4 right-6">
          <LogoutButton />
        </div>
      )}

      {/* Logo */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/logo.png"
          alt="Startup Logo"
          width={120}
          height={120}
          className="mx-auto rounded-full shadow-lg shadow-green-500/40 hover:scale-105 transition-transform"
        />
      </motion.div>

      <motion.h1
        className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-[0_0_15px_rgba(0,255,150,0.6)]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎉 Pass It On
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl max-w-xl text-zinc-300 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Helping students declutter and find essentials. Buy or sell used items
        within your hostel or college – seamlessly.
      </motion.p>

      <p className="text-sm text-white font-medium italic mb-6 animate-pulse">
        Your <span className="text-green-400 font-semibold">extras</span> are
        someone's{" "}
        <span className="text-green-400 font-semibold">essentials</span> 🚀
      </p>

      {/* Marquee */}
      <div className="w-full overflow-hidden whitespace-nowrap border-t border-b border-green-500 my-4 py-2 bg-black">
        <motion.div
          className="inline-block text-green-400 font-semibold text-sm animate-marquee"
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        >
          💻 Hot Deal: Laptop available under ₹10,000! Contact
          freakyakkmu@gmail.com for enquiry 🔥
        </motion.div>
      </div>

      {/* Buttons */}
      <motion.div
        className="flex gap-6 mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <button
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-lg transition-all hover:scale-105"
          onClick={() => router.push("/buyer")}
        >
          👀 I’m a Buyer
        </button>

        <button
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg transition-all hover:scale-105"
          onClick={() => router.push("/seller")}
        >
          💼 I’m a Seller
        </button>
      </motion.div>

      {/* Products */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 px-2 w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="bg-zinc-900 p-4 rounded-2xl shadow-lg border border-green-500 hover:scale-105 transition-transform">
          <Image
            src="/laptop-product.jpg"
            alt="Second-hand Laptop"
            width={500}
            height={300}
            className="rounded-xl object-cover mb-3"
          />
          <h3 className="text-white text-lg font-bold mb-1">
            🔥 2nd-Hand Laptop Deal
          </h3>
          <p className="text-zinc-400 text-sm">
            Perfect for coding & classes — grab a reliable laptop under ₹10,000
            now!
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl shadow-lg border border-blue-500 hover:scale-105 transition-transform">
          <Image
            src="/coset-product.jpg"
            alt="Co-Set Brand New"
            width={500}
            height={300}
            className="rounded-xl object-cover mb-3"
          />
          <h3 className="text-white text-lg font-bold mb-1">
            🆕 Co-Set – Brand New!
          </h3>
          <h1>Available in multiple sizes</h1>
          <p className="text-zinc-400 text-sm">
            Stylish and affordable — your campus wardrobe upgrade starts here
            🎒✨
          </p>
        </div>
      </motion.div>

      {/* 💡 Wish Form Section */}
      <motion.div
        className="w-full max-w-xl mt-12 p-6 bg-zinc-900 rounded-2xl shadow-lg border border-dashed border-green-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h2 className="text-white text-2xl font-bold mb-4">
          💭 Wish for Something?
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          Didn’t find what you were looking for? Let us know and we’ll notify sellers!
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const item = formData.get("item")?.toString().trim();
            const details = formData.get("details")?.toString().trim();

            if (!item) return alert("Please enter what you're looking for");

            const res = await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ item, details }),
            });

            if (res.ok) {
              alert("✅ Your wish has been submitted!");
              form.reset();
            } else {
              alert("❌ Something went wrong.");
            }
          }}
        >
          <input
            name="item"
            type="text"
            placeholder="e.g., Study Table"
            className="px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <textarea
            name="details"
            rows={3}
            placeholder="Any specific details? (optional)"
            className="px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow transition-all hover:scale-105"
          >
            Submit Wish
          </button>
        </form>
      </motion.div>

      {/* Footer */}
      <footer className="mt-20 w-full flex flex-col items-center gap-2 text-zinc-400 text-sm">

        <motion.button
          whileHover={{ scale: 1.05, color: "#22c55e" }}
          onClick={() =>
            (window.location.href = "mailto:freakyakkmu@gmail.com")
          }
          className="flex items-center gap-2 text-white transition-colors"
        >
          <Mail size={18} />
          Contact Us
        </motion.button>
        <span className="text-xs text-zinc-500">
          © 2025 Passion Writers. All rights reserved.
        </span>
      </footer>

      {/* Confetti */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        <div className="w-full h-full bg-[url('/confetti.png')] bg-cover bg-center opacity-10 mix-blend-screen animate-pulse" />
      </motion.div>
    </div>
  );
}
