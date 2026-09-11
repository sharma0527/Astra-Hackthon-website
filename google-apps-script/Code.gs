/************************************************************
 * ASTRA HACKATHON 2026
 * NRI INSTITUTE OF TECHNOLOGY × MTX × NRIIT CODING CLUB
 *
 * GOOGLE APPS SCRIPT BACKEND
 *
 * DATABASE:
 * Form Responses 2
 *
 * FEATURES:
 * ✓ Sequential Team ID
 * ✓ Sequential Application ID
 * ✓ Duplicate Team Name detection
 * ✓ Duplicate Team Lead detection
 * ✓ Duplicate Roll Number detection
 * ✓ Duplicate Roll Number inside same team
 * ✓ SUBMITTED / DUPLICATE status
 * ✓ Confirmation email
 * ✓ Track Application API
 * ✓ Team member extraction
 * ✓ Masked public email
 * ✓ LockService protection
 * ✓ Strictly uses Form Responses 2
 ************************************************************/


/* =========================================================
   CONFIGURATION
   ========================================================= */

const CONFIG = {

  EVENT_NAME: "ASTRA HACKATHON 2026",

  YEAR: "2026",

  API_URL:
    "https://script.google.com/macros/s/AKfycbxEaTgkR0JXt7HW6R-BOlovljWKC4WviDHBv5VzArmpMmfrrUsfc_U6xupv8Viv7M9LWA/exec",

  TRACKING_URL:
    "https://astra-hackthon-website.vercel.app/track-application",

  /*
   * CHANGE ONLY THIS EMAIL.
   */
  ORGANIZER_EMAIL:
    "YOUR-REAL-ORGANIZER-EMAIL@gmail.com",

  /*
   * IMPORTANT:
   * Your actual Google Sheet tab is Form Responses 2.
   */
  SHEET_NAME:
    "Form Responses 2",

  TEAM_ID:
    "Team ID",

  APPLICATION_ID:
    "Application ID",

  STATUS:
    "Status",

  LAST_UPDATED:
    "Last Updated",

  REVIEW_NOTES:
    "Review Notes"
};


/* =========================================================
   FORM SUBMISSION TRIGGER
   ========================================================= */

