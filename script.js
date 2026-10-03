(() => {
  'use strict';
  const COURSES = [
    'Class 1 - 10 (CBSE)',
    'Class 1 - 10 (ICSE)',
    'Class 1 - 10 (State Board)',
    '11th Science',
    '11th Commerce',
    '11th Arts'
  ];
  const DOCUMENTS = ['Passport Size Photo', 'Birth Certificate', 'Previous Marksheet', 'Transfer Certificate', 'Identity Proof', "Parent's ID Proof"];
  const STATUSES = ['Submitted', 'Under Review', 'Shortlisted', 'Merit List', 'Admitted', 'Rejected'];
  const STORE_KEY = 'admitschool-applications-v1';
  const content = document.getElementById('pageContent');
  const modalRoot = document.getElementById('modalRoot');
  const toastRegion = document.getElementById('toastRegion');
  let currentPage = 'dashboard';
  let activeApplicationId = null;
  let applicationStep = 1;
  let activeChartPeriod = 'Month';

const starterApplications = [{
    id: 'AS-25041',
    firstName: 'Zoe',
    lastName: 'Winslow',
    email: 'notthatzoe@email.com',
    phone: '+1 202 555 0143',
    dob: '2013-04-26',
    gender: 'Female',
    course: 'Grade 10 (IB)',
    previousSchool: 'ACS Athens - American Community Schools',
    previousScore: 92,
    parentName: 'Robert Winslow',
    parentPhone: '+1 202 555 0199',
    address: '18 Park View Road, London',
    status: 'Admitted',
    date: '2026-06-12',
    examScore: 86,
    feePaid: 32000,
    documents: ['Passport Size Photo', 'Birth Certificate', 'Previous Marksheet'],
    comment: 'Academic records look strong. Awaiting transfer certificate.'
  },
  {
    id: 'AS-25040',
    firstName: 'Anna',
    lastName: 'Vance',
    email: 'anna.vance@email.com',
    phone: '+44 7700 900077',
    dob: '2009-02-24',
    gender: 'Female',
    course: 'Grade 11 (Science)',
    previousSchool: 'St. Mary High School',
    previousScore: 96,
    parentName: 'Mark Vance',
    parentPhone: '+44 7700 900078',
    address: '42 Lake Avenue, Bristol',
    status: 'Admitted',
    date: '2026-06-11',
    examScore: 94,
    feePaid: 20000,
    documents: ['Passport Size Photo', 'Birth Certificate', 'Previous Marksheet', 'Transfer Certificate', 'Identity Proof'],
    comment: 'Excellent entrance assessment.'
  },
  {
    id: 'AS-25039',
    firstName: 'Invi',
    lastName: 'Kross',
    email: 'invi.kross@email.com',
    phone: '+1 415 555 2671',
    dob: '2011-05-09',
    gender: 'Male',
    course: 'Grade 8 (Cambridge)',
    previousSchool: 'Sunrise Academy',
    previousScore: 84,
    parentName: 'Elena Kross',
    parentPhone: '+1 415 555 2672',
    address: '7 Hill Street, San Francisco',
    status: 'Shortlisted',
    date: '2026-06-10',
    examScore: 0,
    feePaid: 0,
    documents: ['Passport Size Photo', 'Birth Certificate'],
    comment: ''
  },
  {
    id: 'AS-25038',
    firstName: 'Kyra',
    lastName: 'Desai',
    email: 'kyra.desai@email.com',
    phone: '+61 2 9382 0000',
    dob: '2009-11-30',
    gender: 'Female',
    course: 'Grade 11 (Commerce)',
    previousSchool: 'Westwood School',
    previousScore: 89,
    parentName: 'Claire Desai',
    parentPhone: '+61 2 9382 1111',
    address: '29 Cedar Lane, Sydney',
    status: 'Merit List',
    date: '2026-06-09',
    examScore: 91,
    feePaid: 0,
    documents: ['Passport Size Photo', 'Birth Certificate', 'Previous Marksheet', 'Transfer Certificate'],
    comment: 'Ranked in the top 10.'
  },
  {
    id: 'AS-25037',
    firstName: 'Leo',
    lastName: 'Rizos',
    email: 'leo.rizos@email.com',
    phone: '+30 21 0123 4567',
    dob: '2014-03-12',
    gender: 'Male',
    course: 'Grade 5',
    previousSchool: 'Riverdale School',
    previousScore: 78,
    parentName: 'Alex Rizos',
    parentPhone: '+30 21 0123 4568',
    address: '51 Maple Road, Athens',
    status: 'Submitted',
    date: '2026-06-08',
    examScore: 74,
    feePaid: 32000,
    documents: DOCUMENTS.slice(0, 5), 
    comment: 'Admission confirmed. Welcome to the school.'
  },
  {
    id: 'AS-25036',
    firstName: 'Chloe',
    lastName: 'Vane',
    email: 'chloe.vane@email.com',
    phone: '+1 212 555 0174',
    dob: '2009-07-19',
    gender: 'Female',
    course: 'Grade 11 (Arts)',
    previousSchool: 'Oakridge International',
    previousScore: 81,
    parentName: 'Victor Vane',
    parentPhone: '+1 212 555 0175',
    address: '12 Garden Road, New York',
    status: 'Rejected',
    date: '2026-06-07',
    examScore: 49,
    feePaid: 0,
    documents: ['Passport Size Photo', 'Birth Certificate', 'Previous Marksheet'],
    comment: 'Entrance score did not meet the minimum criteria.'
  }
];

  function loadApplications() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      return Array.isArray(saved) ? saved : starterApplications;
    } catch (error) {
      return starterApplications;
    }
  }

  let applications = loadApplications();

  function saveApplications() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(applications));
    } catch (error) {
      /* Keep this demo usable when storage is unavailable. */ }
    updateApplicationCount();
  }

  function updateApplicationCount() {
    document.getElementById('navApplicationCount').textContent = applications.length;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function initials(application) {
    return `${(application.firstName || '?').charAt(0)}${(application.lastName || '').charAt(0)}`.toUpperCase();
  }

  function fullName(application) {
    return `${application.firstName || ''} ${application.lastName || ''}`.trim();
  }

  function statusClass(status) {
    return `status-${String(status).toLowerCase().replaceAll(' ', '-')}`;
  }

  function badge(status) {
    return `<span class="status-pill ${statusClass(status)}">${esc(status)}</span>`;
  }

  function dateLabel(value) {
    if (!value) return 'Not provided';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? esc(value) : date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function money(amount) {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  }

  function icon(name) {
    const icons = {
      plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
      download: '<svg viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M5 20h14"/></svg>',
      search: '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>',
      people: '<svg viewBox="0 0 24 24"><path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 4.2a4 4 0 0 1 0 7.6M22 20v-1.5a4 4 0 0 0-3-3.87"/></svg>',
      check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
      clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
      revenue: '<svg viewBox="0 0 24 24"><path d="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    };
    return icons[name] || icons.people;
  }

  function setPage(page, updateHash = true) {
    const allowed = ['dashboard', 'applications', 'registration', 'application-form', 'application-detail', 'exams', 'merit', 'fees', 'reports', 'login'];
    currentPage = allowed.includes(page) ? page : 'dashboard';
    if (updateHash && location.hash.slice(1) !== currentPage) history.pushState({
      page: currentPage
    }, '', `#${currentPage}`);
    const pageTitles = {
      dashboard: 'Dashboard',
      applications: 'Applications',
      registration: 'Student registration',
      'application-form': 'Application form',
      'application-detail': 'Application details',
      exams: 'Entrance exams',
      merit: 'Merit list',
      fees: 'Fees & payments',
      reports: 'Reports',
      login: 'Login / register'
    };
    document.getElementById('breadcrumbCurrent').textContent = pageTitles[currentPage];
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('active', link.dataset.page === (currentPage === 'application-detail' || currentPage === 'application-form' ? 'applications' : currentPage)));
    document.getElementById('sidebar').classList.remove('open');
    renderPage();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function renderPage() {
    const pages = {
      dashboard: renderDashboard,
      applications: renderApplications,
      registration: renderRegistration,
      'application-form': renderApplicationForm,
      'application-detail': renderApplicationDetail,
      exams: renderExams,
      merit: renderMerit,
      fees: renderFees,
      reports: renderReports,
      login: renderLogin
    };
    content.innerHTML = (pages[currentPage] || renderDashboard)();
    if (currentPage === 'dashboard') renderChart();
    if (currentPage === 'reports') renderCourseAnalytics();
  }

  function statCard(label, number, note, iconName, tone, change = '') {
    return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon ${tone}">${icon(iconName)}</span></div><div class="stat-number">${number}</div><div class="stat-foot"><span class="stat-change ${change ? '' : 'neutral'}">${change || 'This admission cycle'}</span><span>${note}</span></div></article>`;
  }

  function pageHeading(eyebrow, title, description, actions = '') {
    return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</div>`;
  }

  function tableRows(items) {
    if (!items.length) return '<tr><td colspan="6"><div class="empty-state">No applications match your search. Try changing your filters.</div></td></tr>';
    return items.map((application, index) => `<tr><td><div class="applicant-cell"><span class="person-avatar tone-${index % 4}">${esc(initials(application))}</span><span class="applicant-meta"><strong>${esc(fullName(application))}</strong><span>${esc(application.id)}</span></span></div></td><td>${esc(application.course)}</td><td>${dateLabel(application.date)}</td><td>${badge(application.status)}</td><td>${application.examScore ? `${esc(application.examScore)} / 100` : '<span class="field-hint">Not entered</span>'}</td><td><button class="row-action" data-action="view" data-id="${esc(application.id)}" aria-label="View ${esc(fullName(application))}">···</button></td></tr>`).join('');
  }

  function renderDashboard() {
    const admitted = applications.filter((app) => app.status === 'Admitted').length;
    const underReview = applications.filter((app) => ['Submitted', 'Under Review'].includes(app.status)).length;
    const shortlisted = applications.filter((app) => ['Shortlisted', 'Merit List'].includes(app.status)).length;
    const recent = [...applications].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    return `${pageHeading('OVERVIEW', 'Hello, world! :)', 'Here’s what’s happening with admissions today.', `<button class="button button-secondary" data-action="export-csv">${icon('download')} Export report</button><button class="button button-primary" data-action="new-application">${icon('plus')} New application</button>`)}
      <section class="stats-grid" aria-label="Admission statistics">
        ${statCard('Total applications', applications.length, 'vs. last cycle', 'people', 'purple', '+12.8%')}
        ${statCard('Under review', underReview, 'need your attention', 'clock', 'orange', '')}
        ${statCard('Shortlisted', shortlisted, 'ready for next stage', 'check', 'blue', '+8.2%')}
        ${statCard('Confirmed admissions', admitted, 'enrolled this cycle', 'check', 'green', '+18.4%')}
      </section>
      <section class="dashboard-grid">
        <article class="card chart-card"><div class="card-header"><div><h2 class="card-heading">Application overview</h2><p class="card-subheading">Applications received over time</p></div><div class="chart-period" aria-label="Chart period"><button class="${activeChartPeriod === 'Week' ? 'active' : ''}" data-action="chart-period" data-period="Week">Week</button><button class="${activeChartPeriod === 'Month' ? 'active' : ''}" data-action="chart-period" data-period="Month">Month</button><button class="${activeChartPeriod === 'Year' ? 'active' : ''}" data-action="chart-period" data-period="Year">Year</button></div></div><div class="chart-wrap" id="chartWrap"></div></article>
        <article class="card status-card"><div class="card-header"><div><h2 class="card-heading">Application status</h2><p class="card-subheading">A snapshot of your pipeline</p></div><span class="status-total">${applications.length} total</span></div><div class="donut-area"><div class="donut-chart"><div class="donut-center"><strong>${applications.length}</strong><span>applications</span></div></div></div><div class="status-legend">${STATUSES.slice(0, 5).map((status) => `<span class="status-legend-item"><i></i>${esc(status)} <strong>${applications.filter((app) => app.status === status).length}</strong></span>`).join('')}</div></article>
      </section>
      <section class="quick-steps" aria-label="Admissions shortcuts"><a class="quick-step" href="#applications" data-page="applications"><span class="quick-step-icon">01</span><span><strong>Review applications</strong><span>${underReview} waiting for review</span></span></a><a class="quick-step" href="#exams" data-page="exams"><span class="quick-step-icon">02</span><span><strong>Enter exam scores</strong><span>Keep applicant results up to date</span></span></a><a class="quick-step" href="#merit" data-page="merit"><span class="quick-step-icon">03</span><span><strong>Generate merit list</strong><span>Rank eligible applicants fairly</span></span></a></section>
      <section class="card table-card"><div class="card-header"><div><h2 class="card-heading">Recent applications</h2><p class="card-subheading">The latest student applications</p></div><button class="text-link" data-page="applications">View all applications →</button></div><div class="table-scroll"><table><thead><tr><th>Applicant</th><th>Course</th><th>Applied on</th><th>Status</th><th>Exam score</th><th></th></tr></thead><tbody>${tableRows(recent)}</tbody></table></div><div class="table-footer"><span>Showing ${recent.length} of ${applications.length} applications</span><button class="text-link" data-page="applications">Open application list →</button></div></section>`;
  }

  function renderChart() {
    const chart = document.getElementById('chartWrap');
    if (!chart) return;
    const periods = {
      Week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        a: [9, 12, 10, 17, 14, 22, 18],
        b: [5, 7, 6, 11, 9, 14, 12]
      },
      Month: {
        labels: ['01 Jun', '05 Jun', '09 Jun', '13 Jun', '17 Jun', '21 Jun', '25 Jun'],
        a: [8, 13, 11, 20, 17, 26, 22],
        b: [5, 8, 7, 12, 10, 16, 13]
      },
      Year: {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'],
        a: [7, 12, 17, 13, 24, 20, 28],
        b: [4, 8, 11, 9, 15, 13, 19]
      }
    };
    const data = periods[activeChartPeriod];
    const left = 35,
      right = 570,
      top = 13,
      bottom = 151;
    const x = (index) => left + (right - left) * index / (data.labels.length - 1);
    const y = (value) => bottom - value / 32 * (bottom - top);
    const line = (values) => values.map((value, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(value)}`).join(' ');
    const area = `${line(data.a)} L ${right} ${bottom} L ${left} ${bottom} Z`;
    chart.innerHTML = `<div class="chart-legend"><span class="legend-item"><i class="legend-dot"></i>Applications</span><span class="legend-item"><i class="legend-dot secondary"></i>Completed</span></div><svg class="chart-svg" viewBox="0 0 600 185" role="img" aria-label="Application volume chart"><defs><linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity=".15"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs>${[0, 1, 2, 3].map((lineIndex) => { const gy = top + (bottom - top) * lineIndex / 3; return `<line class="chart-grid-line" x1="${left}" y1="${gy}" x2="${right}" y2="${gy}"/><text class="chart-label" x="1" y="${gy + 3}">${30 - lineIndex * 10}</text>`; }).join('')}<path class="chart-area" d="${area}"/><path class="chart-line-second" d="${line(data.b)}"/><path class="chart-line-main" d="${line(data.a)}"/>${data.a.map((value, index) => `<circle class="chart-point" cx="${x(index)}" cy="${y(value)}" r="3.4"/>`).join('')}${data.labels.map((label, index) => `<text class="chart-label" x="${x(index)}" y="174" text-anchor="middle">${label}</text>`).join('')}</svg>`;
  }

  function applicationFilters() {
    return `<div class="list-filters"><label class="search-box">${icon('search')}<input id="applicationSearch" type="search" placeholder="Search name, email or ID" aria-label="Search applications"></label><select class="filter-select" id="statusFilter" aria-label="Filter by status"><option value="">All statuses</option>${STATUSES.map((status) => `<option>${status}</option>`).join('')}</select><select class="filter-select" id="courseFilter" aria-label="Filter by course"><option value="">All courses</option>${COURSES.map((course) => `<option>${esc(course)}</option>`).join('')}</select><span class="result-count" id="resultCount"></span></div>`;
  }

  function renderApplications() {
    return `${pageHeading('ADMISSIONS', 'Applications', 'Search, filter and review every applicant in one place.', `<button class="button button-secondary" data-action="export-csv">${icon('download')} Export CSV</button><button class="button button-primary" data-action="new-application">${icon('plus')} Add applicant</button>`)}<section class="card table-card"><div class="card-header responsive-stack"><div><h2 class="card-heading">All applications</h2><p class="card-subheading">Review student details and update application status.</p></div>${applicationFilters()}</div><div class="table-scroll"><table><thead><tr><th>Applicant</th><th>Course</th><th>Applied on</th><th>Status</th><th>Exam score</th><th></th></tr></thead><tbody id="applicationTableBody">${tableRows(applications)}</tbody></table></div><div class="table-footer"><span id="tableSummary">Showing ${applications.length} applications</span><div class="pagination"><button class="page-number active">1</button></div></div></section>`;
  }

  function filterApplications() {
    const search = (document.getElementById('applicationSearch')?.value || '').toLowerCase().trim();
    const status = document.getElementById('statusFilter')?.value || '';
    const course = document.getElementById('courseFilter')?.value || '';
    const filtered = applications.filter((application) => {
      const searchable = [fullName(application), application.email, application.id, application.phone].join(' ').toLowerCase();
      return (!search || searchable.includes(search)) && (!status || application.status === status) && (!course || application.course === course);
    });
    const body = document.getElementById(currentPage === 'exams' ? 'examTableBody' : 'applicationTableBody');
    if (body) body.innerHTML = currentPage === 'exams' ? examRows(filtered) : tableRows(filtered);
    const count = document.getElementById('resultCount');
    if (count) count.textContent = `${filtered.length} result${filtered.length === 1 ? '' : 's'}`;
    const summary = document.getElementById('tableSummary');
    if (summary) summary.textContent = `Showing ${filtered.length} of ${applications.length} applications`;
  }

  function registrationFields() {
    return `<div class="form-grid"><div class="field"><label for="firstName">First name <span>*</span></label><input id="firstName" name="firstName" required placeholder="e.g. Kei"></div><div class="field"><label for="lastName">Last name <span>*</span></label><input id="lastName" name="lastName" required placeholder="e.g. Zane"></div><div class="field"><label for="email">Email address <span>*</span></label><input id="email" name="email" type="email" required placeholder="student@example.com"></div><div class="field"><label for="phone">Phone number <span>*</span></label><input id="phone" name="phone" type="tel" required placeholder="+1 202 555 0143"></div><div class="field"><label for="dob">Date of birth <span>*</span></label><input id="dob" name="dob" type="date" required></div><div class="field"><label for="gender">Gender</label><select id="gender" name="gender"><option value="">Select gender</option><option>Female</option><option>Male</option><option>Prefer not to say</option></select></div></div>`;
  }

  function renderRegistration() {
    return `${pageHeading('GET STARTED', 'Student registration', 'Create an applicant profile to begin the admissions journey.', `<button class="button button-secondary" data-page="applications">View applications</button>`)}<section class="quick-steps"><div class="quick-step"><span class="quick-step-icon">01</span><span><strong>Register applicant</strong><span>Create a student profile</span></span></div><div class="quick-step"><span class="quick-step-icon">02</span><span><strong>Complete application</strong><span>Choose course and add details</span></span></div><div class="quick-step"><span class="quick-step-icon">03</span><span><strong>Upload documents</strong><span>Prepare files for review</span></span></div></section><form class="form-card" id="registrationForm"><div class="form-section"><h2>Student information</h2><p>Enter the applicant’s personal and contact information.</p>${registrationFields()}</div><div class="form-actions"><button type="reset" class="button button-secondary">Clear form</button><button type="submit" class="button button-primary">Continue to application ${icon('plus')}</button></div></form>`;
  }

  function renderApplicationForm() {
    const stepClass = (number) => applicationStep === number ? 'active' : applicationStep > number ? 'done' : '';
    let section = '';
    if (applicationStep === 1) section = `<div class="form-section"><h2>Course selection</h2><p>Choose the course and school year the student is applying for.</p><div class="form-grid"><div class="field"><label for="course">Preferred course <span>*</span></label><select id="course" name="course" required><option value="">Select a course</option>${COURSES.map((course) => `<option>${esc(course)}</option>`).join('')}</select></div><div class="field"><label for="academicYear">Academic year</label><select id="academicYear" name="academicYear"><option>2026–26</option><option>2026–27</option></select></div><div class="field"><label for="previousSchool">Previous school</label><input id="previousSchool" name="previousSchool" placeholder="Name of previous school"></div><div class="field"><label for="previousScore">Previous academic score (%)</label><input id="previousScore" name="previousScore" type="number" min="0" max="100" placeholder="e.g. 88"></div><div class="field full"><label for="address">Residential address</label><textarea id="address" name="address" placeholder="House, street, city and postal code"></textarea></div></div></div>`;
    if (applicationStep === 2) section = `<div class="form-section"><h2>Parent or guardian</h2><p>Provide a point of contact for admission updates.</p><div class="form-grid"><div class="field"><label for="parentName">Parent / guardian name <span>*</span></label><input id="parentName" name="parentName" required placeholder="Full name"></div><div class="field"><label for="parentPhone">Contact number <span>*</span></label><input id="parentPhone" name="parentPhone" type="tel" required placeholder="+91 98765 43210"></div></div><div class="field full" style="margin-top:14px"><label for="notes">Additional notes</label><textarea id="notes" name="notes" placeholder="Anything the admissions team should know?"></textarea></div></div>`;
    if (applicationStep === 3) section = `<div class="form-section"><h2>Supporting documents</h2><p>Attach available documents. You can add the remaining files after registration.</p><div class="document-list">${DOCUMENTS.map((document, index) => `<div class="document-item"><span class="document-icon">${index + 1}</span><span class="document-copy"><strong>${esc(document)}</strong><span>PDF, JPG or PNG</span></span><label class="upload-button" title="Choose ${esc(document)}">+<input type="file" data-document="${esc(document)}" accept=".pdf,.jpg,.jpeg,.png"></label></div>`).join('')}</div></div>`;
    return `${pageHeading('APPLICATION', 'New application', 'Complete each section to submit a student application.', '')}<section class="form-card"><div class="steps-indicator"><div class="step-item ${stepClass(1)}"><span class="step-circle">${applicationStep > 1 ? '✓' : '1'}</span><span class="step-label">Course & academics</span></div><div class="step-item ${stepClass(2)}"><span class="step-circle">${applicationStep > 2 ? '✓' : '2'}</span><span class="step-label">Parent details</span></div><div class="step-item ${stepClass(3)}"><span class="step-circle">3</span><span class="step-label">Documents & submit</span></div></div><form id="applicationForm" novalidate>${section}<div class="form-actions">${applicationStep > 1 ? '<button type="button" class="button button-secondary" data-action="application-back">Back</button>' : '<button type="button" class="button button-secondary" data-page="registration">Cancel</button>'}<button type="button" class="button button-primary" data-action="application-next">${applicationStep === 3 ? 'Submit application' : 'Continue'} ${applicationStep === 3 ? '✓' : '→'}</button></div></form></section>`;
  }

  function renderApplicationDetail() {
    const application = applications.find((item) => item.id === activeApplicationId) || applications[0];
    if (!application) return `${pageHeading('APPLICATIONS', 'Application not found', 'The selected record may have been removed.', '<button class="button button-primary" data-page="applications">Back to applications</button>')}`;
    const statusButtons = application.status !== 'Admitted' && application.status !== 'Rejected' ? `<button class="button button-primary button-small" data-action="review-status" data-status="Admitted" data-id="${esc(application.id)}">Confirm admission</button><button class="button button-secondary button-small" data-action="review-status" data-status="Shortlisted" data-id="${esc(application.id)}">Shortlist</button><button class="button button-danger button-small" data-action="review-status" data-status="Rejected" data-id="${esc(application.id)}">Reject application</button>` : `<button class="button button-secondary button-small" data-action="admission-letter" data-id="${esc(application.id)}">View admission letter</button>`;
    return `${pageHeading('APPLICATIONS / DETAIL', 'Application details', 'Review the student profile, documents and current admission status.', `<button class="button button-secondary" data-page="applications">← All applications</button>`)}<div class="detail-layout"><div class="detail-card"><div class="detail-profile"><span class="person-avatar">${esc(initials(application))}</span><div><h2>${esc(fullName(application))}</h2><p>${esc(application.id)} · Applied ${dateLabel(application.date)}</p></div><span style="margin-left:auto">${badge(application.status)}</span></div><section class="detail-section"><h3>Student information</h3><div class="detail-data-grid">${detailData('Email address', application.email)}${detailData('Phone number', application.phone)}${detailData('Date of birth', dateLabel(application.dob))}${detailData('Gender', application.gender || 'Not provided')}${detailData('Applied course', application.course)}${detailData('Previous school', application.previousSchool || 'Not provided')}${detailData('Previous score', application.previousScore ? `${application.previousScore}%` : 'Not provided')}${detailData('Exam score', application.examScore ? `${application.examScore} / 100` : 'Not entered')}${detailData('Parent / guardian', application.parentName || 'Not provided')}${detailData('Parent contact', application.parentPhone || 'Not provided')}${detailData('Address', application.address || 'Not provided')}</div></section><section class="detail-section"><h3>Documents received (${(application.documents || []).length}/${DOCUMENTS.length})</h3><div class="document-list">${DOCUMENTS.map((document) => { const received = (application.documents || []).includes(document); return `<div class="document-item"><span class="document-icon">${received ? '✓' : '−'}</span><span class="document-copy"><strong>${esc(document)}</strong><span>${received ? 'Uploaded and ready for review' : 'Awaiting upload'}</span></span></div>`; }).join('')}</div></section>${application.comment ? `<section class="detail-section"><h3>Review notes</h3><p class="field-hint">${esc(application.comment)}</p></section>` : ''}</div><aside class="detail-card"><section><h3>Review actions</h3><div class="detail-action-list">${statusButtons}<button class="button button-secondary button-small" data-action="exam-score" data-id="${esc(application.id)}">Enter exam score</button><button class="button button-secondary button-small" data-action="fee-payment" data-id="${esc(application.id)}">Record fee payment</button>${application.feePaid ? `<button class="button button-secondary button-small" data-action="fee-receipt" data-id="${esc(application.id)}">Generate fee receipt</button>` : ''}<button class="button button-secondary button-small" data-action="admission-letter" data-id="${esc(application.id)}">Generate admission letter</button></div></section><section class="detail-section"><h3>Application activity</h3><div class="timeline"><div class="timeline-item"><i class="timeline-dot"></i><div><strong>Application ${esc(application.status.toLowerCase())}</strong><span>${dateLabel(application.date)}</span></div></div><div class="timeline-item"><i class="timeline-dot"></i><div><strong>Application created</strong><span>${dateLabel(application.date)}</span></div></div></div></section><section class="detail-section"><h3>Fee status</h3><div class="detail-data"><span>Amount paid</span><strong>${money(application.feePaid)}</strong></div></section></aside></div>`;
  }

  function detailData(label, value) {
    return `<div class="detail-data"><span>${label}</span><strong>${esc(value || 'Not provided')}</strong></div>`;
  }

  function examRows(items) {
    return items.length ? items.map((app, index) => `<tr><td><div class="applicant-cell"><span class="person-avatar tone-${index % 4}">${esc(initials(app))}</span><span class="applicant-meta"><strong>${esc(fullName(app))}</strong><span>${esc(app.id)}</span></span></div></td><td>${esc(app.course)}</td><td><strong>${app.examScore ? `${esc(app.examScore)} / 100` : '—'}</strong></td><td>${badge(app.status)}</td><td>${dateLabel(app.date)}</td><td><button class="button button-secondary button-small" data-action="exam-score" data-id="${esc(app.id)}">${app.examScore ? 'Edit score' : 'Add score'}</button></td></tr>`).join('') : '<tr><td colspan="6"><div class="empty-state">No applicants match those filters.</div></td></tr>';
  }
  function renderExams() {
    const scored = applications.filter((app) => Number(app.examScore) > 0).length;
    const noScore = applications.filter((app) => !Number(app.examScore) && !['Rejected', 'Admitted'].includes(app.status));
    return `${pageHeading('ASSESSMENTS', 'Entrance exam management', 'Schedule assessments, enter scores and keep applicants informed.', `<button class="button button-secondary" data-action="export-csv">${icon('download')} Export results</button><button class="button button-primary" data-action="schedule-exam">${icon('plus')} Schedule exam</button>`)}<section class="exam-grid"><article class="exam-card"><span class="exam-date">JUN 24, 2026</span><h3>Senior school entrance</h3><p>11th Science, Commerce and Arts</p><div class="exam-card-bottom"><span>${applications.filter((app) => app.course.startsWith('11th')).length} applicants</span><button class="text-link" data-action="exam-score-first">Manage scores →</button></div></article><article class="exam-card"><span class="exam-date">JUN 28, 2026</span><h3>Junior school assessment</h3><p>Class 1–10 admissions</p><div class="exam-card-bottom"><span>${applications.filter((app) => app.course.startsWith('Class')).length} applicants</span><button class="text-link" data-action="exam-score-first">Manage scores →</button></div></article><article class="exam-card"><span class="exam-date">${scored} SCORED</span><h3>Score entry progress</h3><p>${noScore.length} applicants are awaiting a result</p><div class="exam-card-bottom"><span>Out of ${applications.length} applicants</span><button class="text-link" data-action="exam-score-first">Enter a score →</button></div></article></section><section class="card table-card"><div class="card-header responsive-stack"><div><h2 class="card-heading">Applicant exam scores</h2><p class="card-subheading">Enter or update a score for any applicant.</p></div>${applicationFilters()}</div><div class="table-scroll"><table><thead><tr><th>Applicant</th><th>Course</th><th>Exam score</th><th>Status</th><th>Applied on</th><th>Action</th></tr></thead><tbody id="examTableBody">${examRows(applications)}</tbody></table></div><div class="table-footer"><span>${scored} scores recorded</span><span>Score range: 0–100</span></div></section>`;
  }

  function renderMerit() {
    const ranked = [...applications].filter((app) => !['Rejected', 'Submitted'].includes(app.status)).sort((a, b) => meritScore(b) - meritScore(a));
    return `${pageHeading('SELECTION', 'Merit list', 'Create a transparent shortlist using academic and entrance scores.', `<button class="button button-secondary" data-action="export-csv">${icon('download')} Export merit list</button><button class="button button-primary" data-action="generate-merit">Generate merit list</button>`)}<div class="merit-banner"><div><h2>Merit list criteria</h2><p>Academic score weighted at 60% · Entrance score weighted at 40%</p></div><span class="status-pill status-merit-list">${ranked.length} eligible candidates</span></div><section class="card table-card"><div class="card-header"><div><h2 class="card-heading">Current candidate ranking</h2><p class="card-subheading">Weighted scores update when you generate the list.</p></div><select class="filter-select" id="courseFilter" aria-label="Filter by course"><option value="">All courses</option>${COURSES.map((course) => `<option>${esc(course)}</option>`).join('')}</select></div><div class="table-scroll"><table><thead><tr><th>Rank</th><th>Applicant</th><th>Course</th><th>Academic</th><th>Entrance</th><th>Merit score</th><th>Status</th></tr></thead><tbody id="meritTableBody">${meritRows(ranked)}</tbody></table></div><div class="table-footer"><span>Weighted score = (academic × 0.6) + (entrance × 0.4)</span><span>Updated just now</span></div></section>`;
  }

  function meritScore(application) {
    return Math.round((Number(application.previousScore || 0) * .6 + Number(application.examScore || 0) * .4) * 10) / 10;
  }

  function meritRows(items) {
    return items.length ? items.map((app, index) => `<tr><td><span class="rank">#${String(index + 1).padStart(2, '0')}</span></td><td><div class="applicant-cell"><span class="person-avatar tone-${index % 4}">${esc(initials(app))}</span><span class="applicant-meta"><strong>${esc(fullName(app))}</strong><span>${esc(app.id)}</span></span></div></td><td>${esc(app.course)}</td><td>${app.previousScore || 0}%</td><td>${app.examScore || 0}%</td><td><strong>${meritScore(app)}%</strong></td><td>${badge(app.status)}</td></tr>`).join('') : '<tr><td colspan="7"><div class="empty-state">No eligible applicants yet. Shortlist an application to include it here.</div></td></tr>';
  }

  function renderFees() {
    const paid = applications.reduce((sum, app) => sum + Number(app.feePaid || 0), 0);
    const admitted = applications.filter((app) => app.status === 'Admitted');
    const feeRows = admitted.length ? admitted.map((app) => `<tr><td><div class="applicant-cell"><span class="person-avatar">${esc(initials(app))}</span><span class="applicant-meta"><strong>${esc(fullName(app))}</strong><span>${esc(app.id)}</span></span></div></td><td>${esc(app.course)}</td><td>${money(app.feePaid)}</td><td>${app.feePaid ? '<span class="status-pill status-admitted">Paid</span>' : '<span class="status-pill status-under-review">Pending</span>'}</td><td><button class="button button-secondary button-small" data-action="fee-payment" data-id="${esc(app.id)}">Record payment</button>${app.feePaid ? ` <button class="button button-secondary button-small" data-action="fee-receipt" data-id="${esc(app.id)}">Receipt</button>` : ''}</td></tr>`).join('') : '<tr><td colspan="5"><div class="empty-state">Confirmed admissions will appear here.</div></td></tr>';
    return `${pageHeading('FINANCE', 'Fees & payments', 'Manage fee collection and keep payment records in one place.', `<button class="button button-secondary" data-action="export-csv">${icon('download')} Export fees</button><button class="button button-primary" data-action="fee-structure">Manage fee structure</button>`)}<section class="fee-summary">${statCard('Collected this cycle', money(paid), 'across all applicants', 'revenue', 'green', '')}${statCard('Confirmed admissions', admitted.length, 'with a seat confirmed', 'check', 'purple', '')}${statCard('Outstanding balance', money(Math.max(0, admitted.length * 32000 - paid)), 'estimated admission fees', 'clock', 'orange', '')}</section><section class="card table-card"><div class="card-header"><div><h2 class="card-heading">Admission fee payments</h2><p class="card-subheading">Record fee payments against confirmed seats.</p></div><button class="text-link" data-action="fee-structure">View fee structure →</button></div><div class="table-scroll"><table><thead><tr><th>Applicant</th><th>Course</th><th>Amount paid</th><th>Payment status</th><th>Action</th></tr></thead><tbody>${feeRows}</tbody></table></div><div class="table-footer"><span>Standard admission fee: ₹32,000</span><span>Payment records are saved in this browser</span></div></section>`;
  }

  function renderReports() {
    return `${pageHeading('INSIGHTS', 'Reports & analytics', 'Explore admissions performance and export data for your records.', `<button class="button button-primary" data-action="export-csv">${icon('download')} Download applications CSV</button>`)}<section class="report-grid"><article class="report-card"><span class="stat-icon purple">${icon('people')}</span><div class="report-card-copy"><h3>Application summary</h3><p>${applications.length} applications across ${new Set(applications.map((app) => app.course)).size} courses</p></div><button class="button button-secondary button-small" data-action="export-csv">Export</button></article><article class="report-card"><span class="stat-icon green">${icon('check')}</span><div class="report-card-copy"><h3>Admission outcomes</h3><p>${applications.filter((app) => app.status === 'Admitted').length} confirmed, ${applications.filter((app) => app.status === 'Rejected').length} declined</p></div><button class="button button-secondary button-small" data-action="export-csv">Export</button></article><article class="report-card"><span class="stat-icon orange">${icon('revenue')}</span><div class="report-card-copy"><h3>Fee collection</h3><p>${money(applications.reduce((sum, app) => sum + Number(app.feePaid || 0), 0))} recorded so far</p></div><button class="button button-secondary button-small" data-action="export-csv">Export</button></article><article class="report-card"><span class="stat-icon blue">${icon('clock')}</span><div class="report-card-copy"><h3>Merit & exam scores</h3><p>${applications.filter((app) => Number(app.examScore) > 0).length} entrance scores recorded</p></div><button class="button button-secondary button-small" data-page="merit">View list</button></article></section><h2 class="report-section-title">Course-wise application overview</h2><section class="card"><div class="course-bar-list" id="courseAnalytics"></div></section><h2 class="report-section-title">Application status breakdown</h2><section class="card table-card"><div class="table-scroll"><table><thead><tr><th>Application status</th><th>Applicants</th><th>Share of applications</th></tr></thead><tbody>${STATUSES.map((status) => { const count = applications.filter((app) => app.status === status).length; const percent = applications.length ? Math.round(count / applications.length * 100) : 0; return `<tr><td>${badge(status)}</td><td>${count}</td><td>${percent}%</td></tr>`; }).join('')}</tbody></table></div></section>`;
  }

  function renderCourseAnalytics() {
    const target = document.getElementById('courseAnalytics');
    if (!target) return;
    target.innerHTML = COURSES.map((course) => {
      const count = applications.filter((app) => app.course === course).length;
      const percent = applications.length ? Math.max(count ? 5 : 0, Math.round(count / applications.length * 100)) : 0;
      return `<div class="course-bar-row"><span>${esc(course)}</span><div class="course-bar-track"><div class="course-bar-fill" style="width:${percent}%"></div></div><strong>${count}</strong></div>`;
    }).join('');
  }

  function renderLogin() {
    return `${pageHeading('YOUR ACCOUNT', 'Welcome to AdmitSchool', 'Sign in to manage admissions or register a new applicant.', '')}<div class="login-wrap"><form class="login-card" id="loginForm"><h2>Sign in to your workspace</h2><p>Use your administrator or staff account to continue.</p><div class="field"><label for="loginEmail">Email address</label><input id="loginEmail" type="email" required placeholder="you@school.edu"></div><div class="field"><label for="loginPassword">Password</label><input id="loginPassword" type="password" required placeholder="Enter your password"></div><div class="field"><label for="loginRole">Account role</label><select id="loginRole"><option>Administrator</option><option>Admissions staff</option><option>Applicant</option></select></div><button class="button button-primary" type="submit">Continue to dashboard</button><div class="login-note">Demo workspace: enter any email and password to explore.</div></form></div>`;
  }

  function showToast(message, error = false) {
    const toast = document.createElement('div');
    toast.className = `toast${error ? ' error' : ''}`;
    toast.innerHTML = `<span class="toast-mark">${error ? '!' : '✓'}</span><span>${esc(message)}</span>`;
    toastRegion.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3600);
  }

  function openModal(title, subtitle, body, submitLabel = '', submitAction = '') {
    modalRoot.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-header"><div><h2 id="modalTitle">${esc(title)}</h2><p>${esc(subtitle)}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></div><form id="modalForm"><div class="modal-body">${body}</div><div class="modal-footer"><button type="button" class="button button-secondary" data-action="close-modal">Cancel</button>${submitLabel ? `<button type="submit" class="button button-primary" data-submit-action="${esc(submitAction)}">${esc(submitLabel)}</button>` : ''}</div></form></div>`;
    modalRoot.querySelector('input, select, textarea, button')?.focus();
  }

  function closeModal() {
    modalRoot.innerHTML = '';
  }

  function findApplication(id) {
    return applications.find((app) => app.id === id);
  }

  function openScoreModal(id) {
    const application = findApplication(id) || applications.find((app) => !app.examScore);
    if (!application) return showToast('There are no applicants available to score.', true);
    openModal('Enter entrance exam score', `${fullName(application)} · ${application.id}`, `<input type="hidden" name="id" value="${esc(application.id)}"><div class="field"><label for="examScoreInput">Exam score (0–100) <span>*</span></label><input id="examScoreInput" name="examScore" type="number" min="0" max="100" required value="${application.examScore || ''}" placeholder="Enter score"></div><div class="field"><label for="examComment">Staff notes</label><textarea id="examComment" name="comment" placeholder="Optional notes about the assessment"></textarea></div><p class="modal-note">A recorded score is used to calculate the applicant’s merit ranking.</p>`, 'Save score', 'save-score');
  }

  function openReviewModal(id, status) {
    const application = findApplication(id);
    if (!application) return;
    openModal(`${status} application?`, `${fullName(application)} · ${application.id}`, `<input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="status" value="${esc(status)}"><div class="field"><label for="reviewComment">Feedback for the applicant</label><textarea id="reviewComment" name="comment" placeholder="Add a helpful note for the application record"></textarea></div><p class="modal-note">The application status will change to ${esc(status)}. You can update the status again at any time.</p>`, 'Confirm update', 'update-status');
  }

  function openFeeModal(id) {
    const application = findApplication(id);
    if (!application) return showToast('Select an applicant before recording a payment.', true);
    openModal('Record fee payment', `${fullName(application)} · ${application.id}`, `<input type="hidden" name="id" value="${esc(id)}"><div class="field"><label for="paymentAmount">Payment amount (₹) <span>*</span></label><input id="paymentAmount" name="amount" type="number" min="1" required value="${application.feePaid ? '' : 32000}" placeholder="Enter amount"></div><div class="field"><label for="paymentMethod">Payment method</label><select id="paymentMethod" name="method"><option>Bank transfer</option><option>UPI</option><option>Card</option><option>Cash</option></select></div><p class="modal-note">A receipt number will be generated when the payment is recorded.</p>`, 'Record payment', 'save-payment');
  }

  function openNewApplicantModal() {
    openModal('Register a new applicant', 'Add a student and start their admission application.', `<div class="form-grid">${registrationFields()}</div>`, 'Continue to application', 'register-applicant');
  }

  function openReceipt(id) {
    const app = findApplication(id);
    if (!app || !app.feePaid) return showToast('No payment receipt is available for this applicant.', true);
    const receiptNumber = app.receiptNumber || `AS-R${String(app.id).slice(-5)}`;
    app.receiptNumber = receiptNumber;
    saveApplications();
    const body = `<div class="letter-preview" id="printableLetter"><h3>FEE PAYMENT RECEIPT</h3><p style="text-align:center">ADMIT SCHOOL · ACADEMIC YEAR 2026–27</p><p>Receipt number: <strong>${esc(receiptNumber)}</strong><br>Date: <strong>${dateLabel(new Date().toISOString().slice(0, 10))}</strong></p><p>Received from: <strong>${esc(app.parentName || fullName(app))}</strong><br>Student: <strong>${esc(fullName(app))}</strong><br>Application reference: <strong>${esc(app.id)}</strong></p><p>Course: <strong>${esc(app.course)}</strong><br>Amount received: <strong>${money(app.feePaid)}</strong></p><p>Thank you. Please retain this receipt for your records.</p></div>`;
    openModal('Payment receipt', `${fullName(app)} · ${receiptNumber}`, body, 'Print receipt', 'print-letter');
  }
  function openScheduleModal() {
    openModal('Schedule an entrance exam', 'Add an assessment to the admissions calendar.', `<div class="field"><label for="examTitle">Exam name <span>*</span></label><input id="examTitle" name="title" required placeholder="e.g. Senior school entrance"></div><div class="field"><label for="examDate">Exam date <span>*</span></label><input id="examDate" name="date" type="date" required></div><div class="field"><label for="examCourse">Course</label><select id="examCourse" name="course">${COURSES.map((course) => `<option>${esc(course)}</option>`).join('')}</select></div>`, 'Add to schedule', 'schedule-exam');
  }

  function openFeeStructure() {
    openModal('Admission fee structure', 'Reference fees for the current 2026–27 admission cycle.', `<div class="table-scroll"><table><thead><tr><th>Course group</th><th>Admission fee</th></tr></thead><tbody><tr><td>Class 1–10</td><td>₹32,000</td></tr><tr><td>11th Science</td><td>₹42,000</td></tr><tr><td>11th Commerce</td><td>₹38,000</td></tr><tr><td>11th Arts</td><td>₹36,000</td></tr></tbody></table></div><p class="modal-note" style="margin-top:12px">Fees shown here are a demo reference. Record actual payments from an applicant’s detail page.</p>`);
  }

  function admissionLetter(id) {
    const app = findApplication(id);
    if (!app) return;
    const body = `<div class="letter-preview" id="printableLetter"><h3>ADMISSION OFFER</h3><p style="text-align:center">ADMISSIONS · ACADEMIC YEAR 2026–27</p><p>Dear ${esc(app.parentName || fullName(app))},</p><p>We are pleased to offer <strong>${esc(fullName(app))}</strong> admission to <strong>${esc(app.course)}</strong> at AdmitSchool for the 2026–27 academic year.</p><p>Application reference: <strong>${esc(app.id)}</strong><br>Offer date: <strong>${dateLabel(new Date().toISOString().slice(0, 10))}</strong></p><p>Please contact the admissions office to complete enrollment and submit any outstanding documents.</p><p>Warm regards,<br><strong>Admissions Office</strong><br>AdmitSchool</p></div>`;
    openModal('Admission offer letter', `${fullName(app)} · ${app.id}`, body, 'Print letter', 'print-letter');
  }

  function csvExport(rows, filename) {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Your CSV report has been downloaded.');
  }

  function exportApplications() {
    const rows = [
      ['Application ID', 'First name', 'Last name', 'Email', 'Phone', 'Course', 'Applied on', 'Status', 'Previous score', 'Entrance score', 'Fees paid'], ...applications.map((app) => [app.id, app.firstName, app.lastName, app.email, app.phone, app.course, app.date, app.status, app.previousScore, app.examScore, app.feePaid])
    ];
    csvExport(rows, 'admitschool-admissions-report.csv');
  }

  function generateMerit() {
    let count = 0;
    applications.forEach((app) => {
      if (app.status === 'Shortlisted' || app.status === 'Under Review') {
        app.status = 'Merit List';
        count += 1;
      }
    });
    saveApplications();
    renderPage();
    showToast(`Merit list generated. ${count} eligible application${count === 1 ? '' : 's'} ranked.`);
  }

  function submitApplicationForm() {
    const form = document.getElementById('applicationForm');
    const fields = Object.fromEntries(new FormData(form).entries());
    const draft = JSON.parse(sessionStorage.getItem('admitschool-draft') || '{}');
    if (applicationStep === 1) {
      if (!fields.course) return showToast('Choose a course before continuing.', true);
      sessionStorage.setItem('admitschool-draft', JSON.stringify({ ...draft, ...fields }));
      applicationStep = 2;
      renderPage();
      return;
    }
    if (applicationStep === 2) {
      if (!fields.parentName || !fields.parentPhone) return showToast('Add a parent name and contact number to continue.', true);
      sessionStorage.setItem('admitschool-draft', JSON.stringify({ ...draft, ...fields }));
      applicationStep = 3;
      renderPage();
      return;
    }
    const profile = JSON.parse(sessionStorage.getItem('admitschool-profile') || '{}');
    const fileNames = Array.from(document.querySelectorAll('[data-document]')).filter((input) => input.files?.length).map((input) => input.dataset.document);
    const application = {
      ...profile,
      ...draft,
      ...fields,
      id: `AS-${String(Date.now()).slice(-5)}`,
      status: 'Submitted',
      date: new Date().toISOString().slice(0, 10),
      previousScore: Number(draft.previousScore || 0),
      examScore: 0,
      feePaid: 0,
      documents: fileNames,
      comment: fields.notes || ''
    };
    applications.unshift(application);
    saveApplications();
    sessionStorage.removeItem('admitschool-draft');
    sessionStorage.removeItem('admitschool-profile');
    applicationStep = 1;
    activeApplicationId = application.id;
    showToast('Application submitted successfully. The applicant has been added to the review queue.');
    setPage('application-detail');
  }

  function handleRegistration(data) {
    sessionStorage.setItem('admitschool-profile', JSON.stringify(data));
    applicationStep = 1;
    setPage('application-form');
  }

  function getFormData(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  document.addEventListener('click', (event) => {
    const pageLink = event.target.closest('[data-page]');
    if (pageLink) {
      event.preventDefault();
      setPage(pageLink.dataset.page);
      return;
    }
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) {
      if (event.target === modalRoot) closeModal();
      return;
    }
    const action = actionElement.dataset.action;
    const id = actionElement.dataset.id;
    if (action === 'close-modal') closeModal();
    if (action === 'new-application') openNewApplicantModal();
    if (action === 'view') {
      activeApplicationId = id;
      setPage('application-detail');
    }
    if (action === 'chart-period') {
      activeChartPeriod = actionElement.dataset.period;
      renderPage();
    }
        if (action === 'application-back') {
      const form = document.getElementById('applicationForm');
      if (form) {
        const draft = JSON.parse(sessionStorage.getItem('admitschool-draft') || '{}');
        sessionStorage.setItem('admitschool-draft', JSON.stringify({ ...draft, ...Object.fromEntries(new FormData(form).entries()) }));
      }
      applicationStep = Math.max(1, applicationStep - 1);
      renderPage();
    }
    if (action === 'application-next') submitApplicationForm();
    if (action === 'export-csv') exportApplications();
    if (action === 'generate-merit') generateMerit();
    if (action === 'exam-score') openScoreModal(id);
    if (action === 'exam-score-first') openScoreModal(applications.find((app) => !app.examScore)?.id || applications[0]?.id);
    if (action === 'review-status') openReviewModal(id, actionElement.dataset.status);
    if (action === 'fee-payment') openFeeModal(id);
    if (action === 'fee-receipt') openReceipt(id);
    if (action === 'fee-structure') openFeeStructure();
    if (action === 'schedule-exam') openScheduleModal();
    if (action === 'admission-letter') admissionLetter(id);
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'applicationSearch') filterApplications();
  });
  document.addEventListener('change', (event) => {
    if (['statusFilter', 'courseFilter'].includes(event.target.id) && ['applications', 'exams'].includes(currentPage)) filterApplications();
    if (currentPage === 'merit' && event.target.id === 'courseFilter') {
      const ranked = [...applications].filter((app) => !['Rejected', 'Submitted'].includes(app.status)).sort((a, b) => meritScore(b) - meritScore(a));
      const filtered = ranked.filter((app) => !event.target.value || app.course === event.target.value);
      document.getElementById('meritTableBody').innerHTML = meritRows(filtered);
    }
    if (event.target.matches('[data-document]') && event.target.files?.length) showToast(`${event.target.dataset.document} selected for this application.`);
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    event.preventDefault();
    if (form.id === 'registrationForm') {
      handleRegistration(getFormData(form));
      return;
    }
    if (form.id === 'applicationForm') {
      submitApplicationForm();
      return;
    }
    if (form.id === 'loginForm') {
      showToast('Signed in to the demo workspace. Welcome!');
      setPage('dashboard');
      return;
    }
    if (form.id !== 'modalForm') return;
    const formData = getFormData(form);
    const action = form.querySelector('[data-submit-action]')?.dataset.submitAction;
    if (action === 'save-score') {
      const app = findApplication(formData.id);
      if (!app) return;
      app.examScore = Number(formData.examScore);
      if (app.status === 'Submitted') app.status = 'Under Review';
      if (formData.comment) app.comment = formData.comment;
      saveApplications();
      closeModal();
      renderPage();
      showToast(`Exam score saved for ${fullName(app)}.`);
    }
    if (action === 'update-status') {
      const app = findApplication(formData.id);
      if (!app) return;
      app.status = formData.status;
      if (formData.comment) app.comment = formData.comment;
      if (formData.status === 'Admitted' && !app.feePaid) app.feePaid = 0;
      saveApplications();
      closeModal();
      renderPage();
      showToast(`${fullName(app)} is now ${formData.status.toLowerCase()}.`);
    }
    if (action === 'save-payment') {
      const app = findApplication(formData.id);
      if (!app) return;
      app.feePaid = Number(app.feePaid || 0) + Number(formData.amount || 0);
      saveApplications();
      closeModal();
      renderPage();
      showToast(`Payment saved. Receipt AS-R${Date.now().toString().slice(-6)} generated.`);
    }
    if (action === 'register-applicant') {
      closeModal();
      handleRegistration(formData);
    }
    if (action === 'schedule-exam') {
      closeModal();
      showToast(`${formData.title} scheduled for ${dateLabel(formData.date)}.`);
    }
    if (action === 'print-letter') {
      const letter = document.getElementById('printableLetter');
      if (!letter) return;
      const printWindow = window.open('', '_blank', 'width=700,height=800');
      if (!printWindow) return showToast('Allow pop-ups to print the admission offer.', true);
      printWindow.document.write(`<html><head><title>AdmitSchool Admission Offer</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#29243a;line-height:1.8}h3{text-align:center;color:#8b5cf6}</style></head><body>${letter.outerHTML}</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('admitschool-dark-mode', document.body.classList.contains('dark-mode') ? 'on' : 'off');
  });
  document.getElementById('menuToggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
  document.getElementById('profileButton').addEventListener('click', () => setPage('login'));
  document.getElementById('notificationsButton').addEventListener('click', () => showToast(`${applications.filter((app) => app.status === 'Submitted').length} new applications are ready for review.`));
  window.addEventListener('popstate', () => setPage(location.hash.slice(1) || 'dashboard', false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
  if (localStorage.getItem('admitschool-dark-mode') === 'on') document.body.classList.add('dark-mode');
  updateApplicationCount();
  setPage(location.hash.slice(1) || 'dashboard', false);
})();
