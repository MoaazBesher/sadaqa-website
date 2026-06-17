import os
import re

base_dir = r"e:\Sites\sadaqaSite"

pages_meta = {
    "": { # Root index
        "title": "صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي | أوقات الصلاة والقرآن والأذكار",
        "desc": "موقع صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي. يحتوي الموقع على أوقات الصلاة، أذكار الصباح والمساء، القرآن الكريم، المصحف الإلكتروني، الأدعية والمسبحة الإلكترونية.",
        "url": "https://sadaqa-mainpage.netlify.app/"
    },
    "doaa": {
        "title": "أدعية | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "أدعية من الكتاب والسنة وأدعية السلف. صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/doaa/"
    },
    "quran": {
        "title": "القرآن الكريم | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "تلاوات خاشعة لمجموعة من كبار القراء. القرآن الكريم صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/quran/"
    },
    "moshaf": {
        "title": "المصحف الشريف | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "قراءة القرآن الكريم مع ميزة البحث. المصحف الإلكتروني صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/moshaf/"
    },
    "sonan": {
        "title": "السنن الرواتب | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "جدول السنن الرواتب للصلوات الخمس. صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/sonan/"
    },
    "praytimes": {
        "title": "أوقات الصلاة | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "مواقيت الصلاة الدقيقة. صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/praytimes/"
    },
    "morningazkar": {
        "title": "أذكار الصباح | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "أذكار الصباح كاملة ومكتوبة. صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/morningazkar/"
    },
    "eveningazkar": {
        "title": "أذكار المساء | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "أذكار المساء كاملة ومكتوبة. صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/eveningazkar/"
    },
    "masbaha": {
        "title": "المسبحة الإلكترونية | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "المسبحة الإلكترونية للتسبيح والاستغفار. صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/masbaha/"
    },
    "downloadpage": {
        "title": "تحميل التطبيق | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "تحميل تطبيق صدقة جارية للهواتف المحمولة. صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": "https://sadaqa-mainpage.netlify.app/downloadpage/"
    }
}

# For all the sub-folders in quran
quran_readers = ["abdelbaset", "alijaber", "daghestani", "elafasi", "elghamdy", "elhosary", "elkatami", "elmenshawy", "elsodes", "fares", "islamsobhy", "khaledjalel", "maher", "yasser"]
for reader in quran_readers:
    pages_meta[f"quran/{reader}"] = {
        "title": f"تلاوة القرآن | صدقة جارية على روح محمد أحمد أنور ومحمد عزت حلمي",
        "desc": "تلاوة القرآن الكريم بصوت ندي. صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي البيبي.",
        "url": f"https://sadaqa-mainpage.netlify.app/quran/{reader}/"
    }

global_keywords = "صدقة جارية, محمد أحمد محمد أنور, محمد عزت حلمي البيبي, أوقات الصلاة, قرآن كريم, أذكار الصباح, أذكار المساء, أدعية, مسبحة إلكترونية, سنن"

def generate_seo_tags(meta):
    json_ld = f"""
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "صدقة جارية على روح محمد أحمد محمد أنور ومحمد عزت حلمي",
      "url": "{meta['url']}",
      "description": "{meta['desc']}",
      "publisher": {{
        "@type": "Person",
        "name": "صدقة جارية"
      }}
    }}
    </script>"""

    tags = f"""
    <title>{meta['title']}</title>
    <meta name="description" content="{meta['desc']}">
    <meta name="keywords" content="{global_keywords}">
    <meta name="author" content="Moaaz Ashraf">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{meta['url']}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{meta['url']}">
    <meta property="og:title" content="{meta['title']}">
    <meta property="og:description" content="{meta['desc']}">
    <meta property="og:image" content="https://sadaqa-mainpage.netlify.app/resources/preview.png">
    <meta property="og:site_name" content="صدقة جارية">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{meta['url']}">
    <meta name="twitter:title" content="{meta['title']}">
    <meta name="twitter:description" content="{meta['desc']}">
    <meta name="twitter:image" content="https://sadaqa-mainpage.netlify.app/resources/preview.png">
    {json_ld}
"""
    return tags

def update_file(filepath, folder_key):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    meta = pages_meta.get(folder_key)
    if not meta:
        return

    # Use regex to remove existing title, meta description, keywords, canonical, og:, twitter:
    content = re.sub(r'<title>.*?</title>', '', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'<meta name="description".*?>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta name="keywords".*?>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta name="author".*?>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta name="robots".*?>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<link rel="canonical".*?>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta property="og:.*?".*?>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta name="twitter:.*?".*?>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<script type="application/ld\+json">.*?</script>', '', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'<!-- Open Graph.*?(?=<!--|$)', '', content, flags=re.IGNORECASE | re.DOTALL) # Attempt to remove old comments
    
    # Also clean up empty lines caused by deletions to some extent, but let's just insert it before <link rel="icon" or </head>
    
    seo_tags = generate_seo_tags(meta)
    
    if '<head>' in content:
        parts = content.split('<head>', 1)
        new_content = parts[0] + '<head>\n' + seo_tags + parts[1]
    else:
        new_content = seo_tags + content

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated: {filepath}")

# Process Root
update_file(os.path.join(base_dir, "index.html"), "")

# Process Folders
for folder in pages_meta.keys():
    if folder == "": continue
    filepath = os.path.join(base_dir, folder.replace("/", os.sep), "index.html")
    update_file(filepath, folder)

print("SEO update complete.")
