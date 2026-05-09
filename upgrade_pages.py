import os

base_dir = r"e:\Sites\sadaqaSite"

pages = {
    "doaa": {
        "title": "أدعية | صدقة جارية",
        "h1": "أدعية منتخبة",
        "desc": "أدعية من الكتاب والسنة وأدعية السلف"
    },
    "quran": {
        "title": "القرآن الكريم | صدقة جارية",
        "h1": "القرآن الكريم",
        "desc": "تلاوات خاشعة لمجموعة من كبار القراء"
    },
    "moshaf": {
        "title": "المصحف الشريف | صدقة جارية",
        "h1": "المصحف الشريف",
        "desc": "قراءة القرآن الكريم مع البحث"
    },
    "sonan": {
        "title": "السنن الرواتب | صدقة جارية",
        "h1": "السنن الرواتب",
        "desc": "جدول السنن الرواتب للصلوات الخمس"
    }
}

for folder, meta in pages.items():
    index_path = os.path.join(base_dir, folder, "index.html")
    if not os.path.exists(index_path):
        continue
    with open(index_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if '<section' not in content:
        continue
        
    parts = content.split('<section', 1)
    body_content = parts[1]
    
    if '</section>' in body_content:
        body_parts = body_content.rsplit('</section>', 1)
        core_html = '<section' + body_parts[0] + '</section>'
    else:
        core_html = '<section' + body_content.split('<script type="module">')[0]
        
    top_html = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>""" + meta['title'] + """</title>
    
    <link rel="icon" type="image/x-icon" href="../resources/favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <!-- New Design System -->
    <link rel="stylesheet" href="../css/global.css">
    <style>
        .azkar-list { display: flex; flex-direction: column; gap: 1rem; }
        .azkar-title { display: block; text-decoration: none; padding: 1.25rem 2rem; background: var(--grad-primary); color: var(--clr-bg-base); font-size: 1.5rem; font-family: var(--font-heading); border-radius: var(--radius-md); text-align: center; font-weight: bold; transition: all var(--trans-base); box-shadow: var(--shadow-glow); margin-bottom: 0.5rem; margin-top: 1rem; cursor: pointer; }
        .azkar-title:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4); }
        .content { display: none; margin-bottom: 2rem; animation: fadeIn 0.4s ease; background: var(--clr-bg-surface); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-soft); font-size: 1.5rem; line-height: 2.2; color: var(--clr-text-main); text-align: right; }
        .azkar-item { display: block; width: 100%; cursor: pointer; transition: all var(--trans-base); text-align: right; background: var(--clr-bg-surface-elevated); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-soft); margin-bottom: 1rem; color: var(--clr-text-main); font-size: 1.3rem; }
        .azkar-item:hover { transform: translateY(-3px); border-color: var(--clr-primary); }
        .azkar-text { font-size: 1.3rem; line-height: 1.8; color: var(--clr-text-main); }
        .prayer-card { display: flex; flex-direction: column; gap: 0.5rem; }
        input#searchBar { width: 100%; padding: 1rem 1.5rem; background: var(--clr-bg-surface-elevated); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: var(--clr-text-main); font-size: 1.1rem; margin-bottom: 2rem; outline: none; transition: all var(--trans-base); }
        input#searchBar:focus { border-color: var(--clr-primary); box-shadow: 0 0 15px var(--clr-primary-mute); }
        .download-button { display: inline-block; background: var(--grad-primary); color: var(--clr-bg-base); padding: 1rem 2rem; border-radius: var(--radius-pill); text-decoration: none; font-weight: bold; margin-bottom: 2rem; transition: all var(--trans-base); box-shadow: var(--shadow-glow); text-align: center; width: auto; }
        .download-button:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4); }
        section { max-width: 900px !important; margin: 0 auto 4rem !important; display: block !important; }
    </style>
</head>
<body>
    <div class="container animate-fade-in">
        <header class="islamic-header" style="margin-top: 3rem; margin-bottom: 2rem; text-align: center;">
            <h1 class="heading-brand text-gradient" style="font-size: 3rem; margin-bottom: 0.5rem;">""" + meta['h1'] + """</h1>
            <p style="color: var(--clr-text-muted); font-size: 1.1rem;">""" + meta['desc'] + """</p>
        </header>
"""
    bottom_html = """
    </div>

    <!-- Scripts -->
    <script type="module">
        import { initSharedUI } from '../js/components.js';
        import { mainDb } from '../js/firebase-config.js';
        import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

        initSharedUI();

        // Firebase Visit tracking
        const visitsRef = ref(mainDb, "page_visits/" + """" + folder + """");
        get(visitsRef).then(snapshot => {
            let visits = { count: 1 };
            if (snapshot.exists()) {
                let data = snapshot.val();
                visits.count = (data.count || 0) + 1;
            }
            update(visitsRef, visits);
        }).catch(console.error);
        
        // Expose functions globally
        window.toggleSurah = function(event, surahId) {
            event.preventDefault();
            document.querySelectorAll(".content").forEach(el => {
                if (el.id !== surahId) el.style.display = "none";
            });
            const contentDiv = document.getElementById(surahId);
            if (contentDiv) {
                contentDiv.style.display = contentDiv.style.display === "block" ? "none" : "block";
            }
        };
        
        // Default search filter exposed globally for quran/moshaf
        window.filterSurahs = function() {
            let input = document.getElementById("searchBar");
            if(!input) return;
            let filter = input.value.replace(/[إأآا]/g, "ا").replace(/[ى]/g, "ي").replace(/[\u064B-\u065F]/g, "").toLowerCase();
            let items = document.querySelectorAll(".azkar-item");
            items.forEach(item => {
                let text = item.innerText.replace(/[إأآا]/g, "ا").replace(/[ى]/g, "ي").replace(/[\u064B-\u065F]/g, "").toLowerCase();
                item.style.display = text.includes(filter) ? "block" : "none";
            });
        };
        window.filterNames = window.filterSurahs;
    </script>
</body>
</html>
"""

    new_content = top_html + core_html + bottom_html
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(new_content)

print("Pages upgraded successfully!")
