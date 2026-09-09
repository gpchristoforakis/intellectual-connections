const progress = document.querySelector('#reading-progress');
const sections = [...document.querySelectorAll('article section')];
const navLinks = [...document.querySelectorAll('.contents a')];
const toast = document.querySelector('#toast');

function updateReadingState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
  progress.style.width = `${percent}%`;

  let current = sections[0]?.id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.38) current = section.id;
  }
  navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${current}`));
}

async function sharePage() {
  const data = { title: document.title, text: 'The Conversation That Never Happened', url: window.location.href };
  if (navigator.share) {
    try { await navigator.share(data); return; } catch (error) { if (error.name === 'AbortError') return; }
  }
  await navigator.clipboard.writeText(window.location.href);
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1800);
}

document.querySelector('#share-button').addEventListener('click', sharePage);
document.querySelector('#footer-share').addEventListener('click', sharePage);
window.addEventListener('scroll', updateReadingState, { passive: true });
updateReadingState();
