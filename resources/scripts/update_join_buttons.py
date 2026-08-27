import os
import glob
import re

files = glob.glob('src/pages/*Page.tsx')

# We need to replace the button with a Link in these specific files:
# SrecBranchPage, WiePage, EmbsPage, CsPage, ComsocPage, PelsPage, ImPage, CisPage, SocietyDetailPage

society_pages = ["SrecBranchPage", "WiePage", "EmbsPage", "CsPage", "ComsocPage", "PelsPage", "ImPage", "CisPage", "SocietyDetailPage"]

for filepath in files:
    filename = os.path.basename(filepath)
    if any(sp + ".tsx" == filename for sp in society_pages):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Replace 'Submit Application' or 'Join Chapter' button with a Link
        content = re.sub(
            r'<button className="uppercase tracking-\[0\.2em\] font-bold text-\[10px\] pb-1 border-b border-white hover:text-slate-300 hover:border-slate-300 transition-colors">\s*(Submit Application|Join Chapter)\s*</button>',
            r'<Link to="/join" className="uppercase tracking-[0.2em] font-bold text-[10px] pb-1 border-b border-white hover:text-slate-300 hover:border-slate-300 transition-colors inline-block">\1</Link>',
            content
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
