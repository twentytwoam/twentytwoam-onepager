document.addEventListener("DOMContentLoaded", function () {
  // Get all service items and images
  const serviceItems = document.querySelectorAll(".service-item");
  const serviceImages = document.querySelectorAll(".service-image");

  // Add click event listener to each service item
  serviceItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      // Remove active class from all items and images
      serviceItems.forEach((i) => i.classList.remove("active"));
      serviceImages.forEach((img) => img.classList.remove("active"));

      // Add active class to clicked item and corresponding image
      item.classList.add("active");
      serviceImages[index].classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar-container");
  const navbar = document.getElementById("navbar");
  const navbarSpacer = document.getElementById("navbar-spacer");
  const stickyHamburger = document.getElementById("sticky-hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  const overlay = document.getElementById("overlay");

  // Set active link based on current section
  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-links a, .footer-links a"
  );
  const sections = document.querySelectorAll("section[id]");

  // Variable to store navbar position
  let navbarPosition = null;

  // Function to calculate and update navbar position
  function updateNavbarPosition() {
    if (
      navbarContainer &&
      window.getComputedStyle(navbarContainer).display !== "none"
    ) {
      // Get position and set spacer height
      navbarPosition = navbarContainer.offsetTop;

      // Check if we need to apply sticky class based on current scroll position
      checkStickyState();
    } else {
      // Reset position if navbar is not visible
      navbarPosition = null;
    }
  }

  // Function to check if navbar should be sticky based on scroll position
  function checkStickyState() {
    if (
      navbarPosition !== null &&
      window.getComputedStyle(navbarContainer).display !== "none"
    ) {
      if (window.scrollY >= navbarPosition) {
        navbarContainer.classList.add("sticky");
        navbarSpacer.classList.add("spacer-active");
      } else {
        navbarContainer.classList.remove("sticky");
        navbarSpacer.classList.remove("spacer-active");
      }
    }
  }

  // Function to update active link based on scroll position
  function setActiveNavLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop - 200) {
        currentSection = section.getAttribute("id");
      }
    });

    // If we're at the top of the page, set Home as active
    if (window.scrollY < 200) {
      currentSection = "";
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (
        (href === "#" && currentSection === "") ||
        (href !== "#" && href === "#" + currentSection)
      ) {
        link.classList.add("active");
      }
    });
  }

  // Initialize position after a slight delay to ensure elements are rendered
  setTimeout(updateNavbarPosition, 50);

  // Add resize event listener to recalculate navbar position when window is resized
  let resizeTimer;
  window.addEventListener("resize", function () {
    // Debounce resize events
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      updateNavbarPosition();

      // Reset spacer height when resizing
      if (navbarSpacer && navbar) {
        navbarSpacer.style.height = navbarContainer.classList.contains("sticky")
          ? navbar.offsetHeight + "px"
          : "0px";
      }
    }, 50);
  });

  // Function to toggle mobile menu with hamburger animation
  function toggleMobileMenu() {
    stickyHamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.style.overflow = mobileNav.classList.contains("active")
      ? "hidden"
      : "auto";
  }

  // Hamburger menu click event
  if (stickyHamburger) {
    stickyHamburger.addEventListener("click", toggleMobileMenu);
  }

  // Close mobile menu when clicking overlay
  overlay.addEventListener("click", toggleMobileMenu);

  // Close mobile menu when clicking nav links
  document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
    link.addEventListener("click", function () {
      if (mobileNav.classList.contains("active")) {
        toggleMobileMenu();
      }
    });
  });

  // Sticky navbar on scroll with smooth transition and update active link
  window.addEventListener("scroll", function () {
    checkStickyState();
    setActiveNavLink();
  });

  // Initialize active link on page load
  setActiveNavLink();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") !== "#") {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Calculate position considering sticky navbar and its top margin
          let scrollOffset = 0;
          if (
            navbarPosition !== null &&
            window.getComputedStyle(navbarContainer).display !== "none" &&
            window.scrollY >= navbarPosition
          ) {
            // If navbar is sticky, account for its height and top margin
            scrollOffset =
              navbar.offsetHeight +
              parseFloat(getComputedStyle(navbarContainer).top);
          }

          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.scrollY -
            scrollOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleInput = document.getElementById("toggle-input");
  const problemContent = document.getElementById("problem-content");
  const solutionContent = document.getElementById("solution-content");

  if (toggleInput) {
    // Set initial state
    toggleInput.checked = false;
    problemContent.classList.add("active");
    solutionContent.classList.remove("active");

    // Toggle switch change handler
    toggleInput.addEventListener("change", function () {
      if (this.checked) {
        // Solution is selected
        problemContent.classList.remove("active");
        solutionContent.classList.add("active");
      } else {
        // Problem is selected
        problemContent.classList.add("active");
        solutionContent.classList.remove("active");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Testimonials slider functionality
  const testimonialsWrapper = document.querySelector(".testimonials-wrapper");
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const prevButton = document.querySelector(".swiper-button-prev");
  const nextButton = document.querySelector(".swiper-button-next");
  const paginationContainer = document.querySelector(".swiper-pagination");

  let currentIndex = 0;
  const totalSlides = testimonialSlides.length;
  let autoRotateInterval = null;
  let isAutoRotating = false;
  let isPaused = false; // New flag to track manual pausing

  // Create pagination bullets
  function createPagination() {
    paginationContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const bullet = document.createElement("div");
      bullet.classList.add("swiper-pagination-bullet");
      if (i === currentIndex) {
        bullet.classList.add("swiper-pagination-bullet-active");
      }
      bullet.addEventListener("click", () => {
        goToSlide(i);
        resetAutoRotate();
      });
      paginationContainer.appendChild(bullet);
    }
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }

    currentIndex = index;
    updateSlider();
  }

  // Update slider position and states
  function updateSlider() {
    const offset = currentIndex * -100;
    testimonialsWrapper.style.transform = `translateX(${offset}%)`;

    // Update slide states
    testimonialSlides.forEach((slide, i) => {
      slide.classList.remove("active", "inactive");
      if (i === currentIndex) {
        slide.classList.add("active");
      } else {
        slide.classList.add("inactive");
      }
    });

    // Update pagination
    const bullets = document.querySelectorAll(".swiper-pagination-bullet");
    bullets.forEach((bullet, i) => {
      bullet.classList.toggle(
        "swiper-pagination-bullet-active",
        i === currentIndex
      );
    });
  }

  // Auto-rotate function
  function startAutoRotate() {
    // Don't start if manually paused or already rotating
    if (isPaused || isAutoRotating) {
      return;
    }

    // Clear any existing interval
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
    }

    console.log("Auto-rotation started");
    isAutoRotating = true;
    autoRotateInterval = setInterval(() => {
      if (!isPaused) {
        goToSlide(currentIndex + 1);
      }
    }, 4000);
  }

  // Stop auto-rotation
  function stopAutoRotate() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      autoRotateInterval = null;
      isAutoRotating = false;
      console.log("Auto-rotation stopped");
    }
  }

  // Pause auto-rotation (triggered by hover)
  function pauseAutoRotate() {
    isPaused = true;
    console.log("Auto-rotation paused by hover");
  }

  // Resume auto-rotation (triggered when hover ends)
  function resumeAutoRotate() {
    isPaused = false;
    console.log("Auto-rotation resumed after hover");

    // If not already rotating, start again
    if (!isAutoRotating) {
      startAutoRotate();
    }
  }

  // Reset auto-rotate timer when user interacts with slider
  function resetAutoRotate() {
    stopAutoRotate();
    startAutoRotate();
  }

  // Handle page visibility changes
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      stopAutoRotate();
    } else if (!isPaused) {
      startAutoRotate();
    }
  });

  // Event listeners for navigation buttons
  prevButton.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
    resetAutoRotate();
  });

  nextButton.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
    resetAutoRotate();
  });

  // Handle touch/swipe events
  let startX, moveX;
  let isDown = false;

  testimonialsWrapper.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDown = true;
  });

  testimonialsWrapper.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    moveX = e.touches[0].clientX;
  });

  testimonialsWrapper.addEventListener("touchend", () => {
    isDown = false;
    if (!moveX) return;

    const diff = startX - moveX;
    if (diff > 50) {
      goToSlide(currentIndex + 1);
      resetAutoRotate();
    } else if (diff < -50) {
      goToSlide(currentIndex - 1);
      resetAutoRotate();
    }
    moveX = null;
  });

  // Mouse drag functionality
  testimonialsWrapper.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    isDown = true;
  });

  testimonialsWrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    moveX = e.clientX;
  });

  testimonialsWrapper.addEventListener("mouseup", () => {
    isDown = false;
    if (!moveX) return;

    const diff = startX - moveX;
    if (diff > 50) {
      goToSlide(currentIndex + 1);
      resetAutoRotate();
    } else if (diff < -50) {
      goToSlide(currentIndex - 1);
      resetAutoRotate();
    }
    moveX = null;
  });

  testimonialsWrapper.addEventListener("mouseleave", () => {
    isDown = false;
  });

  // ===== CRITICAL HOVER FUNCTIONALITY =====

  // Apply hover handlers to both slides and cards for better coverage
  testimonialSlides.forEach((slide) => {
    slide.addEventListener("mouseenter", pauseAutoRotate);
    slide.addEventListener("mouseleave", resumeAutoRotate);
  });

  // Add event listeners to cards as well for more precise control
  testimonialCards.forEach((card) => {
    card.addEventListener("mouseenter", pauseAutoRotate);
    card.addEventListener("mouseleave", resumeAutoRotate);
  });

  // Apply to testimonial content areas for better coverage
  const testimonialContents = document.querySelectorAll(".testimonial-content");
  testimonialContents.forEach((content) => {
    content.addEventListener("mouseenter", pauseAutoRotate);
    content.addEventListener("mouseleave", resumeAutoRotate);
  });

  // Initialize
  createPagination();
  updateSlider();
  startAutoRotate();
});

