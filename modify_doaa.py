import sys

file_path = r"e:\Sites\sadaqaSite\doaa\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

top_replacement = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>أدعية | صدقة جارية</title>
    
    <link rel="icon" type="image/x-icon" href="../resources/favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <!-- New Design System -->
    <link rel="stylesheet" href="../css/global.css">
    <style>
        .azkar-list { display: flex; flex-direction: column; gap: 1rem; }
        .azkar-title { display: block; text-decoration: none; padding: 1.25rem 2rem; background: var(--grad-primary); color: var(--clr-bg-base); font-size: 1.5rem; font-family: var(--font-heading); border-radius: var(--radius-md); text-align: center; font-weight: bold; transition: all var(--trans-base); box-shadow: var(--shadow-glow); margin-bottom: 0.5rem; margin-top: 1rem; }
        .azkar-title:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4); }
        .content { display: none; margin-bottom: 2rem; animation: fadeIn 0.4s ease; }
        .azkar-item { cursor: default; transition: all var(--trans-base); text-align: right; background: var(--clr-bg-surface-elevated); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--clr-border); box-shadow: var(--shadow-soft); margin-bottom: 1rem; }
        .azkar-item:hover { transform: translateY(-3px); border-color: var(--clr-primary); }
        .azkar-text { font-size: 1.3rem; line-height: 1.8; color: var(--clr-text-main); }
    </style>
</head>
<body>
    <div class="container animate-fade-in">
        <header class="islamic-header" style="margin-top: 3rem; margin-bottom: 2rem; text-align: center;">
            <h1 class="heading-brand text-gradient" style="font-size: 3rem; margin-bottom: 0.5rem;">أدعية منتخبة</h1>
            <p style="color: var(--clr-text-muted); font-size: 1.1rem;">أدعية من الكتاب والسنة وأدعية السلف</p>
        </header>

        <section id="doaa-section" style="display: block; max-width: 800px; margin: 0 auto 4rem;">
            <div class="azkar-list">
"""

bottom_replacement = """            </div>
        </section>
    </div>

    <!-- Scripts -->
    <script type="module">
        import { initSharedUI } from '../js/components.js';
        import { mainDb } from '../js/firebase-config.js';
        import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

        initSharedUI();

        // Firebase Visit tracking
        const visitsRef = ref(mainDb, "page_visits/dua");
        get(visitsRef).then(snapshot => {
            let visits = { count: 1 };
            if (snapshot.exists()) {
                let data = snapshot.val();
                visits.count = (data.count || 0) + 1;
            }
            update(visitsRef, visits);
        }).catch(console.error);
        
        // Expose toggleSurah globally
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
    </script>
</body>
</html>
"""

new_lines = []
list_started = False
for line in lines:
    if line.strip() == '<a href="#" class="azkar-title" onclick="toggleSurah(event,\'s1\')">أدعية للمتوفي</a>':
        if not list_started:
            new_lines.append(top_replacement)
            list_started = True
    
    if list_started:
        if line.strip() == '</section>':
            break
        new_lines.append(line)

new_lines.append(bottom_replacement)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)
