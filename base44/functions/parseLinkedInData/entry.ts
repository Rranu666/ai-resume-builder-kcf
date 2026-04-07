import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { linkedinData } = await req.json();
    if (!linkedinData) return Response.json({ error: 'LinkedIn data is required' }, { status: 400 });

    // Parse LinkedIn data - supports both JSON and text formats
    let profile = {};
    try {
      profile = typeof linkedinData === 'string' ? JSON.parse(linkedinData) : linkedinData;
    } catch {
      // Try to extract from LinkedIn profile URL or plain text
      profile = extractFromText(linkedinData);
    }

    // Map LinkedIn fields to resume schema
    const mappedData = {
      personal_info: {
        full_name: profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.full_name || profile.name || '',
        email: profile.email || profile.emailAddress || '',
        phone: profile.phone || profile.phoneNumber || '',
        location: profile.location?.name || profile.location || profile.city || '',
        linkedin: profile.linkedinUrl || profile.linkedin || '',
        website: profile.website || profile.websiteUrl || '',
        summary: profile.headline || profile.summary || profile.about || '',
      },
      experience: parseExperience(profile),
      education: parseEducation(profile),
      skills: parseSkills(profile),
    };

    return Response.json({ 
      success: true, 
      data: mappedData,
      message: `Imported ${mappedData.experience.length} job(s), ${mappedData.education.length} education(s), and ${mappedData.skills.length} skill(s)`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function extractFromText(text) {
  // Simple text parsing for LinkedIn URLs or manual entries
  const profile = {};
  const lines = text.split('\n');
  
  // Extract name (usually first non-empty line)
  const nameLine = lines.find(l => l.trim().length > 0);
  if (nameLine) {
    const parts = nameLine.trim().split(' ');
    profile.firstName = parts[0];
    profile.lastName = parts.slice(1).join(' ');
  }
  
  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) profile.email = emailMatch[0];
  
  // Extract phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{4}/);
  if (phoneMatch) profile.phone = phoneMatch[0];
  
  // Extract location (look for city, state patterns)
  const locationMatch = text.match(/(?:Location|City|Based in)[\s:]+([^,\n]+)/i);
  if (locationMatch) profile.location = { name: locationMatch[1].trim() };
  
  return profile;
}

function parseExperience(profile) {
  const experience = [];
  
  if (profile.experience && Array.isArray(profile.experience)) {
    profile.experience.forEach(exp => {
      experience.push({
        title: exp.title || exp.position || '',
        company: exp.company?.name || exp.companyName || exp.company || '',
        location: exp.location?.name || exp.location || '',
        start_date: formatDate(exp.startDate || exp.startMonth, exp.startYear),
        end_date: exp.endDate || exp.endMonth ? formatDate(exp.endDate || exp.endMonth, exp.endYear) : '',
        current: exp.endDate === null || !exp.endDate,
        bullets: exp.description ? [exp.description] : [],
      });
    });
  }
  
  return experience;
}

function parseEducation(profile) {
  const education = [];
  
  if (profile.education && Array.isArray(profile.education)) {
    profile.education.forEach(edu => {
      education.push({
        degree: edu.degree || edu.fieldOfStudy || '',
        institution: edu.schoolName || edu.school || '',
        location: edu.schoolName || '',
        graduation_year: edu.endDate?.year?.toString() || edu.graduationYear || '',
        gpa: edu.gpa || '',
      });
    });
  }
  
  return education;
}

function parseSkills(profile) {
  if (!profile.skills) return [];
  
  if (Array.isArray(profile.skills)) {
    return profile.skills.map(s => typeof s === 'string' ? s : s.name || s.skill || '').filter(Boolean);
  }
  
  return [];
}

function formatDate(month, year) {
  if (!month && !year) return '';
  if (!month) return year;
  const monthNum = typeof month === 'string' ? new Date(`${month} 1`).getMonth() + 1 : month;
  return `${monthNum}/${year}`;
}