import { useEffect, useRef } from 'react';
import { useResumeLayout } from './useResumeLayout';
import type { Position } from '@lib';

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
  const { containerRef, engine, isReady, pageCount, remainingSpace } = useResumeLayout({
    page: {
      height: 1123, // A4 at 96 DPI
      marginTop: 20,
      marginBottom: 20,
      header: { height: 50 },
      footer: { height: 30 }
    },
    template: {
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: 1.5,
        spaces: {
          work: {
            marginTop: 10,
            marginBottom: 0,
            intro: { marginTop: 5 },
            statements: {
              list: { marginTop: 5 },
              item: { marginTop: 3 }
            }
          }
        }
      }
    },
    events: {
      onPageCreated: (pageIndex) => {
        console.log(`Page ${pageIndex + 1} created`);
      },
      onContentPlaced: (result) => {
        console.log('Content placed:', result);
      },
      onOverflow: (contentType, required, available) => {
        console.warn(`Overflow: ${contentType} needs ${required}px, only ${available}px available`);
      }
    }
  });

  // Track previous experiences to detect changes
  const prevExperiencesRef = useRef<Position[]>([]);

  // Add/update experiences when they change
  useEffect(() => {
    if (!engine || !isReady) return;

    // Check if experiences have changed
    const experiencesChanged = 
      JSON.stringify(prevExperiencesRef.current) !== JSON.stringify(experiences);

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
    <div className="resume-preview">
      <div className="resume-stats">
        <div className="stat">
          <span className="stat-label">Pages:</span>
          <span className="stat-value">{pageCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining Space:</span>
          <span className={`stat-value ${getRemainingSpaceClass(remainingSpace)}`}>
            {remainingSpace}px
          </span>
        </div>
      </div>
      
      <div ref={containerRef} className="resume-container" />
    </div>
  );
}

function getRemainingSpaceClass(space: number): string {
  if (space < 100) return 'low';
  if (space < 300) return 'medium';
  return 'high';
}

