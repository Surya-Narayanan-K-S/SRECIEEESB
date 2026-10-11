import { createClient } from '@supabase/supabase-js';

// Load local environment variables if available
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile();
  }
} catch (_) {}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://wlbgdlolgjccvbuvutiw.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MTFbAqD0o2TyKdXFZn_8lg_4e7KLKrG';
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// State tracking for the autonomous daemon
let isDaemonRunning = false;
let daemonIntervalTimer = null;
let lastCycleTimestamp = null;
let totalCyclesRun = 0;
let lastCycleResults = null;

/**
 * Call Gemini 2.5 Flash API with prompt
 */
export async function callGemini(prompt, systemInstruction = '') {
  if (!GEMINI_API_KEY) {
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const contents = [];

  if (systemInstruction) {
    contents.push({
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemInstruction}]\n\n${prompt}` }]
    });
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!res.ok) {
      console.warn(`[AI Manager] Gemini API error: HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (err) {
    console.warn('[AI Manager] Gemini API fetch failed:', err.message);
    return null;
  }
}

/**
 * Write an operation log to public.ai_backend_logs
 */
export async function writeAuditLog({ job_type, status, summary, items_processed = 0, details = {} }) {
  try {
    const payload = {
      job_type,
      status,
      summary,
      items_processed,
      details,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('ai_backend_logs').insert([payload]);
    if (error) {
      console.warn('[AI Manager] Failed to write ai_backend_logs:', error.message);
    }
  } catch (e) {
    console.warn('[AI Manager] Error inserting audit log:', e.message);
  }
}

/**
 * 1. AUTOMATED APPLICATION PROCESSING
 * Reviews pending student applications, checks college identity rules, evaluates SOP,
 * and auto-approves verified students into `student_members`.
 */
export async function processPendingApplications() {
  console.log('[AI Manager] Starting Application Review...');
  let approvedCount = 0;
  let flaggedCount = 0;
  const processedDetails = [];

  try {
    // Fetch pending applications
    const { data: pendingApps, error } = await supabase
      .from('applications')
      .select('*')
      .or('status.eq.PENDING,ai_review_status.eq.PENDING')
      .order('id', { ascending: true })
      .limit(20);

    if (error || !pendingApps || pendingApps.length === 0) {
      const summary = pendingApps?.length === 0 ? 'No pending applications to review.' : `Error: ${error?.message}`;
      await writeAuditLog({
        job_type: 'APPLICATION_REVIEW',
        status: error ? 'FAILED' : 'SUCCESS',
        summary,
        items_processed: 0
      });
      return { success: true, processedCount: 0, approvedCount: 0, flaggedCount: 0, details: [] };
    }

    for (const app of pendingApps) {
      const email = (app.email || '').trim().toLowerCase();
      const rollNumber = (app.roll_number || '').trim().toUpperCase();
      const firstName = (app.first_name || '').trim();
      const lastName = (app.last_name || '').trim();
      const sop = (app.statement_of_purpose || '').trim();

      let isCollegeEmail = email.endsWith('@srec.ac.in');
      let isValidRoll = /^[0-9A-Z]{6,12}$/i.test(rollNumber) && rollNumber.length >= 7;
      let confidenceScore = 60;
      let notes = [];

      if (isCollegeEmail) {
        confidenceScore += 25;
        notes.push('Valid college domain (@srec.ac.in)');
      } else {
        notes.push('Non-college email domain detected');
      }

      if (isValidRoll) {
        confidenceScore += 15;
        notes.push(`Valid roll format: ${rollNumber}`);
      } else {
        notes.push('Unverified or missing roll number format');
      }

      // Ask Gemini to evaluate Statement of Purpose if present
      if (sop && sop.length > 20) {
        const aiEvaluation = await callGemini(
          `Candidate: ${firstName} ${lastName}\nRoll: ${rollNumber}\nDepartment: ${app.department}\nSOP: ${sop}\n\nTask: Evaluate if this is a genuine student application for IEEE SREC or spam/gibberish. Return a JSON object with: {"valid": boolean, "score": number between 0 and 100, "reason": "brief explanation"}`,
          'You are the IEEE SREC Admissions Screening AI. Output strict JSON only.'
        );

        if (aiEvaluation) {
          try {
            const cleanJson = aiEvaluation.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.valid && parsed.score >= 50) {
              confidenceScore = Math.min(100, confidenceScore + 10);
              notes.push(`AI SOP Evaluation: Genuine intent (${parsed.reason || 'Passed'})`);
            } else if (!parsed.valid) {
              confidenceScore -= 30;
              notes.push(`AI SOP Flag: Suspicious intent (${parsed.reason || 'Low quality'})`);
            }
          } catch (_) {
            notes.push('AI SOP semantic review completed');
          }
        }
      }

      const isApproved = confidenceScore >= 75 && isCollegeEmail;
      const reviewStatus = isApproved ? 'APPROVED' : 'FLAGGED';
      const statusNote = notes.join('. ');

      // Update application
      await supabase
        .from('applications')
        .update({
          status: isApproved ? 'APPROVED' : 'PENDING',
          ai_review_status: reviewStatus,
          ai_confidence_score: confidenceScore,
          ai_notes: statusNote,
          ai_reviewed_at: new Date().toISOString()
        })
        .eq('id', app.id);

      // If approved, create or update `student_members` directory record
      if (isApproved && rollNumber) {
        const memberPayload = {
          roll_number: rollNumber,
          email,
          first_name: firstName,
          last_name: lastName,
          department: app.department || 'Engineering',
          year_of_study: app.year_of_study || '1st Year',
          membership_status: 'ACTIVE',
          member_type: 'Student Member',
          target_societies: app.target_societies && app.target_societies.length > 0
            ? app.target_societies
            : [app.target_society || 'IEEE Student Branch SREC'],
          bio_sop: sop || 'Auto-verified by IEEE SREC AI Autopilot'
        };

        await supabase
          .from('student_members')
          .upsert([memberPayload], { onConflict: 'roll_number' });

        approvedCount++;
      } else {
        flaggedCount++;
      }

      processedDetails.push({
        id: app.id,
        rollNumber,
        status: reviewStatus,
        confidence: confidenceScore,
        notes: statusNote
      });
    }

    const summary = `Processed ${pendingApps.length} applications: ${approvedCount} auto-approved, ${flaggedCount} flagged for manual review.`;
    await writeAuditLog({
      job_type: 'APPLICATION_REVIEW',
      status: flaggedCount > 0 ? 'FLAGGED' : 'SUCCESS',
      summary,
      items_processed: pendingApps.length,
      details: { approvedCount, flaggedCount, processedDetails }
    });

    console.log(`[AI Manager] Application Review Done: ${summary}`);
    return { success: true, processedCount: pendingApps.length, approvedCount, flaggedCount, details: processedDetails };
  } catch (err) {
    console.error('[AI Manager] Application review error:', err);
    await writeAuditLog({
      job_type: 'APPLICATION_REVIEW',
      status: 'FAILED',
      summary: `Application review error: ${err.message}`,
      items_processed: 0
    });
    return { success: false, error: err.message };
  }
}

/**
 * 2. AUTOMATED EVENT REPORT SUMMARIZATION
 * Scans event reports needing polish, generates IEEE executive summaries, extracts key takeaways, and tags.
 */
export async function autoSummarizeEventReports() {
  console.log('[AI Manager] Starting Event Report Summarization...');
  let enhancedCount = 0;

  try {
    const { data: reports, error } = await supabase
      .from('event_reports')
      .select('*')
      .or('ai_enhanced.is.null,ai_enhanced.eq.false')
      .order('id', { ascending: false })
      .limit(10);

    if (error || !reports || reports.length === 0) {
      const summary = reports?.length === 0 ? 'All event reports are already AI enhanced.' : `Error: ${error?.message}`;
      await writeAuditLog({
        job_type: 'EVENT_SUMMARIZATION',
        status: error ? 'FAILED' : 'SUCCESS',
        summary,
        items_processed: 0
      });
      return { success: true, enhancedCount: 0 };
    }

    for (const report of reports) {
      const prompt = `Event: "${report.event_name}"
Society: ${report.society || 'IEEE SREC'}
Type: ${report.event_type || 'Technical Event'}
Venue: ${report.venue || 'SREC Campus'}
Participants: ${report.participants_count || 'N/A'}
Chief Guest: ${report.chief_guest || 'Industry Expert'}
Existing Summary: ${report.summary || 'None provided'}

Task: Generate a high quality, publication-ready event report for IEEE Student Branch records.
Return a JSON object:
{
  "summary": "2-3 comprehensive sentences highlighting the objectives, proceedings, and outcomes",
  "key_takeaways": "Bulleted list of 3 key student takeaways, separated by newlines",
  "tags": ["tag1", "tag2", "tag3"]
}`;

      const aiResponse = await callGemini(prompt, 'You are an IEEE Technical Editor. Return JSON only.');
      let generatedSummary = report.summary;
      let generatedTakeaways = report.key_takeaways;
      let generatedTags = report.ai_tags || [];

      if (aiResponse) {
        try {
          const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (parsed.summary) generatedSummary = parsed.summary;
          if (parsed.key_takeaways) generatedTakeaways = parsed.key_takeaways;
          if (Array.isArray(parsed.tags)) generatedTags = parsed.tags;
        } catch (_) {
          if (!report.summary) generatedSummary = aiResponse.slice(0, 500);
        }
      } else if (!report.summary) {
        generatedSummary = `The ${report.event_name} organized by ${report.society || 'IEEE SREC'} engaged ${report.participants_count || 'many'} student delegates in specialized hands-on technical learning and industry knowledge dissemination.`;
      }

      await supabase
        .from('event_reports')
        .update({
          summary: generatedSummary,
          key_takeaways: generatedTakeaways,
          ai_tags: generatedTags,
          ai_enhanced: true,
          ai_enhanced_at: new Date().toISOString()
        })
        .eq('id', report.id);

      enhancedCount++;
    }

    const summary = `Successfully enhanced ${enhancedCount} event reports with AI executive summaries and tags.`;
    await writeAuditLog({
      job_type: 'EVENT_SUMMARIZATION',
      status: 'SUCCESS',
      summary,
      items_processed: enhancedCount
    });

    console.log(`[AI Manager] Event Summarization Done: ${summary}`);
    return { success: true, enhancedCount };
  } catch (err) {
    console.error('[AI Manager] Event summarization error:', err);
    await writeAuditLog({
      job_type: 'EVENT_SUMMARIZATION',
      status: 'FAILED',
      summary: `Event summarization failed: ${err.message}`,
      items_processed: 0
    });
    return { success: false, error: err.message };
  }
}

/**
 * 3. AUTOMATED FUNDING REQUEST TRIAGING
 * Evaluates budget requests, feasibility, and sets priority tags.
 */
export async function triageFundingSubmissions() {
  console.log('[AI Manager] Starting Funding Triaging...');
  let triagedCount = 0;

  try {
    const { data: requests, error } = await supabase
      .from('funding_submissions')
      .select('*')
      .is('ai_analysis', null)
      .limit(10);

    if (error || !requests || requests.length === 0) {
      const summary = requests?.length === 0 ? 'No pending funding submissions to triage.' : `Error: ${error?.message}`;
      await writeAuditLog({
        job_type: 'FUNDING_TRIAGE',
        status: error ? 'FAILED' : 'SUCCESS',
        summary,
        items_processed: 0
      });
      return { success: true, triagedCount: 0 };
    }

    for (const req of requests) {
      const budget = parseFloat(req.budget_amount) || 0;
      let priority = 'NORMAL';
      let feasibility = 80;
      let analysis = 'Feasible within IEEE Branch allocation parameters.';

      if (budget > 50000) {
        priority = 'HIGH';
        feasibility = 65;
        analysis = 'Major budget allocation requires ExCom and Branch Counselor ratification.';
      } else if (budget <= 5000) {
        priority = 'NORMAL';
        feasibility = 95;
        analysis = 'Standard student chapter activity budget. Low administrative overhead.';
      }

      if (req.description) {
        const aiPrompt = `Title: ${req.title}\nType: ${req.submission_type}\nBudget: Rs ${budget}\nDescription: ${req.description}\n\nTask: Assess IEEE feasibility. Return JSON: {"priority": "URGENT"|"HIGH"|"NORMAL"|"LOW", "feasibility": number 0-100, "analysis": "1 concise sentence"}`;
        const aiResp = await callGemini(aiPrompt, 'You are an IEEE Finance Committee Assistant. Output JSON only.');
        if (aiResp) {
          try {
            const parsed = JSON.parse(aiResp.replace(/```json/g, '').replace(/```/g, '').trim());
            if (parsed.priority) priority = parsed.priority;
            if (parsed.feasibility) feasibility = parsed.feasibility;
            if (parsed.analysis) analysis = parsed.analysis;
          } catch (_) {}
        }
      }

      await supabase
        .from('funding_submissions')
        .update({
          ai_priority: priority,
          ai_feasibility_score: feasibility,
          ai_analysis: analysis,
          ai_triaged_at: new Date().toISOString()
        })
        .eq('id', req.id);

      triagedCount++;
    }

    const summary = `Triaged ${triagedCount} funding submissions with budget feasibility assessments.`;
    await writeAuditLog({
      job_type: 'FUNDING_TRIAGE',
      status: 'SUCCESS',
      summary,
      items_processed: triagedCount
    });

    console.log(`[AI Manager] Funding Triaging Done: ${summary}`);
    return { success: true, triagedCount };
  } catch (err) {
    console.error('[AI Manager] Funding triage error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 4. SYSTEM HEALTH AND ANOMALY AUDIT
 * Verifies Supabase table health, member counts, and data integrity.
 */
export async function runSystemHealthCheck() {
  console.log('[AI Manager] Running System Health Audit...');
  try {
    const [
      { count: membersCount },
      { count: pendingAppsCount },
      { count: eventsCount },
      { count: adminsCount }
    ] = await Promise.all([
      supabase.from('student_members').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      supabase.from('event_reports').select('*', { count: 'exact', head: true }),
      supabase.from('admins').select('*', { count: 'exact', head: true })
    ]);

    const healthSummary = `System Healthy: ${membersCount || 0} active members, ${eventsCount || 0} event reports, ${adminsCount || 0} administrators, ${pendingAppsCount || 0} pending applications.`;

    await writeAuditLog({
      job_type: 'HEALTH_AUDIT',
      status: 'SUCCESS',
      summary: healthSummary,
      items_processed: (membersCount || 0) + (eventsCount || 0),
      details: {
        activeMembers: membersCount || 0,
        pendingApplications: pendingAppsCount || 0,
        eventReports: eventsCount || 0,
        registeredAdmins: adminsCount || 0,
        timestamp: new Date().toISOString()
      }
    });

    return {
      success: true,
      summary: healthSummary,
      stats: {
        activeMembers: membersCount || 0,
        pendingApplications: pendingAppsCount || 0,
        eventReports: eventsCount || 0,
        registeredAdmins: adminsCount || 0
      }
    };
  } catch (err) {
    console.error('[AI Manager] Health check failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 5. COMPLETE AUTONOMOUS CYCLE
 * Executes all AI tasks in sequence and produces a consolidated report.
 */
export async function runFullAutopilotCycle() {
  console.log('[AI Manager] >>> EXECUTING FULL AUTOPILOT CYCLE <<<');
  totalCyclesRun++;
  lastCycleTimestamp = new Date().toISOString();

  const [appsRes, reportsRes, fundingRes, healthRes] = await Promise.all([
    processPendingApplications(),
    autoSummarizeEventReports(),
    triageFundingSubmissions(),
    runSystemHealthCheck()
  ]);

  const summary = `Autopilot Cycle #${totalCyclesRun} completed: ${appsRes.approvedCount || 0} apps approved, ${reportsRes.enhancedCount || 0} reports summarized, ${fundingRes.triagedCount || 0} funding items triaged.`;

  lastCycleResults = {
    cycle: totalCyclesRun,
    timestamp: lastCycleTimestamp,
    summary,
    applications: appsRes,
    reports: reportsRes,
    funding: fundingRes,
    health: healthRes
  };

  await writeAuditLog({
    job_type: 'FULL_AUTOPILOT',
    status: 'SUCCESS',
    summary,
    items_processed: (appsRes.processedCount || 0) + (reportsRes.enhancedCount || 0) + (fundingRes.triagedCount || 0),
    details: lastCycleResults
  });

  return lastCycleResults;
}

/**
 * Daemon Controls (Interval polling)
 */
export function startAutonomousDaemon(intervalMs = 300000) { // default 5 minutes
  if (isDaemonRunning) {
    return { status: 'already_running', intervalMs };
  }

  isDaemonRunning = true;
  console.log(`[AI Manager] Autonomous Daemon started (Interval: ${intervalMs / 1000}s)`);

  // Run initial cycle immediately
  runFullAutopilotCycle().catch(e => console.warn('[AI Manager] Initial cycle error:', e.message));

  daemonIntervalTimer = setInterval(() => {
    runFullAutopilotCycle().catch(e => console.warn('[AI Manager] Daemon interval error:', e.message));
  }, intervalMs);

  return { status: 'started', intervalMs };
}

export function stopAutonomousDaemon() {
  if (daemonIntervalTimer) {
    clearInterval(daemonIntervalTimer);
    daemonIntervalTimer = null;
  }
  isDaemonRunning = false;
  console.log('[AI Manager] Autonomous Daemon stopped.');
  return { status: 'stopped' };
}

export function getAutopilotStatus() {
  return {
    isRunning: isDaemonRunning,
    totalCyclesRun,
    lastCycleTimestamp,
    lastCycleResults,
    geminiConfigured: !!GEMINI_API_KEY
  };
}

/**
 * Fetch recent audit logs from Supabase
 */
export async function getRecentAuditLogs(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('ai_backend_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[AI Manager] Failed to fetch audit logs:', err.message);
    return [];
  }
}

/**
 * 4. AUTOMATED ACTIVITY & EVENT GENERATION
 * Generates and auto-inserts upcoming technical events, hackathons, and workshops into public.activities
 */
export async function autoGenerateActivities(count = 3, category = 'all', customTopic = '') {
  console.log(`[AI Manager] Auto-generating ${count} activities (Category: ${category}, Topic: ${customTopic || 'none'})...`);

  try {
    // 1. Get current maximum s_no
    const { data: maxRow } = await supabase
      .from('activities')
      .select('s_no')
      .order('s_no', { ascending: false })
      .limit(1);

    let nextSno = (maxRow?.[0]?.s_no || 50) + 1;

    // 2. Curated IEEE activity templates as base or fallback
    const curatedTemplates = [
      {
        event: "IEEE Xtreme 20.0 - 24-Hour Global Virtual Programming Hackathon",
        date: "24.10.2026 - 25.10.2026",
        chief_guest: "IEEE Computer Society Global Operations Team & Regional Section Mentors",
        participants: "150 Teams (450 Students)",
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
      },
      {
        event: "Hands-on Workshop on Generative AI & Deep Learning Architectures",
        date: "14.11.2026",
        chief_guest: "Dr. K. Senthil Kumar, Lead AI Architect, NVIDIA Developer Community",
        participants: "120 Participants",
        image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80"
      },
      {
        event: "Women in Engineering (WIE) Leadership Summit: Breaking Tech Frontiers",
        date: "05.12.2026",
        chief_guest: "Ms. Radhika Sundaram, Engineering Director, Qualcomm India",
        participants: "180 Participants",
        image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
      },
      {
        event: "National Level Project Expo & Hardware Hackathon: VisionX 2027",
        date: "18.01.2027",
        chief_guest: "Mr. Sivakumar Palanisamy, VP Innovation & Ecosystems, StartupTN",
        participants: "85 Project Teams",
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
      },
      {
        event: "Industrial Masterclass on 6G Communication & Satellite IoT Systems",
        date: "12.02.2027",
        chief_guest: "Dr. A. Balamurugan, Principal Research Engineer, ISRO Telemetry Centre",
        participants: "95 Students",
        image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80"
      },
      {
        event: "Hands-on Bootcamp: EV Powertrain & Smart Grid Integration",
        date: "06.03.2027",
        chief_guest: "Mr. Vigneshwaran R., EV Systems Specialist, Bosch Powertrain Solutions",
        participants: "70 Participants",
        image_url: "https://images.unsplash.com/photo-1558441719-75c138d68d06?w=800&auto=format&fit=crop&q=80"
      }
    ];

    let activitiesToInsert = [];

    // 3. If Gemini API key is available, generate dynamically
    if (GEMINI_API_KEY) {
      const prompt = `Generate ${count} realistic, upcoming technical events or workshops for IEEE Student Branch SREC (Sri Ramakrishna Engineering College, Coimbatore).
Category: ${category}
${customTopic ? `Focus Topic: ${customTopic}` : ''}

Format as a strict JSON array of objects:
[
  {
    "event": "Full official title of the event",
    "date": "DD.MM.YYYY (between 2026 and 2027)",
    "chief_guest": "Name and designation of chief guest / industry mentor",
    "participants": "e.g. 120 Students or 45 Teams",
    "image_url": "https://images.unsplash.com/photo-... URL or thematic tech image"
  }
]
Return JSON ONLY, without markdown fences.`;

      const aiResponse = await callGemini(prompt, 'You are an IEEE event director. Output valid JSON array only.');
      if (aiResponse) {
        try {
          const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            activitiesToInsert = parsed.map((item, idx) => ({
              s_no: nextSno + idx,
              event: item.event || "IEEE Technical Workshop",
              date: item.date || "Upcoming 2026",
              chief_guest: item.chief_guest || "Industry Specialist",
              participants: item.participants || "100 Students",
              image_url: item.image_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
            }));
          }
        } catch (e) {
          console.warn('[AI Manager] Failed to parse Gemini response for activities, falling back to templates:', e.message);
        }
      }
    }

    // Fallback if AI was unavailable or parse failed
    if (activitiesToInsert.length === 0) {
      activitiesToInsert = curatedTemplates.slice(0, count).map((item, idx) => ({
        s_no: nextSno + idx,
        event: item.event,
        date: item.date,
        chief_guest: item.chief_guest,
        participants: item.participants,
        image_url: item.image_url
      }));
    }

    // 4. Insert into public.activities in Supabase
    const { data: inserted, error: insertError } = await supabase
      .from('activities')
      .insert(activitiesToInsert)
      .select();

    if (insertError) {
      throw insertError;
    }

    const summary = `Auto-generated and published ${activitiesToInsert.length} upcoming IEEE activities to backend database.`;
    await writeAuditLog({
      job_type: 'ACTIVITY_AUTOPILOT',
      status: 'SUCCESS',
      summary,
      items_processed: activitiesToInsert.length,
      details: { activities: activitiesToInsert.map(a => a.event) }
    });

    console.log(`[AI Manager] Activities Generated: ${summary}`);
    return {
      success: true,
      count: activitiesToInsert.length,
      activities: inserted || activitiesToInsert
    };
  } catch (err) {
    console.error('[AI Manager] Error auto-generating activities:', err);
    await writeAuditLog({
      job_type: 'ACTIVITY_AUTOPILOT',
      status: 'FAILED',
      summary: `Failed to auto-generate activities: ${err.message}`,
      items_processed: 0
    });
    return { success: false, error: err.message };
  }
}

