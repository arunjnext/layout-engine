import type { Position } from "@lib";
import { useEffect, useRef } from "react";
import { useResumeLayout } from "./useResumeLayout";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

interface ResumePreviewProps {
  experiences: Position[];
}

/**
 * React component for resume preview with automatic page splitting
 *
 * @example
 * ```tsx
 * function App() {
 *   const experiences = [
 *     {
 *       _id: 'work-1',
 *       title: 'Software Engineer',
 *       company: 'Tech Corp',
 *       description: ['Built APIs', 'Led team']
 *     }
 *   ];
 *
 *   return <ResumePreview experiences={experiences} />;
 * }
 * ```
 */
export function ResumePreview({ experiences }: ResumePreviewProps) {
  const { containerRef, engine, isReady, pageCount, remainingSpace } =
    useResumeLayout({
      page: {
        height: 1123, // A4 at 96 DPI
        marginTop: 20,
        marginBottom: 20,
        header: { height: 10 },
        footer: { height: 10 },
      },
      template: {
        style: {
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          lineHeight: 1.5,
          spaces: {
            work: {
              marginTop: 10,
              marginBottom: 0,
              intro: { marginTop: 5 },
              statements: {
                list: { marginTop: 5 },
                item: { marginTop: 3 },
              },
            },
          },
        },
      },
      events: {
        onPageCreated: (pageIndex) => {
          console.log(`Page ${pageIndex + 1} created`);
        },
        onContentPlaced: (result) => {
          console.log("Content placed:", result);
        },
        onOverflow: (contentType, required, available) => {
          console.warn(
            `Overflow: ${contentType} needs ${required}px, only ${available}px available`
          );
        },
      },
    });

  // Track previous experiences to detect changes
  const prevExperiencesRef = useRef<Position[]>([]);

  // Add/update experiences when they change
  useEffect(() => {
    if (!engine || !isReady) return;

    // Check if experiences have changed
    const experiencesChanged =
      JSON.stringify(prevExperiencesRef.current) !==
      JSON.stringify(experiences);

    if (experiencesChanged) {
      prevExperiencesRef.current = experiences;

      (async () => {
        // Reset first to clear any existing content
        engine.reset();

        // Add all experiences
        for (const experience of experiences) {
          await engine.addExperience(experience);
        }
      })();
    }
  }, [engine, isReady, experiences]);

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <Card className="bg-gray-900 text-white border-gray-800 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold opacity-90">Pages</p>
              <p className="text-3xl font-bold">{pageCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold opacity-90">Remaining Space</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{remainingSpace}px</p>
                <Badge 
                  variant={getRemainingSpaceBadgeVariant(remainingSpace)}
                  className={getRemainingSpaceBadgeClass(remainingSpace)}
                >
                  {getRemainingSpaceLabel(remainingSpace)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Container */}
      <Card className="shadow-lg overflow-hidden">
        <CardContent className="p-6 bg-linear-to-br from-gray-50 to-gray-100">
          <div 
            ref={containerRef} 
            className="resume-container max-w-[210mm] mx-auto"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function getRemainingSpaceLabel(space: number): string {
  if (space < 100) return "Low";
  if (space < 300) return "Medium";
  return "High";
}

function getRemainingSpaceBadgeVariant(space: number): "default" | "secondary" | "destructive" {
  if (space < 100) return "destructive";
  if (space < 300) return "secondary";
  return "default";
}

function getRemainingSpaceBadgeClass(space: number): string {
  if (space < 100) return "bg-red-500 hover:bg-red-600";
  if (space < 300) return "bg-yellow-500 hover:bg-yellow-600";
  return "bg-green-500 hover:bg-green-600";
}
