document.addEventListener("DOMContentLoaded", function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Music Player Controls
    const audio = document.getElementById('wedding-music');
    const musicToggle = document.querySelector('.music-toggle');
    let isPlaying = false;

    if (audio && musicToggle) {
        musicToggle.addEventListener('click', function() {
            if (isPlaying) {
                audio.pause();
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                musicToggle.classList.remove('playing');
            } else {
                audio.play();
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                musicToggle.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });

        // Auto-play music after user interaction
        const playAudio = () => {
            audio.play().then(() => {
                isPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                musicToggle.classList.add('playing');
                console.log("Musik berhasil diputar");
            }).catch(error => {
                console.error("Gagal memutar musik:", error);
            });
            document.removeEventListener('click', playAudio);
        };
        document.addEventListener('click', playAudio);
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // RSVP Form Handling
    const rsvpForm = document.querySelector('.rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.attendance) {
                showAlert('Mohon lengkapi form yang disediakan', 'error');
                return;
            }

            // Here you would typically send the data to a server
            console.log('RSVP Data:', data);
            showAlert('Terima kasih atas konfirmasi kehadiran Anda!', 'success');
            rsvpForm.reset();
        });
    }

    // Custom Alert Function
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '1000';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);

        // Remove alert after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Countdown Timer
    function updateCountdown() {
        const weddingDate = new Date('2025-02-01T08:00:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countdownElements = {
            days: document.getElementById('countdown-days'),
            hours: document.getElementById('countdown-hours'),
            minutes: document.getElementById('countdown-minutes'),
            seconds: document.getElementById('countdown-seconds')
        };

        if (countdownElements.days) {
            countdownElements.days.textContent = days.toString().padStart(2, '0');
            countdownElements.hours.textContent = hours.toString().padStart(2, '0');
            countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
            countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
        }
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // Gallery Image Modal
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('gallery-modal'));
            const modalImg = document.getElementById('gallery-modal-img');
            if (modalImg) {
                modalImg.src = this.src;
                modal.show();
            }
        });
    });

    // Copy to Clipboard Function
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-clipboard-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Tersalin';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });

    // Lazy Loading for Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Add to Calendar Button
    const addToCalendarBtn = document.querySelector('.add-to-calendar');
    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', function() {
            const event = {
                title: 'Pernikahan Hendri & Desfirani',
                description: 'Pernikahan Hendri Putra Ariga & Desfirani Khumaira',
                location: 'Venue Address',
                startDate: '2025-02-01T08:00:00',
                endDate: '2025-02-01T17:00:00'
            };

            const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.startDate.replace(/[-:]/g, '')}/${event.endDate.replace(/[-:]/g, '')}`;
            
            window.open(googleCalendarUrl, '_blank');
        });
    }
});
