/**
 * ASTRA 24-HOUR HACKATHON
 * Official Google Apps Script Backend for Application Tracking & Automated ID Generation
 * NRI INSTITUTE OF TECHNOLOGY × MTX × NRIIT CODING CLUB
 */

// Configuration Constants
const CONFIG = {
  EVENT_NAME: "ASTRA 2026",
  YEAR: "2026",
  WEBSITE_TRACKING_URL: "https://astra2026.nriit.edu.in/track", // Update to production website URL
  SHEET_NAME: "Form Responses 1",
  COL_APPLICATION_ID: "Application ID",
  COL_STATUS: "Status",
  COL_LAST_UPDATED: "Last Updated",
  COL_NOTES: "Review Notes"
};

/**
 * Triggered automatically when a new Google Form response is submitted.
 * To set up: Extensions > Apps Script > Triggers > Add Trigger > onFormSubmit > From spreadsheet > On form submit.
 */
function onFormSubmit(e) {
  try {
    const sheet = e.range ? e.range.getSheet() : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const row = e.range ? e.range.getRow() : sheet.getLastRow();

    // Ensure header columns exist
    ensureHeaders(sheet);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

    const appIdIndex = headers.indexOf(CONFIG.COL_APPLICATION_ID);
    const statusIndex = headers.indexOf(CONFIG.COL_STATUS);
    const updatedIndex = headers.indexOf(CONFIG.COL_LAST_UPDATED);

    // Generate unique Application ID if not already assigned
    let existingId = rowData[appIdIndex];
    if (!existingId || existingId.toString().trim() === "") {
      const newAppId = generateApplicationId();
      const nowISO = new Date().toISOString();

      sheet.getRange(row, appIdIndex + 1).setValue(newAppId);
      sheet.getRange(row, statusIndex + 1).setValue("SUBMITTED");
      sheet.getRange(row, updatedIndex + 1).setValue(nowISO);

      // Extract applicant details for email
      const email = extractFieldValue(headers, rowData, ["Email", "Email Address", "Registered Email"]);
      const name = extractFieldValue(headers, rowData, ["Full Name", "Name", "Applicant Name", "Team Leader Name"]);
      const teamName = extractFieldValue(headers, rowData, ["Team Name", "Project Name"]);

      if (email && email.indexOf("@") !== -1) {
        sendConfirmationEmail(email, name || "Innovator", newAppId, teamName);
      }
    }
  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
  }
}

/**
 * Generates an alphanumeric Application ID in the format ASTRA-2026-XXXXXX
 */
