# Aalto University - CS-E4770 - Project 2

This is a repository for the CS-E4770 (Designing and Building Scalable Web Applications) course's second project. The goal of this project is to build a Jamstack application for presenting and submitting programming exercises, which are then graded. The project have to use a SQL database, queue (for the submissions) and a cache (for already graded solutions).

### Used technologies

- Astro
- React
- Node.js
- JavaScript + TypeScript
- PostgreSQL
- RabbitMQ
- Redis
- Docker + Docker-compose
- Flyway

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

UI endpoints:

- `/` - contains 3 lists:
  - **Todo** - list of maximum of 3 exercises that haven't been completed yet
  - **Completed** - list of all the completed exercises
  - **Exercises** - list of all exercises
  - After clicking on any exercise it redirects the user to `/exercise/:slug`
- `/exercise/:slug` - contains the Markdown description of the exercise, textarea for submission and list of submitted solutions and grades/results

## How to run

**It takes a while for all the services to start, please wait until they all do before running the tests or using the application.**

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

### K6

I ran the tests with 10 VUS for 10 seconds.

The performance test chooses a random exercise (1 out of 8) and then either submits a newly generated solution or submits an already submitted solution (reuse chance = 0.5) and then generates a new used id or reuses an existing one (reuse chance = 0.4).

I chose reuse chance for the solutions to be a little higher as the chance that the solution gets used from the cache is lowered by the number of exercises (exercise + solution must be the same for the cache to be used).

The raw data are accessible at the end of this report.

| Endpoint / Metric | Average [ms] | Median [ms] | p(90) [ms] | p(95) [ms] | p(99) [ms] |
|-------------------|--------------|-------------|------------|------------|------------|
| Main page         | 105.79       | 95.17       | 178.61     | 189.82     | 204.25     |
| Submit endpoint   | 62.91        | 40.98       | 116.85     | 168.68     | 473.45     |

### Comments

I would say this is not the ideal way of testing this application - the problem is that all the services are running on the same machine and thus the API service does not get the benefit of using the message queue. In an ideal world the API service would not get affected by the other services almost at all (especiall not by the grader) it would just push the message into the queue and return a response to the user. However, it gets effected heavily in this configuration as the grader starts creating a lot of containers and thus reducing the performance of the API service.

I configured the grader to take 10 submissions from the queue at most in one time, but by using a lower number (e.g. just 1) the API endpoint would perform better as the grader would not be processing so many submissions.

### Reflection

I'm a little bit dissapointed when comparing these results to the previous project - the submitting endpoint is very similar to the submit endpoint in that project, yet the performance is not even close to being as good. I think this is caused by the other services effecting the API service (as described in the previous section).

It has to be said that using the queue approach does make the a big difference as there is no way the performance would be look like this if every request would have to wait for the result of the grader (especially when taking into account that only 10 (or n in general) grading processes can be ran at the same time). 

The caching also definitely would help a lot (depending on the % of exactly the same solutions), but the tests don't show this at all as that is on the side of the grader service and not the API service.

I'm very impressed by Astro as it was fun to use and also performed relatively well. Compared to the API endpoint it was more stable (as seen by the p(99) values).

## Improvements

There are some problems with the application first connecting to all the services (queue, cache, database) as the containers are not ready yet. Unfortunately the best solution I've found is to just keep trying again and again, which I don't think is the ideal solution.

When it comes to performance, I think the biggest problem is that each solution needs to create a separate container for the grading and I think this is the biggest bottleneck of the whole application by far. It would just be better if the Node.js grading container graded these solutions directly, there is no need to create new containers over and over again.

Frontend performance might potentionally be improved by better understanding Astro. I didn't have the time to properly learn the framework. Specifically by using the `client:...` directives in a more suitable way the performance still could improve.

## Conclusion

I was little bit dissapointed by the nature of the performance tests as I don't think they test or show the performance improvement by using the queue and especially not the cache.

Overall I was very happy to try to use all of these techonologies and integrate them together to create this application.

## Data

### Main page

```
http_req_receiving: avg=48.54ms med=47.92ms p(90)=57.34ms p(95)=60.22ms p(99)=66.42ms p(99.99)=74.39ms
http_req_waiting: avg=57ms med=47.4ms p(90)=126.12ms p(95)=134.39ms p(99)=146.35ms p(99.99)=156.74ms
http_reqs: 947 94.200637/s
iteration_duration: avg=105.79ms med=95.17ms p(90)=178.61ms p(95)=189.82ms p(99)=204.25ms p(99.99)=217.86ms count=949
```

### Submit endpoint

```
http_req_waiting: avg=61.16ms med=39.89ms p(90)=114.02ms p(95)=162.97ms p(99)=472.29ms p(99.99)=596.14ms count=1594
http_reqs: 1594 158.659994/s
iteration_duration: avg=62.91ms med=40.98ms p(90)=116.85ms p(95)=168.68ms p(99)=473.45ms p(99.99)=624.82ms count=1596
```
