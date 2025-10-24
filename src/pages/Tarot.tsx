import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { useTarotReadings } from '@/hooks/useTarotReadings';
import { AppLayout } from '@/components/AppLayout';
import { TarotDeck } from '@/components/tarot/TarotDeck';
import { TarotSpread } from '@/components/tarot/TarotSpread';
import { TarotHistory } from '@/components/tarot/TarotHistory';
import { TarotCard as TarotCardType } from '@/utils/tarotCards';
import { Sparkles, Moon, Sun, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Tarot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserData();
  const { readings, isLoading, saveReading, deleteReading } = useTarotReadings();
  const [currentSpread, setCurrentSpread] = useState<'three-card' | 'celtic-cross' | 'love' | 'career'>('three-card');
  const [selectedCards, setSelectedCards] = useState<TarotCardType[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [interpretation, setInterpretation] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const handleCardSelection = (cards: TarotCardType[]) => {
    setSelectedCards(cards);
  };

  const handleNewReading = () => {
    setSelectedCards([]);
    setInterpretation('');
    setIsReading(false);
  };

  const handleSaveReading = async (cards: TarotCardType[], interpretation: string) => {
    await saveReading(cards, interpretation, currentSpread);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const spreadTypes = [
    {
      id: 'three-card',
      name: t('tarot.spreads.threeCard'),
      description: t('tarot.spreads.threeCardDesc'),
      icon: Star,
      cards: 3
    },
    {
      id: 'celtic-cross',
      name: t('tarot.spreads.celticCross'),
      description: t('tarot.spreads.celticCrossDesc'),
      icon: Sparkles,
      cards: 10
    },
    {
      id: 'love',
      name: t('tarot.spreads.love'),
      description: t('tarot.spreads.loveDesc'),
      icon: Moon,
      cards: 5
    },
    {
      id: 'career',
      name: t('tarot.spreads.career'),
      description: t('tarot.spreads.careerDesc'),
      icon: Sun,
      cards: 4
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-mystic pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-playfair text-foreground mb-4 animate-fade-in">
              {t('tarot.title')}
            </h1>
            <p className="text-muted-foreground animate-fade-in">
              {t('tarot.subtitle')}
            </p>
          </div>

          {/* Mobile Selector */}
          <div className="block sm:hidden mb-6">
            <Select value={currentSpread} onValueChange={(value) => setCurrentSpread(value as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('tarot.chooseReadingType')} />
              </SelectTrigger>
              <SelectContent>
                {spreadTypes.map((spread) => (
                  <SelectItem key={`mobile-${spread.id}`} value={spread.id}>
                    <div className="flex items-center gap-2">
                      <spread.icon className="w-4 h-4" />
                      <span>{spread.name} ({spread.cards} {t('tarot.cards')})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {spreadTypes.map((spread) => (
              <button
                key={`desktop-${spread.id}`}
                onClick={() => setCurrentSpread(spread.id as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  currentSpread === spread.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted bg-background hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <spread.icon className="w-6 h-6" />
                  <span className="font-medium">{spread.name}</span>
                  <span className="text-xs text-muted-foreground">{spread.cards} {t('tarot.cards')}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Spread Info */}
          {(() => {
            const selectedSpread = spreadTypes.find(s => s.id === currentSpread);
            if (!selectedSpread) return null;
            
            return (
              <Card className="mystic-border cosmic-glow mb-6">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl font-playfair">
                    <selectedSpread.icon className="w-6 h-6 text-primary" />
                    {selectedSpread.name}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {selectedSpread.description}
                  </p>
                   <Badge variant="outline" className="mx-auto">
                    {selectedSpread.cards} {t('tarot.cards')}
                  </Badge>
                </CardHeader>
              </Card>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card className="mystic-border cosmic-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {t('tarot.chooseYourCards')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TarotDeck
                    onCardSelection={handleCardSelection}
                    maxCards={spreadTypes.find(s => s.id === currentSpread)?.cards || 3}
                    disabled={isReading}
                  />
                  
                  {selectedCards.length > 0 && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => setIsReading(true)}
                        disabled={selectedCards.length !== spreadTypes.find(s => s.id === currentSpread)?.cards}
                        className="w-full"
                        variant="cosmic"
                      >
                        {t('tarot.startReading')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              {selectedCards.length > 0 && (
                <Card className="mystic-border cosmic-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-primary" />
                      {t('tarot.yourReading')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TarotSpread
                      cards={selectedCards}
                      spreadType={currentSpread}
                      isReading={isReading}
                      userProfile={profile}
                      onInterpretation={setInterpretation}
                      onSaveReading={handleSaveReading}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {readings.length > 0 && (
            <div className="mt-8">
              <Card className="mystic-border cosmic-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    {t('tarot.readingHistory')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TarotHistory 
                    readings={readings} 
                    onDeleteReading={deleteReading}
                    isLoading={isLoading} 
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {selectedCards.length > 0 && (
            <div className="fixed bottom-24 right-4">
              <Button
                onClick={handleNewReading}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm"
              >
                {t('tarot.newReading')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Tarot;