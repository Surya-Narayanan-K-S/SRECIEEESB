# Official IEEE Member PDF Cards Directory

Place official IEEE membership PDF cards in this directory named by **IEEE Member ID** (or **Student Roll Number**):

### Example File Naming:
- `102298938.pdf` (for member with IEEE ID `102298938` or `#102298938`)
- `98421045.pdf` (for member with IEEE ID `98421045`)
- `71812503132.pdf` (for member with Roll Number `71812503132`)

### How It Works:
1. When any student member clicks **"View Original IEEE Card (PDF)"** on their Student Dashboard, the system automatically looks for `/cards/{ieee_id}.pdf`.
2. If found, it instantly opens in the embedded PDF reader modal with options to view full screen, open in new tab, download, and print.
3. You can also upload PDF cards directly through the **Admin Dashboard > Student Roster > Edit Member > Upload PDF** or via Supabase Storage bucket `ieee-cards`.
