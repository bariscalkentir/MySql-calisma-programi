// ===== State =====
let readTopics = JSON.parse(localStorage.getItem('mysql_read') || '{}');
let openSections = JSON.parse(localStorage.getItem('mysql_open_sections') || '{}');
let currentTheme = localStorage.getItem('mysql_theme') || 'dark';

// ===== SQL Syntax Highlighting =====
function highlightSQL(code) {
    const keywords = ['SELECT','FROM','WHERE','ORDER BY','GROUP BY','HAVING','INSERT INTO','UPDATE','DELETE FROM','CREATE TABLE','CREATE DATABASE','DROP TABLE','DROP DATABASE','DROP COLUMN','ALTER TABLE','RENAME TABLE','TRUNCATE TABLE','REPLACE INTO','SET','VALUES','INNER JOIN','LEFT JOIN','RIGHT JOIN','CROSS JOIN','SELF JOIN','JOIN','ON','USING','AS','AND','OR','NOT','IN','BETWEEN','LIKE','LIMIT','OFFSET','IS NULL','IS NOT NULL','EXISTS','UNION ALL','UNION','EXCEPT','INTERSECT','WITH RECURSIVE','WITH','PRIMARY KEY','FOREIGN KEY','REFERENCES','CONSTRAINT','CHECK','UNIQUE','NOT NULL','DEFAULT','AUTO_INCREMENT','IF NOT EXISTS','IF EXISTS','INTO','TABLE','DATABASE','COLUMN','ADD','MODIFY','ENGINE','ON DELETE CASCADE','ON DELETE SET NULL','ON DELETE RESTRICT','ON UPDATE CASCADE','SHOW DATABASES','USE','DESC','ASC','DISTINCT','ALL','ROLLUP','WITH ROLLUP','TEMPORARY','GENERATED ALWAYS','VIRTUAL','STORED','UNSIGNED','CASCADE','RESTRICT','NO ACTION','ENUM','BOOLEAN','TRUE','FALSE','CURRENT_TIMESTAMP','CHARACTER SET','COLLATE','NULL','INT','TINYINT','SMALLINT','MEDIUMINT','BIGINT','DECIMAL','FLOAT','DOUBLE','CHAR','VARCHAR','TEXT','DATE','DATETIME','TIMESTAMP','TIME','BIT','BLOB','BINARY','VARBINARY','JSON','UUID'];
    
    let escaped = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    
    // Comments
    escaped = escaped.replace(/(--.*)/g, '<span class="sql-comment">$1</span>');
    
    // Strings
    escaped = escaped.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="sql-string">$1</span>');
    
    // Numbers
    escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="sql-number">$1</span>');
    
    // Keywords (longest first)
    const sorted = keywords.sort((a,b) => b.length - a.length);
    sorted.forEach(kw => {
        const re = new RegExp('\\b(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')\\b', 'gi');
        escaped = escaped.replace(re, (m) => '<span class="sql-keyword">' + m + '</span>');
    });
    
    // Functions
    escaped = escaped.replace(/\b(COUNT|SUM|AVG|MIN|MAX|CONCAT|CONCAT_WS|NOW|CURDATE|CURTIME|ROUND|LAST_INSERT_ID|FIELD|GROUPING|COALESCE|IFNULL)\b/gi, '<span class="sql-function">$1</span>');
    
    // Operators
    escaped = escaped.replace(/(\*|→|×)/g, '<span class="sql-operator">$1</span>');
    
    return escaped;
}

// ===== Build Sidebar =====
function buildNav() {
    const navList = document.getElementById('navList');
    navList.innerHTML = '';
    
    mysqlData.forEach(section => {
        const li = document.createElement('li');
        li.className = 'nav-section';
        
        const isOpen = openSections[section.id];
        const allRead = section.topics.every((_, i) => readTopics[section.id + '_' + i]);
        
        li.innerHTML = `
            <div class="nav-section-title ${isOpen ? 'open' : ''} ${allRead ? 'completed' : ''}" data-section="${section.id}">
                <span class="arrow">▶</span>
                <span class="section-num">${section.id}</span>
                <span>${section.titleEn}</span>
            </div>
            <ul class="nav-items ${isOpen ? 'show' : ''}">
                ${section.topics.map((t, i) => `
                    <li class="nav-item ${readTopics[section.id + '_' + i] ? 'read' : ''}" data-section="${section.id}" data-topic="${i}">
                        <span class="check-icon">✓</span>
                        ${t.name}
                    </li>
                `).join('')}
            </ul>
        `;
        navList.appendChild(li);
    });
    
    // Event listeners
    document.querySelectorAll('.nav-section-title').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.dataset.section;
            el.classList.toggle('open');
            el.nextElementSibling.classList.toggle('show');
            openSections[id] = el.classList.contains('open');
            localStorage.setItem('mysql_open_sections', JSON.stringify(openSections));
        });
    });
    
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', () => {
            const sId = el.dataset.section;
            const tId = el.dataset.topic;
            scrollToTopic(sId, tId);
        });
    });
    
    updateProgress();
}