function generateApplicationId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous 0, O, 1, I
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ASTRA-${CONFIG.YEAR}-${code}`;
}

/**
 * Ensures the target sheet has the required tracking columns
 */
function ensureHeaders(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const required = [CONFIG.COL_APPLICATION_ID, CONFIG.COL_STATUS, CONFIG.COL_LAST_UPDATED, CONFIG.COL_NOTES];

  required.forEach(function (colName) {
    if (headers.indexOf(colName) === -1) {
      const newCol = sheet.getLastColumn() + 1;
      sheet.getRange(1, newCol).setValue(colName);
      sheet.getRange(1, newCol).setFontWeight("bold");
    }
  });
}

/**
 * Helper to match column variations
 */
function extractFieldValue(headers, rowData, aliases) {
  for (let i = 0; i < aliases.length; i++) {
    const idx = headers.findIndex(function (h) {
      return h && h.toString().trim().toLowerCase() === aliases[i].toLowerCase();
    });
    if (idx !== -1 && rowData[idx]) {
      return rowData[idx].toString().trim();
    }
  }
  return "";
}

/**
 * Masks an email for public display: j***e@domain.com
 */
function maskEmail(email) {
  if (!email || email.indexOf("@") === -1) return "Registered Email";
  const parts = email.split("@");
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) return `${name.charAt(0)}***@${domain}`;
  return `${name.charAt(0)}***${name.charAt(name.length - 1)}@${domain}`;
}

/**
 * Sends a rich, branded HTML confirmation email with Application ID
 */
function sendConfirmationEmail(recipientEmail, applicantName, applicationId, teamName) {
  const subject = `ASTRA 2026 — Registration Received [${applicationId}]`;
  const trackingLink = `${CONFIG.WEBSITE_TRACKING_URL}?id=${applicationId}`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #060b18; color: #f1f5f9; padding: 40px 20px; text-align: center;">
      <div style="max-width: 580px; margin: 0 auto; background: #0a1026; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 16px; padding: 32px; text-align: left; box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #ffffff; font-size: 28px; margin: 0; letter-spacing: 2px;">ASTRA</h1>
          <p style="color: #00f0ff; font-size: 13px; font-weight: bold; margin: 4px 0 0 0; letter-spacing: 1px;">A 24-HOUR HACKATHON</p>
          <p style="color: #94a3b8; font-size: 11px; margin-top: 4px;">NRI INSTITUTE OF TECHNOLOGY × MTX × NRIIT CODING CLUB</p>
        </div>
        
        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;">Hello <strong>${applicantName}</strong>,</p>
        
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
          Your ASTRA hackathon registration has been received successfully${teamName ? ` for team <strong>${teamName}</strong>` : ''}.
        </p>
        
        <div style="background-color: #02040a; border: 1px dashed #00f0ff; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
          <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">Your Official Application ID</span>
          <span style="font-size: 24px; font-weight: bold; font-family: monospace; color: #00f0ff; letter-spacing: 2px;">${applicationId}</span>
          <div style="margin-top: 8px;">
            <span style="display: inline-block; font-size: 11px; background: rgba(0, 240, 255, 0.15); color: #38bdf8; padding: 2px 10px; border-radius: 12px; font-weight: bold;">STATUS: SUBMITTED</span>
          </div>
        </div>

        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
          Please keep your Application ID safe for all future correspondence. You can check your application review, shortlisting, and confirmation status at any time:
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${trackingLink}" style="background: linear-gradient(90deg, #00f0ff, #a855f7); color: #000000; font-weight: bold; padding: 12px 28px; border-radius: 10px; text-decoration: none; display: inline-block; font-size: 13px; letter-spacing: 1px;">TRACK MY APPLICATION</a>
        </div>

        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;" />

        <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
          Event Dates: <strong>March 28 & 29, 2026</strong><br/>
          Venue: <strong>NRI Institute of Technology, Pamuru, Andhra Pradesh</strong><br/><br/>
          Regards,<br/>
          <strong>ASTRA Organizing Team</strong><br/>
          NRI Institute of Technology
        </p>
      </div>
    </div>
  `;

  GmailApp.sendEmail(recipientEmail, subject, `Your Application ID: ${applicationId}. Track at: ${trackingLink}`, {
    htmlBody: htmlBody,
    name: "ASTRA Hackathon"
  });
}

/**
 * Web App HTTP GET endpoint for Application Tracking
 * URL format: https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=track&applicationId=ASTRA-2026-XXXXXX
 */
