# Portfolio Data Seeding

This document explains how to automatically populate your Strapi CMS with portfolio data.

## 🚀 Quick Start

### Option 1: Fresh Start (Recommended)
```bash
# Clear database and start fresh
node scripts/reset-and-seed.js

# Start Strapi (will automatically seed data)
npm run develop
```

### Option 2: Manual Seed
```bash
# Start Strapi first
npm run develop

# In another terminal, run the seed script
npm run seed:portfolio
```

## 📊 What Gets Seeded

The automated script will create:

### **CV Entries (4 items)**
- ✅ Master of Science (Education)
- ✅ Bachelor of Science (Education)  
- ✅ UX Engineer @ Ergosign (Experience)
- ✅ Master Thesis @ Ergosign (Experience)

### **Skills (8 items)**
- ✅ Flutter, React, NextJS, Qt Framework
- ✅ Figma, Microsoft .NET, PostgreSQL, LangChain

### **Portfolio Items (3 items)**
- ✅ Day 91 (Artwork)
- ✅ Day 88 (Artwork)
- ✅ Nothing was the same (Music)

### **Sections (4 items)**
- ✅ Skills, Portfolio, Music, Contact

### **Social Links (7 items)**
- ✅ LinkedIn, Behance, GitHub, Twitter
- ✅ Instagram (Personal), Instagram (3D), Spotify

### **Page Content (1 single type)**
- ✅ Personal information and site settings

### **Site Settings (1 single type)**
- ✅ Global site configuration

## 🖼️ Image Requirements

The script expects these images in `/public/assets/`:

### **Portfolio Images**
- `Day91.png` - Day 91 artwork
- `Day88.png` - Day 88 artwork  
- `drake.jpg` - Drake album cover

### **Profile Images**
- `nicolas-klein_2024_tiny.png` - Profile photo
- `memoji.png` - Light mode memoji
- `memoji_dark.png` - Dark mode memoji

## 🔧 Script Features

### **Automatic Permissions**
- Sets up public API access for all content types
- Configures read permissions for frontend integration

### **Image Handling**
- Automatically uploads images to Strapi Media Library
- Handles missing images gracefully with warnings
- Links images to portfolio items and profile content

### **Data Validation**
- All required fields are populated
- Content is automatically published
- Proper ordering for all list items

### **Error Handling**
- Continues processing even if individual items fail
- Provides detailed logging for each step
- Shows success/failure status for each content type

## 🛠️ Troubleshooting

### **Images Not Found**
If you see warnings about missing images:
1. Add the required images to `/public/assets/`
2. Restart Strapi to re-run the seed script
3. Or manually upload images through the admin panel

### **Database Already Seeded**
If you see "Portfolio data has already been imported":
1. Clear the database: `node scripts/reset-and-seed.js`
2. Restart Strapi: `npm run develop`

### **Permission Errors**
If content isn't accessible via API:
1. Go to Settings → Users & Permissions → Roles → Public
2. Enable `find` and `findOne` for all content types
3. Save the permissions

## 📝 Manual Override

If you prefer to enter data manually:
1. Access the admin panel at `http://localhost:1337/admin`
2. Navigate to Content Manager
3. Use the data from `STRAPI_DATA_MIGRATION.md` as reference
4. Create entries for each content type manually

## ✅ Verification

After seeding, verify everything worked:

1. **Check Content Manager** - All content types should have entries
2. **Test API Endpoints** - Visit `http://localhost:1337/api/cv-entries` etc.
3. **Verify Images** - Check that portfolio items have images attached
4. **Check Permissions** - Ensure public role has read access

## 🎯 Next Steps

Once data is seeded:
1. **Create API Token** - Generate read-only token for frontend
2. **Configure Environment** - Set up `.env.local` with Strapi URL
3. **Test Frontend Integration** - Connect your Next.js app
4. **Customize Content** - Edit entries through the admin panel

Your portfolio Strapi CMS is now ready for development! 🚀
