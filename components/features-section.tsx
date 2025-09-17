import { Utensils, Truck, DollarSign, Leaf } from "lucide-react"

const features = [
  {
    icon: Utensils,
    title: "Best Quality Food",
    description: "Sed ut perspiciatis unde omnis este natus sit voluptatem",
  },
  {
    icon: Truck,
    title: "Fast Food Delivery",
    description: "Sed ut perspiciatis unde omnis este natus sit voluptatem",
  },
  {
    icon: DollarSign,
    title: "Money Back Guarantee",
    description: "Sed ut perspiciatis unde omnis este natus sit voluptatem",
  },
  {
    icon: Leaf,
    title: "100% Natural Food",
    description: "Sed ut perspiciatis unde omnis este natus sit voluptatem",
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-[#d62828] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-white text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 border-2 border-[#ffbe0b] rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-[#ffbe0b]" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/90 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
