# ASTRA 2026 — Google Sheets & Application Tracking Setup Guide

This guide explains how to link the official **ASTRA Google Form**, the **Google Sheet**, and the **Google Apps Script** to enable:
1. Automatic generation of unique Application IDs (`ASTRA-2026-XXXXXX`).
2. Automated branded HTML confirmation emails sent to applicants.
3. Real-time application status tracking on the ASTRA website.
4. Organizer status changes (Shortlisting, Confirmation, Waitlisting) from the Google Sheet with zero code modifications.

---

## 1. Link Google Form to Google Sheet

1. Open your official ASTRA Google Form in edit mode.
2. Go to the **Responses** tab.
3. Click **Link to Sheets** (the green Sheets icon) and select **Create a new spreadsheet** (e.g. *ASTRA 2026 Form Responses*).
4. Open the created Google Sheet.

---

## 2. Install the Google Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any existing code in the editor.
3. Open the file [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) in this repository and copy its entire contents.
4. Paste it into the Apps Script editor.
5. In line 12 of `Code.gs`, adjust the `WEBSITE_TRACKING_URL` to your production website's tracking URL (e.g., `https://your-domain.com/track`).
6. Click **Save** (disk icon).

---

## 3. Set Up the "On Form Submit" Trigger

This ensures that whenever an applicant submits the Google Form, the script automatically generates an Application ID, records it in the Sheet, and emails the applicant:

1. In the Apps Script editor, click on the **Triggers** icon (clock icon on the left sidebar).
2. Click **+ Add Trigger** (bottom right).
3. Configure the trigger:
   - **Choose which function to run:** `onFormSubmit`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `From spreadsheet`
   - **Select event type:** `On form submit`
   - **Failure notification settings:** `Notify me daily` (or immediately)
4. Click **Save**.
5. Grant permissions when prompted by Google (click *Advanced* > *Go to ASTRA Script (unsafe)* > *Allow*).

---

## 4. Deploy the Web App API for Website Tracking

To allow the ASTRA website to query application status securely:

1. In the Apps Script editor, click **Deploy** (top right) > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description:** `ASTRA Tracking API v1`
   - **Execute as:** `Me (your email address)`
   - **Who has access:** `Anyone` *(Critical: allows the frontend to fetch public sanitized status without login)*
4. Click **Deploy**.
5. Copy the generated **Web app URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 5. Configure the Frontend Environment Variable

In your hackathon website project:

1. Create a `.env` file in the project root:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
2. Restart or rebuild the website:
   ```bash
   npm run build
   ```

> [!NOTE]
> The website already comes with built-in demo records (e.g. `ASTRA-2026-A8F42K`, `ASTRA-2026-C7K15M`, `ASTRA-2026-D4M82X`). When evaluating or testing offline, you can try these sample IDs immediately even before deploying the Google Sheet!

---

## 6. How Organizers Manage Applications

In the Google Sheet, the script automatically adds these columns:
- **Application ID**: e.g., `ASTRA-2026-A8F42K`
- **Status**: Initially set to `SUBMITTED`
- **Last Updated**: Timestamp of last edit
- **Review Notes**: Optional notes visible to the applicant

### To update an applicant's status:
Simply edit the cell under the **Status** column in the applicant's row to any of the supported statuses:
- `SUBMITTED`
- `UNDER_REVIEW`
- `SHORTLISTED`
- `CONFIRMED`
- `WAITLISTED`
- `REJECTED`
- `COMPLETED`

The ASTRA website tracking portal updates instantly whenever the applicant searches their Application ID!
