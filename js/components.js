// e:\Sites\sadaqaSite\js\components.js

export function initSharedUI() {
    const path = window.location.pathname.toLowerCase();
    const isSubDir = path.includes('/praytimes/') ||
                     path.includes('/praytimes') || 
                     path.includes('/sonan') ||
                     path.includes('/morningazkar') ||
                     path.includes('/eveningazkar') ||
                     path.includes('/doaa') ||
                     path.includes('/quran') ||
                     path.includes('/moshaf') ||
                     path.includes('/masbaha');
    const basePath = isSubDir ? '../' : './';

    // 1. Inject Overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'shared-overlay';
    document.body.appendChild(overlay);

    // 2. Inject Sidebar
    const sidebar = document.createElement('nav');
    sidebar.className = 'sidebar';
    sidebar.id = 'shared-sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <h3 class="heading-brand" style="font-size: 1.8rem; margin:0;">القائمة</h3>
            <button class="btn-icon" id="close-sidebar" aria-label="إغلاق القائمة" style="width: 2.5rem; height: 2.5rem; font-size: 1rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="sidebar-menu">
            <a href="${basePath}praytimes/index.html" class="sidebar-link"><i class="fas fa-mosque"></i> أوقات الصلاة</a>
            <a href="${basePath}sonan/index.html" class="sidebar-link"><i class="fa-brands fa-ussunnah"></i> السنن الرواتب</a>
            <a href="${basePath}morningazkar/index.html" class="sidebar-link"><i class="fas fa-sun"></i> أذكار الصباح</a>
            <a href="${basePath}eveningazkar/index.html" class="sidebar-link"><i class="fas fa-moon"></i> أذكار المساء</a>
            <a href="${basePath}doaa/index.html" class="sidebar-link"><i class="fas fa-pray"></i> أدعية</a>
            <a href="${basePath}quran/index.html" class="sidebar-link"><i class="fa-solid fa-headphones"></i> قرآن كريم</a>
            <a href="${basePath}moshaf/index.html" class="sidebar-link"><i class="fas fa-quran"></i> المصحف</a>
            <a href="${basePath}masbaha/index.html" class="sidebar-link"><i class="fa-solid fa-repeat"></i> المسبحة الإلكترونية</a>
            <br>
            <a href="${basePath}downloadpage/index.html" class="sidebar-link"><i class="fas fa-download"></i> تحميل التطبيق</a>
            <a href="${basePath}index.html" class="sidebar-link" style="border-top: 1px solid var(--clr-border-light)"><i class="fas fa-home"></i> الرئيسية</a>
        </div>
    `;
    document.body.appendChild(sidebar);

    // 3. Inject Menu Button (unless page has a specific custom one, but standardizing is better)
    if (!document.getElementById('open-sidebar')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'btn-icon';
        menuBtn.style.position = 'fixed';
        menuBtn.style.top = '1.5rem';
        menuBtn.style.right = '1.5rem';
        menuBtn.style.zIndex = '1000';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.id = 'open-sidebar';
        menuBtn.setAttribute('aria-label', 'فتح القائمة');
        document.body.appendChild(menuBtn);
    }
    const openBtn = document.getElementById('open-sidebar');

    // Sidebar Logic
    const toggleMenu = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    if (openBtn) openBtn.addEventListener('click', toggleMenu);
    document.getElementById('close-sidebar').addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Highlight current page link and prevent reload on click
    const normalizePath = (p) => p.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
    const currentNorm = normalizePath(window.location.pathname.toLowerCase());
    
    const links = sidebar.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        try {
            const linkUrl = new URL(link.href, window.location.origin);
            if (normalizePath(linkUrl.pathname.toLowerCase()) === currentNorm) {
                link.classList.add('active-sidebar-link');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
        } catch(e) {}
    });

    // Export link utilities
    window.copySiteLink = function(link) {
        navigator.clipboard.writeText(link || "https://sadaqa-mainpage.netlify.app/");
        alert("✅ تم نسخ الرابط!");
    };

    window.shareSiteLink = function(link) {
        const shareLink = link || "https://sadaqa-mainpage.netlify.app/";
        if (navigator.share) {
            navigator.share({
                title: "صدقة جارية",
                url: shareLink
            }).catch(err => console.error("مشاركة فشلت: ", err));
        } else {
            alert("⚠️ خاصية المشاركة غير مدعومة في هذا المتصفح.");
        }
    };

    // 4. Inject Footer
    if (!document.getElementById('shared-footer')) {
        const footer = document.createElement('footer');
        footer.id = 'shared-footer';
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.left = '0';
        footer.style.right = '0';
        footer.style.zIndex = '900';
        footer.style.background = 'rgba(10, 10, 10, 0.8)';
        footer.style.backdropFilter = 'blur(10px)';
        footer.style.WebkitBackdropFilter = 'blur(10px)';
        footer.style.borderTop = '1px solid var(--clr-border-light, #333)';
        footer.style.textAlign = 'center';
        footer.style.padding = '0.75rem';
        footer.innerHTML = `
            <a href="https://moaazbesher.netlify.app/" target="_blank" style="text-decoration:none; color:var(--clr-text-muted, #aaa); transition: color 0.3s; display: inline-flex; align-items: center; gap: 5px; font-family: 'Cairo', sans-serif; font-size: 0.95rem; direction: ltr;">
                Designed and developed by <span style="color: var(--clr-primary, #2a7ae2); font-weight: 700;">Moaaz Besher</span>
            </a>
        `;
        
        document.body.appendChild(footer);
        document.body.style.paddingBottom = '4rem';
    }
}