function organizeRegistrations(e) {

  if (!e || !e.range) {
    throw new Error(
      "organizeRegistrations must run from a spreadsheet On form submit trigger."
    );
  }

  const sheet = e.range.getSheet();
  const row = e.range.getRow();

  /*
   * ONLY Form Responses 2 is processed.
   */
  if (sheet.getName() !== CONFIG.SHEET_NAME) {

    console.log(
      "Ignored submission from sheet: " +
      sheet.getName()
    );

    return;
  }

  /*
   * Ensure system columns exist.
   */
  ensureSystemColumns(sheet);

  /*
   * Prevent duplicate IDs during simultaneous submissions.
   */
  const lock = LockService.getScriptLock();

  try {

    lock.waitLock(30000);

    const headers = getHeaders(sheet);

    const teamIdColumn =
      findColumn(headers, CONFIG.TEAM_ID);

    const applicationIdColumn =
      findColumn(headers, CONFIG.APPLICATION_ID);

    const statusColumn =
      findColumn(headers, CONFIG.STATUS);

    const lastUpdatedColumn =
      findColumn(headers, CONFIG.LAST_UPDATED);

    if (
      teamIdColumn === -1 ||
      applicationIdColumn === -1 ||
      statusColumn === -1 ||
      lastUpdatedColumn === -1
    ) {
      throw new Error(
        "Required system columns are missing."
      );
    }

    /*
     * If already processed, do nothing.
     */
    const existingTeamId =
      String(
        sheet
          .getRange(row, teamIdColumn + 1)
          .getDisplayValue()
      ).trim();

    const existingApplicationId =
      String(
        sheet
          .getRange(row, applicationIdColumn + 1)
          .getDisplayValue()
      ).trim();

    if (
      existingTeamId &&
      existingApplicationId
    ) {

      console.log(
        "Already processed: " +
        existingApplicationId
      );

      return;
    }


    /* =====================================================
       DUPLICATE CHECK
       ===================================================== */

    const duplicateResult =
      checkForDuplicates(
        sheet,
        row,
        headers
      );

    if (duplicateResult.duplicate) {

      sheet
        .getRange(
          row,
          statusColumn + 1
        )
        .setValue("DUPLICATE");

      sheet
        .getRange(
          row,
          lastUpdatedColumn + 1
        )
        .setValue(new Date());

      SpreadsheetApp.flush();

      sendDuplicateAlert(
        sheet,
        row,
        duplicateResult.reason,
        duplicateResult.details,
        headers
      );

      console.log(
        "Duplicate registration rejected."
      );

      return;
    }


    /* =====================================================
       GENERATE UNIQUE ID
       ===================================================== */

    const nextNumber =
      getNextTeamNumber(sheet);

    const number =
      String(nextNumber).padStart(3, "0");

    const teamId =
      "ASTRA-TEAM-" + number;

    const applicationId =
      "ASTRA-2026-TEAM" + number;


    /*
     * Final collision protection.
     */
    if (
      applicationIdExists(
        sheet,
        applicationId
      )
    ) {
      throw new Error(
        "Application ID already exists: " +
        applicationId
      );
    }

    if (
      teamIdExists(
        sheet,
        teamId
      )
    ) {
      throw new Error(
        "Team ID already exists: " +
        teamId
      );
    }


    /* =====================================================
       WRITE IDs + STATUS
       ===================================================== */

    sheet
      .getRange(
        row,
        teamIdColumn + 1
      )
      .setNumberFormat("@")
      .setValue(teamId);

    sheet
      .getRange(
        row,
        applicationIdColumn + 1
      )
      .setNumberFormat("@")
      .setValue(applicationId);

    sheet
      .getRange(
        row,
        statusColumn + 1
      )
      .setValue("SUBMITTED");

    sheet
      .getRange(
        row,
        lastUpdatedColumn + 1
      )
      .setValue(new Date());

    SpreadsheetApp.flush();


    /* =====================================================
       READ FORM DATA
       ===================================================== */

    const rowValues =
      sheet
        .getRange(
          row,
          1,
          1,
          headers.length
        )
        .getDisplayValues()[0];

    const teamName =
      getField(
        headers,
        rowValues,
        ["Team Name"]
      );

    const teamLead =
      getField(
        headers,
        rowValues,
        ["Team Lead Name"]
      );

    const email =
      getField(
        headers,
        rowValues,
        [
          "Team Lead Email",
          "Email Address"
        ]
      );

    const branch =
      getField(
        headers,
        rowValues,
        ["Team Lead Branch"]
      );

    const problemStatement =
      getField(
        headers,
        rowValues,
        ["PROBLEM STATEMENT"]
      );

    const domain =
      getField(
        headers,
        rowValues,
        ["Problem Statement Domain"]
      );


    /* =====================================================
       SEND CONFIRMATION EMAIL
       ===================================================== */

    if (
      email &&
      email.includes("@")
    ) {

      sendConfirmationEmail({
        email: email,
        teamName: teamName,
        teamLead: teamLead,
        teamId: teamId,
        applicationId: applicationId,
        branch: branch,
        problemStatement: problemStatement,
        domain: domain
      });

    }


    console.log(
      "ASTRA REGISTRATION SUCCESS"
    );

    console.log(
      "Team ID: " + teamId
    );

    console.log(
      "Application ID: " + applicationId
    );

    console.log(
      "Status: SUBMITTED"
    );

  }

  finally {

    try {
      lock.releaseLock();
    } catch (error) {
      console.log(
        "Lock release error: " +
        error
      );
    }

  }
}


/* =========================================================
   ENSURE SYSTEM COLUMNS
   ========================================================= */

function ensureSystemColumns(sheet) {

  let headers =
    getHeaders(sheet);

  const requiredColumns = [
    CONFIG.TEAM_ID,
    CONFIG.APPLICATION_ID,
    CONFIG.STATUS,
    CONFIG.LAST_UPDATED,
    CONFIG.REVIEW_NOTES
  ];

  requiredColumns.forEach(
    function(columnName) {

      const exists =
        headers.some(
          function(header) {

            return (
              normalizeHeader(header) ===
              normalizeHeader(columnName)
            );

          }
        );

      if (!exists) {

        const newColumn =
          sheet.getLastColumn() + 1;

        sheet
          .getRange(
            1,
            newColumn
          )
          .setValue(columnName)
          .setFontWeight("bold");

        headers =
          getHeaders(sheet);
      }

    }
  );

}


