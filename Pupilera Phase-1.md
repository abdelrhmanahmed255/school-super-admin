

# **K-12 Education Platform**

## **Product Requirements Specification — Simple Edition**

**Purpose of this document:** Describe every feature of the platform in plain language — what it does, who uses it, and how it works end-to-end — so that any developer or team can rebuild this application using any technology they choose.

---

## **1\. What Is This Platform?**

This is a **multi-tenant cloud platform** for K-12 schools. One platform serves many schools at the same time, with every school’s data completely separate from others.

The platform combines two things:

* **School Management System (SMS):** Handles the administrative side — students, staff, fees, HR, transport, library, inventory.

* **Learning Management System (LMS):** Handles the academic side — courses, lessons, assignments, exams, grades, curriculum.

A school subscribes to the platform and gets its own isolated workspace. Students, teachers, parents, and admins all log in to the same platform but see only their school’s data through their role-specific portal.

### **What problems does it solve?**

|  |  |
| :---- | :---- |
| Manual grade calculation | Grades are calculated automatically with weighted averages |
| Lost invoices and payments | Full digital fee management with payment history |
| Disconnected curriculum materials | Centralized curriculum library shared across all classes of the same grade |
| Repetitive exam creation | Question bank lets teachers reuse and mix verified questions |
| Slow admissions process | Online application with digital review workflow |

---

## **2\. Who Uses It?**

### **2.1 User Types**

| Role | Who they are | What they primarily do |
| :---- | :---- | :---- |
| **Super Admin** | Platform owner (company running the SaaS) | Manages all schools on the platform |
| **School Admin** | School principal or IT manager | Configures the school, manages all data |
| **Academic Coordinator** | Head of academic affairs | Manages curriculum, courses, and content approval |
| **Student Affairs** | Student welfare officer | Manages conduct records, at-risk students |
| **Teacher** | Subject teacher | Teaches courses, creates assignments and exams, marks attendance, enters grades |
| **Student** | Enrolled student | Views lessons, submits assignments, takes exams, views grades |
| **Finance Staff** | Accountant or billing officer | Manages invoices, payments, and financial reports |
| **HR Staff** | Human resources officer | Manages staff records, leave, payroll |
| **Receptionist** | Front desk / admissions assistant | Processes admission applications |

## **3\. Core Concepts**

Understanding these core concepts is essential before reading any feature.

### **School**

A school is the top-level tenant. Every piece of data belongs to exactly one school. Users can only see data from their own school (except Super Admins who see all schools).

### **Academic Year**

A school year (e.g., 2025–2026). Most records (grades, report cards, enrollments) are linked to an academic year. Schools can have multiple active years if they are mid-transition.

### **Semester / Term**

A division of the academic year (e.g., Term 1 and Term 2). Grades and attendance can be calculated per semester.

### **Educational Stage**

A grouping of grade levels (e.g., Primary, Preparatory, Secondary). Each stage covers several consecutive grade levels.

### **Grade Level**

A year of study (e.g., Grade 1, Grade 5, Grade 10). A grade level belongs to a stage.

### **Class (Section)**

A specific group of students within a grade level (e.g., Grade 5-A, Grade 5-B). A class has one primary teacher and multiple enrolled students.

### **Subject**

An area of study (e.g., Mathematics, Arabic, Science). Subjects are assigned to grade levels and taught by teachers.

### **Course**

The actual delivery of a subject to a specific class by a specific teacher in a specific academic year. One subject can have many courses (one per class). Courses contain units and lessons.

### **Lesson**

A single teaching session within a course unit. Lessons have content (videos, PDFs, text, links).

---

## **4\. The Four Portals  ( 3 )**

The platform has five separate front-end areas. Each is designed for a different type of user.

### **Portal 1: Admin Portal**

**Who:** School Admin, Academic Coordinator, Student Affairs, Finance Staff, HR Staff, IT Admin, Librarian, Transport Manager, Inventory Manager, Receptionist

**What it covers:** Everything — all modules are accessible here based on the user’s role permissions.

---

### **Portal 2: Teacher Portal**

**Who:** Teachers (and Montadab/floating teachers)

**What it covers:** Their assigned courses, attendance marking, assignment creation and grading, exam creation and grading, grade entry, schedule view, chat with students and parents, curriculum materials for their subjects.

---

