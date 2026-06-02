document.addEventListener('DOMContentLoaded', () => {

    // 1. Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Ambient Glow Cursor Tracking (Premium Micro-interaction)
    const glow = document.getElementById('bg-glow');
    document.addEventListener('mousemove', (e) => {
        if (glow) {
            const x = e.clientX - 300; // Subtract half width (600px / 2)
            const y = e.clientY - 300; // Subtract half height (600px / 2)
            
            // Smoothen the movement with requestAnimationFrame
            requestAnimationFrame(() => {
                glow.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
    });

    // 4. Pricing Calculator Logic
    const typeButtons = document.querySelectorAll('#video-type-options .calc-opt-btn');
    const lengthSlider = document.getElementById('video-length');
    const lengthLabel = document.getElementById('length-label');
    const sliderMarks = document.querySelector('.slider-marks');
    
    // Addons checkboxes
    const addonCaptions = document.getElementById('addon-captions');
    const addonVfx = document.getElementById('addon-vfx');
    const addonRush = document.getElementById('addon-rush');

    // UI Result Elements
    const estimatedPriceEl = document.getElementById('estimated-price');
    const basePriceValEl = document.getElementById('base-price-val');
    const subtitlePriceValEl = document.getElementById('subtitle-price-val');
    const addonVfxRow = document.getElementById('addon-vfx-row');
    const addonRushRow = document.getElementById('addon-rush-row');

    let videoType = 'short'; // 'short' or 'long'

    // Configure slider based on video type
    function updateSliderConfig() {
        if (videoType === 'short') {
            lengthSlider.min = 15;
            lengthSlider.max = 180;
            lengthSlider.step = 15;
            lengthSlider.value = 60;
            lengthLabel.innerHTML = 'ความยาววิดีโอเสร็จสิ้น: <span>60 วินาที</span>';
            sliderMarks.innerHTML = '<span>15 วิ</span><span>60 วิ</span><span>120 วิ</span><span>180 วิ</span>';
        } else {
            lengthSlider.min = 1;
            lengthSlider.max = 15;
            lengthSlider.step = 1;
            lengthSlider.value = 5;
            lengthLabel.innerHTML = 'ความยาววิดีโอเสร็จสิ้น: <span>5 นาที</span>';
            sliderMarks.innerHTML = '<span>1 นาที</span><span>5 นาที</span><span>10 นาที</span><span>15 นาที</span>';
        }
        calculatePrice();
    }

    // Toggle video type
    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            typeButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            videoType = e.target.getAttribute('data-type');
            updateSliderConfig();
        });
    });

    // Handle slider change
    lengthSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        if (videoType === 'short') {
            lengthLabel.innerHTML = `ความยาววิดีโอเสร็จสิ้น: <span>${val} วินาที</span>`;
        } else {
            lengthLabel.innerHTML = `ความยาววิดีโอเสร็จสิ้น: <span>${val} นาที</span>`;
        }
        calculatePrice();
    });

    // Handle checkboxes change
    [addonCaptions, addonVfx, addonRush].forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });

    // Main Price Calculation Formula
    function calculatePrice() {
        const length = parseInt(lengthSlider.value);
        let basePrice = 0;
        let captionsPrice = 0;
        let vfxPrice = 0;
        let rushPrice = 0;

        if (videoType === 'short') {
            // Short-form calculation (TikTok/Reels/Shorts)
            // base includes visual cuts & sound design.
            if (length <= 60) {
                basePrice = 800;
            } else if (length <= 120) {
                basePrice = 1200;
            } else {
                basePrice = 1600;
            }

            captionsPrice = addonCaptions.checked ? 150 : 0;
            vfxPrice = addonVfx.checked ? 200 : 0;
            rushPrice = addonRush.checked ? 300 : 0;

            // Update addon text dynamically
            addonCaptions.nextElementSibling.nextElementSibling.nextElementSibling.textContent = '+150.-';
            addonVfx.nextElementSibling.nextElementSibling.nextElementSibling.textContent = '+200.-';
            addonRush.nextElementSibling.nextElementSibling.nextElementSibling.textContent = '+300.-';

        } else {
            // Long-form calculation (YouTube/Vlog)
            if (length <= 5) {
                basePrice = 1500;
            } else if (length <= 10) {
                basePrice = 2500;
            } else {
                basePrice = 3500;
            }

            captionsPrice = addonCaptions.checked ? 400 : 0;
            vfxPrice = addonVfx.checked ? 500 : 0;
            rushPrice = addonRush.checked ? 800 : 0;

            // Update addon text dynamically for long form
            addonCaptions.nextElementSibling.nextElementSibling.nextElementSibling.textContent = '+400.-';
            addonVfx.nextElementSibling.nextElementSibling.nextElementSibling.textContent = '+500.-';
            addonRush.nextElementSibling.nextElementSibling.nextElementSibling.textContent = '+800.-';
        }

        // Apply visual updates
        basePriceValEl.textContent = `฿${basePrice.toLocaleString()}`;
        
        if (addonCaptions.checked) {
            subtitlePriceValEl.parentElement.style.display = 'flex';
            subtitlePriceValEl.textContent = `฿${captionsPrice}`;
        } else {
            subtitlePriceValEl.parentElement.style.display = 'none';
        }

        if (addonVfx.checked) {
            addonVfxRow.style.display = 'flex';
            addonVfxRow.querySelector('span:last-child').textContent = `฿${vfxPrice}`;
        } else {
            addonVfxRow.style.display = 'none';
        }

        if (addonRush.checked) {
            addonRushRow.style.display = 'flex';
            addonRushRow.querySelector('span:last-child').textContent = `฿${rushPrice}`;
        } else {
            addonRushRow.style.display = 'none';
        }

        const totalPrice = basePrice + captionsPrice + vfxPrice + rushPrice;
        estimatedPriceEl.textContent = `฿${totalPrice.toLocaleString()}`;
    }

    // Run initial price calculation
    calculatePrice();


    // 5. Portfolio Video Lightbox / Preview modal
    const videoModal = document.getElementById('videoModal');
    const closeModalBtn = document.getElementById('closeModal');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modalImg = document.getElementById('modalVideoImg');

    portfolioItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = item.querySelector('.portfolio-img').src;
            if (videoModal && modalImg) {
                modalImg.src = imgSrc;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });
    });

    function closeModal() {
        if (videoModal) {
            videoModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore background scrolling
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });
    }


    // 6. Form Submission Integration via Vercel Postgres API
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show loading state
            const originalBtnText = formSubmitBtn.textContent;
            formSubmitBtn.textContent = 'กำลังส่งข้อมูล...';
            formSubmitBtn.disabled = true;

            const name = document.getElementById('form-name').value;
            const contact = document.getElementById('form-contact').value;
            const details = document.getElementById('form-details').value;

            // Send request to Vercel Serverless Function
            fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, contact, details })
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Show success alert
                    formSuccess.classList.add('show');
                    formSuccess.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
                    formSuccess.style.borderColor = 'var(--accent)';
                    formSuccess.style.color = 'var(--accent)';
                    formSuccess.innerHTML = '<i class="fa-solid fa-circle-check"></i> ส่งข้อมูลสำเร็จ! ระบบบันทึกข้อมูลเรียบร้อยแล้ว';
                    contactForm.reset();
                } else {
                    console.log(response);
                    formSuccess.classList.add('show');
                    formSuccess.style.backgroundColor = 'rgba(255, 95, 86, 0.1)';
                    formSuccess.style.borderColor = '#ff5f56';
                    formSuccess.style.color = '#ff5f56';
                    formSuccess.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> เกิดข้อผิดพลาด: ' + json.message;
                }
            })
            .catch(error => {
                console.log(error);
                formSuccess.classList.add('show');
                formSuccess.style.backgroundColor = 'rgba(255, 95, 86, 0.1)';
                formSuccess.style.borderColor = '#ff5f56';
                formSuccess.style.color = '#ff5f56';
                formSuccess.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ไม่สามารถเชื่อมต่อฐานข้อมูลได้ (โปรดตรวจสอบการเปิด Vercel Postgres ในโครงการ)';
            })
            .then(() => {
                // Reset button state
                formSubmitBtn.textContent = originalBtnText;
                formSubmitBtn.disabled = false;
                
                // Hide message after 6 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 6000);
            });
        });
    }
});
