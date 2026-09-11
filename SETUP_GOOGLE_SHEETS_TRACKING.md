# ASTRA 2026 — Google Sheets & Application Tracking Setup Guide

This guide explains how to link the official **ASTRA Google Form**, the **Google Sheet**, and the **Google Apps Script** to enable:
1. Automatic generation of unique Team IDs (`ASTRA-TEAM-001`) and Application IDs (`ASTRA-2026-TEAM001`).
2. Automated branded HTML confirmation emails sent to applicants.
3. Real-time application status tracking on the ASTRA website via the live Google Apps Script API.
4. Robust header-based column mapping resilient to column position changes.

---

## 1. Link Google Form to Google Sheet

1. Open your official ASTRA Google Form in edit mode.
2. Go to the **Responses** tab.
3. Click **Link to Sheets** (the green Sheets icon) and select **Create a new spreadsheet** (tab named `Form Responses 2`).
4. Open the created Google Sheet.

---

## 2. Install the Google Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any existing code in the editor completely.
3. Open the file [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) in this repository and copy its entire contents.
4. Paste it into the Apps Script editor.
5. In `CONFIG`:
   - Set `TRACKING_URL` to your production website's tracking URL (e.g., `https://astra-hackathon-website.vercel.app/track-application`).
   - Set `ORGANIZER_EMAIL` to your organizer email for duplicate alerts.
6. Click **Save** (Ctrl + S).

---

## 3. Set Up the "On Form Submit" Trigger

Whenever an applicant submits the Google Form, this trigger executes `organizeRegistrations`, checks duplicates, assigns unique IDs, updates the Sheet, and emails the applicant:

1. In the Apps Script editor, click on the **Triggers** icon (clock icon on the left sidebar).
2. Click **+ Add Trigger** (bottom right).
3. Configure the trigger:
   - **Choose which function to run:** `organizeRegistrations`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `From spreadsheet`
   - **Select event type:** `On form submit`
   - **Failure notification settings:** `Notify me immediately`
4. Click **Save**.
5. Grant permissions when prompted by Google (click *Advanced* > *Go to ASTRA Script (unsafe)* > *Allow*).

---

## 4. Deploy the Web App API for Website Tracking

To allow the ASTRA website to query application status securely:

1. In the Apps Script editor, click **Deploy** > **Manage deployments** (or **New deployment**).
2. If updating an existing deployment:
   - Click **Edit**.
   - Under Version, select **New version**.
3. If creating a new deployment:
   - Click the gear icon next to "Select type" and choose **Web app**.
4. Configure:
   - **Execute as:** `Me (your email address)`
   - **Who has access:** `Anyone` *(Critical: allows the frontend to fetch public sanitized status without login)*
5. Click **Deploy**.
6. Copy the generated **Web app URL**:
   `https://script.google.com/macros/s/AKfycbxEaTgkR0JXt7HW6R-BOlovljWKC4WviDHBv5VzArmpMmfrrUsfc_U6xupv8Viv7M9LWA/exec`
7. Copy the generated Web app URL.
8. Add it to your `.env` or Vercel Environment Variables:
   ```bash
   VITE_API_URL=https://script.google.com/macros/s/AKfycbxEaTgkR0JXt7HW6R-BOlovljWKC4WviDHBv5VzArmpMmfrrUsfc_U6xupv8Viv7M9LWA/exec
   ```

Build the project:
```bash
npm run build
```
