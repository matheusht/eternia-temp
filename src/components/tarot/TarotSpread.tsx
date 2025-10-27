import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TarotCard, getCardInterpretation } from "@/utils/tarotCards";
import { Eye, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

interface TarotSpreadProps {
  cards: TarotCard[];
  spreadType: "three-card" | "celtic-cross" | "love" | "career";
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

export const TarotSpreadComponent: React.FC<TarotSpreadProps> = ({
  cards,
  spreadType,
  isReading,
  userProfile,
  onInterpretation,
  onSaveReading,
}) => {
  const { toast } = useToast();
  const { t, language } = useTranslation();
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [interpretation, setInterpretation] = useState<string>("");
  const [isGeneratingInterpretation, setIsGeneratingInterpretation] =
    useState(false);

  // Create spread layouts with translations - memoized to prevent re-renders
  const spreadLayouts = useMemo(
    (): Record<string, SpreadPosition[]> => ({
      "three-card": [
        {
          name: t("tarotSpread.positions.threeCard.past"),
          description: t("tarotSpread.positions.threeCard.pastDesc"),
          x: 0,
          y: 0,
        },
        {
          name: t("tarotSpread.positions.threeCard.present"),
          description: t("tarotSpread.positions.threeCard.presentDesc"),
          x: 1,
          y: 0,
        },
        {
          name: t("tarotSpread.positions.threeCard.future"),
          description: t("tarotSpread.positions.threeCard.futureDesc"),
          x: 2,
          y: 0,
        },
      ],
      "celtic-cross": [
        {
          name: t("tarotSpread.positions.celticCross.present"),
          description: t("tarotSpread.positions.celticCross.presentDesc"),
          x: 1,
          y: 1,
        },
        {
          name: t("tarotSpread.positions.celticCross.challenge"),
          description: t("tarotSpread.positions.celticCross.challengeDesc"),
          x: 1,
          y: 1,
          rotation: 90,
        },
        {
          name: t("tarotSpread.positions.celticCross.distantPast"),
          description: t("tarotSpread.positions.celticCross.distantPastDesc"),
          x: 0,
          y: 1,
        },
        {
          name: t("tarotSpread.positions.celticCross.recentPast"),
          description: t("tarotSpread.positions.celticCross.recentPastDesc"),
          x: 1,
          y: 0,
        },
        {
          name: t("tarotSpread.positions.celticCross.possibleOutcome"),
          description: t(
            "tarotSpread.positions.celticCross.possibleOutcomeDesc"
          ),
          x: 1,
          y: 2,
        },
        {
          name: t("tarotSpread.positions.celticCross.nearFuture"),
          description: t("tarotSpread.positions.celticCross.nearFutureDesc"),
          x: 2,
          y: 1,
        },
        {
          name: t("tarotSpread.positions.celticCross.yourApproach"),
          description: t("tarotSpread.positions.celticCross.yourApproachDesc"),
          x: 3,
          y: 3,
        },
        {
          name: t("tarotSpread.positions.celticCross.externalInfluences"),
          description: t(
            "tarotSpread.positions.celticCross.externalInfluencesDesc"
          ),
          x: 3,
          y: 2,
        },
        {
          name: t("tarotSpread.positions.celticCross.hopesAndFears"),
          description: t("tarotSpread.positions.celticCross.hopesAndFearsDesc"),
          x: 3,
          y: 1,
        },
        {
          name: t("tarotSpread.positions.celticCross.finalOutcome"),
          description: t("tarotSpread.positions.celticCross.finalOutcomeDesc"),
          x: 3,
          y: 0,
        },
      ],
      love: [
        {
          name: t("tarotSpread.positions.love.you"),
          description: t("tarotSpread.positions.love.youDesc"),
          x: 0,
          y: 0,
        },
        {
          name: t("tarotSpread.positions.love.partner"),
          description: t("tarotSpread.positions.love.partnerDesc"),
          x: 2,
          y: 0,
        },
        {
          name: t("tarotSpread.positions.love.relationship"),
          description: t("tarotSpread.positions.love.relationshipDesc"),
          x: 1,
          y: 0,
        },
        {
          name: t("tarotSpread.positions.love.obstacles"),
          description: t("tarotSpread.positions.love.obstaclesDesc"),
          x: 1,
          y: -1,
        },
        {
          name: t("tarotSpread.positions.love.potential"),
          description: t("tarotSpread.positions.love.potentialDesc"),
          x: 1,
          y: 1,
        },
      ],
      career: [
        {
          name: t("tarotSpread.positions.career.currentSituation"),
          description: t("tarotSpread.positions.career.currentSituationDesc"),
          x: 0,
          y: 0,
        },
        {
          name: t("tarotSpread.positions.career.opportunities"),
          description: t("tarotSpread.positions.career.opportunitiesDesc"),
          x: 1,
          y: -1,
        },
        {
          name: t("tarotSpread.positions.career.obstacles"),
          description: t("tarotSpread.positions.career.obstaclesDesc"),
          x: 1,
          y: 1,
        },
        {
          name: t("tarotSpread.positions.career.outcome"),
          description: t("tarotSpread.positions.career.outcomeDesc"),
          x: 2,
          y: 0,
        },
      ],
    }),
    [t]
  );

  const positions = spreadLayouts[spreadType] || [];

  useEffect(() => {
    if (isReading && cards.length > 0) {
      setRevealedCards([]);
      setInterpretation("");
    }
  }, [isReading, cards]);

  const revealCard = (index: number) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards((prev) => [...prev, index]);
    }
  };

  const generateInterpretation = async () => {
    setIsGeneratingInterpretation(true);

    // Simula geração de interpretação personalizada
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let fullInterpretation = `## ${t(
      "tarotSpread.tarotReading"
    )} - ${getSpreadName(spreadType)}\n\n`;

    cards.forEach((card, index) => {
      const position = positions[index];
      if (position) {
        const cardInterpretation = getCardInterpretation(
          card,
          position.name,
          userProfile,
          language
        );
        fullInterpretation += `${cardInterpretation}\n\n---\n\n`;
      }
    });

    const generalInsightKey = getGeneralInsight(cards, userProfile);
    fullInterpretation += `## ${t("tarotSpread.generalOverview")}\n\n${t(
      "tarotSpread.insights.overviewText",
      { insight: t(generalInsightKey) }
    )}`;

    setInterpretation(fullInterpretation);
    onInterpretation(fullInterpretation);
    setIsGeneratingInterpretation(false);
  };

  const saveReading = () => {
    if (interpretation) {
      onSaveReading(cards, interpretation);
      toast({
        title: t("tarotSpread.readingSaved"),
        description: t("tarotSpread.readingSavedDesc"),
      });
    }
  };

  const getSpreadName = (type: string) => {
    const names = {
      "three-card": t("tarot.history.spreadNames.threeCard"),
      "celtic-cross": t("tarot.history.spreadNames.celticCross"),
      love: t("tarot.history.spreadNames.love"),
      career: t("tarot.history.spreadNames.career"),
    };
    return names[type as keyof typeof names] || type;
  };

  const getGeneralInsight = (cards: TarotCard[], profile: any) => {
    const majorCards = cards.filter((card) => card.suit === "major").length;
    const reversedCards = cards.filter((card) => card.isReversed).length;

    if (majorCards > cards.length / 2) {
      return "tarotSpread.insights.greatTransformation";
    } else if (reversedCards > cards.length / 2) {
      return "tarotSpread.insights.innerReflection";
    } else {
      return "tarotSpread.insights.gradualGrowth";
    }
  };

  return (
    <div className="space-y-6">
      {/* Layout das cartas */}
      <div className="min-h-[300px]">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {spreadType === "three-card" && (
            <div className="flex gap-4 justify-center px-4">
              {cards.map((card, index) => {
                const position = positions[index];
                if (!position) return null;
                const isRevealed = revealedCards.includes(index);

                return (
                  <div
                    key={`three-card-mobile-${index}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-28 h-40 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        isRevealed
                          ? "border-primary bg-gradient-to-br from-purple-900 to-indigo-900"
                          : "border-muted bg-muted hover:border-primary/50"
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
                                {t("tarotSpread.reversed")}
                              </Badge>
                            )}
                            <RotateCcw
                              className={`w-4 h-4 text-muted-foreground ${
                                card.isReversed ? "rotate-180" : ""
                              }`}
                            />
                          </>
                        ) : (
                          <>
                            <Eye className="w-6 h-6 text-muted-foreground mb-2" />
                            <div className="text-xs text-muted-foreground">
                              {t("tarotSpread.tapToReveal")}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-center mt-2 max-w-28">
                      <div className="font-medium">{position.name}</div>
                      <div className="text-muted-foreground">
                        {position.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {spreadType === "love" && (
            <div className="relative w-full max-w-xs mx-auto px-4">
              <div className="grid grid-cols-3 grid-rows-3 gap-3 h-80">
                {cards.map((card, index) => {
                  const position = positions[index];
                  if (!position) return null;
                  const isRevealed = revealedCards.includes(index);

                  let gridPosition = "";
                  if (index === 0) gridPosition = "col-start-1 row-start-2";
                  else if (index === 1)
                    gridPosition = "col-start-3 row-start-2";
                  else if (index === 2)
                    gridPosition = "col-start-2 row-start-2";
                  else if (index === 3)
                    gridPosition = "col-start-2 row-start-1";
                  else if (index === 4)
                    gridPosition = "col-start-2 row-start-3";

                  return (
                    <div
                      key={`love-mobile-${index}`}
                      className={`flex flex-col items-center ${gridPosition}`}
                    >
                      <div
                        className={`w-20 h-28 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          isRevealed
                            ? "border-primary bg-gradient-to-br from-purple-900 to-indigo-900"
                            : "border-muted bg-muted hover:border-primary/50"
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
                                <Badge
                                  variant="outline"
                                  className="text-xs mb-1"
                                >
                                  {t("tarotSpread.reversedShort")}
                                </Badge>
                              )}
                              <RotateCcw
                                className={`w-3 h-3 text-muted-foreground ${
                                  card.isReversed ? "rotate-180" : ""
                                }`}
                              />
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-muted-foreground mb-1" />
                              <div className="text-xs text-muted-foreground">
                                {t("tarotSpread.tap")}
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

          {spreadType === "career" && (
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto px-4">
              {cards.map((card, index) => {
                const position = positions[index];
                if (!position) return null;
                const isRevealed = revealedCards.includes(index);

                return (
                  <div
                    key={`career-mobile-${index}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-24 h-36 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        isRevealed
                          ? "border-primary bg-gradient-to-br from-purple-900 to-indigo-900"
                          : "border-muted bg-muted hover:border-primary/50"
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
                                {t("tarotSpread.reversedShort")}
                              </Badge>
                            )}
                            <RotateCcw
                              className={`w-3 h-3 text-muted-foreground ${
                                card.isReversed ? "rotate-180" : ""
                              }`}
                            />
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 text-muted-foreground mb-1" />
                            <div className="text-xs text-muted-foreground">
                              {t("tarotSpread.tap")}
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

          {spreadType === "celtic-cross" && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-3 min-w-max px-4">
                {cards.map((card, index) => {
                  const position = positions[index];
                  if (!position) return null;
                  const isRevealed = revealedCards.includes(index);

                  return (
                    <div
                      key={`celtic-mobile-${index}`}
                      className="flex flex-col items-center flex-shrink-0"
                    >
                      <div
                        className={`w-20 h-32 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          isRevealed
                            ? "border-primary bg-gradient-to-br from-purple-900 to-indigo-900"
                            : "border-muted bg-muted hover:border-primary/50"
                        }`}
                        onClick={() => revealCard(index)}
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                          {isRevealed ? (
                            <>
                              <div className="text-xs font-medium text-primary mb-1 leading-tight">
                                {card.name.length > 12
                                  ? card.name.substring(0, 10) + "..."
                                  : card.name}
                              </div>
                              {card.isReversed && (
                                <Badge
                                  variant="outline"
                                  className="text-xs mb-1"
                                >
                                  {t("tarotSpread.reversedShort")}
                                </Badge>
                              )}
                              <RotateCcw
                                className={`w-3 h-3 text-muted-foreground ${
                                  card.isReversed ? "rotate-180" : ""
                                }`}
                              />
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-muted-foreground mb-1" />
                              <div className="text-xs text-muted-foreground">
                                {t("tarotSpread.tap")}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-center mt-2 max-w-20">
                        <div className="font-medium">
                          {position.name.length > 10
                            ? position.name.substring(0, 8) + "..."
                            : position.name}
                        </div>
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
            <div
              className="relative"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${
                  Math.max(...positions.map((p) => p.x)) + 1
                }, 100px)`,
                gridTemplateRows: `repeat(${
                  Math.max(...positions.map((p) => p.y)) + 1
                }, 140px)`,
                gap: "16px",
              }}
            >
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
                      gridRow: position.y + 1,
                    }}
                  >
                    <div
                      className={`w-24 h-36 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        isRevealed
                          ? "border-primary bg-gradient-to-br from-purple-900 to-indigo-900 hover:scale-105"
                          : "border-muted bg-muted hover:border-primary/50"
                      } ${
                        position.rotation && spreadType === "celtic-cross"
                          ? "rotate-90"
                          : ""
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
                              <Badge variant="outline" className="text-xs">
                                {t("tarotSpread.reversed")}
                              </Badge>
                            )}
                            <RotateCcw
                              className={`w-4 h-4 text-muted-foreground mt-1 ${
                                card.isReversed ? "rotate-180" : ""
                              }`}
                            />
                          </>
                        ) : (
                          <>
                            <Eye className="w-6 h-6 text-muted-foreground mb-1" />
                            <div className="text-xs text-muted-foreground">
                              {t("tarotSpread.clickToReveal")}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-center mt-2">
                      <div className="font-medium">{position.name}</div>
                      <div className="text-muted-foreground">
                        {position.description}
                      </div>
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
                  {t("tarotSpread.interpreting")}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  {t("tarotSpread.generateInterpretation")}
                </>
              )}
            </Button>

            {interpretation && (
              <Button onClick={saveReading} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {t("tarotSpread.saveReading")}
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
              {interpretation.split("\n").map((line, index) => {
                if (line.startsWith("##")) {
                  return (
                    <h2
                      key={index}
                      className="text-lg font-playfair text-primary mt-4 mb-2"
                    >
                      {line.replace("##", "").trim()}
                    </h2>
                  );
                } else if (line.startsWith("**") && line.endsWith("**")) {
                  return (
                    <h3
                      key={index}
                      className="text-base font-semibold mt-3 mb-1"
                    >
                      {line.replace(/\*\*/g, "")}
                    </h3>
                  );
                } else if (line === "---") {
                  return <Separator key={index} className="my-4" />;
                } else if (line.trim()) {
                  return (
                    <p
                      key={index}
                      className="text-sm text-muted-foreground mb-2"
                    >
                      {line}
                    </p>
                  );
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
