# Aalto University - CS-E4770 - Project 2

This is a repository for the CS-E4770 (Designing and Building Scalable Web Applications) course's second project. The goal of this project is to build a Jamstack application for presenting and submitting programming exercises, which are then graded. The project have to use a SQL database, queue (for the submissions) and a cache (for already graded solutions).

## Design:

My implementation:

- UI - for the frontend of the application
  - built using **Astro**, **React** and **TypeScript**
- API - for handling requests from the frontend
  - built using **Express** and **Node.js**
  - uses **PostgreSQL** to store submissions
  - uses **RabbitMQ** to communicate with the grader
- Grader - for handling grading the solutions
  - built using **Node.js**
  - uses **RabbitMQ** to receive messages from API
  - uses **ioredis** to cache solutions
  - uses **PostgreSQL** to update the results of grading
- Grader-image - for the actual grading of the solutions
- Flyway - for database migrations
- k6 - for performance testing

API endpoints:

- GET `/api/solution/` - returns all submissions in the database (mainly for development)
- POST `/api/solution/` *(expects an Authorization header)* - adds a new solution to the database and sends it for grading
- GET `/api/solution/:id` - returns a solution by id
- GET `/api/solution/slug/:slug` *(expects an Authorization header* - returns all solutions for a specific exercise by a specific user

## How to run

To run the application you need to run:

```
docker-compose up --build
```

To run the k6 performance tess you need to run:

```bash
# If you haven't started the application yet
docker-compose up --build

# k6
todo
```

## Performance

### Preface

I tried to make sure that the tests are accurately representing the performance by rerunning them several times and then taking the maximum out of those tries.

The tests were ran on my Intel-chip Macbook Pro, the Lighthouse tests were ran in a clean Google Chrome (version 107.0.5304.110, no extensions other than Lighthouse).

### Lighthouse

I ran the tests with these settings: 

- Mode = Navigation
- Device = Desktop
- Categories = Performance, Accessibility, Best practices, SEO

**Main page ([http://localhost:3000/](http://localhost:3000/))**

- Performance = **99**
  - First Contentful Paint = 0.5s
  - Time to Interactive = 1s
  - Speed Index = 0.5s
  - Total Blocking Time = 0ms
  - Largest Contentful Paint = 0.5s
  - Cumulative Layout Shift = 0.093
- Accessibility = 93
- Best practices = 100
- SEO = 89

**Exercise page ([http://localhost:3000/exercises/average-of-positives](http://localhost:3000/exercises/average-of-positives))**

- Performance = **100**
  - First Contentful Paint = 0.5s
  - Time to Interactive = 0.5s
  - Speed Index = 0.5s
  - Total Blocking Time = 0ms
  - Largest Contentful Paint = 0.5s
  - Cumulative Layout Shift = 0
- Accessibility = 80
- Best practices = 100
- SEO = 89

## Improvements

There are some problems with the application first connecting to all the services (queue, cache, database) as the containers are not ready yet. Unfortunately the best solution I've found is to just keep trying again and again, which I don't think is the ideal solution.

When it comes to performance, I think the biggest problem is that each solution needs to create a separate container for the grading and I think this is the biggest bottleneck of the whole application by far. It would just be better if the Node.js grading container graded these solutions directly, there is no need to create new containers over and over again.

Frontend performance might potentionally be improved by better understanding Astro. I didn't have the time to properly learn the framework. Specifically by using the `client:...` directives in a more suitable way the performance still could improve.

## Conclusion

todo

## Data

