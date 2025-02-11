/*******************************************************************************
    INSTALL:
        1. TailwindCSS <https://tailwindcss.com/docs/installation>
        2. RUN: $ npm install lodash @types/lodash motion react-hotkeys-hook

    HOW TO USE IT:

    1. Import { SlideProps, Slide, EventType, usePresentationContext, Presentation } in your desired jsx/tsx file;
    2. Create a JSX/TSX function that returns <Presentation />:
            export default function Page() {
                return (
                    <Presentation keyTimeout={100}>
                        <FirstSlide />
                        <SecondSlide />
                        <ThirdSlide />
                    </Presentation>
                );
            }
    3. the keyTimeout prop is obligatory, it sets in miliseconds the debounce of 
       the keymaps.
    4. Create all the slides you want, you can split them into functions or make
       everything inside a single function
            function FirstSlide(): ReactElement<SlideProps> {
                return (
                    <Slide id="first-slide">
                        <div>
                            <h1>Header 1</h1>
                        </div>
                    </Slide>
                );
            }
    5. The id in the slide is obligatory, for the internal state of the presentation.
    6. How to make events, here is an function slide example that contains multiple events
       There will be comments inside the function explaining things:

            function SecondSlide(): ReactElement<SlideProps> {
                // We need to get the functions and data from the presentationContext.
                const { registerSlide, updateSlideEvents, slides, eventAnimate } = usePresentationContext();
                // This is the the slideID, it will be used to register the events
                const slideID = 'second-slide';

                // This is a boolean to just register events once.
                const isRegistered = useRef(false);

                // This hook is to register events before rendering
                useEffect(() => {
                    if (!isRegistered.current) {
                        const events: EventType[] = [
                            { eventID: 'event-1', hasPlayedForward: false },
                            { eventID: 'event-2', hasPlayedForward: false },
                            { eventID: 'event-3', hasPlayedForward: false },
                        ];
                        registerSlide(slideID, events);
                        updateSlideEvents(slideID, events);
                        isRegistered.current = true;
                    }
                }, [registerSlide, updateSlideEvents, slideID]);

                return (
                    <Slide id={slideID}>
                        <div>
                            <motion.div
                                style={{ width: '100px', height: '100px' }}
                                // The initial state
                                initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                    background: "#FF0000",
                                    rotate: "0deg",
                                    borderRadius: "0%",
                                    x: "2rem",
                                    y: "2rem",
                                }}
                                animate={{
                                    // The eventAnimate function takes the slideID, 
                                    // the eventID, a initial value, a final value 
                                    // and the presentation slides.
                                    // It just returns the correct value for the moment.

                                    // These two will play first
                                    opacity: eventAnimate(slideID, 'event-1', 0, 1, slides),
                                    scale: eventAnimate(slideID, 'event-1', 0.5, 1, slides),

                                    // Then these two next
                                    background: eventAnimate(slideID, 'event-2', "#FF0000", "#0000FF", slides),
                                    rotate: eventAnimate(slideID, 'event-2', "0deg", "45deg", slides),
                                    
                                    // Then these three at the end.
                                    borderRadius: eventAnimate(slideID, 'event-3', "0%", "100%", slides),
                                    x: eventAnimate(slideID, 'event-3', "2rem", "4rem", slides),
                                    y: eventAnimate(slideID, 'event-3', "2rem", "4rem", slides),
                                }}
                                transition={{
                                    duration: 0.5,
                                    type: "spring", 
                                    bounce: 0.25
                                }}
                            />
                        </div>
                    </Slide>
                );
            }
    Thats it, now you have a presentation, here are the default keymaps:
        <ARROW-UP> - goes to previous slide
        <ARROW-DOWN> - goes to next slide
        <SHIFT-SPACE> - goes to previous slide
        <SPACE> - goes to next slide
        <F> - toggles fullscreen

*******************************************************************************/

"use client";
import {
    ReactElement,
    ReactNode,
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
    createContext,
    useContext,
    useRef,
} from "react";

import { useHotkeys } from 'react-hotkeys-hook';
import { motion, useScroll } from "motion/react";
import { debounce } from "lodash";