/* =========================================================
   GET HEADERS
   ========================================================= */

function getHeaders(sheet) {

  const lastColumn =
    sheet.getLastColumn();

  if (lastColumn < 1) {
    return [];
  }

  return sheet
    .getRange(
      1,
      1,
      1,
      lastColumn
    )
    .getDisplayValues()[0]
    .map(
      function(header) {
        return String(
          header || ""
        ).trim();
      }
    );
}


/* =========================================================
   FIND COLUMN
   Returns ZERO-BASED index.
   ========================================================= */

function findColumn(
  headers,
  headerName
) {

  const target =
    normalizeHeader(
      headerName
    );

  return headers.findIndex(
    function(header) {

      return (
        normalizeHeader(header) ===
        target
      );

    }
  );
}


/* =========================================================
   NORMALIZE HEADER
   ========================================================= */

function normalizeHeader(value) {

  return String(
    value || ""
  )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}


/* =========================================================
   NORMALIZE VALUE
   ========================================================= */

function normalizeValue(value) {

  return String(
    value || ""
  )
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}


/* =========================================================
   GET FIELD
   ========================================================= */

function getField(
  headers,
  rowValues,
  possibleNames
) {

  for (
    let i = 0;
    i < possibleNames.length;
    i++
  ) {

    const column =
      findColumn(
        headers,
        possibleNames[i]
      );

    if (column !== -1) {

      const value =
        String(
          rowValues[column] || ""
        ).trim();

      if (value) {
        return value;
      }

    }
  }

  return "";
}


/* =========================================================
   GET NEXT TEAM NUMBER
   ========================================================= */

function getNextTeamNumber(sheet) {

  const properties =
    PropertiesService
      .getScriptProperties();

  const stored =
    parseInt(
      properties.getProperty(
        "ASTRA_LAST_TEAM_NUMBER"
      ) || "0",
      10
    );

  const storedNumber =
    isNaN(stored)
      ? 0
      : stored;

  const highest =
    findHighestTeamNumber(sheet);

  const next =
    Math.max(
      storedNumber,
      highest
    ) + 1;

  properties.setProperty(
    "ASTRA_LAST_TEAM_NUMBER",
    String(next)
  );

  return next;
}


/* =========================================================
   FIND HIGHEST TEAM NUMBER
   ========================================================= */

function findHighestTeamNumber(sheet) {

  const headers =
    getHeaders(sheet);

  const column =
    findColumn(
      headers,
      CONFIG.TEAM_ID
    );

  if (column === -1) {
    return 0;
  }

  const lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    return 0;
  }

  const values =
    sheet
      .getRange(
        2,
        column + 1,
        lastRow - 1,
        1
      )
      .getDisplayValues();

  let highest = 0;

  values.forEach(
    function(row) {

      const value =
        String(
          row[0] || ""
        ).trim();

      const match =
        value.match(
          /^ASTRA-TEAM-(\d+)$/i
        );

      if (match) {

        const number =
          parseInt(
            match[1],
            10
          );

        if (
          number > highest
        ) {
          highest = number;
        }

      }

    }
  );

  return highest;
}


/* =========================================================
   APPLICATION ID EXISTS
   ========================================================= */

function applicationIdExists(
  sheet,
  applicationId
) {

  const headers =
    getHeaders(sheet);

  const column =
    findColumn(
      headers,
      CONFIG.APPLICATION_ID
    );

  if (column === -1) {
    return false;
  }

  const lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    return false;
  }

  const values =
    sheet
      .getRange(
        2,
        column + 1,
        lastRow - 1,
        1
      )
      .getDisplayValues();

  const target =
    normalizeApplicationId(
      applicationId
    );

  return values.some(
    function(row) {

      return (
        normalizeApplicationId(
          row[0]
        ) === target
      );

    }
  );
}


/* =========================================================
   TEAM ID EXISTS
   ========================================================= */

function teamIdExists(
  sheet,
  teamId
) {

  const headers =
    getHeaders(sheet);

  const column =
    findColumn(
      headers,
      CONFIG.TEAM_ID
    );

  if (column === -1) {
    return false;
  }

  const lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {
    return false;
  }

  const values =
    sheet
      .getRange(
        2,
        column + 1,
        lastRow - 1,
        1
      )
      .getDisplayValues();

  const target =
    normalizeValue(teamId);

  return values.some(
    function(row) {

      return (
        normalizeValue(
          row[0]
        ) === target
      );

    }
  );
}


