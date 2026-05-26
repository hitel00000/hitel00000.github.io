async function loadJson(path) {
  const res = await fetch(path);
  return res.json();
}

function renderProject(project) {
  return `
    <div class="card">
      <h3>${project.name}</h3>
      <p>${project.description}</p>

      ${project.details?.length ? `
        <ul>
          ${project.details.map(x => `<li>${x}</li>`).join('')}
        </ul>
      ` : ''}

      ${project.status ? `
        <small>${project.status}</small>
      ` : ''}
    </div>
  `;
}

async function init() {
  const [profile, resume, projects, taste] = await Promise.all([
    loadJson('./data/profile.json'),
    loadJson('./data/resume.json'),
    loadJson('./data/projects.json'),
    loadJson('./data/engineering-taste.json')
  ]);

  document.getElementById('app').innerHTML = `
    <section id="home">
      <h2>${profile.name}</h2>
      <p><strong>${profile.title}</strong></p>

      <div class="card">
        ${profile.intro
          .map(text => `<p>${text}</p>`)
          .join('')}
      </div>

      <p><strong>관심 분야</strong></p>
      <p>${profile.focus.join(' · ')}</p>
    </section>

    <section id="experience">
      <h2>경력</h2>
      ${resume.work.map(job => `
        <div class="card">
          <h3>${job.name}</h3>
          <p><strong>${job.position}</strong></p>
          <p>${job.startDate} ~ ${job.endDate}</p>
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
      ${projects.map(renderProject).join('')}
    </section>

    <section id="taste">
      <h2>엔지니어링 성향</h2>
      <div class="card">
        <ul>
          ${taste.preferences.map(x => `<li>${x}</li>`).join('')}
        </ul>
      </div>
    </section>

    <section id="resume">
      <h2>기술 스택</h2>
      ${resume.skills.map(skill => `
        <div class="card">
          <h3>${skill.name}</h3>
          <p>${skill.keywords.join(' · ')}</p>
        </div>
      `).join('')}
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

const isPrintMode =
  new URLSearchParams(window.location.search)
    .get('print') === '1';

if (isPrintMode) {
  document.body.classList.add('print-mode');
}

const printButton = document.getElementById('print-button');

if (printButton) {
  printButton.addEventListener('click', () => {
    window.print();
  });
}
