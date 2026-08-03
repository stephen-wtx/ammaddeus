document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const originalGroup = document.getElementById("originalGroup");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const container = track.parentElement;

    // Animation variables
    let isPlaying = false;
    let currentPosition = 0;
    let lastTime = 0;
    let animationFrameId = null;

    // Drag variables
    let isDragging = false;
    let startX = 0;
    let startPosition = 0;

    const SPEED_PER_SECOND = 35;

    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;

        const deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        const maxScroll =
            track.scrollWidth - container.clientWidth;

        currentPosition -= SPEED_PER_SECOND * deltaTime;

        if (Math.abs(currentPosition) >= maxScroll) {
            currentPosition = -maxScroll;
            track.style.transform = `translate3d(${currentPosition}px,0,0)`;

            stopCarousel();
            return;
        }

        track.style.transform = `translate3d(${currentPosition}px,0,0)`;

        if (isPlaying) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    function startCarousel() {
        if (isPlaying) return;

        isPlaying = true;
        playPauseBtn.textContent = "❚❚ Pause";
        lastTime = 0;

        animationFrameId = requestAnimationFrame(animate);
    }

    function stopCarousel() {
        isPlaying = false;
        playPauseBtn.textContent = "▶ Play";

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function toggleCarousel() {
        if (isPlaying) {
            stopCarousel();
        } else {
            startCarousel();
        }
    }

    playPauseBtn.addEventListener("click", toggleCarousel);

    // Tap any image to start
    document.querySelectorAll(".carousel-group img").forEach(img => {
        img.addEventListener("click", () => {
            if (!isPlaying) {
                startCarousel();
            }
        });
    });

    // ======================
    // Drag functionality
    // ======================

    container.addEventListener("pointerdown", (e) => {
        isDragging = true;

        stopCarousel();

        startX = e.clientX;
        startPosition = currentPosition;

        container.style.cursor = "grabbing";
    });

    container.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;

        currentPosition = startPosition + dx;

        const maxScroll =
            track.scrollWidth - container.clientWidth;

        if (currentPosition > 0) {
            currentPosition = 0;
        }

        if (Math.abs(currentPosition) > maxScroll) {
            currentPosition = -maxScroll;
        }

        track.style.transform = `translate3d(${currentPosition}px,0,0)`;
    });

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;
        container.style.cursor = "grab";
    }

    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointerleave", endDrag);
    container.addEventListener("pointercancel", endDrag);
});
