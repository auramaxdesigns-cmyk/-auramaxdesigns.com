// AURAMAX DESIGNS — CMS DATA LOADER
// Fetches and renders content from JSON data files

// Global data store
window.cmsData = {
    projects: [],
    awards: [],
    publications: [],
    settings: {}
};

// Load all CMS data
async function loadCMSData() {
    try {
        // Load projects
        const projectsResponse = await fetch('data/projects.json');
        const projectsJson = await projectsResponse.json();
        window.cmsData.projects = projectsJson.projects;

        // Load awards
        const awardsResponse = await fetch('data/awards.json');
        const awardsJson = await awardsResponse.json();
        window.cmsData.awards = awardsJson.awards;
        window.cmsData.publications = awardsJson.publications;

        // Load settings
        const settingsResponse = await fetch('data/settings.json');
        const settingsJson = await settingsResponse.json();
        window.cmsData.settings = settingsJson.site;

        // Render all sections
        renderHero();
        renderProjects();
        renderAwards();
        renderPublications();
        renderFooter();

        console.log('CMS data loaded successfully:', window.cmsData);
    } catch (error) {
        console.error('Error loading CMS data:', error);
        // Fallback to static content if CMS fails
    }
}

// Render Hero Section
function renderHero() {
    const settings = window.cmsData.settings;
    document.getElementById('hero-title').textContent = settings.title || 'Auramax Designs';
    document.getElementById('hero-tagline').textContent = settings.tagline || 'Thoughtful spaces crafted with precision';
}

// Render Projects
function renderProjects() {
    const projects = window.cmsData.projects;
    const grid = document.getElementById('project-grid');

    grid.innerHTML = projects.map(project => `
        <article class="project-card project-card-${project.gridSize}">
            <div class="project-image">
                <img src="${project.gridImage}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p class="project-meta">${project.type} / ${project.year}</p>
                <p class="project-description">${project.description}</p>
                <a href="project-dynamic.html?id=${project.id}" class="project-link">Explore the project</a>
            </div>
        </article>
    `).join('');
}

// Render Awards
function renderAwards() {
    const awards = window.cmsData.awards;
    const grid = document.getElementById('awards-grid');

    grid.innerHTML = awards.map(award => `
        <div class="award-item">
            <h4>${award.title}</h4>
            <p class="award-year">${award.year}</p>
            <p class="award-org">${award.organization}</p>
        </div>
    `).join('');
}

// Render Publications
function renderPublications() {
    const publications = window.cmsData.publications;
    const list = document.getElementById('publications-list');

    list.innerHTML = publications.map(pub => `
        <li><span class="publication-title">${pub.title}</span> — ${pub.publication}, ${pub.date}</li>
    `).join('');
}

// Render Footer
function renderFooter() {
    const settings = window.cmsData.settings;
    const footer = document.getElementById('footer-content');

    footer.innerHTML = `
        <div class="footer-section">
            <h3>${settings.title}</h3>
            <p>${settings.tagline}</p>
        </div>

        <div class="footer-section">
            <h4>Studio Location</h4>
            <p>
                ${settings.location}<br>
                ${settings.region}
            </p>
        </div>

        <div class="footer-section">
            <h4>Get in Touch</h4>
            <p>
                <a href="mailto:${settings.email}">${settings.email}</a><br>
                <a href="tel:${settings.phone.replace(/\D/g, '')}">${settings.phone}</a>
            </p>
        </div>

        <div class="footer-section">
            <h4>Follow</h4>
            <p>
                ${settings.social?.instagram ? `<a href="${settings.social.instagram}">Instagram</a><br>` : ''}
                ${settings.social?.linkedin ? `<a href="${settings.social.linkedin}">LinkedIn</a>` : ''}
            </p>
        </div>
    `;

    document.getElementById('copyright').textContent = settings.copyright || '© 2024 Auramax Designs. All rights reserved.';
}

// Load data when DOM is ready
document.addEventListener('DOMContentLoaded', loadCMSData);

// Helper function to get project by ID
function getProjectById(projectId) {
    return window.cmsData.projects.find(p => p.id === projectId);
}

// Helper function to render project page
function renderProjectPage(project) {
    if (!project) return;

    const container = document.getElementById('project-content');
    if (!container) return;

    const featuresHtml = project.features ? project.features.map(feature => `
        <div class="feature">
            <h4>${feature.title}</h4>
            <p>${feature.description}</p>
        </div>
    `).join('') : '';

    const materialsHtml = project.materials ? `
        <table class="materials-table">
            <tr>
                <th>Element</th>
                <th>Material</th>
                <th>Specification</th>
            </tr>
            ${project.materials.map(material => `
                <tr>
                    <td>${material.element}</td>
                    <td>${material.material}</td>
                    <td>${material.finish}</td>
                </tr>
            `).join('')}
        </table>
    ` : '';

    container.innerHTML = `
        <div class="case-study-header">
            <h1>${project.title}</h1>
            <div class="case-study-meta">
                <span class="meta-item">
                    <strong>Project Type:</strong> ${project.type}
                </span>
                <span class="meta-item">
                    <strong>Completed:</strong> ${project.year}
                </span>
            </div>
        </div>

        <div class="case-study-body">
            <section class="case-study-section">
                <h2>Overview</h2>
                <p>${project.overview}</p>
            </section>

            <section class="case-study-section">
                <h2>Design Concept</h2>
                <p>${project.concept}</p>
            </section>

            ${project.features ? `
                <section class="case-study-section">
                    <h2>Key Features</h2>
                    <div class="features-grid">
                        ${featuresHtml}
                    </div>
                </section>
            ` : ''}

            ${project.materials ? `
                <section class="case-study-section">
                    <h2>Materials & Specifications</h2>
                    ${materialsHtml}
                </section>
            ` : ''}

            <section class="case-study-section">
                <h2>Outcome</h2>
                <p>${project.outcome}</p>
            </section>
        </div>

        <div class="case-study-navigation">
            <a href="index-dynamic.html#projects" class="nav-button">← Back to Projects</a>
        </div>
    `;
}
