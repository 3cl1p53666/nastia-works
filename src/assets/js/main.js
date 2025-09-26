document.addEventListener('DOMContentLoaded', () => {
  let worksData = {};
  let glide = null;

  async function loadWorksData() {
    try {
      const response = await fetch('/api/works.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      worksData = await response.json();
      console.log('✅ Portfolio data loaded successfully!');
    } catch (error) {
      console.error('❌ FATAL: Could not load or parse portfolio data:', error);
    }
  }

  function populateModal(work, slug) {
    const modalTitle = document.querySelector('#work-detail-modal .modal__title');
    const modalContent = document.querySelector('#work-detail-modal .modal__content');
    
    // This is the fallback case if data lookup fails
    if (!work) {
      modalTitle.textContent = `Missing: ${slug}`;
      modalContent.innerHTML = `<p>No details available. Please check the console for errors.</p>`;
      console.error(`❌ populateModal failed because no work data was found for slug: "${slug}"`);
      return;
    }

    modalTitle.textContent = work.title;

    let mediaHTML = '';
    if (work.media_items && work.media_items.length > 0) {
      const slides = work.media_items.map(item => {
        let slideContent = '';
        if (item.type === 'image') {
          slideContent = `<img src="${item.url}" alt="${item.alt}" loading="lazy">`;
        } else if (item.type === 'video' && item.provider === 'youtube') {
          slideContent = `<div class="video-responsive"><iframe src="https://www.youtube.com/embed/${item.video_id}" title="${item.alt}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        }
        return `<li class="glide__slide">${slideContent}</li>`;
      }).join('');

      mediaHTML = `
        <div class="glide">
          <div class="glide__track" data-glide-el="track"><ul class="glide__slides">${slides}</ul></div>
          <div class="glide__arrows" data-glide-el="controls">
            <button class="glide__arrow glide__arrow--left" data-glide-dir="<" aria-label="Previous slide">&#x2190;</button>
            <button class="glide__arrow glide__arrow--right" data-glide-dir=">" aria-label="Next slide">&#x2192;</button>
          </div>
        </div>
        <div class="modal-description"><p>${work.description}</p></div>
      `;
    } else {
      mediaHTML = `<div class="modal-description"><p>${work.description}</p></div>`;
    }
    
    modalContent.innerHTML = mediaHTML;
  }

  MicroModal.init({
    onShow: (modal, trigger) => {
      const slug = trigger.dataset.workSlug;
      const work = worksData[slug];

      // --- NEW DEBUGGING BLOCK ---
      if (!work) {
        console.error(`🔴 DATA LOOKUP FAILED!`);
        console.log(`   Looking for slug: "${slug}"`);
        console.log(`   Available keys are:`, Object.keys(worksData));
      }
      // --- END DEBUGGING BLOCK ---

      populateModal(work, slug);

      const glideElement = document.querySelector('#work-detail-modal .glide');
      if (glideElement) {
        glide = new Glide(glideElement).mount();
      }
    },
    onClose: () => {
      if (glide) {
        glide.destroy();
        glide = null;
      }
    },
    disableScroll: true,
  });

  loadWorksData();
});