// Modified JavaScript for Services Rows Section
// document.addEventListener("DOMContentLoaded", function () {
//   const serviceRows = document.querySelectorAll(".service-row");

//   serviceRows.forEach((row) => {
//     // Custom cursor on hover
//     row.addEventListener("mouseenter", function (e) {
//       const image = this.querySelector(".service-row-image img").src;
//       const cursor = document.createElement("div");
//       cursor.classList.add("custom-cursor");
//       cursor.style.backgroundImage = `url(${image})`;
//       document.body.appendChild(cursor);

//       // Make the actual cursor invisible
//       row.style.cursor = "none";

//       // Move custom cursor with mouse
//       document.addEventListener("mousemove", moveCursor);
//     });

//     row.addEventListener("mouseleave", function () {
//       const cursor = document.querySelector(".custom-cursor");
//       if (cursor) {
//         document.body.removeChild(cursor);
//         document.removeEventListener("mousemove", moveCursor);
//       }

//       // Restore the normal cursor
//       row.style.cursor = "auto";
//     });
//   });

//   function moveCursor(e) {
//     const cursor = document.querySelector(".custom-cursor");
//     if (cursor) {
//       cursor.style.left = `${e.clientX}px`;
//       cursor.style.top = `${e.clientY}px`;
//     }
//   }

