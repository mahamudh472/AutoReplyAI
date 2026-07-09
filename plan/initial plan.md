# MVP v1 - AI Social Manager

## 1. Authentication

Simple authentication.

* Email & Password
* Google Login
* Forgot Password

---

## 2. Organizations

A user can own multiple businesses.

Example

```
Mahmud

    → ABC Store
    → XYZ Agency
```

Each organization has

* Name
* Logo
* Timezone
* Language

---

## 3. Meta Connection

Support only Meta.

User connects

* Facebook Page
* Messenger
* Instagram Business

Store

* Access Token
* Page ID
* Instagram ID
* Token Expiry
* Webhook Status

Dashboard shows

```
Facebook

Connected ✅

Instagram

Connected ✅

Last Sync

5 minutes ago
```

---

## 4. Conversation Inbox

Simple inbox.

Conversation List

```
John

Hello

2m ago

--------

Emily

Need help

15m ago
```

Conversation page

```
Customer

Messages

Input Box

AI Status
```

Search

Unread filter

That's enough.

---

## 5. AI Settings

Very simple.

### AI Enabled

```
☑ Enable AI
```

---

### AI Mode

```
Automatic

Draft Only
```

Automatic

AI replies immediately.

Draft

AI creates reply.

User clicks Send.

---

## 6. Prompt Configuration

Only one prompt.

```
You are customer support assistant for ABC Store.

Always be polite.

Don't discuss politics.

Answer based on our products.
```

No complicated prompt builder.

---

## 7. Knowledge Base

Keep it tiny.

Upload

* PDF
* DOCX
* TXT

or

Paste text

Example

```
Shipping Policy

Refund Policy

Opening Hours

FAQ
```

AI searches these.

---

## 8. Conversation Controls

This is one of your main selling points.

For every conversation

```
AI Enabled

ON
```

or

```
OFF
```

Meaning

Conversation A

AI answers.

Conversation B

Human answers.

---

Also add

```
Pause AI
```

Very useful.

---

## 9. AI Models

Just allow selecting model.

```
GPT-5.5

GPT-4.1

Claude

Gemini
```

Temperature

Max Tokens

That's it.

---

## 10. Basic Analytics

Only

```
Messages Today

AI Replies

Human Replies

Open Conversations
```

No charts needed initially.

---

## 11. Settings

Business Name

Timezone

Language

Support Email

---

## 12. Team Members (Optional)

Owner

Member

Nothing more.

---

# Dashboard

```
----------------------------------------

Organization

ABC Store

----------------------------------------

Meta

Connected

----------------------------------------

Today's Messages

45

----------------------------------------

AI Enabled

YES

----------------------------------------

Open Conversations

12

----------------------------------------

Unread

5

----------------------------------------
```

---

# Conversation Page

```
-------------------------------------

John

Online

-------------------------------------

Hello

Hi

Need help

Sure

-------------------------------------

☑ AI Enabled

Prompt Used

Default

-------------------------------------

Reply Box
```

---

# Settings

```
General

Connections

AI

Knowledge Base

Team

Billing
```

---

# What NOT to Build Yet

❌ Multiple AI agents

❌ Workflow builder

❌ CRM

❌ Calendar

❌ Ticket system

❌ Product catalog

❌ Sentiment analysis

❌ AI memory

❌ Advanced analytics

❌ Custom tools

❌ Prompt versioning

❌ Automation rules

❌ Lead scoring

❌ Multi-channel support

❌ API marketplace

---

# Suggested Development Roadmap

### Phase 1 (MVP)

* User authentication
* Organizations
* Meta connection
* Webhooks
* Conversation inbox
* AI auto-reply
* Prompt configuration
* Knowledge base
* Conversation-level AI toggle

### Phase 2

* WhatsApp Business
* Team members
* Conversation tags
* Assign conversations
* Basic analytics
* Subscription plans

### Phase 3

* Multiple AI agents
* Workflow automation
* CRM integrations
* Custom actions
* AI summaries
* Advanced reporting
