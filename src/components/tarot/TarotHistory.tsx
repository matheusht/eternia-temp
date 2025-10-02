import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TarotCard } from '@/utils/tarotCards';
import { Calendar, ChevronDown, ChevronUp, Eye, Trash2 } from 'lucide-react';

interface TarotReading {
  id: string;
  date: Date;
  spreadType: 'three-card' | 'celtic-cross' | 'love' | 'career';
  cards: TarotCard[];
  interpretation: string;
}

interface TarotHistoryProps {
  readings: TarotReading[];
  onDeleteReading?: (readingId: string) => Promise<boolean>;
  isLoading?: boolean;
}

const spreadNames = {
  'three-card': 'Three Cards',
  'celtic-cross': 'Celtic Cross',
  'love': 'Love',
  'career': 'Career'
};

const spreadColors = {
  'three-card': 'bg-blue-500',
  'celtic-cross': 'bg-purple-500',
  'love': 'bg-pink-500',
  'career': 'bg-green-500'
};

export const TarotHistory: React.FC<TarotHistoryProps> = ({ 
  readings, 
  onDeleteReading,
  isLoading = false 
}) => {
  const [expandedReading, setExpandedReading] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleExpanded = (readingId: string) => {
    setExpandedReading(expandedReading === readingId ? null : readingId);
  };

  const getMainCards = (cards: TarotCard[]) => {
    return cards.slice(0, 3); // Show only the first 3 cards in preview
  };

  const handleDeleteReading = async (readingId: string) => {
    if (!onDeleteReading) return;
    
    setDeletingId(readingId);
    await onDeleteReading(readingId);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading readings...</p>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No readings performed yet</p>
        <p className="text-sm">Your readings will appear here after being saved</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {readings.map((reading) => (
        <Card key={reading.id} className="mystic-border hover:cosmic-glow transition-all duration-300">
          <Collapsible
            open={expandedReading === reading.id}
            onOpenChange={() => toggleExpanded(reading.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${spreadColors[reading.spreadType]}`} />
                    <div>
                      <CardTitle className="text-lg font-playfair">
                        {spreadNames[reading.spreadType]}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(reading.date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {reading.cards.length} cards
                    </Badge>
                    {expandedReading === reading.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
                
                {/* Preview of main cards */}
                <div className="flex gap-2 mt-3">
                  {getMainCards(reading.cards).map((card, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded border border-purple-500/30 p-2 text-center"
                    >
                      <div className="text-xs font-medium text-primary truncate">
                        {card.name}
                      </div>
                      {card.isReversed && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Inv.
                        </Badge>
                      )}
                    </div>
                  ))}
                  {reading.cards.length > 3 && (
                    <div className="flex-1 bg-muted/20 rounded border border-muted/30 p-2 text-center flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{reading.cards.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <Separator className="mb-4" />
                
                {/* All cards */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Reading Cards
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {reading.cards.map((card, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded border border-purple-500/50 p-3 text-center"
                      >
                        <div className="text-sm font-medium text-primary mb-1">
                          {card.name}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {card.suit === 'major' ? 'Major Arcana' : `${card.suit}`}
                        </div>
                        {card.isReversed && (
                          <Badge variant="outline" className="text-xs">
                            Reversed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interpretation */}
                <div>
                  <h4 className="font-semibold mb-3">Interpretation</h4>
                  <div className="bg-muted/30 rounded-lg p-4 text-sm">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {reading.interpretation.split('\n').map((line, index) => {
                        if (line.startsWith('##')) {
                          return (
                            <h3 key={index} className="text-base font-playfair text-primary mt-3 mb-2">
                              {line.replace('##', '').trim()}
                            </h3>
                          );
                        } else if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <h4 key={index} className="text-sm font-semibold mt-2 mb-1">
                              {line.replace(/\*\*/g, '')}
                            </h4>
                          );
                        } else if (line === '---') {
                          return <Separator key={index} className="my-3" />;
                        } else if (line.trim()) {
                          return (
                            <p key={index} className="text-xs text-muted-foreground mb-2">
                              {line}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                {onDeleteReading && (
                  <div className="flex justify-end mt-4 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteReading(reading.id)}
                      disabled={deletingId === reading.id}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deletingId === reading.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};