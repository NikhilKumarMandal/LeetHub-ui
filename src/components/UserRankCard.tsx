import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface UserRankingCardProps {
  rank: number;
  name: string;
  avatar?: string;
}

const UserRankingCard = ({ rank, name, avatar }: UserRankingCardProps) => {
  return (
    <Card className="p-3 hover:bg-accent/50 transition-colors border-border/50">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-muted-foreground w-6">
          {rank}
        </span>
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-foreground">{name}</p>
        </div>
      </div>
    </Card>
  );
};

export default UserRankingCard;
