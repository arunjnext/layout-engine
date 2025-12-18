import { useEffect, useRef, useState, useCallback } from 'react';
import { ResumeLayoutEngine, type LayoutEngineConfig, type Position, type Education, type Skill } from '../../lib';

/**
 * Custom React hook for Resume Layout Engine
 * 
 * @example
 * ```tsx
 * function ResumePreview({ resumeData }) {
 *   const { containerRef, engine, pageCount, remainingSpace } = useResumeLayout({
 *     template: {
 *       style: {
 *         fontFamily: 'Arial, sans-serif',
 *         fontSize: '12px'
 *       }
 *     }
 *   });
 * 
 *   useEffect(() => {
 *     if (!engine) return;
 *     
 *     (async () => {
 *       for (const exp of resumeData.experience) {
 *         await engine.addExperience(exp);
 *       }
 *     })();
 *   }, [engine, resumeData]);
 * 
 *   return (
 *     <div>
 *       <div>Pages: {pageCount} | Remaining: {remainingSpace}px</div>
 *       <div ref={containerRef} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useResumeLayout(config: Omit<LayoutEngineConfig, 'container'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ResumeLayoutEngine | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [remainingSpace, setRemainingSpace] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create engine
    const engine = new ResumeLayoutEngine({
      ...config,
      container: containerRef.current,
      events: {
        ...config.events,
        onPageCreated: (pageIndex, pageElement) => {
          setPageCount(engine.getPageCount());
          config.events?.onPageCreated?.(pageIndex, pageElement);
        },
        onContentPlaced: (result) => {
          setRemainingSpace(result.remainingSpace);
          setPageCount(result.pageCount || 0);
          config.events?.onContentPlaced?.(result);
        },
        onOverflow: (contentType, required, available) => {
          config.events?.onOverflow?.(contentType, required, available);
        },
        onError: (error) => {
          config.events?.onError?.(error);
        }
      }
    });

    engineRef.current = engine;
    setIsReady(true);
    setPageCount(engine.getPageCount());
    setRemainingSpace(engine.getRemainingSpace());

    // Cleanup on unmount
    return () => {
      engine.destroy();
      engineRef.current = null;
      setIsReady(false);
    };
  }, []); // Empty deps - only create once

  // Helper methods
  const addExperience = useCallback(async (position: Position) => {
    if (!engineRef.current) return;
    return await engineRef.current.addExperience(position);
  }, []);

  const addEducation = useCallback(async (education: Education) => {
    if (!engineRef.current) return;
    return await engineRef.current.addEducation(education);
  }, []);

  const addSkills = useCallback(async (skills: Skill[]) => {
    if (!engineRef.current) return;
    return await engineRef.current.addSkills(skills);
  }, []);

  const reset = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.reset();
    setPageCount(engineRef.current.getPageCount());
    setRemainingSpace(engineRef.current.getRemainingSpace());
  }, []);

  return {
    containerRef,
    engine: engineRef.current,
    isReady,
    pageCount,
    remainingSpace,
    // Helper methods
    addExperience,
    addEducation,
    addSkills,
    reset
  };
}