// ===== Build Content =====
function buildContent() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '';
    
    mysqlData.forEach(section => {
        const card = document.createElement('div');
        card.className = 'section-card';
        card.id = 'section-' + section.id;
        
        card.innerHTML = `
            <div class="section-header">
                <div class="section-badge">${section.id}</div>
                <div class="section-info">
                    <div class="section-title">${section.title}</div>
                    <div class="section-desc">${section.titleEn} — ${section.topics.length} konu</div>
                </div>
                <div class="section-arrow">▶</div>
            </div>
            <div class="section-body">
                ${section.topics.map((topic, i) => buildTopicCard(section.id, topic, i)).join('')}
            </div>
        `;
        area.appendChild(card);
    });
    
    // Toggle sections
    document.querySelectorAll('.section-header').forEach(el => {
        el.addEventListener('click', () => {
            el.parentElement.classList.toggle('open');
        });
    });
    
    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const code = btn.closest('.code-block').querySelector('.code-body').textContent;
            navigator.clipboard.writeText(code).then(() => {
                btn.textContent = '✓ Kopyalandı';
                setTimeout(() => btn.textContent = 'Kopyala', 1500);
            });
        });
    });
    
    // Mark as read on intersection
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const key = el.dataset.sectionId + '_' + el.dataset.topicId;
                if (!readTopics[key]) {
                    readTopics[key] = true;
                    localStorage.setItem('mysql_read', JSON.stringify(readTopics));
                    const navItem = document.querySelector(`.nav-item[data-section="${el.dataset.sectionId}"][data-topic="${el.dataset.topicId}"]`);
                    if (navItem) navItem.classList.add('read');
                    updateProgress();
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.topic-card').forEach(el => observer.observe(el));
}

function buildOutputTable(output) {
    if (!output) return '';
    return `
        <div class="output-block">
            <div class="output-header">📊 Çıktı (Output)</div>
            <div class="output-table-wrap">
                <table class="output-table">
                    <thead><tr>${output.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>${output.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
            </div>
            ${output.note ? `<div class="output-note">${output.note}</div>` : ''}
        </div>
    `;
}

function buildTopicCard(sectionId, topic, index) {
    const syntaxHtml = topic.syntax ? `
        <div class="code-block">
            <div class="code-header">
                <span class="code-label">Sözdizimi (Syntax)</span>
                <button class="copy-btn">Kopyala</button>
            </div>
            <div class="code-body">${highlightSQL(topic.syntax)}</div>
        </div>
    ` : '';
    
    const examplesHtml = topic.examples ? topic.examples.map(ex => `
        <div class="example-group">
            <div class="code-block">
                <div class="code-header">
                    <span class="code-label">📝 ${ex.label}</span>
                    <button class="copy-btn">Kopyala</button>
                </div>
                <div class="code-body">${highlightSQL(ex.code)}</div>
            </div>
            ${buildOutputTable(ex.output)}
        </div>
    `).join('') : '';
    
    const tipHtml = topic.tip ? `<div class="tip-box"><strong>💡 İpucu:</strong> ${topic.tip}</div>` : '';
    
    return `
        <div class="topic-card" id="topic-${sectionId}-${index}" data-section-id="${sectionId}" data-topic-id="${index}">
            <div class="topic-title">
                <span class="keyword">${topic.name}</span>
            </div>
            <div class="topic-desc">${topic.desc}</div>
            ${syntaxHtml}
            ${examplesHtml}
            ${tipHtml}
        </div>
    `;
}

// ===== Helpers =====
function scrollToTopic(sectionId, topicId) {
    const sectionCard = document.getElementById('section-' + sectionId);
    if (sectionCard && !sectionCard.classList.contains('open')) {
        sectionCard.classList.add('open');
    }
    setTimeout(() => {
        const topic = document.getElementById('topic-' + sectionId + '-' + topicId);
        if (topic) {
            topic.scrollIntoView({ behavior: 'smooth', block: 'center' });
            topic.style.borderColor = 'var(--accent)';
            setTimeout(() => topic.style.borderColor = '', 2000);
        }
    }, 100);
    
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('show');
    
    // Update breadcrumb
    const section = mysqlData.find(s => s.id == sectionId);
    if (section) {
        document.getElementById('breadcrumb').textContent = 
            `Section ${section.id} › ${section.title} › ${section.topics[topicId].name}`;
    }
}

function updateProgress() {
    const total = mysqlData.reduce((sum, s) => sum + s.topics.length, 0);
    const read = Object.keys(readTopics).filter(k => readTopics[k]).length;
    const pct = Math.round((read / total) * 100);
    
    document.getElementById('progressText').textContent = `${read}/${total}`;
    document.getElementById('progressFill').style.width = pct + '%';
    
    // Update section completion in nav
    mysqlData.forEach(section => {
        const allRead = section.topics.every((_, i) => readTopics[section.id + '_' + i]);
        const navTitle = document.querySelector(`.nav-section-title[data-section="${section.id}"]`);
        if (navTitle) navTitle.classList.toggle('completed', allRead);
    });
}

// ===== Search =====
document.getElementById('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const navItems = document.querySelectorAll('.nav-item');
    const navSections = document.querySelectorAll('.nav-section');
    
    if (!q) {
        navItems.forEach(el => el.style.display = '');
        navSections.forEach(el => el.style.display = '');
        return;
    }
    
    navSections.forEach(section => {
        const items = section.querySelectorAll('.nav-item');
        let hasMatch = false;
        items.forEach(item => {
            const match = item.textContent.toLowerCase().includes(q);
            item.style.display = match ? '' : 'none';
            if (match) hasMatch = true;
        });
        section.style.display = hasMatch ? '' : 'none';
        if (hasMatch) {
            section.querySelector('.nav-items').classList.add('show');
            section.querySelector('.nav-section-title').classList.add('open');
        }
    });
});

// ===== Theme =====
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('themeToggle').textContent = theme === 'dark' ? '🌙' : '☀️';
    currentTheme = theme;
    localStorage.setItem('mysql_theme', theme);
}

document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ===== Mobile Sidebar =====
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    overlay.classList.add('show');
});

document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    overlay.classList.remove('show');
});

overlay.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    overlay.classList.remove('show');
});

// ===== Init =====
applyTheme(currentTheme);
buildNav();
buildContent();