function doGet(e) {
  const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
  };

  try {
    const params = e ? e.parameter : {};
    const rawId = params.applicationId || params.id;

    if (!rawId) {
      return jsonResponse({
        success: false,
        message: "Application ID is required.",
        errorCode: "MISSING_ID",
        error: "Application ID parameter is required"
      });
    }

    const targetId = rawId.toString().trim().toUpperCase();

    // Verify format: supports ASTRA-2026-XXXXXX, ASTRA-2026-TEAM001, etc.
    if (!/^ASTRA(-[0-9]{4})?-[A-Z0-9_-]{3,24}$/i.test(targetId)) {
      return jsonResponse({
        success: false,
        message: "Invalid Application ID format.",
        errorCode: "INVALID_FORMAT",
        error: "Invalid Application ID format. Expected format like ASTRA-2026-XXXXXX or ASTRA-2026-TEAM001"
      });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const appIdCol = headers.indexOf(CONFIG.COL_APPLICATION_ID);

    if (appIdCol === -1) {
      return jsonResponse({
        success: false,
        errorCode: "NOT_CONFIGURED",
        error: "Spreadsheet columns not yet initialized"
      });
    }

    const data = sheet.getDataRange().getValues();
    let matchedRow = null;

    for (let r = 1; r < data.length; r++) {
      if (data[r][appIdCol] && data[r][appIdCol].toString().trim().toUpperCase() === targetId) {
        matchedRow = data[r];
        break;
      }
    }

    if (!matchedRow) {
      return jsonResponse({
        success: false,
        message: "Application not found.",
        errorCode: "NOT_FOUND",
        error: "Application not found"
      });
    }

    // Extract sanitized safe public fields
    const name = extractFieldValue(headers, matchedRow, ["Full Name", "Name", "Applicant Name", "Team Leader Name", "Team Lead Name"]);
    const email = extractFieldValue(headers, matchedRow, ["Email", "Email Address", "Registered Email"]);
    const teamName = extractFieldValue(headers, matchedRow, ["Team Name", "Project Name"]);
    const college = extractFieldValue(headers, matchedRow, ["College", "College Name", "Institution"]);
    const branch = extractFieldValue(headers, matchedRow, ["Branch", "Department", "Stream", "Branch / Department"]);
    const track = extractFieldValue(headers, matchedRow, ["Track", "Theme", "Challenge Domain"]);
    const teamIdCol = extractFieldValue(headers, matchedRow, ["Team ID", "Team Id", "TeamID"]);

    // Extract members list
    const members = [];
    if (name) members.push(name);
    ["Team Member 2", "Team Member 3", "Team Member 4", "Member 2", "Member 3", "Member 4", "Member 2 Name", "Member 3 Name", "Member 4 Name"].forEach(function(alias) {
      const val = extractFieldValue(headers, matchedRow, [alias]);
      if (val && val.trim() !== "" && members.indexOf(val.trim()) === -1) {
        members.push(val.trim());
      }
    });
    
    const statusIdx = headers.indexOf(CONFIG.COL_STATUS);
    const updatedIdx = headers.indexOf(CONFIG.COL_LAST_UPDATED);
    const notesIdx = headers.indexOf(CONFIG.COL_NOTES);

    const status = statusIdx !== -1 && matchedRow[statusIdx] ? matchedRow[statusIdx].toString().trim().toUpperCase() : "SUBMITTED";
    const lastUpdated = updatedIdx !== -1 && matchedRow[updatedIdx] ? matchedRow[updatedIdx].toString().trim() : new Date().toISOString();
    const reviewNotes = notesIdx !== -1 && matchedRow[notesIdx] ? matchedRow[notesIdx].toString().trim() : "";

    const appData = {
      applicationId: targetId,
      teamId: teamIdCol || ("ASTRA-TEAM-" + targetId.replace(/[^A-Z0-9]/g, "").slice(-4)),
      teamName: teamName || "ASTRA Innovators",
      teamLead: name || "Team Lead",
      applicantName: name || "Team Lead",
      name: name || "Team Lead",
      email: maskEmail(email),
      maskedEmail: maskEmail(email),
      college: college || "NRI Institute of Technology",
      branch: branch || "Engineering & Technology",
      track: track || "General Track",
      members: members.length > 0 ? members : [name || "Team Lead"],
      memberCount: members.length > 0 ? members.length : 1,
      status: status,
      lastUpdated: lastUpdated,
      reviewNotes: reviewNotes || "Application verified on official ASTRA telemetry."
    };

    return jsonResponse({
      success: true,
      application: appData,
      data: appData
    });

  } catch (err) {
    return jsonResponse({
      success: false,
      message: "Internal server error occurred while retrieving application",
      errorCode: "SERVER_ERROR",
      error: err.toString()
    });
  }
}

/**
 * Returns JSON output with proper ContentService mime type
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
