import os
import re

base_dir = r"e:\Sites\sadaqaSite"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file == "index.html":
            path = os.path.join(root, file)
            
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            original_content = content
            
            # Remove <footer ...>...</footer>
            content = re.sub(r'<footer[^>]*>.*?</footer>', '', content, flags=re.DOTALL)
            
            # Remove <div id="sidebar-container">...</div> and similar variants
            content = re.sub(r'<div id="sidebar-container">.*?</div>\s*<!--.*?-->', '', content, flags=re.DOTALL)
            content = re.sub(r'<div id="sidebar-container">.*?</style>\s*</div>', '', content, flags=re.DOTALL)
            content = re.sub(r'<div id="sidebar-container">\s*<style>.*?</style>\s*</div>', '', content, flags=re.DOTALL)
            
            # Sometimes there is a <div id="sidebar-container"> that just wraps style.
            # The actual sidebar might be <div class="sidebar" id="sidebar">
            content = re.sub(r'<div class="sidebar" id="sidebar">.*?</div>\s*<script>.*?</script>', '', content, flags=re.DOTALL)
            content = re.sub(r'<div class="sidebar"[^>]*>.*?</div>', '', content, flags=re.DOTALL)
            
            # Remove menu-btn
            content = re.sub(r'<button class="menu-btn"[^>]*>.*?</button>', '', content, flags=re.DOTALL)
            
            # Remove overlay
            content = re.sub(r'<div class="overlay"[^>]*></div>', '', content, flags=re.DOTALL)
            
            # Ensure global.css is included if not
            if 'global.css' not in content:
                # Add before </head>
                depth = root[len(base_dir):].count(os.sep)
                prefix = "../" * depth if depth > 0 else "./"
                content = content.replace('</head>', f'    <link rel="stylesheet" href="{prefix}css/global.css">\n</head>')

            # Ensure components.js is included
            if 'js/components.js' not in content:
                depth = root[len(base_dir):].count(os.sep)
                prefix = "../" * depth if depth > 0 else "./"
                js_injection = f"""
    <script type="module">
        import {{ initSharedUI }} from '{prefix}js/components.js';
        initSharedUI();
    </script>
"""
                content = content.replace('</body>', js_injection + '</body>')

            if content != original_content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated: {path}")

print("Refactoring complete.")
