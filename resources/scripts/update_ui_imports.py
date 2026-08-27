import os
import re

ui_category_map = {
    # feedback
    "alert": "feedback",
    "alert-dialog": "feedback",
    "progress": "feedback",
    "skeleton": "feedback",
    "sonner": "feedback",
    "toast": "feedback",
    "toaster": "feedback",
    "use-toast": "feedback",
    # inputs
    "button": "inputs",
    "checkbox": "inputs",
    "form": "inputs",
    "input": "inputs",
    "input-otp": "inputs",
    "label": "inputs",
    "radio-group": "inputs",
    "select": "inputs",
    "slider": "inputs",
    "switch": "inputs",
    "textarea": "inputs",
    "toggle": "inputs",
    "toggle-group": "inputs",
    # data-display
    "avatar": "data-display",
    "badge": "data-display",
    "calendar": "data-display",
    "card": "data-display",
    "carousel": "data-display",
    "chart": "data-display",
    "table": "data-display",
    # navigation
    "breadcrumb": "navigation",
    "menubar": "navigation",
    "navigation-menu": "navigation",
    "pagination": "navigation",
    "tabs": "navigation",
    # overlays
    "dialog": "overlays",
    "drawer": "overlays",
    "dropdown-menu": "overlays",
    "context-menu": "overlays",
    "hover-card": "overlays",
    "popover": "overlays",
    "sheet": "overlays",
    "tooltip": "overlays",
    # layout
    "accordion": "layout",
    "aspect-ratio": "layout",
    "collapsible": "layout",
    "command": "layout",
    "resizable": "layout",
    "scroll-area": "layout",
    "separator": "layout",
    "sidebar": "layout",
}

src_dir = r"c:\Users\surya_hvppyfs\Desktop\New folder\IEEESREC-main\src"

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content
    for comp, folder in ui_category_map.items():
        pattern = rf'from\s+["\']@/components/ui/{comp}["\']'
        replacement = f'from "@/components/ui/{folder}/{comp}"'
        new_content = re.sub(pattern, replacement, new_content)

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated UI import in: {file_path}")

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".tsx", ".ts", ".jsx", ".js")):
            process_file(os.path.join(root, file))

print("Done updating UI imports.")
