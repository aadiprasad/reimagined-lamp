document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.collage-item');
    
    // We can make the radius somewhat responsive
    const calculateRadius = () => {
        return Math.min(window.innerWidth * 0.35, 250); 
    };

    let radius = calculateRadius();

    const positionItems = () => {
        items.forEach((item, index) => {
            // Calculate evenly distributed angle
            const angle = (index / items.length) * 2 * Math.PI;
            
            // Calculate x and y position along the circle
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Apply position
            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
        });
    };

    // Initial position
    positionItems();

    // Update on resize
    window.addEventListener("resize", () => {
        radius = calculateRadius();
        positionItems();
    });
});
