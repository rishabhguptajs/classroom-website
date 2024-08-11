# Classroom Website

This is the repository for a classroom website. It is a simple website having multiple dashboards for the staff of school. It is built using MERN stack.

## Features
- Dashboard for teachers/principal
- Dashboard for students
- Principal can add teachers and students
- Teachers can add students
- Students can view their classmates
- Students can view their timetable
- Teachers can view/create their timetable
- Teachers can view their students

## Installation
1. Clone the repository
2. `cd frontend` and run `npm install`
3. `cd backend` and run `npm install`
4. Create a `.env` file in the backend folder and add the following:
```
MONGO_URI = your_mongo_uri
JWT_SECRET = your_jwt_secret
```
5. Run `npm start` in backend 
6. Create a `.env.local` file in the frontend folder and add the following:
```
NEXT_PUBLIC_SERVER_URL = http://localhost:8080
```
7. Run `npm run dev` in frontend

## Tech Stack

**Client:** Next.js, TailwindCSS, Axios, TypeScript

**Server:** Node, Express, MongoDB, JWT

## Authors
- [@rishabhguptajs](https://www.github.com/rishabhguptajs)

## Thank you for visiting the repository!