### **Portal 3: Student Portal**

**Who:** Students

**What it covers:** Their enrolled courses, lesson content, assignment submission, exam taking, grade viewing, attendance history, schedule, announcements, chat with teachers, curriculum library.

---

### **Portal 4: Super Admin Portal**

**Who:** Platform operator (Anthropic/SaaS company)

**What it covers:** All schools, subscription management, system-wide settings, usage analytics.

---

## **5\. Module: School Setup ( 2 )**

### **What it is**

The first thing a Super Admin does after creating a school account is configure it. This module covers all the foundational settings that everything else depends on.

### **Who uses it**

Super Admin (initial setup), School Admin (ongoing)

### **What you can do**

* Create and configure a school (name, logo, address, phone, website, country, timezone, language) 

* Set the school’s educational stages (Primary / Preparatory / Secondary)

* Define grade levels within each stage

* Create subjects for each grade level

* Define academic years with start and end dates

* Define semesters within each academic year

* Create classes (sections) within each grade level

* Configure the school’s grading scale (e.g., A=90-100, B=80-89, etc.)

* Set the default language (Arabic, English, or bilingual)

* Configure working days and school holidays

* Set subscription tier and feature flags

### **Full cycle**

**Step 1 — Platform onboarding:** Super Admin creates the school on the platform, sets the subscription tier, and sends login credentials to the School Admin.

**Step 2 — Basic configuration:** School Admin logs in and sets up: school name, logo, contact information, timezone, and language preference.

**Step 3 — Academic structure:** School Admin defines educational stages → grade levels → subjects. For example: Stage “Primary” → Grade 1 through Grade 6 → subjects Mathematics, Arabic, English, Science, Social Studies for each grade.

**Step 4 — Academic year:** School Admin creates the current academic year (e.g., 2025–2026) and divides it into semesters (e.g., Term 1: Sep–Jan, Term 2: Feb–Jun).

**Step 5 — Classes:** School Admin creates class sections for each grade level (e.g., Grade 4-A, Grade 4-B, Grade 4-C).

**Step 6 — Grading scale:** School Admin configures how letter grades and GPA are calculated (e.g., 90–100 \= A+, GPA 4.0).

**Step 7 — Ready:** The school is now configured and teachers/students can be added.

---

## **4\. Module: User & Account Management ( 1 )** 

### **What it is**

Creating and managing accounts for all users — students, teachers, and staff — with the right roles and permissions.

### **Who uses it**

School Admin, HR Staff (for staff), Receptionist (for students/parents during admission)

### **What you can do**

* Create user accounts individually or import in bulk via Excel

* Assign roles (teacher, student, parent, etc.)

* Link students to parents (one student can have two parents; one parent can have multiple children)

* Deactivate accounts (soft delete — data is preserved)

* Reset passwords

* Upload profile photos

### **User profile details**

* **Student profile:** 

*  Date of birth,

*  national ID type and number,

*  blood type,

*  disability notes,

*  previous school,

*  bus route assignment

* **Teacher profile:**

*  Qualifications,

*  Specialization,

*  teaching years,

*  professional certifications,

*  national ID

* **Parent profile:**

*  Relationship to student,

*  national ID,

*  job title, employer

### **Full cycle**

**Creating a student account:**

1. Admin creates a user account with role \= Student

2. Fills in the student’s personal details (name, date of birth, national ID)

3. Assigns the student to a class (this creates an enrollment record for the current academic year)

4. Creates or links a parent account — sets the relationship type (father, mother, guardian)

5. The student receives login credentials via email 

6. Student can log in immediately to their respective portals

**Bulk import:** 1\. Admin downloads the Excel template from the import page 2\. Fills in all student or staff data 3\. Uploads the file — system validates each row 4\. Errors are shown (e.g., duplicate national ID, missing required field) 5\. Valid rows are created; error rows are skipped and listed for correction

**Custom role creation:** 1\. Admin navigates to Roles & Permissions 2\. Creates a new role with a name (e.g., “Department Head”) 3\. Toggles on/off specific permissions from the full list of \~40 permissions 4\. Assigns the role to relevant users

---

## **5\. Module: Student Admissions ( 1 )**

### **What it is**

An online application and review process for new students who want to join the school.

### **Who uses it**

* Parents/applicants (submit the application)

* Receptionist and School Admin (review and process)

