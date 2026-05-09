import os

path = input("ادخل مسار الفولدر: ").strip()
output_file = os.path.join(path, "folder_tree.txt")

with open(output_file, "w", encoding="utf-8") as f:
    for root, dirs, files in os.walk(path):
        level = root.replace(path, "").count(os.sep)
        indent = "│   " * level + "├── "
        f.write(f"{indent}{os.path.basename(root)}/\n")
        sub_indent = "│   " * (level + 1)
        for name in files:
            f.write(f"{sub_indent}{name}\n")

print(f"اتعمل الملف: {output_file}")