type EventType = {
    eventID: string;
    hasPlayedForward: boolean;
}

type SlideType = {
    currentEventID: string;
    currentEventIndex: number;
    slideID: string;
    events: EventType[];
}

type PresentationContextType = {
    slides: {
        totalCount: number;
        currentSlideIndex: number;
        currentSlideID: string;
        slides: SlideType[];
    };
    registerSlide: (slideID: string, events?: EventType[]) => void;
    updateSlideEvents: (slideID: string, events: EventType[]) => void;
    setPresentationContext: Dispatch<SetStateAction<PresentationContextType>>;
    eventAnimate: (slideID: string, eventID: string, startValue: any, endValue: any, slides: { totalCount: number; currentSlideIndex: number; currentSlideID: string; slides: SlideType[]; }) => any;
};

// Create a context with an empty placeholder
const PresentationContext = createContext<PresentationContextType | null>(null);

const usePresentationContext = () => {
    const context = useContext(PresentationContext);
    if (!context) throw new Error("usePresentationContext must be used within a PresentationProvider");
    return context;
};


// PresentationProps definition
interface PresentationProps {
    children?: ReactElement<SlideProps> | ReactElement<SlideProps>[];
    keyTimeout: number;
}

function Presentation(props: PresentationProps): ReactElement<PresentationProps> {
    const presentationContainerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ container: presentationContainerRef });
    const [presentationContext, setPresentationContext] = useState<PresentationContextType>({
        slides: {
            totalCount: 0,
            currentSlideIndex: 0,
            currentSlideID: '',
            slides: [],
        },
        registerSlide: () => { },
        updateSlideEvents: () => { },
        setPresentationContext: () => { },
        eventAnimate: () => { },
    });

    const incrementCurrentSlide = () => {
        const currentSlideIndex = presentationContext?.slides?.currentSlideIndex ?? 0;
        const totalCount = presentationContext?.slides?.totalCount ?? 0;
        const slides = presentationContext?.slides?.slides ?? []; // Fallback to empty array if slides are undefined
    
        const currentSlide = slides[currentSlideIndex];
        const events = currentSlide?.events;
    
        if (events && currentSlide.currentEventIndex !== undefined && currentSlide.currentEventIndex < events.length) {
            // Check if the current slide has events and if there's a next event to increment
            const newEventIndex = Math.min(currentSlide.currentEventIndex + 1, events.length);
    
            setPresentationContext((prevContext) => ({
                ...prevContext,
                slides: {
                    ...prevContext.slides,
                    slides: prevContext.slides.slides.map((slide, index) =>
                        index === currentSlideIndex
                            ? {
                                ...slide,
                                currentEventIndex: newEventIndex,
                                currentEventID: events[newEventIndex]?.eventID,
                                events: slide.events?.map(
                                    (event, eventIndex) => eventIndex === newEventIndex ? { ...event, hasPlayedForward: true } : event
                                ),
                            }
                            : slide
                    ),
                },
            }));
        } else if (currentSlideIndex < totalCount - 1) {
            // Move to the next slide if there are no more events in the current slide
            const newSlideIndex = currentSlideIndex + 1;
    
            setPresentationContext((prevContext) => ({
                ...prevContext,
                slides: {
                    ...prevContext.slides,
                    currentSlideIndex: newSlideIndex,
                    currentSlideID: prevContext.slides.slides[newSlideIndex].slideID, // Update currentSlideID here
                },
            }));
        }
    }
    
    const decrementCurrentSlide = () => {
        const currentSlideIndex = presentationContext?.slides?.currentSlideIndex ?? 0;
        const slides = presentationContext?.slides?.slides ?? []; // Fallback to empty array if slides are undefined
        const currentSlide = slides[currentSlideIndex];
        const events = currentSlide?.events;
    
        if (events && currentSlide.currentEventIndex !== undefined && currentSlide.currentEventIndex > -1 && currentSlide.events.length > 0) {
            // Check if the current slide has events and if there's a previous event to decrement
            const newEventIndex = currentSlide.currentEventIndex - 1;
    
            setPresentationContext((prevContext) => ({
                ...prevContext,
                slides: {
                    ...prevContext.slides,
                    slides: prevContext.slides.slides.map((slide, index) =>
                        index === currentSlideIndex
                            ? {
                                ...slide,
                                currentEventIndex: newEventIndex,
                                currentEventID: (newEventIndex < 0) ? "" : events[newEventIndex]?.eventID, // Ensure safe access for eventID
                                events: slide.events?.map(
                                    (event, eventIndex) => eventIndex === newEventIndex ? { ...event, hasPlayedForward: false } : event
                                ),
                            }
                            : slide
                    ),
                },
            }));
        } else if (currentSlideIndex > 0) {
            // Move to the previous slide if there are no more previous events in the current slide
            const newSlideIndex = currentSlideIndex - 1;
    
            setPresentationContext((prevContext) => ({
                ...prevContext,
                slides: {
                    ...prevContext.slides,
                    currentSlideIndex: newSlideIndex,
                    currentSlideID: prevContext.slides.slides[newSlideIndex].slideID, // Update currentSlideID here
                },
            }));
        }
    }

    const scrollDown = () => {
        const presentationElement = presentationContainerRef.current;
        const currentSlideIndex = presentationContext.slides.currentSlideIndex;
        const slides = presentationContext.slides.slides;
        const currentSlide = slides[currentSlideIndex];
        const events = currentSlide.events;
        if (events && currentSlide.currentEventIndex < events.length) {
            incrementCurrentSlide();
        } else if (currentSlideIndex < presentationContext.slides.totalCount - 1) {
            presentationElement?.scrollBy({
                top: window.innerHeight,
                left: 0,
                behavior: "smooth",
            });
            incrementCurrentSlide();
        }
    }
    
    const scrollUp = () => {
        const presentationElement = presentationContainerRef.current;
        const currentSlideIndex = presentationContext.slides.currentSlideIndex;
        const slides = presentationContext.slides.slides;
        const currentSlide = slides[currentSlideIndex];
        const events = currentSlide.events;
    
        if (events && currentSlide.currentEventIndex > -1) {
            decrementCurrentSlide();
        } else if (currentSlideIndex > 0) {
    
            presentationElement?.scrollBy({
                top: -window.innerHeight,
                left: 0,
                behavior: "smooth",
            });
    
            decrementCurrentSlide();
        }
    }



    // Function to register a slide
    const registerSlide = (slideID: string, events: EventType[] = []) => {
        setPresentationContext((prev) => {
            const existingSlide = prev.slides.slides.find((slide) => slide.slideID === slideID);
            if (existingSlide) return prev; // Avoid duplicate registration

            const newSlide: SlideType = {
                slideID,
                currentEventID: events[0]?.eventID || '',
                currentEventIndex: -1,
                events,
            };

            return {
                ...prev,
                slides: {
                    ...prev.slides,
                    totalCount: prev.slides.totalCount + 1,
                    slides: [...prev.slides.slides, newSlide],
                },
            };
        });
    };

    // Function to update slide events
    const updateSlideEvents = (slideID: string, events: EventType[]) => {
        setPresentationContext((prev) => ({
            ...prev,
            slides: {
                ...prev.slides,
                slides: prev.slides.slides.map((slide) =>
                    slide.slideID === slideID
                        ? { ...slide, events, currentEventID: events[0]?.eventID || '', currentEventIndex: -1 }
                        : slide
                ),
            },
        }));
    };

    const eventAnimate = (slideID: string, eventID: string, startValue: any, endValue: any, slides: { totalCount: number; currentSlideIndex: number; currentSlideID: string; slides: SlideType[]; }): any => {
        const currentSlide = slides.slides.find(slide => slide.slideID === slideID);
        const currentEvent = currentSlide?.events?.find(event => event.eventID === eventID);
        const currentEventIndexInSlide = currentSlide?.currentEventIndex ?? -1;
        const currentEventIndex = currentSlide?.events?.findIndex(event => event.eventID === eventID);
    
        return currentEvent?.hasPlayedForward ? endValue : (currentEventIndexInSlide === currentEventIndex ? endValue : startValue)
    }
    

    const toggleFullscreen = () => {
        const doc = document as any;
        if (!document.fullscreenElement) {
          // Enter fullscreen mode
          if (doc.documentElement.requestFullscreen) {
            doc.documentElement.requestFullscreen();
          } else if (doc.documentElement.webkitRequestFullscreen) {
            // Safari support
            doc.documentElement.webkitRequestFullscreen();
          } else if (doc.documentElement.mozRequestFullScreen) {
            // Firefox support
            doc.documentElement.mozRequestFullScreen();
          } else if (doc.documentElement.msRequestFullscreen) {
            // IE/Edge support
            doc.documentElement.msRequestFullscreen();
          }
        } else {
          // Exit fullscreen mode
          if (doc.exitFullscreen) {
            doc.exitFullscreen();
          } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
          } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
          } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
          }
        }
      };

    useEffect(() => {
        // Event listener functions (keeping these unchanged)
        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
        };

        const handleTouchStart = (event: TouchEvent) => {
            event.preventDefault();
        };

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault();
        };

        const handleKeyDown = (event: any) => {
            const keysToBlock = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "f", "F"];
            if (keysToBlock.includes(event.key)) {
                event.preventDefault();
            }
        };

        // Add event listeners on mount
        document.addEventListener("wheel", handleWheel, { passive: false });
        document.addEventListener("touchstart", handleTouchStart, { passive: false });
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener("wheel", handleWheel);
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.children]);

    const scrllDwn = debounce(() => scrollDown(), props.keyTimeout);
    const scrllUp = debounce(() => scrollUp(), props.keyTimeout);

    useHotkeys('space', scrllDwn);
    useHotkeys('shift+space', scrllUp);
    useHotkeys('arrowup', scrllUp);
    useHotkeys('arrowdown', scrllDwn);

    useHotkeys('f', () => toggleFullscreen());
    useHotkeys('F', () => toggleFullscreen());

    return (
        <PresentationContext.Provider
            value={{
                ...presentationContext,
                registerSlide,
                updateSlideEvents,
                setPresentationContext,
                eventAnimate,
            }}
        >
            <motion.div
                id="presentation-scroll-indicator"
                style={{
                    scaleX: scrollYProgress,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    originX: 0,
                    zIndex: 9999,
                }}
                className='h-2'
            />
            <div style={{ zIndex: 9990 }} className="h-fit w-fit fixed bottom-0 right-0 mr-8 mb-8">
                <div className="flex flex-col w-fit h-fit">
                <button className="presentation-touch-control w-16 mb-2 opacity-65 hover:opacity-100 transition-all" onClick={scrllUp}>
                    <svg id="up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                </button>
                <button className="presentation-touch-control w-16 mt-2 opacity-65 hover:opacity-100 transition-all" onClick={scrllDwn}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                </div>
            </div>
            <main ref={presentationContainerRef} id="presentation-container" className="scrollbar-none fixed top-0 left-0 w-screen h-screen overflow-x-hidden overflow-y-auto">
                {props?.children}
            </main>
        </PresentationContext.Provider>
    );
}

interface SlideProps {
    children?: ReactNode;
    id: string;
}

function Slide({ children, id }: SlideProps): ReactElement<SlideProps> {
    const { registerSlide, setPresentationContext } = usePresentationContext();

    // Track whether this slide is already registered
    const isRegistered = useRef(false);

    useEffect(() => {
        if (!isRegistered.current) {
            registerSlide(id);
            isRegistered.current = true; // Mark as registered
            setPresentationContext((prevContext) => ({
                ...prevContext,
                slides: {
                    ...prevContext.slides,
                    currentSlideIndex: prevContext.slides.currentSlideIndex,
                    currentSlideID: prevContext.slides.slides[prevContext.slides.currentSlideIndex].slideID, // Update currentSlideID here
                },
            }));
        }
    }, [registerSlide, id, setPresentationContext]);

    return (
        <section className="w-full h-screen pt-2">
            {children}
        </section>
    );
}

export { usePresentationContext, Presentation, Slide };
export type { EventType, SlideType, PresentationContextType, SlideProps, PresentationProps };
