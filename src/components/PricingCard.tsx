import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { CheckCircle } from "lucide-react"


interface PricingCardProps {
  title: string
  description: string
  price: string
  features: string[]
  buttonText: string
  buttonLink: string
  buttonVariant: "default" | "outline"
  popular?: boolean
}

function PricingCard({
  title,
  description,
  price,
  features,
  buttonText,
  buttonLink,
  buttonVariant,
  popular = false,
}: PricingCardProps) {
  return (
    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md relative">
      {popular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-primary to-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-bold">{price}</span>
        <span className="ml-1 text-muted-foreground">/month</span>
      </div>
      <ul className="mt-6 space-y-2 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`mt-6 ${buttonVariant === "default" ? "shadow-lg shadow-primary/20 hover:shadow-primary/30" : ""}`}
        variant={buttonVariant}
        asChild
      >
        <Link to={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  )
}

export default PricingCard