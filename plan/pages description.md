# 1. Authentication

This is the entry point to the application.

### Login

Allows users to sign in using email/password or Google authentication.

### Register

Users create an account by providing their name, email, and password.

### Forgot Password

Password reset via email.

There is nothing special here—keep it clean and simple.

---

# 2. Onboarding

This page appears only for new users after registration.

Its purpose is to help users set up the platform without navigating through multiple pages.

The onboarding flow should include:

* Create an organization (business name and logo)
* Connect a Meta account
* Select which Facebook Page or Instagram Business account to manage
* Enable AI replies (optional)
* Finish setup

Once completed, users are redirected to the dashboard.

---

# 3. Dashboard

The dashboard gives users a quick overview of their connected business and messaging activity.

It should display:

### Organization Overview

* Organization name
* Logo
* Current subscription (optional for MVP)

### Connected Platforms

Shows the status of connected Meta accounts, including Facebook Pages and Instagram Business accounts.

### Activity Summary

Displays basic statistics such as:

* Messages received today
* AI replies sent
* Open conversations
* Conversations currently handled by humans

### Recent Conversations

A small list of the most recent conversations with customer names, platform, and latest message.

### Quick Actions

Buttons for:

* Open Conversations
* Connect another Meta account
* Configure AI

The dashboard should be informational only. Users shouldn't perform detailed management from here.

---

# 4. Connections

This page manages all connected social media accounts.

Initially, it only supports Meta.

The page contains:

### Connected Accounts

Each connected account displays:

* Facebook Page name
* Instagram Business account
* Connection status
* Last synchronization time
* Webhook status

### Actions

Users can:

* Connect a new Meta account
* Reconnect expired accounts
* Disconnect accounts
* Refresh permissions

In future versions, this page can expand to include WhatsApp, Telegram, TikTok, LinkedIn, etc.

---

# 5. Conversations

This is the primary page of the application where users spend most of their time.

The layout should consist of three sections.

### Conversation List

Displays all conversations.

Each item shows:

* Customer name
* Platform icon (Messenger or Instagram)
* Last message preview
* Last activity time
* AI status
* Unread indicator

Users can search and filter conversations.

---

### Conversation View

Displays the full message history.

Users can:

* Read messages
* Send manual replies
* View AI-generated replies
* Upload attachments (optional for MVP)

---

### Customer Information

A sidebar containing customer information.

Display:

* Customer name
* Profile picture
* Platform
* First contact date
* Total messages
* AI enabled/disabled for this conversation

This panel can later include CRM information.

---

# 6. AI Configuration

This page controls how the AI behaves for the organization.

It should contain the following sections.

### AI Status

A simple switch to enable or disable AI for the organization.

### Reply Mode

Users choose between:

* Automatic replies
* Draft replies requiring approval

### AI Model

Select which language model to use.

### Prompt

A large text editor where users define the AI's behavior.

Example:

* Company description
* Communication style
* Rules
* Things AI should avoid
* Response language

### Response Parameters

Basic settings such as:

* Temperature
* Maximum response length

This page is intentionally simple. Advanced prompt builders and multiple agents can be added later.

---

# 7. Knowledge Base

This page provides information that the AI can reference while responding.

Users can upload:

* PDF documents
* DOCX files
* TXT files

Alternatively, they can paste text directly into the application.

Each document displays:

* Name
* Upload date
* Status
* Delete option

Later versions can introduce folders, websites, FAQs, and syncing with external knowledge sources.

---

# 8. Organization Settings

This page contains general business information.

Users can update:

* Organization name
* Logo
* Default language
* Timezone

These settings affect the AI and conversation timestamps.

---

# 9. Team (Optional for MVP)

If you support multiple users from the start, include a simple team management page.

Users can:

* Invite members
* Remove members
* View member list

Initially, two roles are enough:

* Owner
* Member

More advanced permissions can be added later.

---

# 10. Profile

Each user should have a personal profile page where they can manage their own account.

Settings include:

* Name
* Email
* Password
* Profile picture
* Notification preferences

This page is separate from organization settings because one user may belong to multiple organizations in the future.

---

# 11. Billing (Placeholder)

Even if billing isn't implemented immediately, include a placeholder page.

Eventually, it will contain:

* Current subscription
* Message usage
* AI usage
* Payment methods
* Invoices

This avoids redesigning the navigation later.

---

# Navigation Structure

The application's navigation should be organized around the user's workflow rather than technical features:

1. **Dashboard** – Overview of account health and recent activity.
2. **Conversations** – The main workspace for reading and responding to messages.
3. **Connections** – Connect and manage Meta accounts.
4. **AI** – Configure AI behavior and prompts.
5. **Knowledge Base** – Manage documents and business information used by the AI.
6. **Organization** – Business details and team management.
7. **Profile** – Personal account settings.
8. **Billing** – Subscription and usage (optional initially).
