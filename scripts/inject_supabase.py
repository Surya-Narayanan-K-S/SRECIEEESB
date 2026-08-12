import os

filepath = r'c:\Users\surya\OneDrive\Desktop\IEEE\src\pages\JoinPage.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Supabase import and toast import if not present
if "import { supabase }" not in content:
    content = content.replace(
        'import { motion, AnimatePresence } from "framer-motion";',
        'import { motion, AnimatePresence } from "framer-motion";\nimport { supabase } from "@/lib/supabase";\nimport { useToast } from "@/components/ui/use-toast";'
    )

# 2. Add form states and toast
states = """  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [sop, setSop] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();"""

if "const [firstName" not in content:
    content = content.replace(
        'const [selectedSociety',
        f'{states}\n  const [selectedSociety'
    )

# 3. Replace NextStep logic ? Nothing to change.
# 4. Replace handleSubmit logic
old_handle_submit = """  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    setIsSubmitted(true);
    setTimeout(() => window.location.href = "/", 3500);
  };"""

new_handle_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('applications').insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          department: department,
          year_of_study: yearOfStudy,
          target_society: selectedSociety,
          skills: selectedSkills,
          statement_of_purpose: sop,
        }
      ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setTimeout(() => window.location.href = "/", 3500);
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message || "Could not submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };"""

content = content.replace(old_handle_submit, new_handle_submit)

# 5. Connect inputs to state
content = content.replace(
    'placeholder="John"',
    'placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)}'
)
content = content.replace(
    'placeholder="Doe"',
    'placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)}'
)
content = content.replace(
    'placeholder="john@srec.ac.in"',
    'placeholder="john@srec.ac.in" value={email} onChange={(e) => setEmail(e.target.value)}'
)

# Department select
# Use regex to find Dept select
import re
content = re.sub(
    r'<select required className="w-full bg-\[\#fafafa\].*?>\s*<option value="">Select Dept</option>',
    r'<select required value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-[#fafafa] border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors appearance-none cursor-pointer">\n                            <option value="">Select Dept</option>',
    content, count=1
)

# Year select
content = re.sub(
    r'<select required className="w-full bg-\[\#fafafa\].*?>\s*<option value="">Select Year</option>',
    r'<select required value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} className="w-full bg-[#fafafa] border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors appearance-none cursor-pointer">\n                            <option value="">Select Year</option>',
    content, count=1
)

# Textarea target for SOP
content = content.replace(
    'placeholder="Briefly explain your objective in joining..."',
    'placeholder="Briefly explain your objective in joining..." value={sop} onChange={(e) => setSop(e.target.value)}'
)

# Change Submit button to handle loading state
content = content.replace(
    '<button type="submit" disabled={!termsAccepted}',
    '<button type="submit" disabled={!termsAccepted || isSubmitting}'
)
content = content.replace(
    'Complete Application <ShieldCheck size={16} className={termsAccepted ? "text-cyan-200" : "text-slate-300"} />',
    '{isSubmitting ? "Submitting..." : "Complete Application"} <ShieldCheck size={16} className={termsAccepted ? "text-cyan-200" : "text-slate-300"} />'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated JoinPage.tsx successfully!")