* Student Affairs (final enrollment)

### **What you can do**

* Online application form accessible without an account

* Track application status through multiple stages

* Upload supporting documents (birth certificate, previous report cards, etc.)

* Schedule interviews or entrance exams

* Accept or reject applications with reasons

* Auto-create student and parent accounts on acceptance

### **Application stages**

PENDING\_REVIEW → UNDER\_REVIEW → INTERVIEW\_SCHEDULED → ACCEPTED → ENROLLED  
                                                      ↘ REJECTED

### **Full cycle**

**Step 1 — Application submitted:** A parent visits the school’s application page and fills in the form:

* student name,  
*  date of birth,  
*  desired grade level,  
*  parent contact details,  
*  uploads required documents.

**Step 2 — Initial review:**admin receives a notification of the new application. They open it, review the documents, and either move it to “Under Review” or request more information.

**Step 3 — Interview (optional):** Admin schedules an interview or entrance exam. The status changes to “Interview Scheduled.” The parent is notified via email with the date and time.

**Step 4 — Decision:** After the interview, the admin marks the application as: \- **Accepted** — generates an enrollment number, notifies the parent with acceptance details \- **Rejected** — sends a rejection notification with optional reason

**Step 5 — Enrollment:** Once accepted, a staff member creates the student’s user account from the application data (no re-entry needed). The student is assigned to a class. The parent account is created and linked. The family receives login credentials.

**Step 6 — Finance trigger:** As soon as the student is enrolled, the finance system looks up the applicable fee structure for the student’s grade level and automatically generates the first invoice.

---

## **6\. Module: Curriculum Library ( 3 )**

### **What it is**

A central, school-wide library of official curriculum materials — textbooks, teacher videos, summaries, worksheets — organized by subject and grade level. Unlike courses (which belong to one teacher’s class), curriculum content is shared across **all sections of the same grade**.

### **Who uses it**

* School Admin / Academic Coordinator (uploads official ministry curriculum PDFs)

* Teachers (upload videos, summaries, worksheets; access all materials for their subject)

* Students (access all approved materials for their grade level)

### **Content types**

| Type | Description | Who uploads |
| :---- | :---- | :---- |
| Official Curriculum | Ministry-issued PDF textbooks | Admin |
| Teacher Video | Video lesson recorded or linked by a teacher | Teacher |
| Summary Resource | Notes, summaries, worksheets | Teacher or Admin |

### **Media attached to lessons**

Each curriculum lesson can have multiple media items attached: \- A teacher’s explanation video \- A worksheet PDF \- An official summary document \- An external link (e.g., educational YouTube video)

### **What teachers can do**

* Browse all curriculum materials for their subject/grade

* Upload their own videos or resources (pending admin approval)

* Link their lesson content back to the official syllabus

### **What students can do**

* Browse all published curriculum materials for their grade and subjects

* Watch videos with progress saved (resume from last position)

* Download PDFs

* See “Jump Back In” — a widget showing recently accessed content

### **Full cycle**

1. Admin uploads the official Math Grade 5 textbook PDF

2. Admin reviews the proposal, adjusts any page ranges or lesson names, and approves

3. The structured syllabus is now visible to all Math Grade 5 teachers and students

4. A teacher records a video explaining Lesson 1 and uploads it to the lesson

5. Students can now browse the official PDF, watch the teacher’s explanation video, and download the worksheet — all in one place

---

## **7\. Module: Assignments  ( 2 )**

### **What it is**

Teachers create homework, projects, quizzes, and other tasks that students submit — digitally. The system tracks submissions, applies late penalties. 

### **Who uses it**

* Teachers (create assignments, grade submissions)

* Students (view and submit assignments)

* Parents (view their child’s assignment status and grades)

### **Assignment types**

* Homework

* Quiz

* Project

* Lab Report

* Reading

* Practice

### **What teachers can do**

* Create an assignment with: title, description, instructions, due date, maximum score

* Attach reference files (PDFs, images, etc.)

* Publish or save as draft

* View all submissions and their status

* Grade each submission — write comments and give a score

### **What students can do**

* See all upcoming and past assignments in their course dashboard

* View assignment instructions and download attached files

* Submit: upload files

* See their submission status (Draft / Submitted / Late / Graded)

* View their grade and teacher feedback after grading

### **Grading flow**

