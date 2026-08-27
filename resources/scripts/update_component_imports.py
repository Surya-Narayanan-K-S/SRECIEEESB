import os
import re

component_map = {
    "Navbar": "layout",
    "Footer": "layout",
    "NavLink": "layout",
    "MobileBottomNav": "layout",
    "Hero": "home",
    "Highlights": "home",
    "Impact": "home",
    "Stats": "home",
    "Benefits": "home",
    "UpcomingEvent": "home",
    "Testimonials": "home",
    "TechStack": "home",
    "Newsletter": "home",
    "About": "about",
    "CollegeAbout": "about",
    "Research": "about",
    "Publications": "about",
    "Societies": "societies",
    "SocietyOfficeBearers": "societies",
    "OfficeBearers": "societies",
    "RegistrationModal": "modals",
    "DownloadAppModal": "modals",
    "InstallPrompt": "modals",
    "ChatBot": "modals",
    "Contact": "modals",
}

src_dir = r"c:\Users\surya_hvppyfs\Desktop\New folder\IEEESREC-main\src"

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content
    # Replace direct component imports e.g. import Navbar from "@/components/Navbar"
    # -> import Navbar from "@/components/layout/Navbar" or import { Navbar } from "@/components"
    for comp, folder in component_map.items():
        # Match: import Comp from "@/components/Comp" or import Comp, { ... } from "@/components/Comp"
        pattern1 = rf'import\s+([A-Za-z0-9_]+)\s+from\s+["\']@/components/{comp}["\'];?'
        repl1 = rf'import {comp} from "@/components/{folder}/{comp}";'
        new_content = re.sub(pattern1, repl1, new_content)

        # Match: import Comp, { other } from "@/components/Comp";
        pattern2 = rf'import\s+([A-Za-z0-9_]+),\s*(\{{[^\}}]+\}})\s+from\s+["\']@/components/{comp}["\'];?'
        repl2 = rf'import {comp}, \2 from "@/components/{folder}/{comp}";'
        new_content = re.sub(pattern2, repl2, new_content)

        # Match: import { other } from "@/components/Comp";
        pattern3 = rf'import\s+(\{{[^\}}]+\}})\s+from\s+["\']@/components/{comp}["\'];?'
        repl3 = rf'import \1 from "@/components/{folder}/{comp}";'
        new_content = re.sub(pattern3, repl3, new_content)

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file_path}")

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".tsx", ".ts", ".jsx", ".js")):
            process_file(os.path.join(root, file))

print("Done updating component imports.")