//   // Add additional styles for custom cursor
//   const styleElement = document.createElement("style");
//   styleElement.textContent = `
//     .custom-cursor {
//       position: fixed;
//       width: 400px;
//       height: 250px;
//       background-size: contain;
//       background-repeat: no-repeat;
//       background-position: center;
//       pointer-events: none;
//       z-index: 9999;
//       transform: translate(-50%, -50%);
//       opacity: 1;
//       transition: width 0.3s, height 0.3s;
//     }

//     /* Hide cursor when hovering over service rows */
//     .service-row:hover {
//       cursor: none;
//     }
//   `;
//   document.head.appendChild(styleElement);
// });

document.addEventListener("DOMContentLoaded", function () {
  const brochureForm = document.querySelector('form[name="brochure-download"]');
  const emailInput = document.getElementById("brochure-email");
  const downloadBtn = document.getElementById("download-btn");

  // Initial state - disable button by default
  downloadBtn.disabled = true;
  downloadBtn.style.cursor = "not-allowed";

  // Enable/disable button based on email input
  emailInput.addEventListener("input", function () {
    const hasValue = this.value.trim() !== "";
    downloadBtn.disabled = !hasValue;

    // Change cursor style based on button state
    downloadBtn.style.cursor = hasValue ? "pointer" : "not-allowed";
  });

  // Handle form submission
  brochureForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Only proceed if email is valid
    if (emailInput.validity.valid) {
      // Collect form data
      const formData = new FormData(brochureForm);

      // Submit form to Netlify
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
        .then(() => {
          // Initiate brochure download
          const downloadLink = document.createElement("a");
          downloadLink.href = "twentytwoampdf.pdf"; // Replace with actual brochure file path
          downloadLink.download = "TwentyTwoAm_Brochure.pdf"; // Name of downloaded file
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Reset form and button state
          emailInput.value = "";
          downloadBtn.disabled = true;
          downloadBtn.style.cursor = "not-allowed";
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          alert(
            "There was an error downloading the brochure. Please try again."
          );
        });
    }
  });
});

document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (response.ok) {
        alert("Thank you for your message! We will get back to you soon.");
        form.reset();
      } else {
        alert("There was a problem with your submission. Please try again.");
      }
    });
  });

