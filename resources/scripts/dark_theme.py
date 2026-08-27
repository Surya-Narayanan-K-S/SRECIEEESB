import os
import glob

files = glob.glob('src/components/*Section.tsx') + ['src/pages/Index.tsx']

replacements = {
    'bg-white': 'bg-black',
    'bg-slate-50': 'bg-[#050505]',
    'bg-slate-100': 'bg-[#111111]',
    'text-slate-900': 'text-white font-serif tracking-[0.1em]',
    'text-slate-800': 'text-zinc-100 font-serif tracking-widest',
    'text-slate-700': 'text-zinc-300',
    'text-slate-600': 'text-zinc-400 font-light',
    'text-slate-500': 'text-zinc-500 font-light',
    'text-slate-400': 'text-zinc-600',
    'border-slate-200': 'border-white/10',
    'border-slate-100': 'border-white/5',
    'border-slate-300': 'border-white/20',
    'shadow-xl': 'shadow-[0_0_50px_rgba(255,255,255,0.03)]',
    'shadow-md': 'shadow-[0_0_20px_rgba(255,255,255,0.03)]',
    'shadow-sm': 'shadow-[0_0_10px_rgba(255,255,255,0.02)]',
    'bg-blue-50': 'bg-white/5',
    'bg-blue-100': 'bg-white/10',
    'bg-cyan-50': 'bg-white/5',
    'bg-indigo-50': 'bg-white/5',
    'text-[#0b3b8f]': 'text-white',
    'text-blue-600': 'text-zinc-300',
    'text-blue-500': 'text-zinc-400',
    'text-blue-700': 'text-white',
    'text-cyan-600': 'text-zinc-300',
    'text-cyan-700': 'text-white',
    'border-blue-100': 'border-white/10',
    'border-cyan-100': 'border-white/10',
    'shadow-cyan-900/10': 'shadow-white/5',
    'bg-gradient-to-r from-blue-600 to-cyan-500': 'bg-gradient-to-r from-zinc-600 to-zinc-400',
    'bg-gradient-to-br from-blue-50 to-indigo-50': 'bg-gradient-to-br from-zinc-900 to-black',
    'text-blue-900': 'text-white',
    'bg-slate-900': 'bg-white text-black', # Invert dark buttons
    'text-slate-50': 'text-black',
}

for filepath in files:
    if "HeroSection" in filepath:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Extra fix for Index.tsx box shadow wrappers
    if "Index.tsx" in filepath:
        content = content.replace('rounded-[2.5rem]', '')
        content = content.replace('rounded-[3rem]', '')
        content = content.replace('rounded-[4rem]', '')
        content = content.replace('rounded-[5rem]', '')
        content = content.replace('rounded-t-[3rem]', '')
        content = content.replace('rounded-t-[5rem]', '')
        content = content.replace('shadow-[0_20px_60px_rgba(0,0,0,0.06)]', '')
        content = content.replace('shadow-[0_-20px_60px_rgba(0,0,0,0.08)]', '')
        content = content.replace('max-w-[1300px]', 'max-w-[1800px]')
        content = content.replace('max-w-[1400px]', 'max-w-[1800px]')
        content = content.replace('max-w-[1500px]', 'max-w-[1800px]')
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
