if (window.lucide) lucide.createIcons();

const searchInput = document.querySelector('#subject-search');
const filterButtons = document.querySelectorAll('.filter-chip');
const subjectCards = [...document.querySelectorAll('.subject-card')];
const emptyState = document.querySelector('#empty-state');
let activeFilter = 'all';

function updateSubjects() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  subjectCards.forEach((card) => {
    const matchesFilter = activeFilter === 'all' || card.dataset.status === activeFilter;
    const matchesSearch = card.dataset.search.includes(query);
    const isVisible = matchesFilter && matchesSearch;
    card.style.display = isVisible ? 'flex' : 'none';
    if (isVisible) visible += 1;
  });
  emptyState.style.display = visible ? 'none' : 'block';
}

searchInput.addEventListener('input', updateSubjects);
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    updateSubjects();
  });
});

const backdrop = document.querySelector('#modal-backdrop');
const pitchTitle = document.querySelector('#pitch-title');
const toast = document.querySelector('#toast');

function openModal() {
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => pitchTitle.focus(), 40);
}

function closeModal() {
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

document.querySelector('#open-pitch').addEventListener('click', openModal);
document.querySelector('#add-card').addEventListener('click', openModal);
document.querySelector('#modal-close').addEventListener('click', closeModal);
document.querySelector('#cancel-pitch').addEventListener('click', closeModal);
backdrop.addEventListener('click', (event) => {
  if (event.target === backdrop) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !backdrop.hidden) closeModal();
  if (event.key.toLowerCase() === 'n' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') openModal();
});

document.querySelector('#pitch-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = pitchTitle.value.trim();
  if (!title) return;
  closeModal();
  event.target.reset();
  toast.classList.add('visible');
  window.setTimeout(() => toast.classList.remove('visible'), 3200);
});

const navItems = document.querySelectorAll('.nav-item');
const deskView = document.querySelector('#desk-view');
const planningView = document.querySelector('#planning-view');
const aboutView = document.querySelector('#about-view');
const teamView = document.querySelector('#team-view');
const briefsView = document.querySelector('#briefs-view');
const settingsView = document.querySelector('#settings-view');
const breadcrumbTitle = document.querySelector('#breadcrumb-title');

function showView(viewName) {
  const isPlanning = viewName === 'planning';
  const isAbout = viewName === 'about';
  const isTeam = viewName === 'team';
  const isBriefs = viewName === 'briefs';
  const isSettings = viewName === 'settings';
  const setVisible = (element, visible) => {
    if (visible) element.removeAttribute('hidden');
    else element.setAttribute('hidden', '');
  };
  setVisible(deskView, !isPlanning && !isAbout && !isTeam && !isBriefs && !isSettings);
  setVisible(planningView, isPlanning);
  setVisible(aboutView, isAbout);
  setVisible(teamView, isTeam);
  setVisible(briefsView, isBriefs);
  setVisible(settingsView, isSettings);
  breadcrumbTitle.textContent = isPlanning ? 'Planning' : isAbout ? 'Notre ligne' : isTeam ? 'L’équipe' : isBriefs ? 'Briefs partagés' : isSettings ? 'Paramètres' : 'Accueil';
  navItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === `#${viewName}` || (viewName === 'desk' && item.getAttribute('href') === '#desk')));
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('href').slice(1);
    if (['desk', 'planning', 'about', 'team', 'briefs', 'settings'].includes(target)) showView(target);
  });
});

document.querySelectorAll('[data-slide-action]').forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.slideAction));
});

const slides = [...document.querySelectorAll('.carousel-slide')];
const dots = [...document.querySelectorAll('.carousel-dot')];
const carousel = document.querySelector('.news-carousel');
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === currentSlide));
  dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === currentSlide));
  carousel.style.setProperty('--slide-image', slides[currentSlide].style.getPropertyValue('--slide-image'));
}

document.querySelector('#previous-slide').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('#next-slide').addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
showSlide(0);
window.setInterval(() => {
  if (!document.hidden) showSlide(currentSlide + 1);
}, 6500);

window.addEventListener('hashchange', () => {
  const target = window.location.hash.slice(1);
  if (target === 'planning' || target === 'about' || target === 'team' || target === 'briefs' || target === 'settings' || target === 'desk') showView(target);
});

const initialView = window.location.hash.slice(1);
if (initialView === 'planning' || initialView === 'about' || initialView === 'team' || initialView === 'briefs' || initialView === 'settings') showView(initialView);

const themeOptions = document.querySelectorAll('.theme-option');
function applyTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');
  themeOptions.forEach((option) => option.classList.toggle('active', option.dataset.themeChoice === theme));
  localStorage.setItem('impactnews-theme', theme);
}

themeOptions.forEach((option) => option.addEventListener('click', () => applyTheme(option.dataset.themeChoice)));
applyTheme(localStorage.getItem('impactnews-theme') || 'light');
