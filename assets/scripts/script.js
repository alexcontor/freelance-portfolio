const assetsDataURL = 'https://raw.githubusercontent.com/alexcontor/freelance-portfolio/refs/heads/main/assets/data';
const skillsGrid = document.getElementById('skills-grid');
const projectsGrid = document.getElementById('projects-grid');

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-header');
const modalSubhead = document.getElementById('modal-subhead');
const modalDescription = document.getElementById('modal-description');
const modalExtraInfo = document.getElementById('modal-extra-info');

function ellipsizeText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text; // Return as is if the text doesn't exceed maxLength
}

function darkenHex(hex, amount = 70) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function lightenHex(hex, amount = 66) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
    const b = Math.min(255, (num & 0x0000FF) + amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Scrollspy manually in Bootstrap 5
    var scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#scrollspy-navbar',
        offset: 300
    });
});

// START OF TECHNICAL SKILLS
fetch(assetsDataURL + '/technical-skills.json')
    .then(res => res.json())
    .then(data => {
    data.forEach(skill => {
        const alteredColor = lightenHex(skill.hex_color);
        const imagePath = `assets/icons/technical-skills/${skill.id}.png`;

        const skillCard = document.createElement('div');
        skillCard.classList.add('grid-item');
        skillCard.style.backgroundColor = alteredColor;
        //skillCard.style.borderColor = skill.hex_color;

        skillCard.innerHTML = `
            <img src="${imagePath}" alt="${skill.card_title}">
            <h3>${skill.card_title}</h3>
          `;

        // Add event listener for modal popup
        skillCard.addEventListener('click', () => {
            openModal(skill, imagePath);
        });

        skillsGrid.appendChild(skillCard);
    });
}).catch(err => console.error('Failed to load skills:', err));
// END OF TECHNICAL SKILLS

// START OF PROJECTS
fetch(assetsDataURL + '/projects.json')
    .then(res => res.json())
    .then(data => {
    const projectsGrid = document.getElementById('projects-grid');
    data.forEach(project => {
        const alteredColor = lightenHex(project.hex_color);
        const imagePath = `assets/icons/projects/${project.id}.png`;

        // Create project card dynamically
        const projectCard = document.createElement('div');
        projectCard.classList.add('grid-item');
        projectCard.style.backgroundColor = alteredColor;
        //projectCard.style.borderColor = project.hex_color;

        projectCard.innerHTML = `
          <img src="${imagePath}" alt="${project.card_title}">
          <h3>${project.card_title}</h3>
        `;

        // Add event listener for modal popup
        projectCard.addEventListener('click', () => {
            openModal(project, imagePath);
        });

        projectsGrid.appendChild(projectCard);
    });
}).catch(err => console.error('Failed to load projects:', err));
// END OF PROJECTS

// START OF TESTIMONIALS
fetch(assetsDataURL + '/testimonials.json')
    .then(res => res.json())
    .then(data => {
    const carouselInner = document.querySelector('.carousel-inner');

    // Create and append testimonials
    data.forEach((testimonial, index) => {
        const testimonialItem = document.createElement('div');
        testimonialItem.classList.add('carousel-item');

        // Add the 'active' class to the first item
        if (index === 0) {
            testimonialItem.classList.add('active');
        }

        // Create the structure: image, header, subhead, and description
        testimonialItem.innerHTML = `
                <div class="testimonial-content">
                    <h5>${testimonial.header}</h5>
                    <p>${testimonial.subhead}</p>
                    <p>${testimonial.description}</p>
                </div>
            `;

        carouselInner.appendChild(testimonialItem);
    });

    // Adjust the heights of all carousel items to match the tallest one
    const carouselItems = document.querySelectorAll('.carousel-item');
    let maxHeight = 0;

    // Find the tallest item
    carouselItems.forEach(item => {
        maxHeight = Math.max(maxHeight, item.offsetHeight);
    });

    // Set all items to the tallest height
    carouselItems.forEach(item => {
        item.style.height = `${maxHeight}px`;
    });
}).catch(err => console.error('Failed to load testimonials:', err));


// END OF TESTIMONIALS

function openModal(item, imagePath) {
    const alteredColor = lightenHex(item.hex_color);
    modalContent.style.backgroundColor = alteredColor;
    modalImage.src = imagePath;
    modalTitle.textContent = item.subhead;
    modalDescription.textContent = item.description;

    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the modal (on the overlay)
modal.addEventListener('click', function(event) {
    if (event.target === modal) { // Check if the click was on the overlay (not inside the modal content)
        closeModal();
    }
});

// Prevent click propagation when clicking inside the modal content
modalContent.addEventListener('click', function(event) {
    event.stopPropagation();  // Prevent clicks inside the modal content from triggering overlay click
});