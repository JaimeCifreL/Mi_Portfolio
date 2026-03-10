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
      if (this.showAllProjects || !this.isMobile) return this.filteredProjects;
      return this.filteredProjects.slice(0, 2);
    },
    isMobile() {
      return this.windowWidth <= 700;
    }
  },
  methods: {
    async fetchProjects() {
      const res = await fetch('js/projects.json');
      this.projects = await res.json();
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
    },
    showMoreProjects() {
      this.showAllProjects = true;
    }
  },
  mounted() {
    this.fetchProjects();
    this.windowWidth = window.innerWidth;
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
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
        <div class="project-name" v-if="cardClass.includes('big')">{{ project.title }}</div>
        <div class="project-desc" v-if="cardClass.includes('big')">{{ project.description }}</div>
        <div class="project-tags">
          <span v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
        </div>
      </div>
    </div>
  `
});

app.mount('#vue-projects');
