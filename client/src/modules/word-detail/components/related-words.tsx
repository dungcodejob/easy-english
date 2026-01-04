import { Badge } from '@/shared/ui/shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';

interface RelatedWordsProps {
  items: string[];
  title: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export const RelatedWords = ({ items, title, variant = 'outline' }: RelatedWordsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <Badge key={idx} variant={variant}>
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
