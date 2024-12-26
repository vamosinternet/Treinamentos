document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

class App {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.coursesSection = document.getElementById('courses-section');
        this.moduleSection = document.getElementById('module-section');
        this.videoPlayerSection = document.getElementById('video-player-section');
        this.courseList = document.getElementById('course-list');
        this.videoList = document.getElementById('video-list');
        this.moduleTitle = document.getElementById('module-title');
        this.backToCourses = document.getElementById('back-to-courses');
        this.backToModule = document.getElementById('back-to-module');
        this.currentModule = null;
    }

    init() {
        this.renderCourses();
        this.addEventListeners();
    }

    addEventListeners() {
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.backToCourses.addEventListener('click', () => this.showCoursesSection());
        this.backToModule.addEventListener('click', () => this.showModuleSection());
        this.backToModule.addEventListener('click', () => {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) {
                videoPlayer.pause();
            }
        });
    }

    renderCourses() {
        this.courseList.innerHTML = '';
        Object.entries(videoModules).forEach(([moduleKey, module]) => {
            const courseCard = this.createCard(module.name, `${module.videos.length} aulas`, module.thumbnail);
            courseCard.addEventListener('click', () => this.showModule(moduleKey, module));
            this.courseList.appendChild(courseCard);
        });
    }

    showModule(moduleKey, module) {
        this.currentModule = module;
        this.showSection(this.moduleSection);
        this.moduleTitle.textContent = module.name;
        this.renderVideos(module.videos);
    }

    renderVideos(videos) {
        this.videoList.innerHTML = '';
        videos.forEach(video => {
            const videoCard = this.createCard(video.title, '', video.thumbnail);
            videoCard.addEventListener('click', () => this.playVideo(video));
            this.videoList.appendChild(videoCard);
        });
    }

    playVideo(video) {
        this.showSection(this.videoPlayerSection);
        const videoPlayerContainer = document.getElementById('video-player-container');
        videoPlayerContainer.innerHTML = `
            <video id="video-player" controls>
                <source src="${video.url}" type="video/mp4">
                Seu navegador não suporta o elemento de vídeo.
            </video>
            <h3>${video.title}</h3>
        `;
    }

    createCard(title, description, image) {
        const card = document.createElement('div');
        card.classList.add('card');
        let imageHtml = image ? `<img src="${image}" alt="${title}">` : '';
        card.innerHTML = `
            ${imageHtml}
            <div class="card-content">
                <h3 class="card-title">${title}</h3>
                <p class="card-description">${description}</p>
            </div>
        `;
        return card;
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredModules = Object.entries(videoModules).reduce((acc, [moduleKey, module]) => {
            if (module.name.toLowerCase().includes(searchTerm)) {
                acc[moduleKey] = module;
            }
            return acc;
        }, {});
        this.courseList.innerHTML = '';
        Object.entries(filteredModules).forEach(([moduleKey, module]) => {
            const courseCard = this.createCard(module.name, `${module.videos.length} aulas`, module.thumbnail);
            courseCard.addEventListener('click', () => this.showModule(moduleKey, module));
            this.courseList.appendChild(courseCard);
        });
    }

    showCoursesSection() {
        this.showSection(this.coursesSection);
        this.renderCourses();
    }

    showModuleSection() {
        this.showSection(this.moduleSection);
        this.renderVideos(this.currentModule.videos);
    }

    showSection(section) {
        [this.coursesSection, this.moduleSection, this.videoPlayerSection].forEach(s => s.classList.remove('active'));
        section.classList.add('active');
    }
}

