import { ResumeLayoutEngine, type Education, type LayoutEngineConfig, type Position, type Skill } from 'resume-layout-engine';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [engine, setEngine] = useState<ResumeLayoutEngine | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [remainingSpace, setRemainingSpace] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Store config and callbacks in ref to avoid recreating engine on every render
  const configRef = useRef(config);
  
  // Update config ref in effect to avoid updating during render
  useEffect(() => {
    configRef.current = config;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Create engine with wrapped callbacks to avoid circular dependencies
    const newEngine = new ResumeLayoutEngine({
      ...configRef.current,
      container: containerRef.current,
      events: {
        ...configRef.current.events,
        onPageCreated: (pageIndex, pageElement) => {
          setPageCount(engineRef.current?.getPageCount() || 0);
          configRef.current.events?.onPageCreated?.(pageIndex, pageElement);
        },
        onContentPlaced: (result) => {
          setRemainingSpace(result.remainingSpace);
          setPageCount(result.pageCount || 0);
          configRef.current.events?.onContentPlaced?.(result);
        },
        onOverflow: (contentType, required, available) => {
          configRef.current.events?.onOverflow?.(contentType, required, available);
        },
        onError: (error) => {
          configRef.current.events?.onError?.(error);
        }
      }
    });

    engineRef.current = newEngine;
    setEngine(newEngine);
    setIsReady(true);
    setPageCount(newEngine.getPageCount());
    setRemainingSpace(newEngine.getRemainingSpace());

    // Cleanup on unmount
    return () => {
      newEngine.destroy();
      engineRef.current = null;
      setEngine(null);
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
    engine,
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

