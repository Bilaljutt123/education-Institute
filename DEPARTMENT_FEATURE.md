# Department Feature Implementation Plan

## Overview
Adding department structure to organize courses by departments (IT Department, Business Department, Engineering, etc.)

---

## Backend Implementation ✅ COMPLETE

### 1. Department Model ✅
**File:** `server/models/Department.js`
- Fields: name, code, description, head, createdAt
- Unique constraints on name and code

### 2. Updated Course Model ✅
**File:** File `server/models/Course.js`
- Added `department` field (ObjectId reference to Department)
- Required field

### 3. Department Controller ✅
**File:** `server/controllers/departmentController.js`
- getDepartments() - Get all departments
- getDepartment(id) - Get single department
- createDepartment() - Create new department (Admin)
- updateDepartment(id) - Update department (Admin)
- deleteDepartment(id) - Delete department (Admin)

### 4. Department Routes ✅
**File:** `server/routes/department.js`
- GET /api/departments - Public
- GET /api/departments/:id - Public
- POST /api/departments - Admin only
- PUT /api/departments/:id - Admin only
- DELETE /api/departments/:id - Admin only

### 5. Server Configuration ✅
**File:** `server/server.js`
- Added department routes
- Mounted at /api/departments

### 6. Updated Course Controller ✅
**File:** `server/controllers/courseController.js`
- `getCourses()` now populates department data
- `getCourseById()` now populates department data

---

## Frontend Implementation 🔄 IN PROGRESS

### 1. Type Definitions
**File:** `client/src/types/index.ts`
- [ ] Add Department interface
- [ ] Update Course interface to include department

### 2. API Utilities
**File:** `client/src/utils/api.ts`
- [ ] Add getDepartments()
- [ ] Add getDepartment(id)
- [ ] Add createDepartment(data)
- [ ] Add updateDepartment(id, data)
- [ ] Add deleteDepartment(id)
- [ ] Add getCoursesByDepartment(departmentId)

### 3. Department Management Pages

#### ManageDepartments.tsx (Admin)
- [ ] List all departments
- [ ] Create new department
- [ ] Edit existing department
- [ ] Delete department
- [ ] View courses in each department

#### CreateDepartment.tsx (Admin)
- [ ] Form to create department
- [ ] Fields: name, code, description, head
- [ ] Validation

### 4. Update Existing Components

#### CreateCourse.tsx
- [ ] Add department dropdown selector
- [ ] Fetch all departments
- [ ] Required field

#### ManageCourses.tsx
- [ ] Display department name for each course
- [ ] Filter by department
- [ ] Department badges

#### Dashboard.tsx
- [ ] Show courses grouped by department
- [ ] Department tabs/filters

#### LandingPage.tsx
- [ ] Department showcase section
- [ ] Popular departments

#### CourseCard.tsx
- [ ] Show department badge
- [ ] Department color coding

#### CourseDetail.tsx
- [ ] Display full department information
- [ ] Link to department page

### 5. Navigation Updates
- [ ] Add "Manage Departments" link to admin navbar
- [ ] Add department browsing to student view

### 6. Dashboard Updates
- [ ] Department statistics for admin
- [ ] Browse by department for students

---

## Data Migration (For Existing Data)

Since we're adding a required `department` field to existing courses:

### Option 1: Create Default Department
```javascript
// Run this once
const defaultDept = await Department.create({
  name: 'General',
  code: 'GEN',
  description: 'General courses',
});

// Update all existing courses
await Course.updateMany(
  { department: { $exists: false } },
  { department: defaultDept._id }
);
```

### Option 2: Manual Assignment
- Admin manually assigns departments to existing courses

---

## Testing Checklist

### Backend
- [ ] Create department via API
- [ ] Get all departments
- [ ] Get single department
- [ ] Update department
- [ ] Delete department
- [ ] Create course with department
- [ ] Courses populate department data
- [ ] Filter courses by department

### Frontend
- [ ] Department management UI works
- [ ] Create/Edit/Delete departments
- [ ] Course creation includes department selection
- [ ] Courses display department information
- [ ] Filter courses by department
- [ ] Department statistics display
- [ ] Navigation works correctly

---

## Example Departments

```javascript
[
  {
    name: "Information Technology",
    code: "IT",
    description: "Computer Science and IT related courses",
    head: "Dr. John Smith"
  },
  {
    name: "Business Administration",
    code: "BUS",
    description: "Business, Management, and Economics courses",
    head: "Prof. Jane Doe"
  },
  {
    name: "Engineering",
    code: "ENG",
    description: "Engineering and technical courses",
    head: "Dr. Robert Johnson"
  },
  {
    name: "Arts & Humanities",
    code: "AH",
    description: "Arts, Literature, and Humanities courses",
    head: "Prof. Emily Brown"
  }
]
```

---

## Next Steps

1. Update frontend types
2. Create department API utilities
3. Build ManageDepartments.tsx
4. Build CreateDepartment.tsx
5. Update CreateCourse.tsx with department selector
6. Update all course display components to show department
7. Add department filtering to Dashboard
8. Test all functionality
