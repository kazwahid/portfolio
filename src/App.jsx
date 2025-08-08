import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion'; // Import motion for animations

// Data for the new Expertise Cards - Moved outside the component for optimization
const expertiseData = [
    {
        title: "Data Engineering",
        subtitle: "ETL, Workflows, Automation",
        description: "Experienced in designing and implementing robust data workflows, automating processes, and ensuring data quality across various platforms. Proficient in Python, SQL, and Power Automate for end-to-end ETL solutions.",
        iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="expertise-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
        ),
        accentColor: 'var(--primary-color)',
    },
    {
        title: "Data Analysis",
        subtitle: "Visualization, Insights, Reporting",
        description: "Skilled in transforming raw data into actionable insights through exploratory data analysis and compelling visualizations. Expertise in Power BI (DAX) and Excel for comprehensive reporting and strategic decision-making.",
        iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="expertise-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10M18 20V4M6 20v-4"></path>
            </svg>
        ),
        accentColor: 'var(--primary-color)',
    },
    {
        title: "Cloud & Platforms",
        subtitle: "Jupyter, Modern Infra",
        description: "Conceptual understanding of cloud data platforms and proficiency in tools like Jupyter Notebooks for data exploration and analysis. Focused on scalable solutions and modern data infrastructure principles.",
        iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="expertise-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"></path>
            </svg>
        ),
        accentColor: 'var(--primary-color)',
    }
];

// Separated Data for Education Section
const educationData = [
    {
        degree: "BSc - Statistics & Data Science",
        institution: "COMSATS Lahore Campus",
        period: "September 2023 - Present",
        description: "Building a strong analytical and programming foundation with a focus on statistical inference, computing, machine learning, data visualization, and data mining techniques.",
        logoSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v4m0-4l-9 5m9-5l9 5M3 12l9 5 9-5" />
            </svg>
        )
    },
    {
        degree: "Intermediate",
        institution: "Punjab College, Gujrat",
        period: "2020 - 2022",
        description: "Completed intermediate studies, which provided a strong academic foundation essential for my higher education pursuits.",
        logoSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        )
    },
];

// Separated Data for Certifications Section
const certificationsData = [
    {
        frontTitle: "Microsoft Learn Student Ambassador",
        frontYear: "2024",
        backDetails: ["Recognized for technical leadership and community contribution.", "Fostering a culture of learning and innovation."],
        isFuture: false
    },
    {
        frontTitle: "Microsoft Power Automate Cloud Udemy",
        frontYear: "07/2025 - Present",
        backDetails: ["Certification in cloud-based process automation and workflow optimization.", "Demonstrating proficiency in scalable data workflow design."],
        isFuture: false
    },
    {
        frontTitle: "Future Certifications", // Renamed
        frontYear: "Coming Soon",
        backDetails: [], // Details removed
        isFuture: true
    }
];


// Reusable Framer Motion variants for fade-in animations
const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeInStaggerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// Memoized Certification Card Front Content
const CertificationCardFront = React.memo(({ frontTitle, frontYear }) => (
    <div className="w-full">
        <h3 className="text-2xl-custom font-semibold text-primary-color text-center mb-4">{frontTitle}</h3>
        <p className="text-lg-custom text-text-color text-center">{frontYear}</p>
    </div>
));

// Memoized Certification Card Back Content
const CertificationCardBack = React.memo(({ backDetails }) => (
    <div className="w-full">
        <h3 className="text-2xl-custom font-semibold text-heading-color text-center mb-4">Details</h3>
        {backDetails.length > 0 ? (
            <ul className="list-disc list-inside text-lg-custom text-text-color text-left space-y-2">
                {backDetails.map((detail, i) => (
                    <li key={i}>{detail}</li>
                ))}
            </ul>
        ) : (
            <p className="text-lg-custom text-secondary-text-color text-center">Details coming soon!</p>
        )}
    </div>
));

// Memoized Generic FlipCard Component (Used for Certifications)
const FlipCard = React.memo(({ frontContent, backContent, index, revealedSections, isFuture }) => (
    <motion.div
        className={`flip-card-container card-hover-effect ${isFuture ? 'future-certification-card' : ''}`}
        initial="hidden"
        animate={revealedSections.has('certifications') ? "visible" : "hidden"}
        variants={itemVariants}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, boxShadow: "var(--card-hover-shadow)" }}
    >
        <div className="flip-card">
            <div className="flip-card-front card">
                {frontContent}
                {isFuture && <span className="future-badge">Coming Soon</span>}
            </div>
            <div className="flip-card-back card">
                {backContent}
            </div>
        </div>
    </motion.div>
));

// NEW: Unique Education Card Component
const UniqueEducationCard = React.memo(({ logoSvg, degree, institution, period, description, index, revealedSections }) => (
    <motion.div
        className="unique-education-card"
        initial="hidden"
        animate={revealedSections.has('education') ? "visible" : "hidden"}
        variants={itemVariants}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, boxShadow: "var(--card-hover-shadow)" }}
    >
        <div className="unique-education-card-icon-wrapper">
            {logoSvg}
        </div>
        <div className="unique-education-card-content">
            <h3 className="text-2xl-custom font-semibold text-primary-color">{degree}</h3>
            <p className="text-xl-custom text-text-color">{institution}</p>
            <p className="text-md-custom text-secondary-text-color mt-2">{period}</p>
            <p className="text-lg-custom text-text-color mt-4">{description}</p>
        </div>
    </motion.div>
));

