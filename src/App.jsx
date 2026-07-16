import React, { useState, useEffect, useRef } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Drawer as VaulDrawer } from 'vaul';
import { Play, Pause, X, Mail, Send, Disc } from 'lucide-react';

const CardFlip = ReactCardFlip.default || ReactCardFlip;
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [webAnimated, setWebAnimated] = useState(false);
  const webRef = useRef(null);

  // React Card Flip state for projects
  const [flippedCards, setFlippedCards] = useState({});
  const toggleCardFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Autoplay horizontal scroll container state for Skills section
  const skillsContainerRef = useRef(null);
  const [isSkillsPaused, setIsSkillsPaused] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  // Remove global HTML preloader once React mounts and parses styles
  useEffect(() => {
    const preloader = document.getElementById('global-preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      const timer = setTimeout(() => {
        preloader.remove();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Periodic Autoplay scroll advance with wrap-around
  useEffect(() => {
    if (isSkillsPaused) return;
    const interval = setInterval(() => {
      if (skillsContainerRef.current) {
        const container = skillsContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const card = container.querySelector('.skill-card-wrapper');
          if (card) {
            container.scrollBy({ left: card.offsetWidth, behavior: 'smooth' });
          }
        }
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isSkillsPaused]);

  const handleSkillsScroll = () => {
    if (skillsContainerRef.current) {
      const container = skillsContainerRef.current;
      const card = container.querySelector('.skill-card-wrapper');
      if (card) {
        const cardWidth = card.offsetWidth;
        const index = Math.round(container.scrollLeft / cardWidth);
        setActiveDot(Math.min(Math.max(index, 0), 5));
      }
    }
  };

  const handlePrevSkill = () => {
    if (skillsContainerRef.current) {
      const container = skillsContainerRef.current;
      const card = container.querySelector('.skill-card-wrapper');
      if (card) {
        const cardWidth = card.offsetWidth;
        if (container.scrollLeft <= 5) {
          // Wrap to end
          const maxScroll = container.scrollWidth - container.clientWidth;
          container.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
      }
    }
  };

  const handleNextSkill = () => {
    if (skillsContainerRef.current) {
      const container = skillsContainerRef.current;
      const card = container.querySelector('.skill-card-wrapper');
      if (card) {
        const cardWidth = card.offsetWidth;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 10) {
          // Wrap to start
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }
  };

  const scrollToSkillsIndex = (idx) => {
    if (skillsContainerRef.current) {
      const container = skillsContainerRef.current;
      const card = container.querySelector('.skill-card-wrapper');
      if (card) {
        const cardWidth = card.offsetWidth;
        container.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      }
    }
  };


  // Active section scroll spy state
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', number: '01' },
    { id: 'about', label: 'About', number: '02' },
    { id: 'experience', label: 'Experience', number: '03' },
    { id: 'projects', label: 'Projects', number: '04' },
    { id: 'ai-lab', label: 'AI Lab', number: '05' },
    { id: 'beyond', label: 'Beyond Work', number: '06' },
    { id: 'connect', label: 'Connect', number: '07' }
  ];

  useEffect(() => {
    const sections = ['home', 'about', 'experience', 'projects', 'ai-lab', 'beyond', 'connect'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setWebAnimated(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setWebAnimated(true);
        } else {
          setWebAnimated(false);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px 50px 0px' });
    if (webRef.current) {
      observer.observe(webRef.current);
    }
    return () => observer.disconnect();
  }, []);
  // Retro iPod Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [bounceCenter, setBounceCenter] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  // Intersection Observer for scroll-reveal animations
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  // iPod audio controllers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    setBounceCenter(true);
    setTimeout(() => setBounceCenter(false), 150);
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setShowPulse(false);
      }).catch(err => {
        console.error("Audio playback blocked or failed:", err);
      });
    }
  };
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  // Close modal and reset state handler
  const handleCloseModal = () => {
    setContactModalOpen(false);
    setSubmissionStatus('idle');
  };
  // Submit Mission Form handler via background API
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    try {
      const response = await fetch("https://formsubmit.co/ajax/itsvarshajha14@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: formName,
          Email: formEmail,
          Message: formMessage,
          _subject: `New Portfolio Mission Briefing from ${formName}`
        })
      });
      if (response.ok) {
        setSubmissionStatus('success');
        setFormName('');
        setFormEmail('');
        setFormMessage('');
      } else {
        setSubmissionStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmissionStatus('error');
    }
  };
  return (
    <div className="font-sans antialiased text-foreground bg-background min-h-screen relative">
      {/* 2. Hanging iPod Music Player Widget */}
      <div 
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center cursor-pointer pointer-events-auto md:bottom-8 md:right-8"
      >
        {/* Short Web Strand Line */}
        <div className="w-[1.5px] h-16 bg-foreground/30 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rotate-45"></div>
        </div>
        {/* iPod Card - Classic Rounded Silhouette */}
        <div className="w-40 h-[250px] bg-[#1c1213] border-[6.5px] border-white rounded-[24px] shadow-[8px_8px_0px_#000] p-3 flex flex-col select-none relative overflow-hidden transition-all duration-300 mt-2 hover:shadow-[8px_8px_0px_#ee304a] z-10">
          {/* In-world halftone background pattern at bottom of the body */}
          <div className="absolute bottom-0 inset-x-0 h-16 halftone opacity-[0.12] pointer-events-none rounded-b-[20px]"></div>
          {/* Screen Area (Digital OLED Grid) */}
          <div className="bg-[#0f0405] border-[3.5px] border-white p-2 rounded-xl flex flex-col justify-between h-[100px] relative shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] overflow-hidden">
            <span className="font-display text-[8px] uppercase tracking-widest text-primary font-bold">Now Playing</span>
            <div className="font-display text-[9px] uppercase tracking-wide text-foreground truncate px-0.5 select-none font-bold">
              {isPlaying ? "Post Malone - Sunflower" : "Tap to Play Theme"}
            </div>
            {/* Segmented/Dashed Progress Bar (Comic "impact line" style) */}
            <div className="flex gap-[3px] mt-1.5 h-2 items-center" onClick={(e) => e.stopPropagation()}>
              {Array.from({ length: 10 }).map((_, idx) => {
                const isActive = duration ? (currentTime / duration) * 10 >= idx + 0.5 : false;
                return (
                  <div 
                    key={idx}
                    className={`h-full flex-1 border border-white/20 transition-colors duration-150 ${isActive ? 'bg-[#ee304a]' : 'bg-[#3a2e2e]'}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[7px] font-mono text-muted-foreground mt-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            {/* Pulsing POP! Speech bubble */}
            {showPulse && (
              <div className="absolute -top-3 -right-2 rotate-[12deg] bg-primary border-2 border-black text-white font-display text-[8px] font-bold px-1.5 py-0.5 shadow-[2px_2px_0px_#000] z-20 animate-bounce">
                POP!
              </div>
            )}
          </div>
          {/* Click Wheel Area */}
          <div className="mt-3 flex flex-col items-center">
            <div className="size-20 rounded-full border-[6.5px] border-white bg-[#fbf8f1] relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.15)]">
              {/* Top Menu Button */}
              <button 
                onClick={togglePlay}
                className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-sans text-black/75 hover:text-primary transition-colors cursor-pointer select-none z-10 font-bold tracking-widest"
              >
                MENU
              </button>
              {/* Left Seek Button */}
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-sans text-black/45 select-none pointer-events-none font-bold">
                ◀◀
              </span>
              {/* Right Skip Button */}
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-sans text-black/45 select-none pointer-events-none font-bold">
                ▶▶
              </span>
              {/* Bottom Play/Pause Icon Button */}
              <button 
                onClick={togglePlay}
                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-sans text-black/75 hover:text-primary transition-colors cursor-pointer select-none z-10 font-bold"
              >
                ▶Ⅱ
              </button>
              {/* Center Play Button (Visual Center & Primary Tap Target - Solid classic iPod Select button) */}
              <button 
                onClick={togglePlay}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-9 rounded-full bg-gradient-to-br from-primary to-rose-600 border-2 border-white flex items-center justify-center text-white shadow-[0_2px_4px_rgba(238,48,74,0.3)] transition-all hover:brightness-110 active:scale-90 cursor-pointer z-10 ${bounceCenter ? 'animate-wheel-bounce' : ''}`}
                title="Play/Pause"
              >
                {/* Clean inner circle to mimic the select button indentation */}
                <div className="size-5 rounded-full border border-white/25 bg-white/10"></div>
              </button>
            </div>
          </div>
          <audio ref={audioRef} src="/theme-song.mp3" loop />
        </div>
      </div>
      {/* 3. Hanging Spider-Woman with Hover Swing */}
      <div className="absolute top-0 left-4 md:left-12 lg:left-20 z-30 hanging-spider pointer-events-auto w-[18vw] sm:w-[21vw] md:w-[24vw] max-w-[290px] min-w-[125px]">
        <img 
          src="/spider-woman-hanging.svg" 
          alt="Spider-Woman Hanging Upside Down" 
          className="w-full h-auto drop-shadow-[10px_10px_0px_rgba(0,0,0,0.35)]"
          draggable="false"
        />
      </div>
      {/* 4. Sticky-Note Style Comic Callouts */}
      <div className="hidden lg:block absolute top-[920px] left-[5%] z-30 font-display text-xs uppercase tracking-wide border-4 border-black p-3 bg-yellow-400 text-black shadow-[4px_4px_0px_#000] rotate-[-4deg] w-48 sticky-halftone-yellow">
        <p className="font-bold leading-tight">Just your friendly neighborhood PM!</p>
      </div>
      <div className="hidden xl:block absolute top-[2100px] right-[4%] z-30 font-display text-xs uppercase tracking-wide border-4 border-black p-3 bg-pink-500 text-black shadow-[4px_4px_0px_#000] rotate-[5deg] w-48 sticky-halftone-pink">
        <p className="font-bold leading-tight">Web-slinging through complex problems!</p>
      </div>
      <div className="hidden lg:block absolute top-[1550px] right-[6%] z-30 font-display text-xs uppercase tracking-wide border-4 border-black p-3 bg-yellow-400 text-black shadow-[4px_4px_0px_#000] rotate-[-2deg] w-44 sticky-halftone-yellow">
        <p className="font-bold leading-tight">With great data comes...</p>
      </div>
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
   <nav aria-label="Primary" className="flex items-stretch">
    <a aria-label="Varsha — home" className="flex shrink-0 items-center justify-center border-r-2 border-primary bg-card px-3" href="#home">
     <img alt="Varsha logo" className="size-9 rounded-full border border-primary/60 object-cover" data-nimg="1" decoding="async" height="40" src="/spider-avatar.png" style={{ color: "transparent" }} width="40"/>
    </a>
    <ul className="hidden flex-1 md:flex">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <li key={item.id} className="min-w-0 flex-1">
            <a 
              className={`group flex h-full flex-col justify-center gap-0.5 border-r border-border px-3 py-3 transition-colors ${
                isActive ? 'bg-primary/10 border-b-2 border-b-primary' : 'hover:bg-primary/10'
              }`} 
              href={`#${item.id}`}
            >
              <span className={`font-display text-[10px] leading-none tracking-widest ${
                isActive ? 'text-primary font-black' : 'text-primary/70 group-hover:text-primary'
              }`}>
                {item.number}
              </span>
              <span className={`font-display text-xs uppercase leading-none tracking-wide lg:text-sm ${
                isActive ? 'text-foreground font-black' : 'text-foreground/90 group-hover:text-foreground'
              }`}>
                {item.label}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
    <div className="flex flex-1 items-center justify-between md:hidden">
     <span className="px-3 font-display text-xs uppercase tracking-widest text-primary">
      Issue #01
     </span>
     <button aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu" className="flex h-full items-center justify-center px-4 text-foreground" type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <svg aria-hidden="true" className="lucide lucide-menu size-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
       <path d="M4 5h16" />
       <path d="M4 12h16" />
       <path d="M4 19h16" />
      </svg>
     </button>
    </div>
   </nav>
  </header>
      {/* Mobile Toggle Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-card border-b-2 border-border flex flex-col md:hidden z-40 shadow-lg">
          <ul className="flex flex-col">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`group flex flex-col justify-center border-b border-border px-6 py-4 transition-colors ${
                      isActive ? 'bg-primary/15 border-l-4 border-l-primary' : 'hover:bg-primary/10'
                    }`}
                  >
                    <span className={`font-display text-[9px] tracking-widest ${
                      isActive ? 'text-primary font-black' : 'text-primary/70'
                    }`}>
                      {item.number}
                    </span>
                    <span className={`font-display text-sm uppercase leading-none tracking-wide ${
                      isActive ? 'text-foreground font-black' : 'text-foreground/90'
                    }`}>
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {/* Main Content Sections */}
      <main>
   <section className="relative min-h-[100svh] w-full overflow-hidden" id="home">
    <div className="absolute inset-0 -z-10 will-change-transform" style={{ transform: "translate3d(0px, 0px, 0px) scale(1.1)" }}>
     <img alt="" className="object-cover object-center" data-nimg="fill" decoding="async" src="/hero-city.png" style={{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,color:"transparent"}} style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", color: "transparent" }}/>
     <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/25 to-background">
     </div>
     <div className="halftone absolute inset-0 opacity-40">
     </div>
    </div>
    <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-64 w-64 text-foreground/45 sm:h-80 sm:w-80" fill="none" viewBox="0 0 200 200">
     <g stroke="currentColor" strokeWidth="0.75">
      <path className="web-strand" d="M0 0 L120 40 M0 0 L60 90 M0 0 L40 140 M0 0 L150 20 M0 0 L20 150" style={{ "--len": "260" }} />
      <path className="web-strand" d="M40 15 Q60 55 20 80 M120 40 Q70 60 60 90 M60 90 Q40 120 20 150" style={{ "--len": "200", animationDelay: "0.1s" }} />
     </g>
    </svg>
    <svg aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-64 w-64 text-foreground/45 sm:h-80 sm:w-80" fill="none" viewBox="0 0 200 200">
     <g stroke="currentColor" strokeWidth="0.75">
      <path className="web-strand" d="M200 0 L80 40 M200 0 L140 90 M200 0 L160 140 M200 0 L50 20 M200 0 L180 150" style={{ "--len": "260" }} />
      <path className="web-strand" d="M160 15 Q140 55 180 80 M80 40 Q130 60 140 90 M140 90 Q160 120 180 150" style={{ "--len": "200", animationDelay: "0.1s" }} />
     </g>
    </svg>
    <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
     <span className="hero-fade mb-8 inline-block border-2 border-primary px-4 py-1.5 font-display text-xs uppercase tracking-widest text-primary">
      Issue #01 · Origin Story
     </span>
     <span aria-hidden="true" className="web-strand mb-2 block h-16 w-px bg-foreground/60 sm:h-20" style={{ "--len": "80" }}></span>
     <h1 className="swing-name font-display text-[22vw] leading-[0.82] tracking-tight text-foreground drop-shadow-[0_4px_0_oklch(0.62_0.222_20)] sm:text-[18vw] lg:text-[13rem]">
      VARSHA
     </h1>
     <div className="hero-fade mt-6 flex w-full max-w-md items-center gap-3" style={{ animationDelay: "0.9s" }}>
      <span className="h-px flex-1 bg-primary/60">
      </span>
      <span className="size-2 rotate-45 bg-primary">
      </span>
      <span className="h-px flex-1 bg-primary/60">
      </span>
     </div>
     <p className="hero-fade mt-6 font-display text-lg uppercase tracking-wide sm:text-2xl" style={{ animationDelay: "1s" }}>
      <span className="text-primary">
       AI Product Manager
      </span>
      <span className="mx-2 text-muted-foreground">
       ·
      </span>
      <span className="text-foreground/70">
       Data Storyteller
      </span>
      <span className="mx-2 text-muted-foreground">
       ·
      </span>
      <span className="text-foreground/70">
       AI Explorer
      </span>
     </p>
     <p className="hero-fade mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg" style={{ animationDelay: "1.05s" }}>
      Building AI-powered experiences that make technology feel more human.
     </p>
     <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "1.1s" }}>
      <a className="group inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 font-display text-sm uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5" href="#projects">
       View Projects
       <svg aria-hidden="true" className="lucide lucide-arrow-right size-4 transition-transform group-hover:translate-x-1" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
       </svg>
      </a>
      <a className="inline-flex items-center justify-center border-2 border-foreground/30 px-6 py-3 font-display text-sm uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary" href="#connect">
       Let's Connect
      </a>
     </div>
     <ul className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-muted-foreground" style={{ animationDelay: "1.15s" }}>
      <li className="flex items-center gap-2">
       <span className="size-1.5 rotate-45 bg-primary">
       </span>
       I build products.
      </li>
      <li className="flex items-center gap-2">
       <span className="size-1.5 rotate-45 bg-primary">
       </span>
       I ask questions.
      </li>
      <li className="flex items-center gap-2">
       <span className="size-1.5 rotate-45 bg-primary">
       </span>
       I solve problems.
      </li>
      <li className="flex items-center gap-2">
       <span className="size-1.5 rotate-45 bg-primary">
       </span>
       I care about people.
      </li>
     </ul>
    </div>
    <div className="hero-fade absolute bottom-6 left-1/2 -translate-x-1/2 text-center" style={{ animationDelay: "1.2s" }}>
     <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
      Scroll to explore
     </span>
     <div className="mx-auto mt-2 h-8 w-px animate-pulse bg-primary/70">
     </div>
    </div>
   </section>
   <section className="mx-auto max-w-6xl px-4 py-24 lg:py-32" id="about">
    <div className="mb-12">
     <div className="reveal is-visible flex items-center gap-4">
      <span className="inline-flex items-center justify-center bg-primary px-3 py-1 font-display text-lg text-primary-foreground">
       02
      </span>
      <span className="h-0.5 w-16 bg-primary/60">
      </span>
     </div>
     <div className="reveal is-visible" style={{ transitionDelay: "80ms" }}>
      <h2 className="mt-4 font-display text-5xl uppercase leading-none tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
       The Human Behind the Products
      </h2>
     </div>
     <div className="reveal is-visible" style={{ transitionDelay: "140ms" }}>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
       Every hero has an origin. Mine is about building things that quietly disappear into a person's day.
      </p>
     </div>
    </div>
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
     <div className="reveal is-visible halftone rounded-lg border-2 border-border bg-card p-6 sm:p-8">
      <p className="font-display text-2xl uppercase tracking-wide text-primary">
       hello, i'm varsha!
      </p>
      <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
       <p>
        I'm an engineer by training and a product builder by choice. Over 5+ years in tech, I've moved from breaking software to explaining it — and now to shaping the AI-native products that come next.
       </p>
       <p>
        My path started in Quality Engineering at TCS, evolved into Analytics and Tableau, and is now transitioning into AI Product Management — where I get to combine every past chapter.
       </p>
       <p>
        I love understanding people before building solutions. The best products aren't the smartest — they're the ones that quietly disappear into a person's day.
       </p>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
       <li className="border border-primary/60 px-3 py-1 font-display text-xs uppercase tracking-wide text-primary">
        Product
       </li>
       <li className="border border-primary/60 px-3 py-1 font-display text-xs uppercase tracking-wide text-primary">
        AI
       </li>
       <li className="border border-primary/60 px-3 py-1 font-display text-xs uppercase tracking-wide text-primary">
        Analytics
       </li>
       <li className="border border-primary/60 px-3 py-1 font-display text-xs uppercase tracking-wide text-primary">
        Data
       </li>
       <li className="border border-primary/60 px-3 py-1 font-display text-xs uppercase tracking-wide text-primary">
        Storytelling
       </li>
      </ul>
     </div>
     <div className="flex flex-col gap-4">
      <div className="reveal is-visible group rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary">
       <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded bg-primary/15 text-primary">
         <svg aria-hidden="true" className="lucide lucide-lightbulb size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
         </svg>
        </span>
        <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
         <span className="mr-2 text-sm text-primary">
          ·
          01
         </span>
         Product Thinking
        </h3>
       </div>
       <p className="mt-2 pl-14 text-sm leading-relaxed text-muted-foreground">
        Frame the problem before the pixel.
       </p>
      </div>
      <div className="reveal is-visible group rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary" style={{ transitionDelay: "70ms" }}>
       <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded bg-primary/15 text-primary">
         <svg aria-hidden="true" className="lucide lucide-git-branch size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 6a9 9 0 0 0-9 9V3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
         </svg>
        </span>
        <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
         <span className="mr-2 text-sm text-primary">
          ·
          02
         </span>
         Systems Thinking
        </h3>
       </div>
       <p className="mt-2 pl-14 text-sm leading-relaxed text-muted-foreground">
        Every feature is a node in a graph.
       </p>
      </div>
      <div className="reveal is-visible group rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary" style={{ transitionDelay: "140ms" }}>
       <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded bg-primary/15 text-primary">
         <svg aria-hidden="true" className="lucide lucide-chart-column size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
         </svg>
        </span>
        <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
         <span className="mr-2 text-sm text-primary">
          ·
          03
         </span>
         Data Driven
        </h3>
       </div>
       <p className="mt-2 pl-14 text-sm leading-relaxed text-muted-foreground">
        Numbers narrate. I translate.
       </p>
      </div>
      <div className="reveal is-visible group rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary" style={{ transitionDelay: "210ms" }}>
       <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded bg-primary/15 text-primary">
         <svg aria-hidden="true" className="lucide lucide-users size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path d="M16 3.128a4 4 0 0 1 0 7.744" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <circle cx="9" cy="7" r="4" />
         </svg>
        </span>
        <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
         <span className="mr-2 text-sm text-primary">
          ·
          04
         </span>
         User Obsessed
        </h3>
       </div>
       <p className="mt-2 pl-14 text-sm leading-relaxed text-muted-foreground">
        Empathy is a design tool.
       </p>
      </div>
      <div className="reveal is-visible group rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary" style={{ transitionDelay: "280ms" }}>
       <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded bg-primary/15 text-primary">
         <svg aria-hidden="true" className="lucide lucide-brain size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 18V5" />
          <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
          <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
          <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
          <path d="M18 18a4 4 0 0 0 2-7.464" />
          <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
          <path d="M6 18a4 4 0 0 1-2-7.464" />
          <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
         </svg>
        </span>
        <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
         <span className="mr-2 text-sm text-primary">
          ·
          05
         </span>
         AI Curious
        </h3>
       </div>
       <p className="mt-2 pl-14 text-sm leading-relaxed text-muted-foreground">
        Models as material, not magic.
       </p>
      </div>

     </div>
    </div>
   </section>
   <section className="mx-auto max-w-5xl px-4 py-24 lg:py-32" id="experience">
    <div className="mb-12">
     <div className="reveal is-visible flex items-center gap-4">
      <span className="inline-flex items-center justify-center bg-primary px-3 py-1 font-display text-lg text-primary-foreground">
       03
      </span>
      <span className="h-0.5 w-16 bg-primary/60">
      </span>
     </div>
     <div className="reveal is-visible" style={{ transitionDelay: "80ms" }}>
      <h2 className="mt-4 font-display text-5xl uppercase leading-none tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
       Panel by Panel
      </h2>
     </div>
     <div className="reveal is-visible" style={{ transitionDelay: "140ms" }}>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
       A comic-strip resume — each frame a chapter, each chapter a choice.
      </p>
     </div>
    </div>
    <div className="grid gap-12 md:grid-cols-2 items-center">

     <div>

      <ol className="relative border-l-2 border-primary/40 pl-6 sm:pl-10">
      <li className="relative mb-8 last:mb-0">
       <span className="absolute -left-[calc(1.5rem+7px)] top-6 size-3 rotate-45 bg-primary sm:-left-[calc(2.5rem+7px)]">
       </span>
       <div className="reveal is-visible halftone rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
         <div>
          <h3 className="font-display text-2xl uppercase tracking-wide text-foreground">
           AI Product Builder
          </h3>
          <p className="mt-1 text-sm text-primary">
           IIT Patna · Independent
          </p>
         </div>
         <span className="border border-primary/60 px-3 py-1 font-display text-xs uppercase tracking-wide text-primary">
          2025 — Now
         </span>
        </div>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
         Prototyping AI-native products end-to-end — discovery, research, personas, PRDs, RICE/MoSCoW prioritization, and Responsible AI design — through to shipped, testable MVPs.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          PM & Agentic AI certified
         </li>
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          2 AI product case studies
         </li>
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          Certificate of Excellence
         </li>
        </ul>
       </div>
      </li>
      <li className="relative mb-8 last:mb-0">
       <span className="absolute -left-[calc(1.5rem+7px)] top-6 size-3 rotate-45 bg-primary sm:-left-[calc(2.5rem+7px)]">
       </span>
       <div className="reveal is-visible halftone rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary sm:p-6" style={{ transitionDelay: "60ms" }}>
        <div className="flex flex-wrap items-start justify-between gap-2">
         <div>
          <h3 className="font-display text-2xl uppercase tracking-wide text-foreground">
           Data Analyst
          </h3>
          <p className="mt-1 text-sm text-primary">
           Tata Consultancy Services
          </p>
         </div>
         <span className="border border-primary/60 px-3 py-1 font-display text-xs uppercase tracking-wide text-primary">
          2023 — Now
         </span>
        </div>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
         Turned raw healthcare operations data into clear narratives — building self-serve dashboards consumed internally and by pharma partners, and mentoring the analytics workstream.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          10+ Tableau dashboards
         </li>
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          30% reporting effort saved
         </li>
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          50+ data tickets resolved
         </li>
        </ul>
       </div>
      </li>
      <li className="relative mb-8 last:mb-0">
       <span className="absolute -left-[calc(1.5rem+7px)] top-6 size-3 rotate-45 bg-primary sm:-left-[calc(2.5rem+7px)]">
       </span>
       <div className="reveal is-visible halftone rounded-lg border-2 border-border bg-card p-5 transition-colors hover:border-primary sm:p-6" style={{ transitionDelay: "120ms" }}>
        <div className="flex flex-wrap items-start justify-between gap-2">
         <div>
          <h3 className="font-display text-2xl uppercase tracking-wide text-foreground">
           Quality Engineer
          </h3>
          <p className="mt-1 text-sm text-primary">
           Tata Consultancy Services
          </p>
         </div>
         <span className="border border-primary/60 px-3 py-1 font-display text-xs uppercase tracking-wide text-primary">
          2021 — 2023
         </span>
        </div>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
         Built deep QA expertise in clinical prescription-review systems, collaborated on backlog refinement using Given/When/Then user stories, and coded a Python chatbot to automate JIRA/Confluence onboarding.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          QA Lead in Year 1
         </li>
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          Python onboarding chatbot
         </li>
         <li className="rounded bg-primary/10 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-foreground">
          15% dev-QA effort saved
         </li>
        </ul>
       </div>
      </li>
     </ol>

     </div>

     {/* Right Column: Spider-Gwen typing on laptop cutout */}
     <div className="flex justify-center md:justify-end reveal is-visible" style={{ transitionDelay: "200ms" }}>
      <div className="relative w-full max-w-[260px] md:max-w-[280px] lg:max-w-[320px]">

       <div className="absolute inset-0 bg-[#ee304a]/5 rounded-full filter blur-3xl -z-10 animate-pulse"></div>

       <img 

         src="/spider-gwen-laptop.png" 

         alt="Spider-Gwen coding on laptop" 

         className="w-full h-auto object-contain animate-gwen-float transition-all duration-300 hover:scale-[1.03] select-none pointer-events-auto"

       />

      </div>

     </div>

    </div>
   </section>
   <section className="mx-auto max-w-6xl px-4 py-24 lg:py-32" id="projects">
    <div className="mb-12">
     <div className="reveal is-visible flex items-center gap-4">
      <span className="inline-flex items-center justify-center bg-primary px-3 py-1 font-display text-lg text-primary-foreground">
       04
      </span>
      <span className="h-0.5 w-16 bg-primary/60">
      </span>
     </div>
     <div className="reveal is-visible" style={{ transitionDelay: "80ms" }}>
      <h2 className="mt-4 font-display text-5xl uppercase leading-none tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
       Collectible Issues
      </h2>
     </div>
     <div className="reveal is-visible" style={{ transitionDelay: "140ms" }}>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
       Each project is a comic-book issue — pick one up, follow the arc.
      </p>
     </div>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      {/* Card 1: Maison AI */}
      <CardFlip isFlipped={!!flippedCards['maison-ai']} flipDirection="horizontal" flipSpeedBackToFront={0.45} flipSpeedFrontToBack={0.45}>
        {/* Front */}
        <div 
          onClick={() => toggleCardFlip('maison-ai')}
          className="group flex flex-col justify-between rounded-lg border-2 border-border bg-card p-6 min-h-[330px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_#000] hover:border-primary cursor-pointer select-none relative"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="border border-primary/60 px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-primary">
                Fashion · AI Product
              </span>
              <span className="font-display text-2xl text-foreground/40">
                #001
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-foreground">
              Maison AI
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              An AI stylist that translates mood into wardrobe. Personalized outfit stories generated from vibe, weather and calendar.
            </p>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs uppercase font-display text-primary group-hover:translate-x-1 transition-transform">
            <span>Read Issue Details</span>
            <span>→</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="flex flex-col justify-between rounded-lg border-4 border-black bg-primary p-6 min-h-[330px] shadow-[8px_8px_0px_#000] select-none relative"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="border-2 border-black px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-black font-black">
                Issue Highlights
              </span>
              <button 
                onClick={() => toggleCardFlip('maison-ai')}
                className="font-display text-xs uppercase text-black/75 hover:text-black font-black transition-colors cursor-pointer"
              >
                Close [x]
              </button>
            </div>
            <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-black font-black">
              Maison AI — Inside
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-black/90 font-sans">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Role:</strong> Discovery & UX Prototyping</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Focus:</strong> PRD & RICE Prioritization</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Tech:</strong> OpenAI APIs, Lovable</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
            <a className="inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" href="https://github.com/VarshaJha-14/Maison-PM-case-study/tree/main" target="_blank" rel="noopener noreferrer">
              Case Study
              <svg aria-hidden="true" className="lucide lucide-arrow-up-right size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
            <a className="inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" href="https://maison-ai-stylist.lovable.app/" target="_blank" rel="noopener noreferrer">
              Prototype
              <svg aria-hidden="true" className="lucide lucide-arrow-up-right size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
            <a className="inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" href="https://github.com/VarshaJha-14/Maison-PM-case-study/tree/main" target="_blank" rel="noopener noreferrer">
              GitHub
              <svg aria-hidden="true" className="lucide lucide-arrow-up-right size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>
      </CardFlip>

      {/* Card 2: FocusBuddy */}
      <CardFlip isFlipped={!!flippedCards['focus-buddy']} flipDirection="horizontal" flipSpeedBackToFront={0.45} flipSpeedFrontToBack={0.45}>
        {/* Front */}
        <div 
          onClick={() => toggleCardFlip('focus-buddy')}
          className="group flex flex-col justify-between rounded-lg border-2 border-border bg-card p-6 min-h-[330px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_#000] hover:border-primary cursor-pointer select-none relative"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="border border-primary/60 px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-primary">
                Neurodivergent · AI Coach
              </span>
              <span className="font-display text-2xl text-foreground/40">
                #002
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-foreground">
              FocusBuddy
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              An AI executive-function coach. Breaks tasks into micro-quests, nudges with empathy, and reflects the day back to you.
            </p>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs uppercase font-display text-primary group-hover:translate-x-1 transition-transform">
            <span>Read Issue Details</span>
            <span>→</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="flex flex-col justify-between rounded-lg border-4 border-black bg-primary p-6 min-h-[330px] shadow-[8px_8px_0px_#000] select-none relative"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="border-2 border-black px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-black font-black">
                Issue Highlights
              </span>
              <button 
                onClick={() => toggleCardFlip('focus-buddy')}
                className="font-display text-xs uppercase text-black/75 hover:text-black font-black transition-colors cursor-pointer"
              >
                Close [x]
              </button>
            </div>
            <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-black font-black">
              FocusBuddy — Inside
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-black/90 font-sans">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Role:</strong> Discovery & PM Execution</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Focus:</strong> Daily reflection & task structures</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Approach:</strong> Empathy-driven micro-quests</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
            <a className="inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" href="https://github.com/VarshaJha-14/FocusBuddy" target="_blank" rel="noopener noreferrer">
              Case Study
              <svg aria-hidden="true" className="lucide lucide-arrow-up-right size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
            <a className="inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" href="https://maison-ai-stylist.lovable.app/" target="_blank" rel="noopener noreferrer">
              Prototype
              <svg aria-hidden="true" className="lucide lucide-arrow-up-right size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>
      </CardFlip>

      {/* Card 3: CampusConnect */}
      <CardFlip isFlipped={!!flippedCards['campus-connect']} flipDirection="horizontal" flipSpeedBackToFront={0.45} flipSpeedFrontToBack={0.45}>
        {/* Front */}
        <div 
          onClick={() => toggleCardFlip('campus-connect')}
          className="group flex flex-col justify-between rounded-lg border-2 border-border bg-card p-6 min-h-[330px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_#000] hover:border-primary cursor-pointer select-none relative"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="border border-primary/60 px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-primary">
                Community · AI Platform
              </span>
              <span className="font-display text-2xl text-foreground/40">
                #003
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-foreground">
              CampusConnect
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              An AI-driven platform for community building and study coordination among college students.
            </p>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs uppercase font-display text-primary group-hover:translate-x-1 transition-transform">
            <span>Read Issue Details</span>
            <span>→</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="flex flex-col justify-between rounded-lg border-4 border-black bg-primary p-6 min-h-[330px] shadow-[8px_8px_0px_#000] select-none relative"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="border-2 border-black px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-black font-black">
                Issue Highlights
              </span>
              <button 
                onClick={() => toggleCardFlip('campus-connect')}
                className="font-display text-xs uppercase text-black/75 hover:text-black font-black transition-colors cursor-pointer"
              >
                Close [x]
              </button>
            </div>
            <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-black font-black">
              CampusConnect — Inside
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-black/90 font-sans">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Role:</strong> PM & Architecture Mapping</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Focus:</strong> Study coordination & community</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>System:</strong> AI-native cohort generation</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
            <a className="inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" href="https://github.com/VarshaJha-14/CampusConnect-PM-CaseStudy" target="_blank" rel="noopener noreferrer">
              Case Study
              <svg aria-hidden="true" className="lucide lucide-arrow-up-right size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>
      </CardFlip>

      {/* Card 4: Startup Analytics */}
      <CardFlip isFlipped={!!flippedCards['startup-analytics']} flipDirection="horizontal" flipSpeedBackToFront={0.45} flipSpeedFrontToBack={0.45}>
        {/* Front */}
        <div 
          onClick={() => toggleCardFlip('startup-analytics')}
          className="group flex flex-col justify-between rounded-lg border-2 border-border bg-card p-6 min-h-[330px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_#000] hover:border-primary cursor-pointer select-none relative"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="border border-primary/60 px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-primary">
                0→1 · Metrics System
              </span>
              <span className="font-display text-2xl text-foreground/40">
                #004
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-foreground">
              Startup Analytics
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Built a full-funnel analytics stack for an early-stage team. From event schema to weekly narrative, in two sprints.
            </p>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs uppercase font-display text-primary group-hover:translate-x-1 transition-transform">
            <span>Read Issue Details</span>
            <span>→</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="flex flex-col justify-between rounded-lg border-4 border-black bg-primary p-6 min-h-[330px] shadow-[8px_8px_0px_#000] select-none relative"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <span className="border-2 border-black px-2.5 py-1 font-display text-[10px] uppercase tracking-widest text-black font-black">
                Issue Highlights
              </span>
              <button 
                onClick={() => toggleCardFlip('startup-analytics')}
                className="font-display text-xs uppercase text-black/75 hover:text-black font-black transition-colors cursor-pointer"
              >
                Close [x]
              </button>
            </div>
            <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-black font-black">
              Startup Analytics — Inside
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-black/90 font-sans">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Role:</strong> Data PM & Implementation Lead</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Focus:</strong> Event Schema & Tracking Plans</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-black"></span>
                <span><strong>Approach:</strong> Weekly narrative sprint maps</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
            <a className="inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" href="https://github.com/VarshaJha-14/Project-Indian-Start-Up-Case-Study" target="_blank" rel="noopener noreferrer">
              Case Study
              <svg aria-hidden="true" className="lucide lucide-arrow-up-right size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
            <a className="inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 font-display text-xs uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" href="https://github.com/VarshaJha-14/Maison-PM-case-study/tree/main" target="_blank" rel="noopener noreferrer">
              GitHub
              <svg aria-hidden="true" className="lucide lucide-arrow-up-right size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>
      </CardFlip>
    </div></section>
   <section className="mx-auto max-w-6xl px-4 py-24 lg:py-32" id="ai-lab">
    <div className="mb-12">
     <div className="reveal flex items-center gap-4">
      <span className="inline-flex items-center justify-center bg-primary px-3 py-1 font-display text-lg text-primary-foreground">
       05
      </span>
      <span className="h-0.5 w-16 bg-primary/60">
      </span>
     </div>
     <div className="reveal" style={{ transitionDelay: "80ms" }}>
      <h2 className="mt-4 font-display text-5xl uppercase leading-none tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
       AI Lab
      </h2>
     </div>
     <div className="reveal" style={{ transitionDelay: "140ms" }}>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
       A working laboratory — half research notebook, half sketchbook. Nodes connect where ideas do.
      </p>
     </div>

    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
     <div className="reveal halftone rounded-lg border-2 border-border bg-card p-6 transition-colors hover:border-primary">
      <span className="font-display text-3xl text-primary/70">
       01
      </span>
      <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-foreground">
       Experiments
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
       Fast, wrong, useful.
      </p>
     </div>
     <div className="reveal halftone rounded-lg border-2 border-border bg-card p-6 transition-colors hover:border-primary" style={{ transitionDelay: "60ms" }}>
      <span className="font-display text-3xl text-primary/70">
       02
      </span>
      <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-foreground">
       LLMs
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
       Claude · GPT · open-weights.
      </p>
     </div>
     <div className="reveal halftone rounded-lg border-2 border-border bg-card p-6 transition-colors hover:border-primary" style={{ transitionDelay: "120ms" }}>
      <span className="font-display text-3xl text-primary/70">
       03
      </span>
      <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-foreground">
       Prompt Engineering
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
       Structure &gt; cleverness.
      </p>
     </div>
     <div className="reveal halftone rounded-lg border-2 border-border bg-card p-6 transition-colors hover:border-primary" style={{ transitionDelay: "180ms" }}>
      <span className="font-display text-3xl text-primary/70">
       04
      </span>
      <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-foreground">
       Agentic AI
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
       Tools + memory + intent.
      </p>
     </div>
     <div className="reveal halftone rounded-lg border-2 border-border bg-card p-6 transition-colors hover:border-primary" style={{ transitionDelay: "240ms" }}>
      <span className="font-display text-3xl text-primary/70">
       05
      </span>
      <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-foreground">
       Product Ideas
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
       Weekly. Ship or shelve.
      </p>
     </div>
     <div className="reveal halftone rounded-lg border-2 border-border bg-card p-6 transition-colors hover:border-primary" style={{ transitionDelay: "300ms" }}>
      <span className="font-display text-3xl text-primary/70">
       06
      </span>
      <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-foreground">
       AI Workflows
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
       Human-in-the-loop by default.
      </p>
     </div>
    </div>
    <div className="reveal mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
     <div>
      <h3 className="font-display text-3xl uppercase tracking-tight text-foreground sm:text-4xl">
       Skills, but sorted.
      </h3>
      <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
       Six disciplines that keep me useful across the AI stack — from problem framing to shipping the last mile.
      </p>
     </div>
     {/* Carousel navigation controls */}
     <div className="flex gap-3 shrink-0">
       <button 
         onClick={handlePrevSkill}
         className="bg-[#1a1111] hover:bg-primary hover:text-white text-primary border-2 border-black size-10 flex items-center justify-center shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer font-bold rounded-none"
         title="Previous Skill"
       >
         <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
           <path d="m15 18-6-6 6-6" />
         </svg>
       </button>
       <button 
         onClick={handleNextSkill}
         className="bg-[#1a1111] hover:bg-primary hover:text-white text-primary border-2 border-black size-10 flex items-center justify-center shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer font-bold rounded-none"
         title="Next Skill"
       >
         <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
           <path d="m9 18 6-6-6-6" />
         </svg>
       </button>
     </div>
    </div>
    <div className="reveal mt-8 relative skills-carousel-container-parent">
      {/* Neon Infinite Scrolling Forest, Clouds, and Stars Back Scenery */}
      <div className="absolute inset-x-0 top-0 h-[200px] pointer-events-none z-0 moving-scenery-bg" />

      <div 
        ref={skillsContainerRef}
        onMouseEnter={() => setIsSkillsPaused(true)}
        onMouseLeave={() => setIsSkillsPaused(false)}
        onScroll={handleSkillsScroll}
        className="skills-carousel-container relative z-10"
      >

      {/* Card 1: Product */}
      <div className="skill-card-wrapper carousel-card">
        <div className="animate-card-float h-full" style={{ animationDelay: "0s" }}>
          <div className="rounded-lg border-2 border-border bg-card p-5 transition-all duration-300 ease-out hover:bg-card h-full train-coach train-coach-shadow">
            <div className="flex items-center justify-between">
             <h4 className="font-display text-xl uppercase tracking-wide text-foreground">
              Product
             </h4>
             <span className="font-display text-sm text-primary">
              01
             </span>
            </div>
            <ul className="mt-3 space-y-1.5">
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Discovery
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Roadmapping
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Metrics
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              PRD craft
             </li>
            </ul>
            
            <div className="train-wheel-left">
              <span className="train-wheel-hub animate-pulse" />
            </div>
            <div className="train-wheel-right">
              <span className="train-wheel-hub animate-pulse" />
            </div>
          </div>
        </div>
        <div className="train-track-segment">
          <div className="train-rail-upper" />
          <div className="train-ties moving-track-ties" />
          <div className="train-rail-lower" />
        </div>
      </div>
      
      {/* Card 2: AI */}
      <div className="skill-card-wrapper carousel-card" style={{ transitionDelay: "50ms" }}>
        <div className="animate-card-float h-full" style={{ animationDelay: "0.4s" }}>
          <div className="rounded-lg border-2 border-border bg-card p-5 transition-all duration-300 ease-out hover:bg-card h-full train-coach train-coach-shadow">
            <div className="flex items-center justify-between">
             <h4 className="font-display text-xl uppercase tracking-wide text-foreground">
              AI
             </h4>
             <span className="font-display text-sm text-primary">
              02
             </span>
            </div>
            <ul className="mt-3 space-y-1.5">
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              LLMs
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Prompting
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Agents
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Evals
             </li>
            </ul>
            
            <div className="train-wheel-left">
              <span className="train-wheel-hub animate-pulse" />
            </div>
            <div className="train-wheel-right">
              <span className="train-wheel-hub animate-pulse" />
            </div>
          </div>
        </div>
        <div className="train-track-segment">
          <div className="train-rail-upper" />
          <div className="train-ties moving-track-ties" />
          <div className="train-rail-lower" />
        </div>
      </div>
      
      {/* Card 3: Analytics */}
      <div className="skill-card-wrapper carousel-card" style={{ transitionDelay: "100ms" }}>
        <div className="animate-card-float h-full" style={{ animationDelay: "0.8s" }}>
          <div className="rounded-lg border-2 border-border bg-card p-5 transition-all duration-300 ease-out hover:bg-card h-full train-coach train-coach-shadow">
            <div className="flex items-center justify-between">
             <h4 className="font-display text-xl uppercase tracking-wide text-foreground">
              Analytics
             </h4>
             <span className="font-display text-sm text-primary">
              03
             </span>
            </div>
            <ul className="mt-3 space-y-1.5">
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              SQL
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Cohorts
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Funnels
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Storytelling
             </li>
            </ul>
            
            <div className="train-wheel-left">
              <span className="train-wheel-hub animate-pulse" />
            </div>
            <div className="train-wheel-right">
              <span className="train-wheel-hub animate-pulse" />
            </div>
          </div>
        </div>
        <div className="train-track-segment">
          <div className="train-rail-upper" />
          <div className="train-ties moving-track-ties" />
          <div className="train-rail-lower" />
        </div>
      </div>
      
      {/* Card 4: Data */}
      <div className="skill-card-wrapper carousel-card" style={{ transitionDelay: "150ms" }}>
        <div className="animate-card-float h-full" style={{ animationDelay: "1.2s" }}>
          <div className="rounded-lg border-2 border-border bg-card p-5 transition-all duration-300 ease-out hover:bg-card h-full train-coach train-coach-shadow">
            <div className="flex items-center justify-between">
             <h4 className="font-display text-xl uppercase tracking-wide text-foreground">
              Data
             </h4>
             <span className="font-display text-sm text-primary">
              04
             </span>
            </div>
            <ul className="mt-3 space-y-1.5">
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Modeling
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Tableau
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Warehousing
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Visualization
             </li>
            </ul>
            
            <div className="train-wheel-left">
              <span className="train-wheel-hub animate-pulse" />
            </div>
            <div className="train-wheel-right">
              <span className="train-wheel-hub animate-pulse" />
            </div>
          </div>
        </div>
        <div className="train-track-segment">
          <div className="train-rail-upper" />
          <div className="train-ties moving-track-ties" />
          <div className="train-rail-lower" />
        </div>
      </div>
      
      {/* Card 5: Design */}
      <div className="skill-card-wrapper carousel-card" style={{ transitionDelay: "200ms" }}>
        <div className="animate-card-float h-full" style={{ animationDelay: "1.6s" }}>
          <div className="rounded-lg border-2 border-border bg-card p-5 transition-all duration-300 ease-out hover:bg-card h-full train-coach train-coach-shadow">
            <div className="flex items-center justify-between">
             <h4 className="font-display text-xl uppercase tracking-wide text-foreground">
              Design
             </h4>
             <span className="font-display text-sm text-primary">
              05
             </span>
            </div>
            <ul className="mt-3 space-y-1.5">
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Systems
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Prototyping
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Figma
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              UX
             </li>
            </ul>
            
            <div className="train-wheel-left">
              <span className="train-wheel-hub animate-pulse" />
            </div>
            <div className="train-wheel-right">
              <span className="train-wheel-hub animate-pulse" />
            </div>
          </div>
        </div>
        <div className="train-track-segment">
          <div className="train-rail-upper" />
          <div className="train-ties moving-track-ties" />
          <div className="train-rail-lower" />
        </div>
      </div>
      
      {/* Card 6: Tech */}
      <div className="skill-card-wrapper carousel-card" style={{ transitionDelay: "250ms" }}>
        <div className="animate-card-float h-full" style={{ animationDelay: "2.0s" }}>
          <div className="rounded-lg border-2 border-border bg-card p-5 transition-all duration-300 ease-out hover:bg-card h-full train-coach train-coach-shadow">
            <div className="flex items-center justify-between">
             <h4 className="font-display text-xl uppercase tracking-wide text-foreground">
              Tech
             </h4>
             <span className="font-display text-sm text-primary">
              06
             </span>
            </div>
            <ul className="mt-3 space-y-1.5">
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Python
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Github
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              APIs
             </li>
             <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-1.5 rotate-45 bg-primary">
              </span>
              Web Scraping
             </li>
            </ul>
            
            <div className="train-wheel-left">
              <span className="train-wheel-hub animate-pulse" />
            </div>
            <div className="train-wheel-right">
              <span className="train-wheel-hub animate-pulse" />
            </div>
          </div>
        </div>
        <div className="train-track-segment">
          <div className="train-rail-upper" />
          <div className="train-ties moving-track-ties" />
          <div className="train-rail-lower" />
        </div>
      </div>
    </div>
    </div>
    
    {/* Page indicator dot indicators */}
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => scrollToSkillsIndex(idx)}
          className={`h-2.5 rounded-full transition-all duration-300 border border-black cursor-pointer ${
            activeDot === idx ? 'w-6 bg-primary' : 'w-2.5 bg-border hover:bg-primary/50'
          }`}
          title={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
   </section>
   <section className="mx-auto max-w-6xl px-4 py-24 lg:py-32" id="beyond">
    <div className="mb-12">
     <div className="reveal flex items-center gap-4">
      <span className="inline-flex items-center justify-center bg-primary px-3 py-1 font-display text-lg text-primary-foreground">
       06
      </span>
      <span className="h-0.5 w-16 bg-primary/60">
      </span>
     </div>
     <div className="reveal" style={{ transitionDelay: "80ms" }}>
      <h2 className="mt-4 font-display text-5xl uppercase leading-none tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
       Beyond the Work
      </h2>
     </div>
     <div className="reveal" style={{ transitionDelay: "140ms" }}>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
       The scrapbook — clippings, sticky notes and side quests that make the work better.
      </p>
     </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {/* Card 1 */}
      <div className="reveal flip-card">
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front relative overflow-hidden bg-gradient-to-br from-card to-[#120708] border-2 border-border p-5 flex flex-col justify-between items-start">
            <div className="card-accent-bar" />
            <div className="flex justify-between items-center w-full z-10 relative">
              <span className="card-badge">SIDE QUEST // 01</span>
              <span className="card-pulse-dot" />
            </div>
            {/* Floating illustration */}
            <svg viewBox="0 0 24 24" className="floating-card-icon animate-float-1" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span className="card-watermark">01</span>
            <h3 className="mt-6 font-display text-xl uppercase tracking-wider text-foreground leading-snug z-10 relative text-balance">
              TRINITY CERTIFIED MUSICIAN
            </h3>
          </div>
          {/* Back */}
          <div className="flip-card-back relative overflow-hidden bg-[#120708] border-2 border-primary p-5 flex flex-col justify-center">
            <div className="card-accent-bar" />
            <span className="card-back-index">01 // BACK</span>
            <span className="font-display text-[10px] uppercase tracking-widest text-primary mb-2 font-black">
              Why it matters
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground text-left">
              Years of vocal training taught me that consistency, feedback, and repetition create mastery. I bring the same mindset to building products.
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="reveal flip-card" style={{ transitionDelay: "55ms" }}>
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front relative overflow-hidden bg-gradient-to-br from-card to-[#120708] border-2 border-border p-5 flex flex-col justify-between items-start">
            <div className="card-accent-bar" />
            <div className="flex justify-between items-center w-full z-10 relative">
              <span className="card-badge">SIDE QUEST // 02</span>
              <span className="card-pulse-dot" />
            </div>
            {/* Floating illustration */}
            <svg viewBox="0 0 24 24" className="floating-card-icon animate-float-2" stroke="currentColor" strokeWidth="1.5">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
            </svg>
            <span className="card-watermark">02</span>
            <h3 className="mt-6 font-display text-xl uppercase tracking-wider text-foreground leading-snug z-10 relative text-balance">
              UNDERSTANDING PEOPLE
            </h3>
          </div>
          {/* Back */}
          <div className="flip-card-back relative overflow-hidden bg-[#120708] border-2 border-primary p-5 flex flex-col justify-center">
            <div className="card-accent-bar" />
            <span className="card-back-index">02 // BACK</span>
            <span className="font-display text-[10px] uppercase tracking-widest text-primary mb-2 font-black">
              Why it matters
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground text-left">
              Executive function, decision making, motivation, and cognitive psychology influence how I approach product discovery and user research.
            </p>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="reveal flip-card" style={{ transitionDelay: "110ms" }}>
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front relative overflow-hidden bg-gradient-to-br from-card to-[#120708] border-2 border-border p-5 flex flex-col justify-between items-start">
            <div className="card-accent-bar" />
            <div className="flex justify-between items-center w-full z-10 relative">
              <span className="card-badge">SIDE QUEST // 03</span>
              <span className="card-pulse-dot" />
            </div>
            {/* Floating illustration */}
            <svg viewBox="0 0 24 24" className="floating-card-icon animate-float-3" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="card-watermark">03</span>
            <h3 className="mt-6 font-display text-xl uppercase tracking-wider text-foreground leading-snug z-10 relative text-balance">
              STORIES & IDEAS
            </h3>
          </div>
          {/* Back */}
          <div className="flip-card-back relative overflow-hidden bg-[#120708] border-2 border-primary p-5 flex flex-col justify-center">
            <div className="card-accent-bar" />
            <span className="card-back-index">03 // BACK</span>
            <span className="font-display text-[10px] uppercase tracking-widest text-primary mb-2 font-black">
              Why it matters
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground text-left">
              Books, essays, research, and great storytelling constantly shape how I communicate ideas and simplify complex systems.
            </p>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="reveal flip-card" style={{ transitionDelay: "165ms" }}>
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front relative overflow-hidden bg-gradient-to-br from-card to-[#120708] border-2 border-border p-5 flex flex-col justify-between items-start">
            <div className="card-accent-bar" />
            <div className="flex justify-between items-center w-full z-10 relative">
              <span className="card-badge">SIDE QUEST // 04</span>
              <span className="card-pulse-dot" />
            </div>
            {/* Floating illustration */}
            <svg viewBox="0 0 24 24" className="floating-card-icon animate-float-4" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="17" x2="22" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
            </svg>
            <span className="card-watermark">04</span>
            <h3 className="mt-6 font-display text-xl uppercase tracking-wider text-foreground leading-snug z-10 relative text-balance">
              VISUAL STORYTELLING
            </h3>
          </div>
          {/* Back */}
          <div className="flip-card-back relative overflow-hidden bg-[#120708] border-2 border-primary p-5 flex flex-col justify-center">
            <div className="card-accent-bar" />
            <span className="card-back-index">04 // BACK</span>
            <span className="font-display text-[10px] uppercase tracking-widest text-primary mb-2 font-black">
              Why it matters
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground text-left">
              I enjoy editing videos and creating visual stories. It has taught me pacing, rhythm, attention to detail, and how every frame should serve the bigger narrative.
            </p>
          </div>
        </div>
      </div>

      {/* Card 5 */}
      <div className="reveal flip-card" style={{ transitionDelay: "220ms" }}>
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front relative overflow-hidden bg-gradient-to-br from-card to-[#120708] border-2 border-border p-5 flex flex-col justify-between items-start">
            <div className="card-accent-bar" />
            <div className="flex justify-between items-center w-full z-10 relative">
              <span className="card-badge">SIDE QUEST // 05</span>
              <span className="card-pulse-dot" />
            </div>
            {/* Floating illustration */}
            <svg viewBox="0 0 24 24" className="floating-card-icon animate-float-5" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <span className="card-watermark">05</span>
            <h3 className="mt-6 font-display text-xl uppercase tracking-wider text-foreground leading-snug z-10 relative text-balance">
              RESEARCHER
            </h3>
          </div>
          {/* Back */}
          <div className="flip-card-back relative overflow-hidden bg-[#120708] border-2 border-primary p-5 flex flex-col justify-center">
            <div className="card-accent-bar" />
            <span className="card-back-index">05 // BACK</span>
            <span className="font-display text-[10px] uppercase tracking-widest text-primary mb-2 font-black">
              Why it matters
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground text-left">
              Writing a research paper taught me to question assumptions, validate evidence, and communicate ideas with clarity before making decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Card 6 */}
      <div className="reveal flip-card" style={{ transitionDelay: "275ms" }}>
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front relative overflow-hidden bg-gradient-to-br from-card to-[#120708] border-2 border-border p-5 flex flex-col justify-between items-start">
            <div className="card-accent-bar" />
            <div className="flex justify-between items-center w-full z-10 relative">
              <span className="card-badge">SIDE QUEST // 06</span>
              <span className="card-pulse-dot" />
            </div>
            {/* Floating illustration */}
            <svg viewBox="0 0 24 24" className="floating-card-icon animate-float-6" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="card-watermark">06</span>
            <h3 className="mt-6 font-display text-xl uppercase tracking-wider text-foreground leading-snug z-10 relative text-balance">
              GIVING BACK
            </h3>
          </div>
          {/* Back */}
          <div className="flip-card-back relative overflow-hidden bg-[#120708] border-2 border-primary p-5 flex flex-col justify-center">
            <div className="card-accent-bar" />
            <span className="card-back-index">06 // BACK</span>
            <span className="font-display text-[10px] uppercase tracking-widest text-primary mb-2 font-black">
              Why it matters
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground text-left">
              Supporting education, animal welfare, or community initiatives. Small actions, long-term impact.
              </p>
            </div>
          </div>
        </div>
      </div>
   </section>
   </main>
      {/* Footer / Connect Section */}
      <footer className="relative overflow-hidden border-t-2 border-primary/40" id="connect">
    <div className="halftone absolute inset-0 opacity-30">
    </div>
    <div className="relative mx-auto max-w-6xl px-4 py-20 text-center md:text-left lg:py-24">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        {/* Left Column: Portrait Cutout - 50% size of section */}
        <div className="flex justify-center md:justify-start reveal order-2 md:order-1 md:-translate-y-[20%]" style={{ transitionDelay: "100ms" }}>
          <div className="relative w-full max-w-[120px] sm:max-w-[145px] lg:max-w-[180px] transition-transform duration-300 hover:scale-[1.03]">
            {/* Halftone soft background glow */}
            <div className="absolute inset-0 bg-[#ee304a]/10 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
            <img 
              ref={webRef}
              src="/spider-web-connect.png" 
              alt="Glow Pink Heart Web" 
              className={`w-full h-auto object-contain select-none pointer-events-auto transition-transform duration-300 ${webAnimated ? 'animate-web-heartbeat' : ''}`}
              draggable="false"
            />
          </div>
        </div>

        {/* Right Column: Connect text & actions */}
        <div className="flex flex-col items-center md:items-start order-1 md:order-2">
          <div className="reveal">
            <span className="inline-flex items-center justify-center bg-primary px-3 py-1 font-display text-lg text-primary-foreground">
              07
            </span>
          </div>
          <div className="reveal" style={{ transitionDelay: "80ms" }}>
            <h2 className="mt-6 font-display text-4xl uppercase leading-tight tracking-tight text-foreground text-balance text-center md:text-left sm:text-5xl lg:text-6xl">
              With great data comes great responsibility.
            </h2>
          </div>
          <div className="reveal" style={{ transitionDelay: "140ms" }}>
            <p className="mt-5 max-w-xl text-pretty text-center md:text-left leading-relaxed text-muted-foreground sm:text-lg">
              Building something ambitious with AI, or hiring for an AI product role? Let's trade notes.
            </p>
          </div>
          <div className="reveal mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3" style={{ transitionDelay: "200ms" }}>
            <a className="inline-flex items-center gap-2 border-2 border-foreground/30 px-5 py-3 font-display text-sm uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary" href="https://www.linkedin.com/in/varsha-jha-66870916b" rel="noopener noreferrer" target="_blank">
              <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
              LinkedIn
            </a>
            <a className="inline-flex items-center gap-2 border-2 border-foreground/30 px-5 py-3 font-display text-sm uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary" href="https://github.com/VarshaJha-14" rel="noopener noreferrer" target="_blank">
              <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0024 12.5C24 5.87 18.63.5 12 .5z" />
              </svg>
              GitHub
            </a>
            <a className="inline-flex items-center gap-2 border-2 border-foreground/30 px-5 py-3 font-display text-sm uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary" href="https://mail.google.com/mail/?view=cm&fs=1&to=itsvarshajha14@gmail.com" rel="noopener noreferrer" target="_blank">
              <svg aria-hidden="true" className="lucide lucide-mail size-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect height="16" rx="2" width="20" x="2" y="4" />
              </svg>
              Email
            </a>
            <a className="inline-flex items-center gap-2 border-2 border-foreground/30 px-5 py-3 font-display text-sm uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary" download="" href="/resume.pdf">
              <svg aria-hidden="true" className="lucide lucide-download size-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              Resume
            </a>
          </div>
          <div className="reveal mt-8 w-full flex justify-center md:justify-start" style={{ transitionDelay: "260ms" }}>
            <button 
              onClick={() => setContactModalOpen(true)}
              className="inline-flex items-center justify-center bg-primary px-8 py-4 font-display text-base uppercase tracking-wide text-primary-foreground border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              Start a mission
            </button>
          </div>
        </div>
      </div>
      <p className="mt-16 text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
        © 2026 · Varsha — End of Issue #01, to be continued.
      </p>
    </div>
   </footer>
      {/* 5. Centered Translucent Contact Modal */}
      {contactModalOpen && (
        <div 
          className="modal-overlay"
          onClick={() => setContactModalOpen(false)}
        >
          <div 
            className="modal-content-box modal-enter-animation"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#ee304a]/90 text-[#fbf8f1] border-b-2 border-primary/40 p-5 flex justify-between items-center relative select-none shrink-0">
              <div className="absolute inset-0 halftone opacity-20 pointer-events-none"></div>
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide leading-none">Mission Briefing</h3>
                <span className="font-display text-[9px] uppercase tracking-wider text-[#fbf8f1]/80 mt-1 block">New message classification: Incoming</span>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="bg-black/80 text-[#ee304a] border border-primary/40 rounded p-1.5 hover:text-white transition-colors cursor-pointer" 
                title="Abort Mission"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Form Content or Success Screen */}
            {submissionStatus === 'success' ? (
              <div className="p-8 flex flex-col items-center justify-center gap-5 text-center bg-[#0d0707]/30 min-h-[340px] relative">
                <div className="absolute inset-0 halftone opacity-5 pointer-events-none"></div>
                <div className="w-14 h-14 rounded-full border-2 border-emerald-500/80 flex items-center justify-center text-emerald-500 animate-pulse shadow-[0px_0px_15px_rgba(16,185,129,0.25)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display text-2xl uppercase tracking-wider text-emerald-500">Transmission Secured</h4>
                  <span className="font-display text-[9px] uppercase tracking-widest text-emerald-500/60 block mt-1">Status: Logged on server</span>
                </div>
                <p className="font-sans text-xs leading-relaxed text-muted-foreground max-w-xs">
                  Briefing data has been sent successfully. Response will be transmitted via encrypted channels.
                </p>
                <button 
                  onClick={handleCloseModal}
                  className="mt-2 bg-primary text-white font-display text-sm uppercase tracking-wider px-8 py-3 border border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer transition-all"
                >
                  Close Terminal
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 relative justify-center bg-[#0d0707]/30">
                <div className="absolute inset-0 halftone opacity-5 pointer-events-none"></div>
                
                {submissionStatus === 'error' && (
                  <div className="bg-destructive/15 border border-destructive/40 text-destructive text-xs py-2.5 px-3.5 text-center font-display uppercase tracking-wider mb-2">
                    Transmission interrupted. Connection failed.
                  </div>
                )}
                
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-1">
                  Establish a secure link by entering your parameters below. Response will be transmitted via encrypted channels.
                </p>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] uppercase tracking-widest text-[#ee304a]">Sender Identity (Name) *</label>
                  <input 
                    type="text" 
                    required
                    disabled={submissionStatus === 'submitting'}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="bg-[#1a1111]/70 border border-primary/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0px_0px_10px_rgba(238,48,74,0.15)] focus:bg-[#1a1111]/90 outline-none transition-all font-sans rounded-none disabled:opacity-50"
                    placeholder="e.g. Gwen Stacy"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] uppercase tracking-widest text-[#ee304a]">Secure Channel (Email) *</label>
                  <input 
                    type="email" 
                    required
                    disabled={submissionStatus === 'submitting'}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="bg-[#1a1111]/70 border border-primary/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0px_0px_10px_rgba(238,48,74,0.15)] focus:bg-[#1a1111]/90 outline-none transition-all font-sans rounded-none disabled:opacity-50"
                    placeholder="secure@channel.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[11px] uppercase tracking-widest text-[#ee304a]">Mission Details (Message) *</label>
                  <textarea 
                    required
                    rows={4}
                    disabled={submissionStatus === 'submitting'}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="bg-[#1a1111]/70 border border-primary/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0px_0px_10px_rgba(238,48,74,0.15)] focus:bg-[#1a1111]/90 outline-none transition-all font-sans resize-none rounded-none disabled:opacity-50"
                    placeholder="Detail the mission..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!formName.trim() || !formEmail.trim() || !formMessage.trim() || submissionStatus === 'submitting'}
                  className={`group flex items-center justify-center gap-2 bg-[#ee304a] text-white font-display text-sm uppercase tracking-wider py-3 border border-black transition-all cursor-pointer mt-2 disabled:bg-[#221819] disabled:text-[#887072]/50 disabled:border-[#382627] disabled:shadow-none disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:pointer-events-none ${
                    (formName.trim() && formEmail.trim() && formMessage.trim() && submissionStatus !== 'submitting') ? 'mission-submit-glow' : ''
                  }`}
                >
                  <Send className="size-4" />
                  {submissionStatus === 'submitting' ? 'Transmitting Briefing...' : 'Transmit Briefing'}
                </button>
                <div className="flex items-center gap-3 my-1">
                  <span className="h-px flex-1 bg-border/40"></span>
                  <span className="text-[10px] uppercase font-display text-muted-foreground">OR</span>
                  <span className="h-px flex-1 bg-border/40"></span>
                </div>
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=itsvarshajha14@gmail.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center font-display text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors py-1 inline-flex items-center justify-center gap-1.5"
                >
                  <Mail className="size-3.5" />
                  Open Default Client Directly
                </a>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}