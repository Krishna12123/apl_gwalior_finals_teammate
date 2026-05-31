# Architecture Document

# SchemeAI Architecture

## Overview

SchemeAI is an AI-powered government scheme recommendation platform that helps citizens discover schemes they are eligible for based on their profile information.

The system uses:

* React.js for frontend
* Firebase for backend services
* Gemini API for AI recommendations
* Firestore for storing users and schemes
* RAG (Retrieval-Augmented Generation) for accurate scheme recommendations

---

# High Level Architecture

```text
┌─────────────────┐
│     User        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ React Frontend  │
│ Tailwind CSS    │
│ Framer Motion   │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│ Firebase Authentication      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Firestore Database           │
│                              │
│ Users Collection             │
│ Schemes Collection           │
│ Saved Schemes Collection     │
│ Search History Collection    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Eligibility Engine           │
│ Age Filter                   │
│ Income Filter                │
│ Category Filter              │
│ State Filter                 │
│ Occupation Filter            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ RAG Retrieval Layer          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Gemini API                   │
│ AI Recommendation Engine     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Personalized Recommendations │
└──────────────────────────────┘
```

---

# Frontend Architecture

## Technology Stack

* React.js
* React Router
* Tailwind CSS
* Framer Motion

## Pages

### Landing Page

Purpose:

* Explain platform
* Login / Signup

### Dashboard

Purpose:

* Show recommendations
* Quick actions

### Profile Page

Purpose:

* Collect user information

### Scheme Details Page

Purpose:

* Show complete scheme details

### Saved Schemes Page

Purpose:

* Show bookmarked schemes

### AI Assistant Page

Purpose:

* Chat with AI

---

# Backend Architecture

## Firebase Authentication

Supports:

* Email Login
* Google Login

Responsibilities:

* User Registration
* Login
* Session Management

---

# Database Architecture

## Users Collection

```json
{
  "uid": "123",
  "name": "Krishna",
  "age": 18,
  "gender": "Male",
  "category": "OBC",
  "income": 200000,
  "state": "Madhya Pradesh",
  "occupation": "Student"
}
```

---

## Schemes Collection

```json
{
  "schemeId": "SCH001",
  "name": "Scholarship Scheme",
  "state": "MP",
  "category": ["OBC"],
  "ageMin": 18,
  "ageMax": 25,
  "incomeLimit": 300000,
  "benefits": "Financial Assistance",
  "documents": [
    "Aadhaar",
    "Income Certificate"
  ],
  "applyLink": "url"
}
```

---

## Saved Schemes Collection

```json
{
  "userId": "123",
  "schemeId": "SCH001",
  "savedAt": "timestamp"
}
```

---

## Search History Collection

```json
{
  "userId": "123",
  "query": "Scholarships for OBC students",
  "timestamp": "timestamp"
}
```

---

# Recommendation Engine

## Input

User Profile:

* Age
* Gender
* Category
* Occupation
* Income
* State

## Process

Step 1:
Retrieve all schemes

Step 2:
Apply filters

```javascript
age >= ageMin
```

```javascript
age <= ageMax
```

```javascript
income <= incomeLimit
```

```javascript
category match
```

```javascript
state match
```

Step 3:
Generate eligible scheme list

## Output

Filtered schemes

---

# AI Layer

## Purpose

Convert filtered results into human-friendly recommendations.

Example:

Input:

```text
User:
18 Year Old
OBC
Student
MP
```

Output:

```text
You are eligible for 5 schemes.

The most beneficial schemes are:
1. Scholarship Scheme
2. Skill Development Scheme

These are recommended because you are an OBC student with income below the eligibility threshold.
```

---

# RAG Architecture

## Why RAG?

Prevents hallucination.

AI only answers using stored scheme data.

## Flow

```text
User Question
       │
       ▼
Retrieve Relevant Schemes
       │
       ▼
Build Context
       │
       ▼
Send To Gemini
       │
       ▼
Generate Response
```

Example:

Question:

"Which schemes are available for OBC students?"

Retrieved:

* Scholarship A
* Scholarship B
* Skill Development Scheme

Gemini generates answer based only on retrieved data.

---

# Security Architecture

## Authentication

Firebase Authentication

## Database Rules

Users can:

* Read own profile
* Update own profile

Users cannot:

* Access other user profiles

Admin can:

* Manage schemes

---

# Deployment Architecture

```text
React Frontend
      │
      ▼
Firebase Hosting
      │
      ▼
Firestore
      │
      ▼
Gemini API
```

---

# Future Architecture

Phase 2

* Push Notifications
* Deadline Reminders
* Saved Searches

Phase 3

* Voice Assistant
* Regional Languages
* Mobile App

---

# Architecture Goals

* Fast recommendations
* Scalable architecture
* Secure user data
* AI-powered personalization
* Easy deployment using Firebase
* Minimal backend complexity for hackathon development
```
