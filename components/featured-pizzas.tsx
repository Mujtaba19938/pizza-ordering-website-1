import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const featuredPizzas = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, and basil",
    price: "$25.00",
    image: "/margherita-pizza.png",
  },
  {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Pepperoni, mozzarella, and our signature sauce",
    price: "$28.00",
    image: "/pepperoni-pizza.png",
  },
  {
    id: 3,
    name: "Veggie Deluxe",
    description: "Bell peppers, mushrooms, onions, and olives",
    price: "$26.00",
    image: "/469396989_1090214405923653_645958267498695417_n.jpg",
  },
]

export function FeaturedPizzas() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#d62828] mb-3 sm:mb-4">Featured Pizzas</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Try our most popular pizzas, made with the finest ingredients and baked to perfection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredPizzas.map((pizza) => (
            <Card
              key={pizza.id}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-[#ffbe0b] overflow-hidden p-0"
            >
              <div className="relative">
                <img
                  src={pizza.image || "/placeholder.svg"}
                  alt={pizza.name}
                  className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#d62828] text-white px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                  {pizza.price}
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl mb-2 text-[#d62828]">{pizza.name}</CardTitle>
                <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{pizza.description}</p>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 pt-0">
                <Button className="w-full bg-[#ffbe0b] text-black hover:bg-[#e6a800] font-semibold transition-all hover:scale-105 text-sm sm:text-base py-2 sm:py-3">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Button size="lg" className="bg-[#d62828] text-white hover:bg-[#b91c1c] px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold">
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  )
}
