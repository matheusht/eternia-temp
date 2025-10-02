import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TarotCard, getRandomCards } from '@/utils/tarotCards';
import { Sparkles, RotateCcw } from 'lucide-react';

interface TarotDeckProps {
  onCardSelection: (cards: TarotCard[]) => void;
  maxCards: number;
  disabled?: boolean;
}

export const TarotDeck: React.FC<TarotDeckProps> = ({ onCardSelection, maxCards, disabled }) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [deckShuffled, setDeckShuffled] = useState(false);

  const shuffleDeck = async () => {
    setIsShuffling(true);
    setDeckShuffled(false);
    
    // Simulates shuffling with delay for visual effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const selectedCards = getRandomCards(maxCards);
    onCardSelection(selectedCards);
    
    setIsShuffling(false);
    setDeckShuffled(true);
  };

  const resetDeck = () => {
    setDeckShuffled(false);
    onCardSelection([]);
  };

  return (
    <div className="text-center space-y-6">
      {/* Visual deck of cards */}
      <div className="relative mx-auto w-48 h-32">
        {/* Stacked cards for visual effect */}
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg border-2 border-gold-400 shadow-lg transition-all duration-300 ${
              isShuffling ? 'animate-pulse' : ''
            }`}
            style={{
              transform: `translateX(${index * 2}px) translateY(${index * -2}px) rotate(${index * 2 - 4}deg)`,
              zIndex: 5 - index
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold-400 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {!deckShuffled 
            ? `Focus on your question and shuffle the cards to select ${maxCards} card${maxCards > 1 ? 's' : ''}`
            : `${maxCards} card${maxCards > 1 ? 's' : ''} selected for your reading`
          }
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        {!deckShuffled ? (
          <Button
            onClick={shuffleDeck}
            disabled={disabled || isShuffling}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isShuffling ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Shuffling...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Shuffle Cards
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={resetDeck}
            variant="outline"
            disabled={disabled}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Shuffle Again
          </Button>
        )}
      </div>

      {/* Mystical effect during shuffling */}
      {isShuffling && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};