window.addEventListener("DOMContentLoaded", () => {
  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const downArrow = document.getElementById("down-arrow-container");
  const logoImg = document.querySelector("#line2 .inline-wrapper img");
  const heroSection = document.querySelector(".mission-section");

  // Initial animations
  setTimeout(() => {
    line1.classList.add("show");
  }, 500);

  setTimeout(() => {
    line2.classList.remove("hidden");
    line2.querySelector(".inline-wrapper").classList.add("show");
  }, 2500);

  setTimeout(() => {
    downArrow.style.opacity = "1";
  }, 3500);

  // Create a wrapper link for the floating logo
  const logoLink = document.createElement("a");
  logoLink.href = "https://unboringb2b.com"; // Change this to your desired URL, e.g., "https://example.com"
  logoLink.target = "_blank"; // Open in a new tab
  logoLink.id = "floating-logo-link";

  // Create floating logo that will move from original position to bottom right
  const floatingLogo = logoImg.cloneNode(true);
  floatingLogo.id = "floating-logo";

  // Append logo to link, then link to body
  logoLink.appendChild(floatingLogo);
  document.body.appendChild(logoLink);

  // Store initial values
  let originalLogoRect = null;
  let originalLogoWidth = null;

  // Function to initialize or update the floating logo position
  function updateLogoPosition() {
    const logoRect = logoImg.getBoundingClientRect();
    originalLogoRect = {
      left: logoRect.left,
      top: logoRect.top,
    };
    originalLogoWidth = logoImg.offsetWidth;

    // Set initial styles for floating logo link
    logoLink.style.position = "fixed";
    logoLink.style.left = originalLogoRect.left + "px";
    logoLink.style.top = originalLogoRect.top + "px";
    logoLink.style.display = "none"; // Initially hidden
    logoLink.style.zIndex = "1000";

    // Set initial styles for floating logo
    floatingLogo.style.width = originalLogoWidth + "px";
  }

  // Function to handle scroll
  function handleScroll() {
    const scrollY = window.scrollY;
    const heroBottom = heroSection.offsetHeight;
    const scrollThreshold = 100; // Start transition after scrolling this much

    // Target position for bottom right corner (fixed position)
    const targetRight = 20; // 20px from right edge
    const targetBottom = 20; // 20px from bottom edge
    const targetWidth = 130; // Width when in corner

    // Calculate scroll progress (0 when at top, 1 when transition should complete)
    const scrollProgress = Math.min(
      Math.max((scrollY - scrollThreshold) / 300, 0),
      1
    );

    if (scrollY > scrollThreshold) {
      // When scrolling down past threshold, show floating logo and hide original
      logoLink.style.display = "block";
      logoImg.style.visibility = "hidden";

      // Set CSS variable for transition progress - this will be used in CSS
      document.documentElement.style.setProperty(
        "--scroll-progress",
        scrollProgress
      );

      if (scrollProgress >= 1) {
        // Final position (bottom right corner)
        logoLink.style.left = "auto";
        logoLink.style.top = "auto";
        logoLink.style.right = targetRight + "px";
        logoLink.style.bottom = targetBottom + "px";
        floatingLogo.style.width = targetWidth + "px";
        floatingLogo.classList.add("fixed-position");
      } else {
        // Transitioning position
        // Calculate position between original and final
        const currentLeft =
          originalLogoRect.left * (1 - scrollProgress) +
          (window.innerWidth - targetWidth - targetRight) * scrollProgress;
        const currentTop =
          originalLogoRect.top * (1 - scrollProgress) +
          (window.innerHeight - targetWidth - targetBottom) * scrollProgress;
        const currentWidth =
          originalLogoWidth -
          (originalLogoWidth - targetWidth) * scrollProgress;

        logoLink.style.left = currentLeft + "px";
        logoLink.style.top = currentTop + "px";
        logoLink.style.right = "auto";
        logoLink.style.bottom = "auto";
        floatingLogo.style.width = currentWidth + "px";
        floatingLogo.classList.add("transitioning");
        floatingLogo.classList.remove("fixed-position");
      }
    } else {
      // When at the top, show original logo and hide floating logo
      logoLink.style.display = "none";
      logoImg.style.visibility = "visible";
      floatingLogo.classList.remove("transitioning", "fixed-position");
    }
  }

  // Initialize on load
  updateLogoPosition();

  // Update values on resize to maintain responsive behavior
  window.addEventListener("resize", () => {
    updateLogoPosition();
    handleScroll(); // Recalculate position after resize
  });

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);

  // Initial check in case page loads scrolled down
  handleScroll();
});

document.addEventListener("DOMContentLoaded", function () {
  // Wait for 6 seconds (6000 milliseconds)
  setTimeout(function () {
    const floatingLogo = document.getElementById("floating-logo");
    if (floatingLogo) {
      floatingLogo.classList.add("visible");
    }
  }, 6000);

  // Optional: Add click event to the logo if needed
  const floatingLogo = document.getElementById("floating-logo");
  if (floatingLogo) {
    floatingLogo.addEventListener("click", function () {
      // Add your click functionality here, e.g.:
      // window.location.href = 'https://your-website.com';
    });
  }
});