/* =========================================================
   NORMALIZE APPLICATION ID
   ========================================================= */

function normalizeApplicationId(value) {

  return String(
    value || ""
  )
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}


/* =========================================================
   DUPLICATE CHECKER
   ========================================================= */

function checkForDuplicates(
  sheet,
  currentRow,
  headers
) {

  const lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {

    return {
      duplicate: false,
      reason: "",
      details: ""
    };

  }

  const currentValues =
    sheet
      .getRange(
        currentRow,
        1,
        1,
        headers.length
      )
      .getDisplayValues()[0];

  const currentTeamName =
    normalizeValue(
      getField(
        headers,
        currentValues,
        ["Team Name"]
      )
    );

  const currentTeamLead =
    normalizeValue(
      getField(
        headers,
        currentValues,
        ["Team Lead Name"]
      )
    );

  const currentRollNumbers =
    getAllRollNumbers(
      headers,
      currentValues
    );


  /*
   * Duplicate roll numbers within same team.
   */
  const uniqueRollNumbers =
    new Set(
      currentRollNumbers
    );

  if (
    uniqueRollNumbers.size !==
    currentRollNumbers.length
  ) {

    return {
      duplicate: true,
      reason:
        "Duplicate Roll Number within the same team.",
      details:
        currentRollNumbers.join(", ")
    };

  }


  /*
   * Compare previous registrations.
   */
  for (
    let rowNumber = 2;
    rowNumber <= lastRow;
    rowNumber++
  ) {

    if (
      rowNumber === currentRow
    ) {
      continue;
    }

    const previousValues =
      sheet
        .getRange(
          rowNumber,
          1,
          1,
          headers.length
        )
        .getDisplayValues()[0];


    /* TEAM NAME */

    const previousTeamName =
      normalizeValue(
        getField(
          headers,
          previousValues,
          ["Team Name"]
        )
      );

    if (
      currentTeamName &&
      previousTeamName &&
      currentTeamName ===
      previousTeamName
    ) {

      return {
        duplicate: true,
        reason:
          "Duplicate Team Name.",
        details:
          getField(
            headers,
            previousValues,
            ["Team Name"]
          )
      };

    }


    /* TEAM LEAD */

    const previousTeamLead =
      normalizeValue(
        getField(
          headers,
          previousValues,
          ["Team Lead Name"]
        )
      );

    if (
      currentTeamLead &&
      previousTeamLead &&
      currentTeamLead ===
      previousTeamLead
    ) {

      return {
        duplicate: true,
        reason:
          "Duplicate Team Lead.",
        details:
          getField(
            headers,
            previousValues,
            ["Team Lead Name"]
          )
      };

    }


    /* ROLL NUMBERS */

    const previousRollNumbers =
      getAllRollNumbers(
        headers,
        previousValues
      );

    const previousRollSet =
      new Set(
        previousRollNumbers
      );

    for (
      let i = 0;
      i < currentRollNumbers.length;
      i++
    ) {

      if (
        previousRollSet.has(
          currentRollNumbers[i]
        )
      ) {

        return {
          duplicate: true,
          reason:
            "Duplicate Roll Number.",
          details:
            currentRollNumbers[i]
        };

      }

    }

  }

  return {
    duplicate: false,
    reason: "",
    details: ""
  };
}


/* =========================================================
   GET ALL ROLL NUMBERS
   ========================================================= */

function getAllRollNumbers(
  headers,
  rowValues
) {

  const rolls = [];

  headers.forEach(
    function(header, index) {

      const normalized =
        normalizeHeader(header)
          .replace(
            /[^a-z0-9]/g,
            ""
          );

      if (
        normalized.includes("rollnumber") ||
        normalized.includes("rollno")
      ) {

        const value =
          String(
            rowValues[index] || ""
          ).trim();

        if (value) {

          rolls.push(
            normalizeValue(value)
          );

        }

      }

    }
  );

  return rolls;
}


/* =========================================================
   CONFIRMATION EMAIL
   ========================================================= */