Student submits assignment  
      Grading → Teacher grades manually (input field for grade)and adds feedback comments  
  → Final score saved → notification sent to student and parent

### **Full cycle**

1. Teacher creates assignment “Chapter 3 Summary” for Grade 5-A Math course, due in 3 days, max score 50 points

2. Assignment appears immediately in all Grade 5-A students’ course page

3. Each student gets a notification: “New assignment: Chapter 3 Summary, due in 3 days”

4. Students submit their work (upload PDF or image) before the deadline

5. After the deadline, the teacher opens the submissions list — sees who submitted, who hasn’t submitted

6. Teacher clicks a submission → sees the student’s work

7. Teacher grades each submission and adds feedback comments

8. Each student gets notified: “Your assignment has been graded: 44/50”

9. A grade entry is automatically created in the Grades module (source: this assignment)

---

## **8\. Module: Grades & Report Cards ( 4 )**

### **What it is**

The central record of every student’s academic performance. Grades are recorded per subject, per assessment type, and per semester. At the end of a term, all grades are aggregated into a Report Card.

### **Who uses it**

* Teachers (enter assignment and quiz grades)

* School Admin / Student Affairs (enter midterm and final exam grades)

* Students (view their grades)

* Finance Staff (can block report card access for unpaid invoices)

### **Grade types**

* Assignment, Quiz, Project (teachers can enter these)

* Participation, Extra Credit (teachers can enter these)

* Midterm, Final Exam (admin/student affairs can enter these — restricted role)

### **How grades work**

Every graded item — whether it’s an assignment, a quiz, or an exam — creates a grade entry. Each entry has: \- Score and maximum score \- A percentage (auto-calculated) \- A letter grade (based on the school’s grading scale) \- A weight (how much it counts toward the final average) \- The source (which assignment or exam it came from)

The system calculates a **weighted average** across all grades for a subject to produce the final subject grade.

### **Grade audit trail**

Every time someone changes a grade (corrects a score, modifies a weight), the old and new values are recorded in an immutable audit log with the editor’s name and timestamp. This protects against unauthorized changes.

### **Report Cards**

At the end of a semester, the admin generates report cards: \- Shows each subject’s final grade, letter grade, and GPA contribution \- Overall GPA and class rank \- Teacher comments and principal comments \- Generated as a printable PDF (bilingual — Arabic and English)

### **Report card access control**

* Parents can view report cards **only if there are no unpaid invoices** for their child

* If an invoice is unpaid, the parent sees a message: “Please settle your outstanding balance to access the report card”

* Once payment is made, access is granted automatically

### **Full cycle**

1. Teacher grades 30 assignment submissions — each creates a grade entry (type: Assignment, source: Assignment ID)

2. Teacher administers a weekly quiz — quiz results create grade entries (type: Quiz)

3. Admin enters midterm scores (restricted to Admin/Student Affairs role)

4. At the end of the term, admin clicks “Generate Report Cards”

5. System calculates: Final Grade \= (Assignments × 20%) \+ (Quizzes × 20%) \+ (Midterm × 30%) \+ (Final × 30%)

6. Report card PDF is generated for each student

7. Report cards are published 

8. If they have an unpaid invoice, they see the payment prompt; otherwise they see and can download the PDF

---

## **9\. Module: Class Scheduling & Timetable ( 2 )**

### **What it is**

Defining when each subject is taught for each class, so teachers and students know their daily and weekly schedules.

### **Who uses it**

* School Admin (creates and manages schedules)

* Academic Coordinator (reviews for conflicts)

* Teachers (view their own schedule)

* Students (view their class schedule)

### **What a schedule contains**

* Day of week (Sunday through Thursday, for example)

* Period number (1st period, 2nd period, etc.)

* Start and end time for each period

* Which subject is taught in each period

* Which teacher teaches it

* Which room it takes place in (optional)

### **Conflict detection**

The system automatically detects: \- A teacher scheduled for two classes at the same time \- A room booked for two classes at the same time \- Conflicts are flagged for admin resolution

### **Schedule changes**

When a schedule needs to be changed temporarily (e.g., a teacher is absent): \- Admin creates a schedule change record for a specific date \- Substitution assigned: another teacher covers the class \- Affected students and parents are notified of the change

### **Full cycle**

1. Admin opens the Schedule Builder for Grade 5-A

