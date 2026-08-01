document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const originalGroup = document.getElementById("originalGroup");
    const playPauseBtn = document.getElementById("playPauseBtn");

    // Duplica dinamicamente o grupo de imagens para garantir o loop infinito perfeito
    // const clonedGroup = originalGroup.cloneNode(true);
    // clonedGroup.removeAttribute("id"); 
    // track.appendChild(clonedGroup);

    // Variáveis de controle de animação
    let isPlaying = false;
    let currentPosition = 0;
    let lastTime = 0;
    let animationFrameId = null;

    // Velocidade: ~25 pixels por segundo
    const SPEED_PER_SECOND = 35; 

    // Função de animação fluida por tempo real
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;

        const deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        const maxScroll =
            track.scrollWidth - track.parentElement.clientWidth;

        currentPosition -= SPEED_PER_SECOND * deltaTime;

        // Chegou no último card
        if (Math.abs(currentPosition) >= maxScroll) {
            currentPosition = -maxScroll;
            track.style.transform = `translate3d(${currentPosition}px,0,0)`;

            isPlaying = false;
            playPauseBtn.textContent = "▶ Play";
            return;
        }

        track.style.transform = `translate3d(${currentPosition}px,0,0)`;

        if (isPlaying) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    // Liga/Desliga o movimento
    function toggleCarousel() {
        if (!isPlaying) {
            isPlaying = true;
            playPauseBtn.textContent = "❚❚ Pause";
            lastTime = 0; 
            animationFrameId = requestAnimationFrame(animate);
        } else {
            isPlaying = false;
            playPauseBtn.textContent = "▶ Play";
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }
    }

    playPauseBtn.addEventListener("click", toggleCarousel);
});