async function loadJson(path) {
  const res = await fetch(path);
  return res.json();
}

function isPrintRoute() {
  return window.location.hash === '#print' ||
    new URLSearchParams(window.location.search).get('print') === '1';
}

function renderProject(project, options = {}) {
  const details = options.compact
    ? project.details?.slice(0, 3)
    : project.details;

  return `
    <div class="card">
      <div class="item-heading">
        <div>
          <h3>
            ${project.name}
            ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-github-link">[GitHub]</a>` : ''}
          </h3>
        </div>
        ${project.status ? `<p class="meta">${project.status}</p>` : ''}
      </div>
      <p>${project.description}</p>

      ${details?.length ? `
        <ul>
          ${details.map(x => `<li>${x}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;
}

function renderSkillRows(skills) {
  return skills
    .map(skill => `
      <div class="skill-row">
        <strong>${skill.name}</strong>
        <span>${skill.keywords.join(', ')}</span>
      </div>
    `)
    .join('');
}

async function init() {
  const [profile, resume, projects, taste] = await Promise.all([
    loadJson('./data/profile.json'),
    loadJson('./data/resume.json'),
    loadJson('./data/projects.json'),
    loadJson('./data/engineering-taste.json')
  ]);

  document.getElementById('app').innerHTML = `
    <section class="print-resume-header" aria-label="Resume header">
      <h1>${profile.name}</h1>
      <p class="print-title">${profile.title}</p>
      <p class="print-contact">
        <a href="mailto:${profile.email}">${profile.email}</a>
        <span>·</span>
        <a href="${profile.github}" target="_blank" rel="noopener noreferrer">
          ${profile.github.replace('https://', '')}
        </a>
      </p>
      <p class="print-summary">${profile.summary}</p>
      <div class="print-intro">
        ${profile.intro.slice(1, 3).map(text => `<p>${text}</p>`).join('')}
      </div>
    </section>

    <section id="home">
      <h2>${profile.name}</h2>
      <p><strong>${profile.title}</strong></p>

      <div class="card">
        ${profile.intro
          .map(text => `<p>${text}</p>`)
          .join('')}
      </div>

      <div class="focus-tags" aria-label="관심 분야">
        ${profile.focus.map(item => `<span>${item}</span>`).join('')}
      </div>
    </section>

    <section id="experience">
      <h2>경력</h2>
      ${resume.work.map(job => `
        <div class="card">
          <div class="item-heading">
            <div>
              <h3>${job.name}</h3>
              ${job.note ? `<p class="job-note">${job.note}</p>` : ''}
              <p class="role">${job.position}</p>
            </div>
            <p class="meta">${job.startDate} ~ ${job.endDate}</p>
          </div>
          <p>${job.summary}</p>

          ${job.highlights?.length ? `
            <ul>
              ${job.highlights.map(x => `<li>${x}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </section>

    <section id="projects">
      <h2>프로젝트</h2>
      <div class="web-projects">
        ${projects.map(project => renderProject(project)).join('')}
      </div>
      <div class="print-projects">
        ${projects.map(project => renderProject(project, { compact: true })).join('')}
      </div>
    </section>

    <section id="taste">
      <h2>엔지니어링 성향</h2>
      <div class="card">
        <ul>
          ${taste.preferences.map(x => `<li>${x}</li>`).join('')}
        </ul>
      </div>
    </section>

    <section id="skills">
      <h2>기술 스택</h2>
      <div class="web-skills">
        ${resume.skills.map(skill => `
          <div class="card skill-card ${skill.name === 'Primary' ? 'is-primary' : ''}">
            <h3>${skill.name}</h3>
            <p>${skill.keywords.join(' · ')}</p>
          </div>
        `).join('')}
      </div>
      <div class="print-skills">
        ${renderSkillRows(resume.skills)}
      </div>
    </section>

    <section id="contact">
      <h2>연락처</h2>
      <div class="contact-links">
        <a href="mailto:${profile.email}">
          ${profile.email}
        </a> 
        <p>
          <a href="${profile.github}" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </div>
      <small>${profile.footer}</small>
    </section>
  `;
}

init();

if (isPrintRoute()) {
  document.body.classList.add('print-mode');
}

window.addEventListener('hashchange', () => {
  document.body.classList.toggle('print-mode', isPrintRoute());
});

const printButton = document.getElementById('print-button');

if (printButton) {
  printButton.addEventListener('click', () => {
    window.print();
  });
}
