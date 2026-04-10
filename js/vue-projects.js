// Vue.js CDN y lógica para cargar proyectos desde JSON y mostrar detalles
const app = Vue.createApp({
  data() {
    return {
      projects: [],
      selectedTech: 'all',
      showModal: false,
      activeProject: null,
      showAllProjects: false,
      windowWidth: window.innerWidth,
      techOptions: [
        'all', 'React', 'TypeScript', 'Node.js', 'Next.js', 'MongoDB', 'PostgreSQL', 'Firebase', 'Tailwind', 'Framer Motion', 'Expo', 'Chart.js', 'React Native', 'Stripe'
      ]
    };
  },
  computed: {
    filteredProjects() {
      if (this.selectedTech === 'all') return this.projects;
      return this.projects.filter(p => p.technologies.includes(this.selectedTech));
    },
    visibleProjects() {
      // show only the actual filtered projects (no repetition)
      return this.filteredProjects;
    },
    isMobile() {
      return this.windowWidth <= 700;
    }
  },
  watch: {
    selectedTech() {
      // re-init carousel when filter changes
      setTimeout(() => this.initCarousel(), 80);
    }
  },
  methods: {
    async fetchProjects() {
      const res = await fetch('js/projects.json');
      this.projects = await res.json();
      // init carousel after loading projects
      setTimeout(() => this.initCarousel(), 120);
    },
    openModal(project) {
      window.location.href = `projects/detail.html?id=${project.id}`;
    },
    closeModal() {
      this.showModal = false;
      this.activeProject = null;
      document.body.style.overflow = '';
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      // Re-init carousel on resize to re-calculate sizes
      this.initCarousel();
    },
    showMoreProjects() {
      this.showAllProjects = true;
    },
    // no repetition: removed prepareRepeatedProjects
    initCarousel() {
      try {
        const container = document.querySelector('#vue-projects .projects-cards');
        if (!container) return;
        // ensure styles are applied by forcing class
        container.classList.add('carousel');
        // remove any previous handler (no infinite loop now)
        if (this._carouselHandler) {
          container.removeEventListener('scroll', this._carouselHandler);
          this._carouselHandler = null;
        }
        // intersection observer to animate the centered card
        if (this._carouselObserver) this._carouselObserver.disconnect();
        const options = { root: container, threshold: [0.45, 0.6, 0.9] };
        this._carouselObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const el = entry.target;
            if (entry.intersectionRatio > 0.55) {
              el.classList.add('active');
            } else {
              el.classList.remove('active');
            }
          });
        }, options);
        // observe each card
        const cards = Array.from(container.querySelectorAll('.project-card'));
        cards.forEach(c => this._carouselObserver.observe(c));
      } catch (e) {
        console.warn('carousel init error', e);
      }
    },
    destroyCarousel() {
      const container = document.querySelector('#vue-projects .projects-cards');
      if (!container) return;
      container.classList.remove('carousel');
      this._carouselHandler = null;
      if (this._carouselObserver) {
        this._carouselObserver.disconnect();
        this._carouselObserver = null;
      }
    },
    scrollCarousel(dir = 'right') {
      try {
        const container = document.querySelector('#vue-projects .projects-cards');
        if (!container) return;
        // prefer scrolling by roughly half the visible width (so 2 cards view on desktop)
        const step = Math.max(Math.floor(container.clientWidth * 0.5), 200);
        const delta = dir === 'left' ? -step : step;
        container.scrollBy({ left: delta, behavior: 'smooth' });
      } catch (e) {
        console.warn('scrollCarousel error', e);
      }
    },
  },
  mounted() {
    this.fetchProjects();
    this.windowWidth = window.innerWidth;
    // init handled after projects are fetched
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.destroyCarousel && this.destroyCarousel();
  }
});

app.component('project-card', {
  props: ['project', 'index', 'total'],
  computed: {
    cardClass() {
      if (this.total === 1) return 'big solo';
      if (this.total === 2) return 'big';
      if (this.total === 3) return this.index < 2 ? 'big' : 'small solo';
      return this.index < 2 ? 'big' : 'small';
    }
  },
  template: `
    <div class="project-card" :class="cardClass" @click="$root.openModal(project)">
      <div class="project-img-container">
        <img :src="project.image" :alt="project.title" class="project-img" />
        <div class="project-title-overlay" v-if="cardClass.includes('small')">{{ project.title }}</div>
      </div>
      <div class="project-info">
        <div class="project-name">{{ project.title }}</div>
        <div class="project-desc">{{ project.description }}</div>
        <div class="project-tags">
          <span v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
        </div>
      </div>
    </div>
  `
});

app.mount('#vue-projects');