2. For each period in the week, admin assigns: subject \+ teacher \+ room

3. System checks for conflicts — alerts if a teacher is double-booked

4. Admin resolves conflicts and finalizes the schedule

5. The schedule is published — students can view it in their portal

6. Mid-term: Math teacher requests leave for 3 days

7. Admin creates schedule changes for those 3 days, assigns a substitute teacher

8. All Grade 5-A students receive a notification: “Schedule change: Math on Feb 20 will be taught by Mr. Hassan”

---

## **10\. Module: Announcements ( 4 )**

### **What it is**

A broadcast communication tool for the school to publish official messages to specific groups of people.

### **Who uses it**

* School Admin, Academic Coordinator, Teachers (create announcements)

* Students, Staff (receive and read announcements)

### **Priority levels**

| Priority | Display | Delivery |
| :---- | :---- | :---- |
| **Low** | In feed only | In-app notification |
| **Normal** | In feed \+ banner | In-app push |
| **Important** | Banner \+ email | Push \+ email |
| **Urgent** | Pop-up modal (must acknowledge) | Push \+ email  |

### **Targeting**

Announcements can be sent to: \- Everyone in the school \- Specific grade level (e.g., all Grade 5 students and parents) \- Specific class (e.g., Grade 5-A only) \- Staff only 

### **Attachments**

Announcements can include files (PDFs, images) that recipients can download.

### **Auto-generated announcements**

Some events automatically create announcements without admin action: \- Exam schedule published → automatically creates an “Important” announcement to all students 

### **Full cycle**

1. Principal wants to announce a school trip

2. Admin navigates to Announcements → New Announcement

3. Fills in: Title, message body, attaches permission slip PDF

4. Sets priority \= Important, targets Grade 5 students and parents

5. Publishes

6. All Grade 5 students receive a push notification \+ email: “New announcement: School Trip \- Permission Required”

7. Users open the announcement, read it, download the PDF

---

## **11\. Module: Notifications ( 4 )**

### **What it is**

An automated system that sends alerts to users when important events happen. Unlike announcements (which are written by humans), notifications are triggered automatically by system events.

### **Who uses it**

Everyone — every user type receives notifications relevant to their role.

### **Notification types**

| Category | Notification |
| :---- | :---- |
| Academic | New assignment, assignment due soon, assignment graded, new grade, new course content |
| Exams | New exam posted, exam reminder, exam result available |
| Communication | New announcement, new chat message |
| Schedule | Schedule changed |
| Finance | payment received, payment reminder |
|  |  |
|  |  |
|  |  |
| Content | Course submitted for review, approved, returned, published |
| Admissions | New application received |

### **Delivery channels**

Each notification can be delivered through multiple channels simultaneously: \- **In-app notification** (bell icon in the portal) — always \- **Push notification** (mobile app or browser) — configurable \- **Email**

---

## **12\. Module: Finance & Fees ( 5 )**

### **What it is**

The complete financial management system for the school — from setting up fee structures to tracking payments, managing discounts, and generating accounting reports.

### **Who uses it**

* Finance Staff (manage all financial operations)

* School Admin (view financial reports)

### **What the finance module covers**

**Fee Structures:** Define what fees apply to which grade levels and their amounts (e.g., “Grade 5 Annual Tuition: 15,000 EGP”, “Bus Fee: 3,000 EGP”).

**Invoices:** Generated automatically when a student enrolls or manually by finance staff. An invoice lists the fees due, the due date, and the payment status.

**Payment Plans:** Instead of one lump sum, a family can pay in installments. Each installment has its own due date and status.

### **Full cycle**

1. Student enrolls in Grade 5 in September

2. Finance module detects the enrollment and auto-generates an invoice: “Annual Tuition: 15,000 EGP \+ Activity Fee: 500 EGP \= 15,500 EGP, due Oct 1”

3. General Ledger records the debit and credit entries automatically

---

## **13\. Module: Human Resources (HR) ( 5 )**

### **What it is**

Managing all staff-related operations — employment records

**Who uses it**

* HR Staff (manage all HR operations)

* School Admin (view reports)

### **What the HR module covers**

**Staff Records:** Complete employment profile for each staff member — department, designation, contract type, start date, salary.

**Departments & Designations:** Define the organizational structure (e.g., Math Department, Primary School Division) and job titles (Teacher, Senior Teacher, Department Head).

