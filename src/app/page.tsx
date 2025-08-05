"use client";

import { useEffect, useState } from "react";
// Homepage Components
import {
  HeroSection,
  PropertySearchSection,
  BenefitsSection,
  FeaturedPropertiesSection,
  ServicesSection,
  NewsletterSection,
  ContactSection,
} from "@/components/homepage";
import Adventure from "@/components/homepage/Adventure";
import Developer from "@/components/homepage/Developer";
import Sections from "@/components/homepage/Sections";
import Newsletter from "@/components/homepage/Newsletter";

// Define the Property type based on the Prisma schema
type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  location: string;
  currency: string;
  featuredImage: string;
  galleryImages: string[];
  beds: number;
  baths: number;
  area: number;
  createdAt: Date;
};

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        console.log("Fetching properties from API...");
        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        // Convert createdAt strings to Date objects
        const formattedData = (data || []).map((property: Property) => ({
          ...property,
          createdAt: new Date(property.createdAt),
        }));

        setProperties(formattedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // Reset loading state when navigating back to this page
  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);

    // Simulate API call
    try {
      // In a real app, you would send this data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContactSuccess(true);
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col pt-16">
      {/* Hero Section */}
      <HeroSection />

      {/* Property Search Section */}
      <PropertySearchSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Featured Properties Section */}
      <FeaturedPropertiesSection properties={properties} loading={loading} />

      {/* Adventure Section */}
      <Adventure />

      {/* Developer Section */}
      <Developer />

      {/* Services Section */}
      <ServicesSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Sections Section */}
      <Sections properties={properties} loading={loading} />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Contact Section */}
      <ContactSection
        contactForm={contactForm}
        contactSubmitting={contactSubmitting}
        contactSuccess={contactSuccess}
        onFormChange={handleContactChange}
        onFormSubmit={handleContactSubmit}
      />
    </main>
  );
}