import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FeaturedCardProps {
  title: string;
  description: string;
  color: 'green' | 'purple' | 'yellow';
  buttonText: string;
  badge?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  description,
  color,
  buttonText,
  badge,
}) => {
  const colorClasses: Record<FeaturedCardProps['color'], string> = {
    green: 'bg-gradient-to-br from-green-800 to-green-900',
    purple: 'bg-gradient-to-br from-purple-800 to-purple-900',
    yellow: 'bg-gradient-to-br from-yellow-600 to-yellow-700',
  };

  return (
    <Card className={`${colorClasses[color]} border-0 overflow-hidden relative`}>
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            fill="#FFFFFF"
            d="M47.7,-61.1C62.3,-53.5,75.2,-39.7,79.7,-23.7C84.2,-7.7,80.3,10.6,71.9,25.5C63.5,40.4,50.5,52,36.3,60.3C22.1,68.6,6.6,73.7,-8.3,72.9C-23.3,72.1,-37.7,65.4,-50.8,55.1C-63.9,44.8,-75.7,30.9,-79.5,14.8C-83.3,-1.3,-79.1,-19.7,-69.5,-33.6C-59.9,-47.5,-44.9,-57,-30.1,-64.5C-15.3,-72,-0.6,-77.5,13.5,-75.3C27.6,-73.1,33.1,-68.7,47.7,-61.1Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <CardHeader className="relative z-10 p-3 md:p-4">
        {badge ? (
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base md:text-lg font-bold">{title}</CardTitle>
              <CardDescription className="text-white/80 text-sm md:text-base">{description}</CardDescription>
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs">{badge}</Badge>
          </div>
        ) : (
          <>
            <CardTitle className="text-base md:text-lg font-bold">{title}</CardTitle>
            <CardDescription className="text-white/80 text-sm md:text-base">{description}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="relative z-10 pt-0 p-3 md:p-4">
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 mt-2 md:mt-4 text-xs md:text-sm"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeaturedCard;