// Memoized ExperienceDetailCard Component
const ExperienceDetailCard = React.memo(({ iconSvg, title, company, period, responsibilities, location, website, technologies, index, revealedSections }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <motion.div
            className={`card p-6 md:p-8 card-hover-effect relative overflow-hidden`}
            initial="hidden"
            animate={revealedSections.has('experience') ? "visible" : "hidden"}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, boxShadow: "var(--card-hover-shadow)" }}
        >
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={toggleExpand}>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center border border-color bg-background-light-variant-color transition-transform duration-200 group-hover:scale-110">
                        {iconSvg}
                    </div>
                    <div>
                        <h3 className="text-2xl-custom font-semibold text-primary-color">{title}</h3>
                        <p className="text-lg-custom text-text-color">{company} | {period}</p>
                    </div>
                </div>
                <motion.button
                    className="p-2 rounded-full text-secondary-text-color hover:text-primary-color transition-colors duration-200"
                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg className={`w-6 h-6 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </motion.button>
            </div>

            <motion.div
                initial={false}
                animate={{ maxHeight: isExpanded ? '1000px' : '0px', opacity: isExpanded ? 1 : 0, marginTop: isExpanded ? '1rem' : '0rem' }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="flex flex-wrap gap-4 mb-6 text-text-color text-lg-custom">
                    {location && (
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-text-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{location}</span>
                        </div>
                    )}
                    {website && (
                        <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-color hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>Website</span>
                        </a>
                    )}
                </div>

                <h4 className="text-xl-custom font-semibold text-heading-color mb-3">Responsibilities:</h4>
                <ul className="list-disc list-inside text-text-color space-y-3 mb-6">
                    {responsibilities.map((responsibility, i) => (
                        <li key={i} className="text-lg-custom" dangerouslySetInnerHTML={{ __html: responsibility.replace(/(\d+%)/g, '<span class="font-semibold text-primary-color">$1</span>') }} />
                    ))}
                </ul>

                {technologies && technologies.length > 0 && (
                    <>
                        <h4 className="text-xl-custom font-semibold text-heading-color mb-3">Technologies Used:</h4>
                        <div className="flex flex-wrap gap-2">
                            {technologies.map((tech, i) => (
                                <motion.span
                                    key={i}
                                    className="px-3 py-1 rounded-full text-sm font-medium bg-primary-color text-background-color tech-tag-effect"
                                    whileHover={{ scale: 1.05, boxShadow: "0 4px 8px var(--primary-color-shadow)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
});


// NEW: Project Card Revamped Component
const ProjectCardRevamped = React.memo(({ category, title, year, description, impact, technologies, index, revealedSections }) => {
    return (
        <motion.div
            className="project-card-revamped"
            initial="hidden"
            animate={revealedSections.has('projects') ? "visible" : "hidden"}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "var(--project-card-hover-shadow)" }}
        >
            <div className="flex justify-between items-start mb-4">
                <span className="project-category-tag">{category}</span>
                <span className="text-lg-custom text-secondary-text-color">{year}</span>
            </div>
            <h3 className="text-2xl-custom font-semibold text-primary-color mb-3">{title}</h3>
            <p className="text-lg-custom text-text-color mb-4">{description}</p>

            {impact && impact.length > 0 && (
                <div className="mt-auto pt-4"> {/* Use mt-auto to push to bottom */}
                    <h4 className="text-xl-custom font-semibold text-heading-color mb-2">Impact:</h4>
                    <ul className="list-disc list-inside text-text-color text-lg-custom mb-4">
                        {impact.map((item, i) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/(\d+%)/g, '<span class="font-semibold text-primary-color">$1</span>') }} />
                        ))}
                    </ul>
                </div>
            )}

            {technologies && technologies.length > 0 && (
                <div className="mt-auto pt-4 border-t border-border-color"> {/* Use mt-auto to push to bottom */}
                    <h4 className="text-xl-custom font-semibold text-heading-color mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech, i) => (
                            <motion.span
                                key={i}
                                className="px-3 py-1 rounded-full text-sm font-medium bg-background-light-variant-color text-text-color border border-border-color tech-tag-effect-secondary"
                                whileHover={{ scale: 1.05, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
});


// Revamped ExpertiseCard Component
const ExpertiseCard = React.memo(({ title, subtitle, description, iconSvg, accentColor, index, revealedSections }) => {
    return (
        <motion.div
            className="expertise-card-revamped"
            initial="hidden"
            animate={revealedSections.has('skills') ? "visible" : "hidden"}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="expertise-icon-revamped">
                {React.cloneElement(iconSvg, { className: `${iconSvg.props.className || ''}`, style: { color: 'white' } })}
            </div>
            <h3 className="expertise-title-revamped" style={{ '--accent-color': accentColor }}>{title}</h3>
            <p className="expertise-subtitle-revamped" style={{ '--accent-color': accentColor }}>{subtitle}</p>
            <p className="expertise-description-revamped">{description}</p>
        </motion.div>
    );
});

// Memoized Reusable ContactLink Component
const ContactLink = React.memo(({ href, target, rel, iconPath, children }) => (
    <motion.a
        href={href}
        target={target}
        rel={rel}
        className="btn-primary inline-flex px-6 py-3 text-lg-custom font-semibold shadow-md contact-button-effect"
        whileHover={{ scale: 1.05, boxShadow: "0 6px 15px var(--primary-color-shadow)" }}
        whileTap={{ scale: 0.95 }}
    >
        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={iconPath}></path>
        </svg>
        {children}
    </motion.a>
));

// NEW: TypewriterText Component
const TypewriterText = React.memo(({ phrases, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000 }) => {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const fullText = phrases[currentPhraseIndex].text;
            const lang = phrases[currentPhraseIndex].lang;

            if (isDeleting) {
                setCurrentText(prev => prev.substring(0, prev.length - 1));
                if (currentText === '') {
                    setIsDeleting(false);
                    setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
                }
            } else {
                setCurrentText(prev => fullText.substring(0, prev.length + 1));
                if (currentText === fullText) {
                    setIsDeleting(true);
                    setIsTypingComplete(true);
                }
            }
        };

        const timer = setTimeout(
            handleTyping,
            isDeleting ? deletingSpeed : (isTypingComplete ? typingSpeed : typingSpeed * 1.5)
        );

        if (currentText === phrases[currentPhraseIndex].text && !isDeleting) {
            clearTimeout(timer);
            setTimeout(() => setIsDeleting(true), pauseTime);
        }

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime, isTypingComplete]);

    const currentLang = phrases[currentPhraseIndex].lang;

    return (
        <motion.h1
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-tight typewriter-effect gradient-text-typewriter mb-4 ${currentLang === 'ar' || currentLang === 'ur' ? 'font-arabic' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            {currentText}
            <span className="typewriter-cursor">|</span>
        </motion.h1>
    );
});


// Main App Component
const App = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [currentSection, setCurrentSection] = useState('hero');
    const [revealedSections, setRevealedSections] = useState(new Set());
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [showHeader, setShowHeader] = useState(false);
    const heroSectionRef = useRef(null);

    // Phrases for the typewriter effect
    const typewriterPhrases = [
        { text: "Hi, it's me Wahid.", lang: "en" },
        { text: "سلام، میں وحید ہوں", lang: "ur" },
        { text: "مرحبا، أنا وحيد", lang: "ar" },
        { text: "こんにちは、ワヒドです", lang: "ja" },
        { text: "안녕하세요, 와히드입니다", lang: "ko" },
        { text: "Hola, soy Wahid.", lang: "es" },
    ];

    // Function to toggle mobile menu visibility
    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    // Function to close mobile menu
    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    // Function to toggle dark mode
    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prevMode => !prevMode);
    }, []);

    // Effect to apply dark mode class to the document element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Effect for custom cursor functionality
    useEffect(() => {
        const customCursor = document.getElementById('custom-cursor');
        const handleMouseMove = (e) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = () => {
            if (customCursor) customCursor.classList.add('grow');
        };
        const handleMouseLeave = () => {
            if (customCursor) customCursor.classList.remove('grow');
        };

        document.addEventListener('mousemove', handleMouseMove);

        const interactiveElements = document.querySelectorAll('a, button, .card-hover-effect, .flip-card-container, .tech-tag-effect, .project-card-revamped, .expertise-card-revamped, .unique-education-card, .contact-button-effect, .contact-section-container');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            interactiveElements.forEach(element => {
                element.removeEventListener('mouseenter', handleMouseEnter);
                element.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    // Effect for smooth scrolling and section highlighting using Intersection Observer
    useEffect(() => {
        const sections = document.querySelectorAll('section');
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setCurrentSection(entry.target.id);
                    setRevealedSections(prev => new Set(prev).add(entry.target.id));
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        const handleAnchorClick = (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.sticky-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            closeMobileMenu();
        };

        const anchorElements = document.querySelectorAll('a[href^="#"]');
        anchorElements.forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick);
        });

        return () => {
            sections.forEach(section => {
                observer.unobserve(section);
            });
            anchorElements.forEach(anchor => {
                anchor.removeEventListener('click', handleAnchorClick);
            });
        };
    }, [closeMobileMenu]);

    // Callback for handling scroll event to show/hide scroll-to-top button and header
    const handleScroll = useCallback(() => {
        if (window.scrollY > 300) {
            setShowScrollToTop(true);
        } else {
            setShowScrollToTop(false);
        }

        if (heroSectionRef.current) {
            const heroHeight = heroSectionRef.current.offsetHeight;
            if (window.scrollY > heroHeight - 80) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }
        }
    }, []);

    // Effect to add and clean up scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Function to scroll to the top of the page
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    // Effect for dynamic date/time in footer
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timeZoneAbbr = 'PKT';

            const dateTimeElement = document.getElementById('footer-datetime');
            if (dateTimeElement) {
                dateTimeElement.textContent = `${dayOfWeek} ${hours}:${minutes}:${seconds} ${timeZoneAbbr}`;
            }
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="font-montserrat bg-background-color min-h-screen transition-colors duration-300">
            {/* Custom Styles mimicking kenjimmy.xyz aesthetic */}
            <style>
                {`
                /* Font Imports */
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');


                /* CSS Variables for Theming */
                :root {
                    --primary-color: #007B8A;
                    --primary-hover-color: #00636E;
                    --secondary-color-creative-1: #00ADB5;
                    --complementary-secondary-color: #4A4A4A;
                    --hero-button-gradient-start: #007B8A;
                    --hero-button-gradient-end: #00ADB5;
                    --primary-color-shadow: rgba(0, 123, 138, 0.3);

                    /* Light Mode Variables */
                    --background-light-mode: #F8F8F8;
                    --card-light-mode: #FFFFFF;
                    --border-light-mode: #E5E5E5;
                    --text-light-mode: #333333;
                    --heading-light-mode: #1A1A1A;
                    --background-light-variant-light-mode: #F0F0F0;
                    --secondary-text-light-mode: #777777;

                    /* Dark Mode Variables */
                    --background-dark-mode: #000000;
                    --card-dark-mode: #121212;
                    --border-dark-mode: #2C2C2C;
                    --text-dark-mode: #EFEFEF;
                    --heading-dark-mode: #FFFFFF;
                    --background-light-variant-dark-mode: #080808;
                    --secondary-text-dark-mode: #BBBBBB;

                    /* Dynamic Variables */
                    --background-color: var(--background-light-mode);
                    --card-color: var(--card-light-mode);
                    --border-color: var(--border-light-mode);
                    --text-color: var(--text-light-mode);
                    --heading-color: var(--heading-light-mode);
                    --background-light-variant-color: var(--background-light-variant-light-mode);
                    --secondary-text-color: var(--secondary-text-light-mode);

                    /* Shadows */
                    --card-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                    --card-hover-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    --project-card-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                    --project-card-hover-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .dark {
                    --background-color: var(--background-dark-mode);
                    --card-color: var(--card-dark-mode);
                    --border-color: var(--border-dark-mode);
                    --text-color: var(--text-dark-mode);
                    --heading-color: var(--heading-dark-mode);
                    --background-light-variant-color: var(--background-light-variant-dark-mode);
                    --secondary-text-color: var(--secondary-text-dark-mode);

                    --card-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    --card-hover-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                    --project-card-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    --project-card-hover-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                }

                /* Apply Dynamic Variables */
                .bg-background-color { background-color: var(--background-color); }
                .text-text-color { color: var(--text-color); }
                .text-heading-color { color: var(--heading-color); }
                .text-primary-color { color: var(--primary-color); }
                .text-secondary-text-color { color: var(--secondary-text-color); }
                .bg-background-light-variant-color { background-color: var(--background-light-variant-color); }
                .border-color { border-color: var(--border-color); }


                /* Base Body Styles */
                body {
                    font-family: 'Montserrat', sans-serif;
                    line-height: 1.6;
                    scroll-behavior: smooth;
                    cursor: none;
                }

                /* Subtle Noise Background */
                .bg-background-color {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYmVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2hCYXJkZXJzIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDAwMDAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA0Ii8+PC9zdmc+');
                    background-size: 100px 100px;
                    background-repeat: repeat;
                }
                .dark .bg-background-color {
                    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYmVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2hCYXJkZXJzIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxscz0iIzAwMDAwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNCIvPjwvZmlsdGVyPgo=');
                    background-size: 100px 100px;
                    background-repeat: repeat;
                }


                /* Sticky Header Styling */
                .sticky-header {
                    position: sticky;
                    top: -100px;
                    z-index: 1000;
                    background-color: #0A0A0A;
                    backdrop-filter: none;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    transition: top 0.3s ease-in-out, background-color 0.3s, padding 0.3s, box-shadow 0.3s;
                }
                .sticky-header.show {
                    top: 0;
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                }
                .logo-group {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .logo-name {
                    font-family: 'Space Mono', monospace;
                    font-weight: 700;
                    font-size: 1.75rem;
                    line-height: 1;
                    background: linear-gradient(90deg, #E0E0E0, #B0E0E6); /* Subtle gradient */
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                    text-transform: uppercase;
                }
                .logo-description {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.9rem; /* Slightly larger for prominence */
                    background: linear-gradient(90deg, #E0E0E0, #B0E0E6); /* Subtle gradient */
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                    margin-top: 0.2rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em; /* Increased letter spacing for prominence */
                    font-weight: 800; /* Made tagline more prominent */
                }

                .header-nav-link {
                    font-family: 'Montserrat', sans-serif;
                    color: white;
                    font-weight: 500;
                    transition: color 0.2s ease-in-out, font-weight 0.2s ease-in-out, transform 0.2s ease-in-out;
                    position: relative;
                }
                .header-nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -5px;
                    left: 50%;
                    background-color: var(--primary-color);
                    transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
                }
                .header-nav-link:hover {
                    color: var(--primary-color);
                    transform: translateY(-2px);
                }
                .header-nav-link:hover::after,
                .header-nav-link.active::after {
                    width: 100%;
                    left: 0;
                }
                .header-nav-link.active {
                    color: var(--primary-color);
                    font-weight: 700;
                }
                .header-separator {
                    color: rgba(255, 255, 255, 0.3);
                }

                /* Primary Button Styling (for contact links) */
                .btn-primary {
                    background: linear-gradient(45deg, var(--hero-button-gradient-start), var(--hero-button-gradient-end));
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    box-shadow: 0 4px 10px var(--primary-color-shadow);
                    transition: all 0.2s ease-in-out;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    border: none;
                }
                .btn-primary:hover {
                    background: linear-gradient(45deg, var(--hero-button-gradient-end), var(--hero-button-gradient-start));
                    transform: translateY(-2px);
                    scale: 1.01;
                    box-shadow: 0 6px 15px var(--primary-color-shadow);
                }
                .btn-primary:active {
                    transform: translateY(0);
                    scale: 0.99;
                    box-shadow: 0 2px 5px var(--primary-color-shadow);
                }

                /* Secondary Button Styling (for Read More/Less) */
                .btn-secondary {
                    color: var(--text-color);
                    font-weight: 500;
                    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, scale 0.1s ease-in-out;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    border: 1px solid var(--border-color);
                    background-color: var(--card-color);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-secondary:hover {
                    color: var(--primary-color);
                    background-color: var(--background-color);
                    border-color: var(--primary-color);
                    scale: 1.01;
                }
                .btn-secondary:active {
                    scale: 0.99;
                }


                /* Card General Styling (Unified Dark Theme Style) */
                .card {
                    background-color: var(--card-color);
                    border-radius: 0.75rem;
                    box-shadow: var(--card-shadow);
                    border: 1px solid var(--border-color);
                    transition: all 0.2s ease-in-out;
                }
                .card-hover-effect:hover {
                    transform: translateY(-5px) scale(1.005);
                    box-shadow: var(--card-hover-shadow);
                }

                /* Project Card Revamped Styling (NEW) */
                .project-card-revamped {
                    background-color: var(--card-color);
                    border-radius: 0.75rem;
                    box-shadow: var(--project-card-shadow);
                    border: 1px solid var(--border-color);
                    transition: all 0.3s ease-in-out;
                    overflow: hidden;
                    position: relative;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                }
                .project-card-revamped:hover {
                    background-color: var(--background-light-variant-color);
                    box-shadow: var(--project-card-hover-shadow);
                }

                .project-category-tag {
                    display: inline-block;
                    padding: 0.3rem 0.8rem;
                    border: 1px solid var(--border-color);
                    border-radius: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--secondary-text-color);
                    background-color: var(--background-light-variant-color);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .tech-tag-effect-secondary {
                    transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
                    color: var(--text-color);
                    background-color: var(--background-light-variant-color);
                    border: 1px solid var(--border-color);
                }
                .tech-tag-effect-secondary:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }


                /* Expertise Card Specific Styling (Revamped) */
                .expertise-card-revamped {
                    background-color: var(--card-color);
                    border: 1px solid var(--border-color);
                    border-radius: 0.75rem;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                    transition: all 0.2s ease-in-out;
                    position: relative;
                    overflow: hidden;
                    color: var(--text-color);
                    box-shadow: var(--card-shadow);
                }
                .expertise-card-revamped:hover {
                    box-shadow: var(--card-hover-shadow);
                }

                .expertise-icon-revamped {
                    width: 48px;
                    height: 48px;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .expertise-title-revamped {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: var(--heading-color);
                    position: relative;
                    padding-bottom: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .expertise-title-revamped::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 3px;
                    background-color: var(--primary-color);
                    transform-origin: left;
                    transform: scaleX(0);
                    transition: transform 0.3s ease-in-out;
                }
                .expertise-card-revamped:hover .expertise-title-revamped::after {
                    transform: scaleX(1);
                }

                .expertise-subtitle-revamped {
                    font-size: 1.125rem;
                    color: var(--complementary-secondary-color);
                    position: relative;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                }
                .expertise-subtitle-revamped::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 2px;
                    background-color: var(--primary-color);
                    transform-origin: left;
                    transform: scaleX(0);
                    transition: transform 0.3s ease-in-out;
                }
                .expertise-card-revamped:hover .expertise-subtitle-revamped::after {
                    transform: scaleX(1);
                }

                .expertise-description-revamped {
                    font-size: 1rem;
                    color: var(--text-color);
                }

                /* Content Wrapper for Expandable Sections */
                .content-wrapper {
                    max-height: 120px;
                    overflow: hidden;
                    transition: max-height 0.5s ease-out;
                    position: relative;
                }
                .content-wrapper.expanded {
                    max-height: 1000px;
                    transition: max-height 0.7s ease-in;
                }
                .read-more-gradient-project {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 60px;
                    background: linear-gradient(to top, var(--card-color), rgba(255,255,255,0));
                    pointer-events: none;
                }
                .dark .read-more-gradient-project {
                    background: linear-gradient(to top, var(--card-color), rgba(42,42,42,0));
                }
                .content-wrapper.expanded .read-more-gradient-project {
                    display: none;
                }

                /* Flip Card Specific Styling */
                .flip-card-container {
                    perspective: 1000px;
                    width: 100%;
                    height: 280px;
                }
                .flip-card {
                    width: 100%;
                    height: 100%;
                    transition: transform 0.8s ease-in-out;
                    transform-style: preserve-3d;
                    position: relative;
                    border-radius: 0.75rem;
                    box-shadow: var(--card-shadow);
                    border: 1px solid var(--border-color);
                }
                .flip-card-container:hover .flip-card {
                    transform: rotateY(180deg);
                }
                .flip-card-front, .flip-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    border-radius: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 1.5rem;
                    box-sizing: border-box;
                    background-color: var(--card-color);
                }
                .flip-card-back {
                    transform: rotateY(180deg);
                    background-color: var(--background-color);
                    color: var(--text-color);
                }

                /* Future Certification Card Styling (Enhanced) */
                .future-certification-card .flip-card {
                    border: 3px dashed var(--primary-color);
                    box-shadow: 0 0 20px var(--primary-color-shadow);
                    animation: pulse-border 2s infinite alternate ease-in-out;
                }
                .future-certification-card .flip-card-front,
                .future-certification-card .flip-card-back {
                    background-color: var(--background-light-variant-color);
                    position: relative;
                }
                .future-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background-color: var(--primary-color);
                    color: white;
                    padding: 0.4rem 1rem;
                    border-radius: 0.75rem;
                    font-size: 0.95rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    box-shadow: 0 4px 10px var(--primary-color-shadow);
                    animation: pulse-badge 1.8s infinite ease-in-out;
                    text-transform: uppercase;
                }
                @keyframes pulse-border {
                    from { border-color: rgba(0, 123, 138, 0.5); box-shadow: 0 0 10px rgba(0, 123, 138, 0.2); }
                    to { border-color: rgba(0, 123, 138, 1); box-shadow: 0 0 25px rgba(0, 123, 138, 0.6); }
                }
                @keyframes pulse-badge {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.03); opacity: 0.95; }
                    100% { transform: scale(1); opacity: 1; }
                }


                /* Custom Typography Classes */
                .name-heading {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.1;
                    color: var(--heading-color);
                }
                h2, h3, h4 { font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.2; color: var(--heading-color); }
                h2 { font-size: 2.5rem; }
                h3 { font-size: 1.75rem; }
                h4 { font-size: 1.25rem; }
                .text-base-custom { font-size: 1rem; line-height: 1.7; }
                .text-md-custom { font-size: 0.9rem; line-height: 1.5rem; }
                .text-lg-custom { font-size: 1.125rem; line-height: 1.75rem; }
                .text-xl-custom { font-size: 1.25rem; line-height: 1.75rem; }
                .text-2xl-custom { font-size: 1.5rem; line-height: 2rem; }

                /* Static Subheading for Hero */
                .static-subheading-hero {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-size: 1.5rem;
                    line-height: 1.2;
                    color: var(--text-color);
                }
                @media (min-width: 768px) {
                    .static-subheading-hero {
                        font-size: 2rem;
                    }
                }
                @media (min-width: 1024px) {
                    .static-subheading-hero {
                        font-size: 2.5rem;
                    }
                }

                /* Personal Section Heading */
                .personal-section-heading {
                    font-size: 1.25rem; /* Small size */
                    font-weight: 700;
                    color: var(--primary-color); /* Highlighted color */
                    margin-bottom: 1rem; /* Spacing from the card */
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }


                /* Typewriter effect styles */
                .typewriter-effect {
                    display: inline-block;
                    position: relative;
                    min-height: 1.2em;
                    font-family: 'Montserrat', sans-serif;
                }

                .typewriter-cursor {
                    display: inline-block;
                    animation: blink-caret 0.75s step-end infinite;
                    font-weight: 300;
                    margin-left: 2px;
                }

                @keyframes blink-caret {
                    from, to { opacity: 0; }
                    50% { opacity: 1; }
                }

                /* Gradient Text for Typewriter */
                .gradient-text-typewriter {
                    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color-creative-1));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }

                /* Arabic and Urdu font for the Arabic/Urdu headings */
                .font-arabic {
                    font-family: 'Noto Sans Arabic', 'Noto Nastaliq Urdu', sans-serif;
                    direction: rtl;
                }

                /* Section Fade-in Animation */
                @keyframes fade-in-section {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-section {
                    animation: fade-in-section 0.8s ease-out forwards;
                    opacity: 0;
                    animation-delay: var(--animation-delay, 0s);
                }

                /* Scroll to Top Button Styling */
                .scroll-to-top {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background-color: var(--primary-color);
                    color: white;
                    border-radius: 9999px;
                    padding: 0.75rem;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                    z-index: 1000;
                    opacity: 0;
                    transform: translateY(20px);
                }
                .scroll-to-top.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .scroll-to-top:hover {
                    background-color: var(--primary-hover-color);
                    transform: translateY(-2px);
                }

                /* Custom Cursor Styles */
                #custom-cursor {
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background-color: var(--primary-color);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    transform: translate(-50%, -50%);
                    transition: width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out;
                    mix-blend-mode: difference;
                }
                #custom-cursor.grow {
                    width: 30px;
                    height: 30px;
                    background-color: rgba(255, 255, 255, 0.5);
                    opacity: 0.6;
                    mix-blend-mode: normal;
                }

                /* Unique Education Card Styling (Unified) */
                .unique-education-card {
                    background: var(--card-color);
                    border-radius: 0.75rem;
                    border: 1px solid var(--border-color);
                    box-shadow: var(--card-shadow);
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                    transition: all 0.3s ease-in-out;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    height: auto;
                    min-height: 250px;
                }
                .unique-education-card:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--card-hover-shadow);
                }

                .unique-education-card-icon-wrapper {
                    width: 64px;
                    height: 64px;
                    margin-bottom: 1.5rem;
                    border-radius: 50%;
                    background-color: var(--background-light-variant-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.7);
                    transition: all 0.2s ease-in-out;
                }
                .dark .unique-education-card-icon-wrapper {
                    box-shadow: inset 2px 2px 5px rgba(0,0,0,0.4), inset -2px -2px 5px (50,50,50,0.1);
                }

                .unique-education-card:hover .unique-education-card-icon-wrapper {
                    transform: scale(1.1);
                    box-shadow: 0 0 15px var(--primary-color-shadow);
                }

                /* Footer styling */
                .footer {
                    background-color: #0A0A0A;
                    color: white;
                    font-family: 'Space Mono', monospace;
                    font-size: 0.85rem;
                    padding-top: 2rem;
                    padding-bottom: 2rem;
                }

                .footer-text-gradient {
                    background: linear-gradient(90deg, #E0E0E0, #B0E0E6); /* Subtle gradient */
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }

                /* Responsive adjustments for footer */
                @media (max-width: 767px) {
                    .footer .container {
                        flex-direction: column;
                        align-items: center;
                    }
                    .footer-left, .footer-center, .footer-right {
                        margin-bottom: 1rem;
                    }
                    .footer-left p, .footer-center p, .footer-right p {
                        font-size: 0.75rem;
                    }
                }

                /* Contact Section Specific Styles */
                .contact-section-container {
                    background-color: var(--card-color);
                    border-radius: 1rem;
                    box-shadow: var(--card-shadow);
                    padding: 3rem;
                    margin-top: 2rem;
                    border: 1px solid var(--border-color);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease-in-out;
                    background-image: radial-gradient(circle at top left, var(--primary-color-shadow) 0%, transparent 40%);
                }

                .contact-section-container:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 25px var(--primary-color-shadow);
                }

                .contact-button-effect {
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                    transition: all 0.3s ease-in-out;
                }

                .contact-button-effect::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: all 0.4s ease-in-out;
                    z-index: -1;
                }

                .contact-button-effect:hover::before {
                    left: 100%;
                }

                .contact-button-effect:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 8px 20px var(--primary-color-shadow);
                }
                `}
            </style>

            {/* Custom Cursor Element */}
            <div id="custom-cursor" style={{ left: cursorPosition.x, top: cursorPosition.y }}></div>

            {/* Header & Navigation */}
            <header className={`sticky-header py-4 ${showHeader ? 'show' : ''}`}>
                <nav className="container mx-auto px-6 flex items-center justify-between">
                    {/* Left: Name and Description */}
                    <div className="logo-group">
                        <a href="#hero" className="logo-name">QAZI WAHID</a>
                        <p className="logo-description">DATA AI VALUE</p>
                    </div>

                    {/* Right: Navigation Links, Connect Button, Dark Mode Toggle */}
                    <div className="hidden md:flex items-center gap-x-6">
                        <a href="#about" className={`header-nav-link ${currentSection === 'about' ? 'active' : ''}`}>About</a>
                        <span className="header-separator">/</span>
                        <a href="#education" className={`header-nav-link ${currentSection === 'education' ? 'active' : ''}`}>Education</a>
                        <span className="header-separator">/</span>
                        <a href="#certifications" className={`header-nav-link ${currentSection === 'certifications' ? 'active' : ''}`}>Certifications</a>
                        <span className="header-separator">/</span>
                        <a href="#experience" className={`header-nav-link ${currentSection === 'experience' ? 'active' : ''}`}>Experience</a>
                        <span className="header-separator">/</span>
                        <a href="#projects" className={`header-nav-link ${currentSection === 'projects' ? 'active' : ''}`}>Projects</a>
                        <span className="header-separator">/</span>
                        <a href="#skills" className={`header-nav-link ${currentSection === 'skills' ? 'active' : ''}`}>Expertise</a>
                        <span className="header-separator">/</span>
                        <a href="#personal" className={`header-nav-link ${currentSection === 'personal' ? 'active' : ''}`}>Personal</a>
                        <span className="header-separator">/</span>
                        <a href="#contact" className="btn-primary px-6 py-2 text-lg-custom font-semibold shadow-md">
                            Connect!
                        </a>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-color ml-4"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.325 3.325l-.707.707M5.373 5.373l-.707-.707M18.627 5.373l.707-.707M5.373 18.627l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {/* Mobile Menu Button */}
                    <button id="mobile-menu-button" className="md:hidden text-text-color focus:outline-none" onClick={toggleMobileMenu}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </nav>
                {/* Mobile Menu Overlay */}
                <div id="mobile-menu" className={`md:hidden fixed inset-0 bg-background-color bg-opacity-95 z-50 flex flex-col items-center justify-center space-y-8 transition-colors duration-300 ${isMobileMenuOpen ? '' : 'hidden'}`}>
                    <a href="#about" className="text-2xl text-heading-color hover:text-primary-color transition-colors duration-200" onClick={closeMobileMenu}>about</a>
                    <a href="#education" className="text-2xl text-heading-color hover:text-primary-color transition-colors duration-200" onClick={closeMobileMenu}>education</a>
                    <a href="#certifications" className="text-2xl text-heading-color hover:text-primary-color transition-colors duration-200" onClick={closeMobileMenu}>certifications</a>
                    <a href="#experience" className="text-2xl text-heading-color hover:text-primary-color transition-colors duration-200" onClick={closeMobileMenu}>experience</a>
                    <a href="#projects" className="text-2xl text-heading-color hover:text-primary-color transition-colors duration-200" onClick={closeMobileMenu}>projects</a>
                    <a href="#skills" className="text-2xl text-heading-color hover:text-primary-color transition-colors duration-200" onClick={closeMobileMenu}>expertise</a>
                    <a href="#personal" className="text-2xl text-heading-color hover:text-primary-color transition-colors duration-200" onClick={closeMobileMenu}>personal</a>
                    <a href="#contact" className="text-2xl text-heading-color hover:text-primary-color transition-colors duration-200" onClick={closeMobileMenu}>contact</a>
                    <button id="close-mobile-menu" className="absolute top-6 right-6 text-text-color focus:outline-none" onClick={closeMobileMenu}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </header>

            <main>
                {/* Hero Section - Sleek Version */}
                <section
                    id="hero"
                    ref={heroSectionRef}
                    className="bg-background-color py-20 md:py-32 relative overflow-hidden transition-colors duration-300 min-h-screen flex items-center justify-center"
                >
                    <div className="container mx-auto px-6 flex flex-col items-center justify-center h-full relative z-10 text-center">
                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        >
                            {/* Animated Typewriter Introduction */}
                            <TypewriterText phrases={typewriterPhrases} />

                            {/* Static Subheading */}
                            <motion.h2
                                className="static-subheading-hero text-xl md:text-2xl lg:text-3xl font-semibold uppercase leading-tight mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.0 }}
                            >
                                Inquisitive Mind in Data & AI.
                            </motion.h2>

                            {/* Concise Introductory Paragraph */}
                            <motion.p
                                className="text-lg-custom text-text-color mb-8 max-w-xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.2 }}
                            >
                                Continuous learning and crafting intelligent data solutions.
                            </motion.p>
                        </motion.div>
                    </div>
                    {/* Scroll down indicator */}
                    <motion.div
                        className="absolute bottom-10 w-full flex justify-center text-secondary-text-color text-lg-custom animate-bounce"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                    >
                        scroll down / use arrow down.
                    </motion.div>
                </section>

                    {/* About Section */}
                    <section id="about" className={`bg-background-color py-12 md:py-16 transition-colors duration-300 relative overflow-hidden`}>
                        <motion.div
                            className="container mx-auto px-6 py-8 md:py-12 relative z-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInVariants}
                        >
                            <div className="max-w-4xl mx-auto card p-8">
                                <p className="text-lg-custom text-text-color mb-6">
                                    My journey as an aspiring <span className="text-primary-color">Data Science & AI Engineer</span> is fueled by a deep curiosity for how data can transform. I approach each project with a meticulous yet grounded mindset, knowing that true innovation stems from a solid grasp of core processes and a commitment to practical outcomes. My focus is on building <span className="text-primary-color">robust data systems</span>.
                                </p>
                                <p className="text-lg-custom text-text-color mb-6">
                                    My strength lies in blending <span className="text-primary-color">effective design</span> with <span className="text-primary-color">practical application</span>. This means I strive to create data solutions that are technically sound, user-friendly, and operate efficiently. Before diving into any data work, I thoroughly research, ensuring every stakeholder's view is considered.
                                </p>
                                <p className="text-lg-custom text-text-color">
                                    Want to move your data ideas from concept to live operation quickly? I deliver this through clear communication, dependable results, and a dedication to excellence in data engineering and intelligent systems.
                                </p>
                            </div>
                        </motion.div>
                    </section>

                    {/* Education Section */}
                    <section id="education" className={`bg-background-color py-12 md:py-16 transition-colors duration-300 relative overflow-hidden`}>
                        <motion.div
                            className="container mx-auto px-6 py-8 md:py-12 relative z-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInStaggerVariants}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                                {educationData.map((item, index) => (
                                    <UniqueEducationCard
                                        key={index}
                                        logoSvg={item.logoSvg}
                                        degree={item.degree}
                                        institution={item.institution}
                                        period={item.period}
                                        description={item.description}
                                        index={index}
                                        revealedSections={revealedSections}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* Certifications Section */}
                    <section id="certifications" className={`bg-background-color py-12 md:py-16 transition-colors duration-300 relative overflow-hidden`}>
                        <motion.div
                            className="container mx-auto px-6 py-8 md:py-12 relative z-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInStaggerVariants}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                                {certificationsData.map((item, index) => (
                                    <FlipCard
                                        key={index}
                                        frontContent={<CertificationCardFront frontTitle={item.frontTitle} frontYear={item.frontYear} />}
                                        backContent={<CertificationCardBack backDetails={item.backDetails} />}
                                        index={index}
                                        revealedSections={revealedSections}
                                        isFuture={item.isFuture}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className={`bg-background-color py-12 md:py-16 transition-colors duration-300 relative overflow-hidden`}>
                        <motion.div
                            className="container mx-auto px-6 py-8 md:py-12 relative z-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInStaggerVariants}
                        >
                            <div className="max-w-5xl mx-auto space-y-12">
                                <ExperienceDetailCard
                                    iconSvg={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    }
                                    title="Automation Engineer Intern"
                                    company="Arcana Info"
                                    period="July 2025 - Present"
                                    location="Islamabad, Pakistan"
                                    website="https://arcanainfo.com/"
                                    technologies={["Power Automate", "Python", "SQL", "Automation"]}
                                    responsibilities={[
                                        "Designed and implemented data workflow automations using Power Automate, streamlining routine business processes and demonstrating foundational understanding of data flow orchestration and process optimization.",
                                        "Developed and deployed a Power Automate bot to automate invoice data processing, functioning as a lightweight ETL solution that reduced manual data entry time by 40% and improved data accuracy by 25% for a key client.",
                                        "Engineered a cloud-based data integration solution to synchronize customer data across Salesforce and a custom CRM, eliminating manual data reconciliation and saving the sales team an estimated 10 hours per week, showcasing practical application of cloud services for robust data management."
                                    ]}
                                    index={0}
                                    revealedSections={revealedSections}
                                />
                                <ExperienceDetailCard
                                    iconSvg={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z" />
                                        </svg>
                                    }
                                    title="Trainee Business Analyst"
                                    company="SpectrumX"
                                    period="March 2025 - June 2025"
                                    location="Remote (Part-Time)"
                                    website="https://www.spectrumv.io/"
                                    technologies={["Power BI", "DAX", "Agile", "Product Discovery", "Teamwork"]}
                                    responsibilities={[
                                        "Designed and implemented a customer churn dashboard using Power BI, involving the collection, cleaning, and preparation of raw customer data from diverse sources, which identified key patterns and led to a targeted marketing campaign reducing churn by 15%.",
                                        "Conducted market basket analysis on e-commerce datasets, performing extensive data cleaning and transformation to identify product bundling opportunities, resulting in a 10% increase in average order value and a 5% boost in cross-selling revenue.",
                                        "Collaborated with cross-functional teams to understand data requirements and deliver actionable insights, demonstrating strong communication and problem-solving skills critical for effective data infrastructure development."
                                    ]}
                                    index={1}
                                    revealedSections={revealedSections}
                                />
                            </div>
                        </motion.div>
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className={`bg-background-color py-12 md:py-16 transition-colors duration-300 relative overflow-hidden`}>
                        <motion.div
                            className="container mx-auto px-6 relative z-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInStaggerVariants}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                                <ProjectCardRevamped
                                    category="Analytics"
                                    title="Multi-Channel E-Commerce Analytics Dashboard"
                                    year="2025"
                                    description="Comprehensive Power BI solution analyzing 500+ customers and 1,200+ orders."
                                    impact={[
                                        "60%+ revenue segment identification",
                                        "10% sales increase"
                                    ]}
                                    technologies={["Power BI", "DAX", "Data Modeling"]}
                                    index={0}
                                    revealedSections={revealedSections}
                                />
                                <ProjectCardRevamped
                                    category="Development"
                                    title="R-Based Visualization Framework"
                                    year="2025"
                                    description="Structured analytical framework for data ingestion and transformation."
                                    impact={[
                                        "Enhanced decision-making efficiency through actionable insights"
                                    ]}
                                    technologies={["R", "Data Visualization", "Statistical Computing"]}
                                    index={1}
                                    revealedSections={revealedSections}
                                />
                                <ProjectCardRevamped
                                    category="Research"
                                    title="Supply Chain Analytics Study"
                                    year="2024"
                                    description="Exploratory analysis on 1,700+ sales and supply chain records."
                                    impact={[
                                        "5% projected reduction in returns through logistics optimization"
                                    ]}
                                    technologies={["Python", "Jupyter", "EDA"]}
                                    index={2}
                                    revealedSections={revealedSections}
                                />
                            </div>
                        </motion.div>
                    </section>

                    {/* Skills Section (My Expertise) */}
                    <section id="skills" className={`bg-background-color py-12 md:py-16 transition-colors duration-300 relative overflow-hidden`}>
                        <motion.div
                            className="container mx-auto px-6 relative z-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInStaggerVariants}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {expertiseData.map((expertise, index) => (
                                    <ExpertiseCard
                                        key={index}
                                        title={expertise.title}
                                        subtitle={expertise.subtitle}
                                        description={expertise.description}
                                        iconSvg={expertise.iconSvg}
                                        accentColor={expertise.accentColor}
                                        index={index}
                                        revealedSections={revealedSections}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* Personal Section - Revamped */}
                    <section id="personal" className={`bg-background-color py-12 md:py-16 transition-colors duration-300 relative overflow-hidden`}>
                        <motion.div
                            className="container mx-auto px-6 relative z-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInVariants}
                        >
                            <h2 className="personal-section-heading text-center">What I do when I am not immersed in data.</h2> {/* Updated heading */}
                            <div className="max-w-4xl mx-auto card p-8 text-center">
                                <motion.p
                                    className="text-lg-custom text-text-color mb-6"
                                    initial="hidden"
                                    animate={revealedSections.has('personal') ? "visible" : "hidden"}
                                    variants={fadeInVariants}
                                    transition={{ delay: 0.2 }}
                                >
                                    I find my best ideas when I'm not actively trying to think. My curiosity extends to everything—<span className="text-primary-color">new places</span>, diverse people, and unexpected experiences. Often, a simple chat with someone who sees the world differently can unravel problems I've been stuck on for days. I thrive on challenging problems, and it's fascinating how insights from casual conversations often evolve into <span className="text-primary-color">tangible solutions</span>.
                                </motion.p>
                                <motion.p
                                    className="text-lg-custom text-text-color"
                                    initial="hidden"
                                    animate={revealedSections.has('personal') ? "visible" : "hidden"}
                                    variants={fadeInVariants}
                                    transition={{ delay: 0.4 }}
                                >
                                    My most significant breakthroughs happen away from the computer—during a game, over coffee, or while exploring a new place. <span className="text-primary-color">Chess</span> keeps my mind sharp, sports help clear my head, and conversations with friends consistently spark my best ideas. Staying curious and connected to the world around me keeps me both creative and grounded.
                                </motion.p>
                            </div>
                        </motion.div>
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className={`bg-background-color py-12 md:py-16 transition-colors duration-300 relative overflow-hidden`}>
                        <motion.div
                            className="container mx-auto px-6 py-8 md:py-12 text-center relative z-10 contact-section-container"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInVariants}
                        >
                            {/* Removed "Let's Connect!" heading from here */}
                            <p className="text-xl-custom text-text-color mb-8 max-w-2xl mx-auto">
                                I am always open to discussing new projects, collaborations, or opportunities. Feel free to reach out!
                            </p>
                            <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
                                <ContactLink href="mailto:qwahid@outlook.com" iconPath="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7m14-6a2 2 0 00-2-2H7a2 2 0 00-2 2v4l7 4 7-4V6z">Email Me</ContactLink>
                                <ContactLink href="tel:+923363706365" iconPath="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">Call Me</ContactLink>
                                <ContactLink href="https://linkedin.com/in/qaziwahid/" target="_blank" rel="noopener noreferrer" iconPath="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.381 1.11-2.5 2.48-2.5s2.48 1.119 2.48 2.5zM.02 24h4.96V8h-4.96V24zM9.52 8h4.62v2.85c.62-.92 1.38-1.62 2.92-1.62 3.12 0 5.46 2.06 5.46 6.5V24h-4.96v-6.56c0-1.56-.56-2.62-1.94-2.62-1.06 0-1.68.72-1.96 1.44-.1.24-.12.54-.12.84V24H9.52V8z">LinkedIn</ContactLink>
                            </div>
                        </motion.div>
                    </section>
            </main>

            <footer className="footer py-8 transition-colors duration-300">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                    {/* Left Section - Copyright */}
                    <div className="footer-left mb-4 md:mb-0">
                        <p className="text-base-custom font-bold uppercase footer-text-gradient">©2025 QAZI WAHID</p>
                    </div>

                    {/* Center Section - Legal Notice */}
                    <div className="footer-center mb-4 md:mb-0">
                        <p className="text-base-custom font-bold uppercase text-white">LEGAL NOTICE</p>
                    </div>

                    {/* Right Section - Dynamic Date/Time */}
                    <div className="footer-right">
                        <p className="text-base-custom font-bold uppercase text-white" id="footer-datetime"></p>
                    </div>
                </div>
            </footer>

            <button
                onClick={scrollToTop}
                className={`scroll-to-top ${showScrollToTop ? 'show' : ''}`}
                aria-label="Scroll to top"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
};

export default App;
