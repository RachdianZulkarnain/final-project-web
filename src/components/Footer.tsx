"use client";
import React from "react";
import { usePathname } from "next/navigation";

interface TextLinkProps {
  children: React.ReactNode;
}

const TextLink: React.FC<TextLinkProps> = ({ children }) => {
  return <div className="hover:underline hover:cursor-pointer">{children}</div>;
};

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // 🚀 jika di halaman profile dan dashboard, jangan tampilkan footer
if (pathname.startsWith("/profile") || pathname.startsWith("/dashboard"))
  return null;

  return (
    <div className="bg-[#0290d1] sticky rounded-t-[40px] z-10 -mt-[50px] grid grid-cols-2 md:grid-cols-5 gap-8 py-16 px-16 sm:px-8 lg:px-40 md:justify-items-center">
      {/* About */}
      <div className="flex flex-col gap-8">
        <div className="font-bold text-white text-lg">About Homigo</div>
        <div className="text-input flex flex-col gap-2 items-start">
          <TextLink>About us</TextLink>
          <TextLink>Careers</TextLink>
          <TextLink>Investors</TextLink>
          <TextLink>Press</TextLink>
          <TextLink>Blog</TextLink>
        </div>
      </div>

      {/* Support */}
      <div className="flex flex-col gap-8">
        <div className="font-bold text-secondary text-lg">Support</div>
        <div className="text-input grid gap-2">
          <TextLink>Help Center</TextLink>
          <TextLink>Report a safety concern</TextLink>
          <TextLink>Issue a complaint</TextLink>
          <TextLink>Privacy policy</TextLink>
          <TextLink>Cookie Policy</TextLink>
          <TextLink>Terms of use</TextLink>
        </div>
      </div>

      {/* Tenants */}
      <div className="flex flex-col gap-8">
        <div className="font-bold text-secondary text-lg">Tenants</div>
        <div className="text-input grid gap-2">
          <TextLink>FAQs</TextLink>
          <TextLink>Community Forum</TextLink>
          <TextLink>Tenant Resources</TextLink>
          <TextLink>Payments</TextLink>
        </div>
      </div>

      {/* Explore */}
      <div className="flex flex-col gap-8">
        <div className="font-bold text-secondary text-lg">Explore</div>
        <div className="text-input grid gap-2">
          <TextLink>Hotels</TextLink>
          <TextLink>Apartments</TextLink>
          <TextLink>Villas</TextLink>
          <TextLink>Promotions</TextLink>
        </div>
      </div>

      {/* Find Us */}
      <div className="flex flex-col gap-8">
        <div className="font-bold text-secondary text-lg">Find Us</div>
        <div className="text-input flex gap-2">
          <TextLink>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </TextLink>

          <TextLink>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </TextLink>
        </div>
      </div>
    </div>
  );
};

export default Footer;
