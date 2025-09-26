window.addEventListener('load', () => {
  // --- Home Page Load Animation ---
  const homePageContent = document.querySelector('.categories__grid');

  // Only run this animation if we are on the home page
  if (homePageContent) {
    const tl = gsap.timeline(); // Create a GSAP timeline

    tl.from('.site-header__branding', {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })
    .from('.site-header__nav a', {
      y: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }, "-=0.4") // Start this animation 0.4s before the previous one ends
     .fromTo('.category-card',
      { y: -50, opacity: 0 },              // from
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power2.out' }, // to
      "-=0.3"    //tl.set('.category-card', { opacity: 1 }, "-=0.0")
    )
    // Remove inline transform so CSS :hover transform/transition can work
    .add(() => gsap.set('.category-card', { clearProps: 'transform' }), '+=0.01');
  }
});