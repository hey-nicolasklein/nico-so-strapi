'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

async function seedPortfolioData() {
  const shouldImportSeedData = await isFirstRun();

  if (shouldImportSeedData) {
    try {
      console.log('Setting up portfolio data...');
      await importPortfolioData();
      console.log('Portfolio data imported successfully!');
    } catch (error) {
      console.log('Could not import portfolio data');
      console.error(error);
    }
  } else {
    console.log(
      'Portfolio data has already been imported. We cannot reimport unless you clear your database first.'
    );
  }
}

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });
  const initHasRun = await pluginStore.get({ key: 'portfolioDataImported' });
  await pluginStore.set({ key: 'portfolioDataImported', value: true });
  return !initHasRun;
}

async function setPublicPermissions() {
  // Find the ID of the public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  // Set permissions for all portfolio content types
  const permissions = [
    'cv-entry', 'skill', 'portfolio-item', 'section', 'social-link', 'page-content', 'site-setting'
  ];

  const allPermissionsToCreate = [];
  permissions.forEach((controller) => {
    const permissionsToCreate = ['find', 'findOne'].map((action) => {
      return strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  
  await Promise.all(allPermissionsToCreate);
  console.log('Public permissions set for all content types');
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  return stats['size'];
}

function getFileData(fileName) {
  const filePath = path.join('public', 'assets', fileName);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  const size = getFileSizeInBytes(filePath);
  const ext = fileName.split('.').pop();
  const mimeType = mime.lookup(ext || '') || '';

  return {
    filepath: filePath,
    originalFileName: fileName,
    size,
    mimetype: mimeType,
  };
}

async function uploadFile(file, name) {
  return strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: file,
      data: {
        fileInfo: {
          alternativeText: `Portfolio image: ${name}`,
          caption: name,
          name,
        },
      },
    });
}

async function checkFileExistsBeforeUpload(files) {
  const existingFiles = [];
  const uploadedFiles = [];
  const filesCopy = [...files];

  for (const fileName of filesCopy) {
    if (!fileName) continue;
    
    // Check if the file already exists in Strapi
    const fileWhereName = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: fileName.replace(/\..*$/, ''),
      },
    });

    if (fileWhereName) {
      existingFiles.push(fileWhereName);
    } else {
      const fileData = getFileData(fileName);
      if (fileData) {
        const fileNameNoExtension = fileName.split('.').shift();
        const [file] = await uploadFile(fileData, fileNameNoExtension);
        uploadedFiles.push(file);
      }
    }
  }
  
  const allFiles = [...existingFiles, ...uploadedFiles];
  return allFiles.length === 1 ? allFiles[0] : allFiles;
}

async function createEntry({ model, entry }) {
  try {
    await strapi.documents(`api::${model}.${model}`).create({
      data: entry,
    });
    console.log(`✅ Created ${model}: ${entry.title || entry.siteName || entry.platform || 'entry'}`);
  } catch (error) {
    console.error(`❌ Error creating ${model}:`, error.message);
  }
}

async function importSiteSettings() {
  console.log('📝 Creating Site Settings...');
  await createEntry({
    model: 'site-setting',
    entry: {
      footerText: 'created with',
      footerCopyright: '© {year} Nicolas Klein',
      contactHeading: 'Say hello 👋🏼',
      contactCta: "Let's change the world together.",
      emailSubject: 'Hey',
      emailBody: 'Let us talk :)',
      publishedAt: Date.now(),
    },
  });
}

async function importPageContent() {
  console.log('📝 Creating Page Content...');
  
  // Upload profile images
  const profileImage = await checkFileExistsBeforeUpload(['nicolas-klein_2024_tiny.png']);
  const memojiLight = await checkFileExistsBeforeUpload(['memoji.png']);
  const memojiDark = await checkFileExistsBeforeUpload(['memoji_dark.png']);

  await createEntry({
    model: 'page-content',
    entry: {
      siteName: 'Nicolas',
      siteTitle: 'Nicolas Klein - Frontend Developer',
      taglineDesktop: 'Frontend developer by 🖤',
      taglineMobile: 'Developer by 🖤',
      metaDescription: '👋 Hey I\'m Nicolas a UX-Engineer from south-west Germany.',
      heroGreeting: 'Hey I\'m',
      aboutHeading: 'About me',
      aboutText: 'I am Nicolas, a {age} years old Software Engineer from Germany. Currently I am building AI solutions at Ergosign GmbH.',
      aboutInterests: 'Beyond programming, I have a passion for photography and digital art.',
      cabinetDescription: 'My personal cabinet of curiosities with both digital and physical items in it.',
      email: 'hey@nico.so',
      birthday: '1998-05-10',
      profileImage,
      memojiLight,
      memojiDark,
      publishedAt: Date.now(),
    },
  });
}

