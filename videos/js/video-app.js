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
        this.currentSubmodule = null;
        this.breadcrumbs = [];
    }

    init() {
        this.renderCourses();
        this.addEventListeners();
    }

    addEventListeners() {
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.backToCourses.addEventListener('click', () => this.navigateBack());
        this.backToModule.addEventListener('click', () => this.navigateBack());
    }

    renderCourses() {
        this.courseList.innerHTML = '';
        Object.entries(videoModules).forEach(([moduleKey, module]) => {
            const courseCard = this.createCard(module.name, `${this.countVideos(module.videos)} aulas`, module.thumbnail);
            courseCard.addEventListener('click', () => this.showModule(moduleKey, module));
            this.courseList.appendChild(courseCard);
        });
    }

    countVideos(videos) {
        return videos.reduce((count, video) => {
            // Skip disabled videos in the count
            if (video.disabled) return count;
            return count + (video.videos ? this.countVideos(video.videos) : 1);
        }, 0);
    }

    showModule(moduleKey, module) {
        this.currentModule = module;
        this.currentSubmodule = null;
        this.breadcrumbs = [{ name: 'Cursos', action: () => this.showCoursesSection() }, { name: module.name }];
        this.updateBreadcrumbs();
        this.showSection(this.moduleSection);
        this.moduleTitle.textContent = module.name;
        this.renderVideos(module.videos);
    }

    renderVideos(videos) {
        this.videoList.innerHTML = '';
        videos.forEach(video => {
            // Skip disabled videos
            if (video.disabled) return;
            
            const videoCard = this.createCard(video.title, '', video.thumbnail);
            videoCard.addEventListener('click', () => {
                if (video.videos) {
                    this.showSubmodule(video);
                } else {
                    this.playVideo(video);
                }
            });
            this.videoList.appendChild(videoCard);
        });
    }

    showSubmodule(submodule) {
        this.currentSubmodule = submodule;
        this.breadcrumbs.push({ name: submodule.title });
        this.updateBreadcrumbs();
        this.moduleTitle.textContent = submodule.title;
        this.renderVideos(submodule.videos);
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
            const courseCard = this.createCard(module.name, `${this.countVideos(module.videos)} aulas`, module.thumbnail);
            courseCard.addEventListener('click', () => this.showModule(moduleKey, module));
            this.courseList.appendChild(courseCard);
        });
    }

    showCoursesSection() {
        this.showSection(this.coursesSection);
        this.renderCourses();
    }

    showSection(section) {
        [this.coursesSection, this.moduleSection, this.videoPlayerSection].forEach(s => s.classList.remove('active'));
        section.classList.add('active');
    }

    navigateBack() {
        if (this.breadcrumbs.length > 1) {
            this.breadcrumbs.pop();
            const lastBreadcrumb = this.breadcrumbs[this.breadcrumbs.length - 1];
            if (lastBreadcrumb.action) {
                lastBreadcrumb.action();
            } else {
                this.showModule(this.currentModule.name, this.currentModule);
            }
        } else {
            this.showCoursesSection();
        }
    }

    updateBreadcrumbs() {
        const breadcrumbsContainer = document.createElement('div');
        breadcrumbsContainer.classList.add('breadcrumbs');
        this.breadcrumbs.forEach((crumb, index) => {
            const crumbElement = document.createElement('span');
            crumbElement.textContent = crumb.name;
            if (crumb.action) {
                crumbElement.classList.add('clickable');
                crumbElement.addEventListener('click', crumb.action);
            }
            breadcrumbsContainer.appendChild(crumbElement);
            if (index < this.breadcrumbs.length - 1) {
                const separator = document.createElement('span');
                separator.textContent = ' > ';
                breadcrumbsContainer.appendChild(separator);
            }
        });
        this.moduleSection.insertBefore(breadcrumbsContainer, this.moduleSection.firstChild);
    }
}
