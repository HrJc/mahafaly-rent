import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { FeaturedCars } from "@/components/home/FeaturedCars"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { FAQSection } from "@/components/home/FAQSection"
import { CTASection } from "@/components/home/CTASection"
import { prisma } from "@/lib/prisma"
import { serializeData } from "@/lib/utils"

export default async function HomePage() {
  const featuredCars = await prisma.car.findMany({
    where: { available: true },
    take: 3,
    orderBy: { pricePerDay: "desc" },
  })

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedCars cars={serializeData(featuredCars)} />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
