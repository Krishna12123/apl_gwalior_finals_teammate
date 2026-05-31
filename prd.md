# Product Requirements Document (PRD)

## Product Name

SchemeAI – AI-Powered Government Scheme Recommendation Platform

---

## 1. Problem Statement

Millions of citizens are unaware of government schemes they are eligible for. Existing government portals require users to manually search and understand eligibility criteria, making the process difficult and time-consuming.

Challenges:

* Users do not know which schemes apply to them.
* Eligibility requirements are difficult to understand.
* Application processes are complex.
* Important benefits remain unclaimed.

---

## 2. Vision

Build an AI-powered platform that automatically identifies government schemes relevant to a citizen based on their profile and provides personalized recommendations, eligibility explanations, required documents, and application guidance.

---

## 3. Target Users

### Primary Users

* Students
* Farmers
* Job seekers
* Senior citizens
* Women
* Persons with disabilities

### Secondary Users

* NGOs
* Government help centers
* Educational institutions

---

## 4. Objectives

### Business Objectives

* Simplify scheme discovery.
* Increase awareness of government benefits.
* Improve accessibility for citizens.

### User Objectives

* Find eligible schemes quickly.
* Understand eligibility requirements.
* Access application information easily.

---

## 5. Core Features

### User Authentication

* Google Sign-In
* Email & Password Login

### User Profile

Users provide:

* Name
* Age
* Gender
* State
* District
* Category
* Occupation
* Annual Income
* Disability Status

### Scheme Recommendation Engine

Automatically match schemes based on:

* Age
* Income
* Category
* Occupation
* State
* Gender

### AI Recommendation Layer

Generate personalized explanations such as:

"Based on your profile as an 18-year-old OBC student from Madhya Pradesh, these schemes provide scholarship and skill development benefits."

### Scheme Details Page

Display:

* Description
* Benefits
* Eligibility
* Required Documents
* Official Application Link

### AI Chat Assistant

Example queries:

* Which schemes are available for farmers?
* What scholarships can I apply for?
* What documents are required?

### Saved Schemes

* Users can bookmark schemes for later review.

### Application Guidance

Show:

* Required documents
* Eligibility checklist
* Step-by-step application instructions

---

## 6. Premium Features (Future Scope)

### AI Form Filling Assistant

Guide users while filling government forms.

### Application Deadline Alerts

Notifications for:

* New schemes
* Upcoming deadlines
* Profile-based recommendations

### Scheme Comparison

Compare multiple schemes side by side.

### Multilingual Support

* English
* Hindi
* Regional languages

---

## 7. User Journey

### Step 1

User signs up.

### Step 2

User completes profile.

### Step 3

System stores data in Firebase.

### Step 4

Recommendation engine filters schemes.

### Step 5

AI explains best scheme matches.

### Step 6

User views scheme details.

### Step 7

User saves or applies.

---

## 8. Functional Requirements

### Authentication

* Register
* Login
* Logout

### Profile Management

* Create profile
* Edit profile

### Scheme Search

* Search by keyword
* Search by category

### Recommendation Engine

* Eligibility matching
* Ranking system

### AI Assistant

* Natural language queries
* Personalized responses

### Data Storage

* User data
* Scheme data
* Search history
* Saved schemes

---

## 9. Non-Functional Requirements

### Performance

* Recommendations within 2 seconds

### Scalability

* Support 10,000+ users

### Security

* Firebase Authentication
* Firestore Security Rules

### Accessibility

* Mobile responsive
* Simple UI

---

## 10. Technical Architecture

Frontend:

* React.js
* Tailwind CSS
* Framer Motion
* React Router

Backend:

* Firebase Authentication
* Firestore Database
* Firebase Hosting

AI Layer:

* Gemini API
* RAG Pipeline

Database Collections:

users

* userId
* profile data

schemes

* scheme information

savedSchemes

* user bookmarks

searchHistory

* previous searches

---

## 11. Success Metrics

* Number of registered users
* Number of scheme recommendations generated
* Saved scheme count
* AI chat usage
* User satisfaction score

---

## 12. Future Roadmap

Phase 1:

* Authentication
* Profile creation
* Recommendation engine
* AI chatbot

Phase 2:

* Notifications
* Saved schemes
* Application guidance

Phase 3:

* AI form filling
* Regional languages
* Mobile application

---

## One-Line Pitch

"SchemeAI helps citizens discover and apply for government schemes through AI-powered personalized recommendations and eligibility matching."
