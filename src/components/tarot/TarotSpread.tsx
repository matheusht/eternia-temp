import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TarotCard, getCardInterpretation } from '@/utils/tarotCards';
import { Eye, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TarotSpreadProps {
  cards: TarotCard[];
  spreadType: 'three-card' | 'celtic-cross' | 'love' | 'career';
  isReading: boolean;
  userProfile: any;
  onInterpretation: (interpretation: string) => void;
  onSaveReading: (cards: TarotCard[], interpretation: string) => void;
}

interface SpreadPosition {
  name: string;
  description: string;
  x: number;
  y: number;
  rotation?: number;
}

const spreadLayouts: Record<string, SpreadPosition[]> = {
  'three-card': [
    { name: 'Past', description: 'Past influences', x: 0, y: 0 },
    { name: 'Present', description: 'Current situation', x: 1, y: 0 },
    { name: 'Future', description: 'Future trends', x: 2, y: 0 }
  ],
  'celtic-cross': [
    { name: 'Present', description: 'Current situation', x: 1, y: 1 },
    { name: 'Challenge', description: 'What challenges you', x: 1, y: 1, rotation: 90 },
    { name: 'Distant Past', description: 'Roots of the situation', x: 0, y: 1 },
    { name: 'Recent Past', description: 'Recent influences', x: 1, y: 0 },
    { name: 'Possible Outcome', description: 'Possible result', x: 1, y: 2 },
    { name: 'Near Future', description: 'Upcoming events', x: 2, y: 1 },
    { name: 'Your Approach', description: 'How you see the situation', x: 3, y: 3 },
    { name: 'External Influences', description: 'External factors', x: 3, y: 2 },
    { name: 'Hopes and Fears', description: 'Your inner feelings', x: 3, y: 1 },
    { name: 'Final Outcome', description: 'Final result', x: 3, y: 0 }
  ],
  'love': [
    { name: 'You', description: 'Your love energy', x: 0, y: 0 },
    { name: 'Partner/Interest', description: 'Other person\'s energy', x: 2, y: 0 },
    { name: 'Relationship', description: 'The dynamic between you', x: 1, y: 0 },
    { name: 'Obstacles', description: 'Challenges to overcome', x: 1, y: -1 },
    { name: 'Potential', description: 'Future of the relationship', x: 1, y: 1 }
  ],
  'career': [
    { name: 'Current Situation', description: 'Your professional position', x: 0, y: 0 },
    { name: 'Opportunities', description: 'Emerging chances', x: 1, y: -1 },
    { name: 'Obstacles', description: 'Professional challenges', x: 1, y: 1 },
    { name: 'Outcome', description: 'Career trend', x: 2, y: 0 }
  ]
};

export const TarotSpreadComponent: React.FC<TarotSpreadProps> = ({
  cards,
  spreadType,
  isReading,
  userProfile,
  onInterpretation,
  onSaveReading
}) => {
  const { toast } = useToast();
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [interpretation, setInterpretation] = useState<string>('');
  const [isGeneratingInterpretation, setIsGeneratingInterpretation] = useState(false);

  const positions = spreadLayouts[spreadType] || [];

  useEffect(() => {
    if (isReading && cards.length > 0) {
      setRevealedCards([]);
      setInterpretation('');
    }
  }, [isReading, cards]);

  const revealCard = (index: number) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards(prev => [...prev, index]);
    }
  };

  const generateInterpretation = async () => {
    setIsGeneratingInterpretation(true);
    
    // Simula geração de interpretação personalizada
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let fullInterpretation = `## Tarot Reading - ${getSpreadName(spreadType)}\n\n`;
    
    cards.forEach((card, index) => {
      const position = positions[index];
      if (position) {
        const cardInterpretation = getCardInterpretation(card, position.name, userProfile);
        fullInterpretation += `${cardInterpretation}\n\n---\n\n`;
      }
    });
    
    fullInterpretation += `## General Overview\n\nYour reading reveals a moment of ${getGeneralInsight(cards, userProfile)}. The present energies suggest that you are on the right path to achieve your spiritual and personal goals.`;
    
    setInterpretation(fullInterpretation);
    onInterpretation(fullInterpretation);
    setIsGeneratingInterpretation(false);
  };

  const saveReading = () => {
    if (interpretation) {
      onSaveReading(cards, interpretation);
      toast({
        title: "Reading Saved",
        description: "Your reading has been saved to history",
      });
    }
  };

  const getSpreadName = (type: string) => {
    const names = {
      'three-card': 'Three Cards',
      'celtic-cross': 'Celtic Cross',
      'love': 'Love',
      'career': 'Career'
    };
    return names[type as keyof typeof names] || type;
  };

  const getGeneralInsight = (cards: TarotCard[], profile: any) => {
    const majorCards = cards.filter(card => card.suit === 'major').length;
    const reversedCards = cards.filter(card => card.isReversed).length;
    
    if (majorCards > cards.length / 2) {
      return 'great spiritual transformation';
    } else if (reversedCards > cards.length / 2) {
      return 'inner reflection and need for perspective change';
    } else {
      return 'gradual growth and steady progress';
    }
  };

  return (
    <div className="space-y-6">
      {/* Layout das cartas */}
      <div className="min-h-[300px]">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {spreadType === 'three-card' && (
            <div className="flex gap-4 justify-center px-4">
              {cards.map((card, index) => {
                const position = positions[index];
                if (!position) return null;
                const isRevealed = revealedCards.includes(index);
                
                return (
                  <div key={`three-card-mobile-${index}`} className="flex flex-col items-center">
                    <div
                      className={`w-28 h-40 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        isRevealed 
                          ? 'border-primary bg-gradient-to-br from-purple-900 to-indigo-900' 
                          : 'border-muted bg-muted hover:border-primary/50'
                      }`}
                      onClick={() => revealCard(index)}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                        {isRevealed ? (
                          <>
                            <div className="text-sm font-medium text-primary mb-1">
                              {card.name}
                            </div>
                            {card.isReversed && (
                            <Badge variant="outline" className="text-xs mb-1">
                              Reversed
                            </Badge>
                            )}
                            <RotateCcw className={`w-4 h-4 text-muted-foreground ${card.isReversed ? 'rotate-180' : ''}`} />
                          </>
                        ) : (
                          <>
                            <Eye className="w-6 h-6 text-muted-foreground mb-2" />
                            <div className="text-xs text-muted-foreground">
                              Tap to reveal
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-center mt-2 max-w-28">
                      <div className="font-medium">{position.name}</div>
                      <div className="text-muted-foreground">{position.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {spreadType === 'love' && (
            <div className="relative w-full max-w-xs mx-auto px-4">
              <div className="grid grid-cols-3 grid-rows-3 gap-3 h-80">
                {cards.map((card, index) => {
                  const position = positions[index];
                  if (!position) return null;
                  const isRevealed = revealedCards.includes(index);
                  
                  let gridPosition = '';
                  if (index === 0) gridPosition = 'col-start-1 row-start-2';
                  else if (index === 1) gridPosition = 'col-start-3 row-start-2';
                  else if (index === 2) gridPosition = 'col-start-2 row-start-2';
                  else if (index === 3) gridPosition = 'col-start-2 row-start-1';
                  else if (index === 4) gridPosition = 'col-start-2 row-start-3';
                  
                  return (
                    <div key={`love-mobile-${index}`} className={`flex flex-col items-center ${gridPosition}`}>
                      <div
                        className={`w-20 h-28 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          isRevealed 
                            ? 'border-primary bg-gradient-to-br from-purple-900 to-indigo-900' 
                            : 'border-muted bg-muted hover:border-primary/50'
                        }`}
                        onClick={() => revealCard(index)}
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
                          {isRevealed ? (
                            <>
                              <div className="text-xs font-medium text-primary mb-1 leading-tight">
                                {card.name}
                              </div>
                               {card.isReversed && (
                                <Badge variant="outline" className="text-xs mb-1">
                                  Rev.
                                </Badge>
                               )}
                               <RotateCcw className={`w-3 h-3 text-muted-foreground ${card.isReversed ? 'rotate-180' : ''}`} />
                             </>
                           ) : (
                             <>
                               <Eye className="w-4 h-4 text-muted-foreground mb-1" />
                               <div className="text-xs text-muted-foreground">
                                 Tap
                               </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-1">
                        <div className="font-medium">{position.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {spreadType === 'career' && (
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto px-4">
              {cards.map((card, index) => {
                const position = positions[index];
                if (!position) return null;
                const isRevealed = revealedCards.includes(index);
                
                return (
                  <div key={`career-mobile-${index}`} className="flex flex-col items-center">
                    <div
                      className={`w-24 h-36 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        isRevealed 
                          ? 'border-primary bg-gradient-to-br from-purple-900 to-indigo-900' 
                          : 'border-muted bg-muted hover:border-primary/50'
                      }`}
                      onClick={() => revealCard(index)}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                        {isRevealed ? (
                          <>
                            <div className="text-xs font-medium text-primary mb-1 leading-tight">
                              {card.name}
                            </div>
                             {card.isReversed && (
                               <Badge variant="outline" className="text-xs mb-1">
                                 Rev.
                               </Badge>
                             )}
                             <RotateCcw className={`w-3 h-3 text-muted-foreground ${card.isReversed ? 'rotate-180' : ''}`} />
                           </>
                         ) : (
                           <>
                             <Eye className="w-4 h-4 text-muted-foreground mb-1" />
                             <div className="text-xs text-muted-foreground">
                               Tap
                             </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-center mt-2">
                      <div className="font-medium">{position.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {spreadType === 'celtic-cross' && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-3 min-w-max px-4">
                {cards.map((card, index) => {
                  const position = positions[index];
                  if (!position) return null;
                  const isRevealed = revealedCards.includes(index);
                  
                  return (
                    <div key={`celtic-mobile-${index}`} className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-20 h-32 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          isRevealed 
                            ? 'border-primary bg-gradient-to-br from-purple-900 to-indigo-900' 
                            : 'border-muted bg-muted hover:border-primary/50'
                        }`}
                        onClick={() => revealCard(index)}
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                          {isRevealed ? (
                            <>
                              <div className="text-xs font-medium text-primary mb-1 leading-tight">
                                {card.name.length > 12 ? card.name.substring(0, 10) + '...' : card.name}
                              </div>
                               {card.isReversed && (
                                 <Badge variant="outline" className="text-xs mb-1">
                                   Rev.
                                 </Badge>
                               )}
                               <RotateCcw className={`w-3 h-3 text-muted-foreground ${card.isReversed ? 'rotate-180' : ''}`} />
                             </>
                           ) : (
                             <>
                               <Eye className="w-4 h-4 text-muted-foreground mb-1" />
                               <div className="text-xs text-muted-foreground">
                                 Tap
                               </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-2 max-w-20">
                        <div className="font-medium">{position.name.length > 10 ? position.name.substring(0, 8) + '...' : position.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex justify-center">
            <div className="relative" style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.max(...positions.map(p => p.x)) + 1}, 100px)`,
              gridTemplateRows: `repeat(${Math.max(...positions.map(p => p.y)) + 1}, 140px)`,
              gap: '16px'
            }}>
              {cards.map((card, index) => {
                const position = positions[index];
                if (!position) return null;
                
                const isRevealed = revealedCards.includes(index);
                
                return (
                  <div
                    key={`desktop-${spreadType}-${index}`}
                    className="flex flex-col items-center"
                    style={{
                      gridColumn: position.x + 1,
                      gridRow: position.y + 1
                    }}
                  >
                    <div
                      className={`w-24 h-36 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        isRevealed 
                          ? 'border-primary bg-gradient-to-br from-purple-900 to-indigo-900 hover:scale-105' 
                          : 'border-muted bg-muted hover:border-primary/50'
                      } ${position.rotation && spreadType === 'celtic-cross' ? 'rotate-90' : ''}`}
                      onClick={() => revealCard(index)}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                        {isRevealed ? (
                          <>
                            <div className="text-sm font-medium text-primary mb-1">
                              {card.name}
                            </div>
                             {card.isReversed && (
                               <Badge variant="outline" className="text-xs">
                                 Reversed
                               </Badge>
                             )}
                            <RotateCcw className={`w-4 h-4 text-muted-foreground mt-1 ${card.isReversed ? 'rotate-180' : ''}`} />
                          </>
                        ) : (
                          <>
                            <Eye className="w-6 h-6 text-muted-foreground mb-1" />
                             <div className="text-xs text-muted-foreground">
                               Click to reveal
                             </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-center mt-2">
                      <div className="font-medium">{position.name}</div>
                      <div className="text-muted-foreground">{position.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ações */}
      {revealedCards.length === cards.length && (
        <div className="space-y-4">
          <Separator />
          <div className="flex gap-3 justify-center">
            <Button
              onClick={generateInterpretation}
              disabled={isGeneratingInterpretation || !!interpretation}
              variant="cosmic"
            >
              {isGeneratingInterpretation ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Interpreting...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Generate Interpretation
                </>
              )}
            </Button>
            
            {interpretation && (
              <Button onClick={saveReading} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Reading
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Interpretação */}
      {interpretation && (
        <Card className="mystic-border cosmic-glow">
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {interpretation.split('\n').map((line, index) => {
                if (line.startsWith('##')) {
                  return <h2 key={index} className="text-lg font-playfair text-primary mt-4 mb-2">{line.replace('##', '').trim()}</h2>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <h3 key={index} className="text-base font-semibold mt-3 mb-1">{line.replace(/\*\*/g, '')}</h3>;
                } else if (line === '---') {
                  return <Separator key={index} className="my-4" />;
                } else if (line.trim()) {
                  return <p key={index} className="text-sm text-muted-foreground mb-2">{line}</p>;
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const TarotSpread = TarotSpreadComponent;