**Staff Documents:** Securely store staff documents (contracts, certificates, ID copies).

---

## **14\. Module: Analytics & Dashboard ( 5 )**

### **What it is**

A real-time overview of what’s happening across the school, with data pulled from all modules.

### **Who uses it**

* School Admin (full overview)

* Teachers (their class and subject performance)

* Finance Staff (financial metrics)

* HR Staff (staff attendance and leave metrics)

### **Dashboard sections by role**

**School Admin dashboard:** \- Total students enrolled, total staff \- Outstanding invoices \- Upcoming exams this week \- At-risk students count (with link to full list) \- Recent announcements \- Recent admission applications

**Teacher dashboard:** \- Their classes’ attendance for today \- Assignments pending grading \- Exam results summary for their last exam \- Course completion rate for their courses \- Students with low grades in their subject

**Finance dashboard:** \- Total collected this month vs target \- Overdue invoices list 

**Student dashboard:** \- Today’s schedule \- Upcoming assignments and due dates \- Recent grades \- “Jump Back In” (last studied curriculum content)

**Reports (exportable)**

* Student academic performance per subject per term (Excel)

* Class attendance report (Excel)

* Financial collection report (Excel)

* At-risk student report (Excel)

---

## **16\. Feature Lifecycle Cycles**

This section shows how different features work **together** in complete end-to-end journeys. This is how data flows through the system as real school activities happen.

---

### **Cycle 1: New Student Joins the School**

From online application to first fee invoice, everything automated.

STEP 1 — Parent submits online application  
  → No account needed — public form  
  → Uploads: birth certificate, previous report card  
  → Status: Pending Review

STEP 2 — Admissions team reviews  
  → Receptionist moves to "Under Review"  
  → Optionally schedules an interview

STEP 3 — Decision made  
  → Accepted: enrollment number generated, parent notified by email  
  → Rejected: reason sent to parent

STEP 4 — Accounts created  
  → Student account created from application data (no re-entry)  
  → receive login credentials via email

STEP 5 — Student enrolled in class  
  → Admin assigns student to Grade 5-A  
  → Enrollment record created for current academic year

STEP 6 — Finance triggered automatically  
  → System finds fee structure for Grade 5  
  → Generates first invoice: "Annual Tuition 15,500 EGP, due Oct 1"  
  → Parent receives notification

STEP 7 — LMS enrollment  
  → Student automatically enrolled in all active courses for Grade 5-A  
  → Student can immediately access lesson content

---

### **Cycle 2: Teacher Assigns Homework → Grades It → students Sees the Result**

STEP 1 — Teacher creates assignment  
  → "Chapter 3 Summary" — due in 3 days, max 50 points  
  → Attaches PDF or image  
  → Publishes

STEP 2 — Students notified  
  → All enrolled students get: "New assignment due in 3 days"

STEP 3 — Students submit  
  → Students upload their work (PDF or image )  
  → Submission status: Submitted / Late / Not Submitted

STEP 4 — Teacher grades  
  → Reviews each submission  
  → Gives score  
  → Adds personal feedback comment

STEP 6 — Student notified  
  → "Your assignment has been graded: 42/50"  
  → Student reads teacher's feedback

STEP 7 — Grade ledger updated  
  → Grade entry created automatically: type=Assignment, score=42, max=50  
  → Feeds into the term's final grade calculation

---

### **Cycle 3: Parent Doesn’t Pay Fees → Multiple Consequences**

STEP 1 — Invoice created (Oct 1\)  
  → Student notified

STEP 2 — Due date passes unpaid (Oct 1\)  
  → Status: OVERDUE

STEP 3 — Payment reminders sent  
  → Day 3: Reminder notification  
  → Day 7: Second reminder

STEP 5 — Report card blocked  
  → End of term → report cards published  
  → student tries to open report card → "Please settle your outstanding balance"  
  → Report card not visible

---

### **Cycle 4: Announcement** 

STEP 1 — Admin creates announcement  
  → "Final Exams start Feb 10 — no school uniform required"  
  → Priority: Important  
  → Target: All Grade 5 students and parents

STEP 2 — Notification dispatched  
  → Push notification to all 63 students  
  → Email to all 63 students

---

### **Feature flag overrides**

Individual features can be enabled or disabled per school regardless of tier (controlled by Super Admin). 

