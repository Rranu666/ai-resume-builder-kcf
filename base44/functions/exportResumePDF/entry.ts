import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Template-specific HTML generators
function buildResumeHTML(resume, theme, fontStack) {
  const pi = resume.personal_info || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  const escHtml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const accentColor = theme.accent || "#1e40af";
  const bgColor = theme.bg || "#ffffff";
  const templateStyle = resume.template || "modern";

  // Pick layout based on template
  const isTwoColumn = ["modern", "tech", "creative", "startup", "designer"].includes(templateStyle);
  const isMinimal = ["minimal", "compact"].includes(templateStyle);
  const isExecutive = ["executive", "finance", "academic"].includes(templateStyle);

  const contactLine = [pi.email, pi.phone, pi.location, pi.linkedin, pi.website]
    .filter(Boolean).map(escHtml).join(" &nbsp;|&nbsp; ");

  const skillsHTML = skills.length
    ? skills.map(s => `<span style="display:inline-block;margin:2px 4px 2px 0;padding:3px 10px;background:${accentColor}22;border:1px solid ${accentColor}55;border-radius:20px;font-size:11px;color:${accentColor};font-weight:600;">${escHtml(s)}</span>`).join("")
    : "";

  const expHTML = experience.map(exp => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:4px;">
        <div>
          <div style="font-weight:700;font-size:13px;color:#1a1a1a;">${escHtml(exp.title)}</div>
          <div style="font-size:12px;color:${accentColor};font-weight:600;">${escHtml(exp.company)}${exp.location ? ` &mdash; ${escHtml(exp.location)}` : ""}</div>
        </div>
        <div style="font-size:11px;color:#666;white-space:nowrap;">
          ${escHtml(exp.start_date || "")}${exp.current ? " &mdash; Present" : (exp.end_date ? ` &mdash; ${escHtml(exp.end_date)}` : "")}
        </div>
      </div>
      ${(exp.bullets || []).length ? `<ul style="margin:6px 0 0 16px;padding:0;">${(exp.bullets || []).map(b => `<li style="font-size:12px;color:#333;margin-bottom:3px;line-height:1.5;">${escHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
  `).join("");

  const eduHTML = education.map(edu => `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;">
        <div>
          <div style="font-weight:700;font-size:13px;color:#1a1a1a;">${escHtml(edu.degree)}</div>
          <div style="font-size:12px;color:${accentColor};font-weight:600;">${escHtml(edu.institution)}${edu.location ? ` &mdash; ${escHtml(edu.location)}` : ""}</div>
          ${edu.gpa ? `<div style="font-size:11px;color:#666;">GPA: ${escHtml(edu.gpa)}</div>` : ""}
        </div>
        <div style="font-size:11px;color:#666;">${escHtml(edu.graduation_year || "")}</div>
      </div>
    </div>
  `).join("");

  const projHTML = projects.map(proj => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
        <div style="font-weight:700;font-size:13px;color:#1a1a1a;">${escHtml(proj.name)}</div>
        ${proj.link ? `<a href="${escHtml(proj.link)}" style="font-size:11px;color:${accentColor};">${escHtml(proj.link)}</a>` : ""}
      </div>
      ${proj.description ? `<div style="font-size:12px;color:#333;margin-top:3px;line-height:1.5;">${escHtml(proj.description)}</div>` : ""}
      ${(proj.technologies || []).length ? `<div style="margin-top:4px;">${(proj.technologies || []).map(t => `<span style="display:inline-block;margin:2px 3px 2px 0;padding:1px 7px;background:#f1f5f9;border-radius:10px;font-size:10px;color:#475569;">${escHtml(t)}</span>`).join("")}</div>` : ""}
    </div>
  `).join("");

  const sectionTitle = (title) => {
    if (isMinimal) {
      return `<div style="margin:18px 0 8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">
        <span style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;text-transform:uppercase;">${title}</span>
      </div>`;
    }
    if (isExecutive) {
      return `<div style="margin:20px 0 10px;padding-bottom:5px;border-bottom:3px solid ${accentColor};">
        <span style="font-size:13px;font-weight:800;letter-spacing:0.05em;color:${accentColor};text-transform:uppercase;">${title}</span>
      </div>`;
    }
    // modern / default
    return `<div style="margin:18px 0 10px;display:flex;align-items:center;gap:8px;">
      <span style="font-size:12px;font-weight:700;letter-spacing:0.08em;color:${accentColor};text-transform:uppercase;">${title}</span>
      <div style="flex:1;height:2px;background:linear-gradient(to right, ${accentColor}55, transparent);border-radius:2px;"></div>
    </div>`;
  };

  // Two-column layout for modern/tech
  if (isTwoColumn) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escHtml(pi.full_name || resume.title || "Resume")}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 210mm; min-height: 297mm; background: #fff; }
  body { font-family: ${fontStack}; font-size: 12px; color: #333; background: ${bgColor}; }
  @page { size: A4; margin: 0; }
  @media print {
    html, body { width: 210mm; height: 297mm; }
    .page { page-break-after: avoid; }
  }
  a { color: ${accentColor}; text-decoration: none; }
</style>
</head>
<body>
<div class="page" style="display:flex;min-height:297mm;">
  <!-- Sidebar -->
  <div style="width:220px;min-height:100%;background:${accentColor};padding:32px 20px;flex-shrink:0;">
    ${pi.profile_photo ? `<div style="width:90px;height:90px;border-radius:50%;overflow:hidden;margin:0 auto 16px;border:3px solid rgba(255,255,255,0.4);">
      <img src="${escHtml(pi.profile_photo)}" style="width:100%;height:100%;object-fit:cover;" />
    </div>` : `<div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
      <span style="font-size:28px;font-weight:800;color:white;">${escHtml((pi.full_name || "?").charAt(0).toUpperCase())}</span>
    </div>`}
    <h1 style="font-size:16px;font-weight:800;color:white;text-align:center;margin-bottom:4px;line-height:1.3;">${escHtml(pi.full_name || "")}</h1>

    <!-- Contact -->
    <div style="margin:20px 0;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:8px;">Contact</div>
      ${pi.email ? `<div style="font-size:10px;color:rgba(255,255,255,0.9);margin-bottom:5px;word-break:break-all;">✉ ${escHtml(pi.email)}</div>` : ""}
      ${pi.phone ? `<div style="font-size:10px;color:rgba(255,255,255,0.9);margin-bottom:5px;">✆ ${escHtml(pi.phone)}</div>` : ""}
      ${pi.location ? `<div style="font-size:10px;color:rgba(255,255,255,0.9);margin-bottom:5px;">⌖ ${escHtml(pi.location)}</div>` : ""}
      ${pi.linkedin ? `<div style="font-size:10px;color:rgba(255,255,255,0.9);margin-bottom:5px;word-break:break-all;">${escHtml(pi.linkedin)}</div>` : ""}
      ${pi.website ? `<div style="font-size:10px;color:rgba(255,255,255,0.9);word-break:break-all;">${escHtml(pi.website)}</div>` : ""}
    </div>

    <!-- Skills -->
    ${skills.length ? `<div>
      <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:8px;">Skills</div>
      ${skills.map(s => `<div style="margin-bottom:4px;padding:4px 8px;background:rgba(255,255,255,0.15);border-radius:4px;font-size:10px;color:white;">${escHtml(s)}</div>`).join("")}
    </div>` : ""}
  </div>

  <!-- Main Content -->
  <div style="flex:1;padding:32px 28px;background:${bgColor};">
    ${pi.summary ? `<div style="margin-bottom:4px;">
      <div style="font-size:12px;color:#444;line-height:1.6;">${escHtml(pi.summary)}</div>
    </div>` : ""}

    ${experience.length ? `${sectionTitle("Experience")}${expHTML}` : ""}
    ${education.length ? `${sectionTitle("Education")}${eduHTML}` : ""}
    ${projects.length ? `${sectionTitle("Projects")}${projHTML}` : ""}
  </div>
</div>
</body>
</html>`;
  }

  // Single-column (executive, minimal, classic)
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escHtml(pi.full_name || resume.title || "Resume")}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 210mm; min-height: 297mm; background: #fff; }
  body { font-family: ${fontStack}; font-size: 12px; color: #333; background: ${bgColor}; }
  @page { size: A4; margin: 0; }
  @media print {
    html, body { width: 210mm; height: 297mm; }
  }
  a { color: ${accentColor}; text-decoration: none; }
</style>
</head>
<body style="padding:36px 44px;background:${bgColor};">
  <!-- Header -->
  <div style="text-align:${isExecutive ? "left" : "center"};padding-bottom:${isExecutive ? "16px" : "20px"};border-bottom:${isExecutive ? `4px solid ${accentColor}` : `1px solid #e2e8f0`};margin-bottom:6px;">
    ${pi.profile_photo && isExecutive ? `<img src="${escHtml(pi.profile_photo)}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;margin-bottom:8px;float:left;margin-right:16px;" />` : ""}
    <div>
      <h1 style="font-size:${isExecutive ? "26px" : "24px"};font-weight:800;color:${isExecutive ? accentColor : "#1a1a1a"};letter-spacing:-0.02em;margin-bottom:4px;">${escHtml(pi.full_name || "")}</h1>
      <div style="font-size:11px;color:#555;margin-bottom:4px;">${contactLine}</div>
    </div>
    ${pi.profile_photo && isExecutive ? `<div style="clear:both;"></div>` : ""}
  </div>

  ${pi.summary ? `${sectionTitle("Summary")}
  <p style="font-size:12px;color:#444;line-height:1.65;margin-bottom:4px;">${escHtml(pi.summary)}</p>` : ""}

  ${experience.length ? `${sectionTitle("Experience")}${expHTML}` : ""}
  ${education.length ? `${sectionTitle("Education")}${eduHTML}` : ""}
  ${skills.length ? `${sectionTitle("Skills")}<div style="margin-bottom:8px;">${skillsHTML}</div>` : ""}
  ${projects.length ? `${sectionTitle("Projects")}${projHTML}` : ""}
</body>
</html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeId, theme, fontStack } = await req.json();

    if (!resumeId) return Response.json({ error: 'resumeId is required' }, { status: 400 });

    // Fetch resume (user-scoped — RLS ensures ownership)
    const resumes = await base44.entities.Resume.list();
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) return Response.json({ error: 'Resume not found' }, { status: 404 });

    const selectedTheme = theme || { accent: "#1e40af", bg: "#ffffff" };
    const selectedFont = fontStack || "'Inter', system-ui, sans-serif";

    const html = buildResumeHTML(resume, selectedTheme, selectedFont);

    return Response.json({ html });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});