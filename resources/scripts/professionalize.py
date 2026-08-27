import glob
import re

files = glob.glob('src/components/*Section.tsx')

replacements = {
    # Remove bouncy/playful rounded corners
    'rounded-3xl': 'rounded-none',
    'rounded-2xl': 'rounded-none',
    'rounded-xl': 'rounded-none',
    'rounded-[2rem]': 'rounded-none',
    'rounded-[2.5rem]': 'rounded-none',
    'rounded-[3rem]': 'rounded-none',
    'rounded-[4rem]': 'rounded-none',
    'rounded-[5rem]': 'rounded-none',
    'rounded-t-[3rem]': 'rounded-none',
    'rounded-tl-[3rem]': 'rounded-none',
    'rounded-tr-[3rem]': 'rounded-none',
    
    # Remove bright bouncy text gradients
    'text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600': 'text-slate-900 font-serif font-medium',
    'from-cyan-500 to-blue-600': 'from-slate-200 to-slate-100',
    'text-[#0b3b8f]': 'text-slate-900',
    'text-blue-600': 'text-slate-900',
    'text-cyan-500': 'text-slate-400',
    'text-cyan-600': 'text-slate-500',
    'hover:text-cyan-600': 'hover:text-slate-900',
    'text-white': 'text-slate-900',
    'bg-slate-900 text-white': 'bg-slate-900 text-slate-100', # Fix inversion
    
    # Remove bright interactive blobs
    'bg-cyan-100/40': 'bg-transparent',
    'bg-blue-100/40': 'bg-transparent',
    'bg-indigo-100/40': 'bg-transparent',
    'bg-slate-50 border border-slate-100': 'bg-[#fafafa] border border-slate-200',
    'bg-cyan-50': 'bg-slate-100',
    'bg-blue-50': 'bg-slate-100',
    
    # Remove playful bouncing
    'hover:-translate-y-2': 'hover:shadow-lg',
    'group-hover:-translate-y-2': '',
    'group-hover:scale-110': 'group-hover:scale-105',
    'transition-all duration-300': 'transition-all duration-700 ease-in-out',
    'transition-all duration-500': 'transition-all duration-700 ease-in-out',
    
    # Sharp boundaries
    'border-transparent': 'border-slate-200',
    
    # Refined typography
    'font-black': 'font-bold tracking-tight',
    'font-heading': 'font-serif',
}

for filepath in files:
    if "HeroSection" in filepath:
        continue # Ignore HeroSection as requested
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    
    # Custom Regex replacements for specific layouts
    # Remove dynamic shadows to use crisp lines
    content = re.sub(r'shadow-\[.*?\]', 'shadow-sm hover:shadow-lg', content)
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