function sendConfirmationEmail(data) {

  const trackingLink =
    CONFIG.TRACKING_URL +
    "?applicationId=" +
    encodeURIComponent(
      data.applicationId
    );

  const subject =
    "ASTRA Hackathon 2026 | Registration Received | " +
    data.applicationId;

  const plainText =
    "Hello " +
    (data.teamLead || "Team Lead") +
    ",\n\n" +

    "Your registration for the ASTRA Hackathon 2026 has been successfully received.\n\n" +

    "REGISTRATION DETAILS\n" +
    "------------------------------\n" +

    "Team Name: " +
    (data.teamName || "N/A") +
    "\n" +

    "Team ID: " +
    data.teamId +
    "\n" +

    "Application ID: " +
    data.applicationId +
    "\n" +

    "Status: SUBMITTED\n" +

    "Team Lead: " +
    (data.teamLead || "N/A") +
    "\n" +

    "Branch: " +
    (data.branch || "N/A") +
    "\n\n" +

    "Track Application:\n" +
    trackingLink +
    "\n\n" +

    "Please save your Application ID:\n" +
    data.applicationId +
    "\n\n" +

    "This email confirms that your registration has been received.\n\n" +

    "All the best! We will meet you at the hackathon.\n\n" +

    "Regards,\n" +
    "ASTRA Hackathon Team\n" +
    "NRI Institute of Technology";


  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width,initial-scale=1.0">
</head>

<body style="
margin:0;
padding:0;
background:#f3f6fa;
font-family:Arial,Helvetica,sans-serif;
">

<div style="
max-width:650px;
margin:auto;
padding:30px 15px;
">

<div style="
background:#111827;
color:white;
padding:30px;
border-radius:16px 16px 0 0;
">

<h1 style="
margin:0;
font-size:28px;
">
ASTRA HACKATHON 2026
</h1>

<p style="
margin-bottom:0;
color:#d1d5db;
">
Registration Successfully Received
</p>

</div>

<div style="
background:white;
padding:30px;
border-radius:0 0 16px 16px;
">

<h2>Registration Details</h2>

<p>
<strong>Team Name:</strong>
${escapeHtml(data.teamName || "N/A")}
</p>

<p>
<strong>Team ID:</strong>
${escapeHtml(data.teamId)}
</p>

<p>
<strong>Application ID:</strong>
${escapeHtml(data.applicationId)}
</p>

<p>
<strong>Status:</strong>
<span style="
color:#16a34a;
font-weight:bold;
">
SUBMITTED
</span>
</p>

<p>
<strong>Team Lead:</strong>
${escapeHtml(data.teamLead || "N/A")}
</p>

<p>
<strong>Branch:</strong>
${escapeHtml(data.branch || "N/A")}
</p>

<div style="
margin:25px 0;
padding:22px;
background:#f3f7ff;
border-radius:12px;
text-align:center;
">

<p style="
margin-top:0;
color:#6b7280;
">
Your Application ID
</p>

<div style="
font-size:24px;
font-weight:bold;
letter-spacing:1px;
">
${escapeHtml(data.applicationId)}
</div>

</div>

<div style="
text-align:center;
margin:30px 0;
">

<a
href="${trackingLink}"
style="
display:inline-block;
background:#111827;
color:#ffffff;
padding:14px 25px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
">
TRACK APPLICATION
</a>

</div>

<p style="
color:#6b7280;
font-size:13px;
line-height:1.6;
">
Please keep your Application ID safe.
You can use it to track your application.
</p>

<hr style="
border:none;
border-top:1px solid #e5e7eb;
margin:25px 0;
">

<p style="
color:#6b7280;
font-size:13px;
line-height:1.6;
">

Regards,<br>

<strong>
ASTRA Hackathon Team
</strong>

<br>

NRI Institute of Technology

</p>

</div>
</div>

</body>
</html>
`;

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: plainText,
    htmlBody: htmlBody,
    name: "ASTRA Hackathon"
  });
}


/* =========================================================
   DUPLICATE ALERT
   ========================================================= */

function sendDuplicateAlert(
  sheet,
  row,
  reason,
  details,
  headers
) {

  if (
    !CONFIG.ORGANIZER_EMAIL ||
    CONFIG.ORGANIZER_EMAIL.includes(
      "YOUR-"
    )
  ) {

    console.log(
      "Organizer email is not configured."
    );

    return;
  }

  const rowValues =
    sheet
      .getRange(
        row,
        1,
        1,
        headers.length
      )
      .getDisplayValues()[0];

  const teamName =
    getField(
      headers,
      rowValues,
      ["Team Name"]
    );

  const teamLead =
    getField(
      headers,
      rowValues,
      ["Team Lead Name"]
    );

  const email =
    getField(
      headers,
      rowValues,
      [
        "Team Lead Email",
        "Email Address"
      ]
    );

  MailApp.sendEmail({

    to:
      CONFIG.ORGANIZER_EMAIL,

    subject:
      "ASTRA Registration | Duplicate Detected",

    body:
      "Duplicate ASTRA registration detected.\n\n" +

      "Team Name: " +
      teamName +
      "\n\n" +

      "Team Lead: " +
      teamLead +
      "\n\n" +

      "Email: " +
      email +
      "\n\n" +

      "Reason: " +
      reason +
      "\n\n" +

      "Matched Value: " +
      details +
      "\n\n" +

      "Status: DUPLICATE"

  });
}


/* =========================================================
   APPLICATION TRACKING API
   ========================================================= */

function doGet(e) {

  try {

    const params =
      e && e.parameter
        ? e.parameter
        : {};

    const rawApplicationId =
      params.applicationId ||
      params.id ||
      "";

    /*
     * Missing ID
     */
    if (
      !String(
        rawApplicationId
      ).trim()
    ) {

      return jsonResponse({
        success: false,
        message:
          "Application ID is required.",
        errorCode:
          "MISSING_ID"
      });

    }


    /*
     * Normalize
     */
    const targetId =
      normalizeApplicationId(
        rawApplicationId
      );


    /*
     * Validate
     */
    if (
      !/^ASTRA-2026-TEAM\d{3,}$/
        .test(targetId)
    ) {

      return jsonResponse({
        success: false,
        message:
          "Invalid Application ID format. Example: ASTRA-2026-TEAM001",
        errorCode:
          "INVALID_FORMAT"
      });

    }


    /*
     * Open bound spreadsheet.
     */
    const spreadsheet =
      SpreadsheetApp
        .getActiveSpreadsheet();

    if (!spreadsheet) {

      return jsonResponse({
        success: false,
        message:
          "Registration database is unavailable.",
        errorCode:
          "NO_SPREADSHEET"
      });

    }


    /*
     * STRICTLY Form Responses 2.
     */
    const sheet =
      spreadsheet.getSheetByName(
        CONFIG.SHEET_NAME
      );

    if (!sheet) {

      return jsonResponse({
        success: false,
        message:
          "Form Responses 2 sheet was not found.",
        errorCode:
          "SHEET_NOT_FOUND"
      });

    }


    const lastRow =
      sheet.getLastRow();

    const lastColumn =
      sheet.getLastColumn();

    if (
      lastRow < 2 ||
      lastColumn < 1
    ) {

      return jsonResponse({
        success: false,
        message:
          "Application not found.",
        errorCode:
          "NOT_FOUND"
      });

    }


    const headers =
      getHeaders(sheet);

    const applicationColumn =
      findColumn(
        headers,
        CONFIG.APPLICATION_ID
      );

    if (
      applicationColumn === -1
    ) {

      return jsonResponse({
        success: false,
        message:
          "Application tracking is not configured correctly.",
        errorCode:
          "APPLICATION_COLUMN_MISSING"
      });

    }


    /*
     * Read all registrations.
     */
    const values =
      sheet
        .getRange(
          2,
          1,
          lastRow - 1,
          lastColumn
        )
        .getDisplayValues();


    /*
     * Find exact application.
     */
    let matchedRow = null;

    for (
      let i = 0;
      i < values.length;
      i++
    ) {

      const storedId =
        normalizeApplicationId(
          values[i][applicationColumn]
        );

      if (
        storedId === targetId
      ) {

        matchedRow =
          values[i];

        break;
      }

    }


    if (!matchedRow) {

      return jsonResponse({
        success: false,
        message:
          "Application not found. Please check your Application ID and try again.",
        errorCode:
          "NOT_FOUND"
      });

    }


    /*
     * Build safe public response.
     */
    const application =
      buildApplicationResponse(
        headers,
        matchedRow,
        targetId
      );


    return jsonResponse({

      success: true,

      application: application,

      data: application

    });

  }

  catch (error) {

    console.error(error);

    return jsonResponse({

      success: false,

      message:
        "Unable to process the application request.",

      errorCode:
        "SERVER_ERROR"

    });

  }
}


/* =========================================================
   BUILD PUBLIC APPLICATION RESPONSE
   ========================================================= */

function buildApplicationResponse(
  headers,
  rowValues,
  targetId
) {

  const teamId =
    getField(
      headers,
      rowValues,
      [CONFIG.TEAM_ID]
    );

  const teamName =
    getField(
      headers,
      rowValues,
      ["Team Name"]
    );

  const teamLead =
    getField(
      headers,
      rowValues,
      ["Team Lead Name"]
    );

  const email =
    getField(
      headers,
      rowValues,
      [
        "Team Lead Email",
        "Email Address"
      ]
    );

  const branch =
    getField(
      headers,
      rowValues,
      ["Team Lead Branch"]
    );

  const problemStatement =
    getField(
      headers,
      rowValues,
      ["PROBLEM STATEMENT"]
    );

  const domain =
    getField(
      headers,
      rowValues,
      ["Problem Statement Domain"]
    );

  const status =
    getField(
      headers,
      rowValues,
      [CONFIG.STATUS]
    ) ||
    "SUBMITTED";

  const lastUpdated =
    getField(
      headers,
      rowValues,
      [CONFIG.LAST_UPDATED]
    );

  const reviewNotes =
    getField(
      headers,
      rowValues,
      [CONFIG.REVIEW_NOTES]
    );

  const members =
    getTeamMembers(
      headers,
      rowValues,
      teamLead
    );

  return {

    applicationId:
      targetId,

    teamId:
      teamId,

    teamName:
      teamName,

    teamLead:
      teamLead,

    email:
      maskEmail(email),

    maskedEmail:
      maskEmail(email),

    branch:
      branch,

    problemStatement:
      problemStatement,

    domain:
      domain,

    members:
      members,

    memberCount:
      members.length,

    status:
      String(
        status
      ).toUpperCase(),

    lastUpdated:
      lastUpdated,

    /*
     * If Review Notes are private internal notes,
     * remove this field from the public API.
     */
    reviewNotes:
      reviewNotes

  };
}


/* =========================================================
   GET TEAM MEMBERS
   ========================================================= */

function getTeamMembers(
  headers,
  rowValues,
  teamLead
) {

  const members = [];


  /*
   * Team Lead first.
   */
  if (teamLead) {

    members.push({

      name:
        teamLead,

      role:
        "Team Lead"

    });

  }


  /*
   * Find only:
   *
   * TEAM MEMBER X
   * + FULL NAME
   *
   * Do not expose emails, rolls or branches.
   */
  headers.forEach(
    function(header, index) {

      const normalized =
        normalizeHeader(
          header
        );

      const isTeamMemberName =
        normalized.includes(
          "team member"
        ) &&
        normalized.includes(
          "full name"
        );

      if (
        !isTeamMemberName
      ) {
        return;
      }

      const name =
        String(
          rowValues[index] || ""
        ).trim();

      if (!name) {
        return;
      }

      /*
       * Avoid adding Team Lead twice.
       */
      if (
        normalizeValue(name) ===
        normalizeValue(teamLead)
      ) {
        return;
      }

      const match =
        normalized.match(
          /team member\s*(\d+)/
        );

      const memberNumber =
        match
          ? match[1]
          : "";

      members.push({

        name:
          name,

        role:
          memberNumber
            ? "Team Member " +
              memberNumber
            : "Team Member"

      });

    }
  );


  return members;
}


/* =========================================================
   MASK EMAIL
   ========================================================= */

function maskEmail(email) {

  const value =
    String(
      email || ""
    ).trim();

  if (
    !value ||
    !value.includes("@")
  ) {

    return "Registered Email";

  }

  const parts =
    value.split("@");

  const username =
    parts[0];

  const domain =
    parts[1];

  if (
    username.length <= 2
  ) {

    return (
      username.charAt(0) +
      "***@" +
      domain
    );

  }

  return (
    username.charAt(0) +
    "***" +
    username.charAt(
      username.length - 1
    ) +
    "@" +
    domain
  );
}


/* =========================================================
   JSON RESPONSE
   ========================================================= */

function jsonResponse(object) {

  return ContentService
    .createTextOutput(
      JSON.stringify(object)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

  return String(
    value || ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}