async function importSkills() {
  console.log('📝 Creating Skills...');
  
  const skills = [
    { title: 'Flutter', iconName: 'SiFlutter', category: 'frontend', order: 1 },
    { title: 'React', iconName: 'SiReact', category: 'frontend', order: 2 },
    { title: 'NextJS', iconName: 'SiNextdotjs', category: 'frontend', order: 3 },
    { title: 'Framework', iconName: 'SiQt', category: 'framework', order: 4 },
    { title: 'Figma', iconName: 'SiFigma', category: 'design', order: 5 },
    { title: 'Microsoft', iconName: 'SiDotnet', category: 'backend', order: 6 },
    { title: 'Postgress', iconName: 'SiPostgresql', category: 'backend', order: 7 },
    { title: 'LangChain', iconName: 'SiLangchain', category: 'tools', order: 8 },
  ];

  for (const skill of skills) {
    await createEntry({
      model: 'skill',
      entry: {
        ...skill,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importCvEntries() {
  console.log('📝 Creating CV Entries...');
  
  const cvEntries = [
    {
      title: 'Master of Science',
      category: 'education',
      timeFrom: '2020',
      timeTo: '2022',
      description: 'Consolidation of the knowledge gained in the Bachelor\'s degree. Topics such as machine learning, software development processes and data warehouses are covered.',
      link: 'https://www.htwsaar.de/studium-und-lehre/studienangebot/studiengaenge/praktische-informatik_master',
      order: 1,
    },
    {
      title: 'Bachelor of Science',
      category: 'education',
      timeFrom: '2019',
      timeTo: '2020',
      description: 'Practically oriented study of computer science with a strong focus on application development. During my studies I gained an understanding of software architectures, web development and machine learning.',
      link: 'https://www.htwsaar.de/studium-und-lehre/studienangebot/studiengaenge/praktische-informatik_bachelor',
      order: 2,
    },
    {
      title: 'UX Engineer @ Ergosign',
      category: 'experience',
      timeFrom: '2021',
      timeTo: 'now',
      description: 'As a UX Engineer I work side by side with UX Designers creating tailormade solutions. Lately AI has been a big part of my work, particulary retrieval-augmented generation pipelines (RAG). Technologies utilized include Langchain, Nuxt, Gitlab-CI, Figma and OpenAI.',
      link: 'https://www.ergosign.de/de/',
      order: 1,
    },
    {
      title: 'Master Thesis @ Ergosign',
      category: 'experience',
      timeFrom: '2020',
      timeTo: '2021',
      description: 'Master Thesis in industry with focus on Flutter front-end development, real-time synchronization and user experience research. Technologies utilized included Flutter, Bloc, Bloc-Hydrated, Appwrite and Gitlab-CI.',
      link: 'https://www.ergosign.de/de/',
      order: 2,
    },
  ];

  for (const entry of cvEntries) {
    await createEntry({
      model: 'cv-entry',
      entry: {
        ...entry,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importPortfolioItems() {
  console.log('📝 Creating Portfolio Items...');
  
  // Upload portfolio images
  const day91Image = await checkFileExistsBeforeUpload(['Day91.png']);
  const day88Image = await checkFileExistsBeforeUpload(['Day88.png']);
  const drakeImage = await checkFileExistsBeforeUpload(['drake.jpg']);

  const portfolioItems = [
    {
      title: 'Day 91',
      subtitle: 'Made during my 100days of art challenge.',
      image: day91Image,
      externalLink: 'https://www.instagram.com/p/CPyES_kBhVQ/',
      createdWith: 'Blender3D',
      type: 'Artwork',
      order: 1,
    },
    {
      title: 'Day 88',
      subtitle: 'Made during my 100days of art challenge.',
      image: day88Image,
      externalLink: 'https://www.instagram.com/p/CPK9v2VhphV/',
      createdWith: 'Blender3D',
      type: 'Artwork',
      order: 2,
    },
    {
      title: 'Nothing was the same',
      subtitle: 'One of my favorite records of all time. Drake at his peak.',
      image: drakeImage,
      externalLink: 'https://www.instagram.com/p/CR_G-qwsMhL/',
      createdWith: 'Music',
      type: 'Music',
      order: 3,
    },
  ];

  for (const item of portfolioItems) {
    await createEntry({
      model: 'portfolio-item',
      entry: {
        ...item,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importSections() {
  console.log('📝 Creating Sections...');
  
  const sections = [
    {
      identifier: 'skills',
      heading: 'Skills',
      description: '',
      visible: true,
      order: 1,
    },
    {
      identifier: 'portfolio',
      heading: 'Things I love',
      description: 'My personal cabinet of curiosities with both digital and physical items in it.',
      visible: true,
      order: 2,
    },
    {
      identifier: 'music',
      heading: 'Music I love',
      description: 'My most listened to songs in the last week on Spotify.',
      visible: true,
      order: 3,
    },
    {
      identifier: 'contact',
      heading: 'Say hello 👋🏼',
      description: "Let's change the world together.",
      visible: true,
      order: 4,
    },
  ];

  for (const section of sections) {
    await createEntry({
      model: 'section',
      entry: {
        ...section,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importSocialLinks() {
  console.log('📝 Creating Social Links...');
  
  const socialLinks = [
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/heynicolas/',
      iconName: 'BsLinkedin',
      order: 1,
      visible: true,
    },
    {
      platform: 'Behance',
      url: 'https://www.behance.net/hey_nicolasklein',
      iconName: 'BsBehance',
      order: 2,
      visible: true,
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/hey-nicolasklein',
      iconName: 'BsGithub',
      order: 3,
      visible: true,
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/heynicolasklein',
      iconName: 'BsTwitter',
      order: 4,
      visible: true,
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/hey.nicolasklein/',
      iconName: 'BsInstagram',
      order: 5,
      visible: true,
    },
    {
      platform: 'Instagram 3D',
      url: 'https://www.instagram.com/3d.nicolasklein/',
      iconName: 'BsInstagram',
      order: 6,
      visible: true,
    },
    {
      platform: 'Spotify',
      url: 'https://open.spotify.com/user/funforstarax',
      iconName: 'BsSpotify',
      order: 7,
      visible: true,
    },
  ];

  for (const link of socialLinks) {
    await createEntry({
      model: 'social-link',
      entry: {
        ...link,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importPortfolioData() {
  // Set up public permissions first
  await setPublicPermissions();
  
  // Import in the correct order
  await importSiteSettings();
  await importPageContent();
  await importSkills();
  await importCvEntries();
  await importPortfolioItems();
  await importSections();
  await importSocialLinks();
}

module.exports = async () => {
  await seedPortfolioData();
};
