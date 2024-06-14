# scrap_activity

## Overview

The 'scrap_activity' project is a web crawler built with NestJS and Sequelize using TypeScript. It fetches entries from 'https://news.ycombinator.com/' and stores them in a MySQL database hosted on AWS RDS. These entries can be filtered based on title length and ordered by points or number of comments.

## Endpoints

### 1. Scrap Entries

- **Endpoint:** `/scrap`
- **Description:** Scrapes the web and returns the entries from 'https://news.ycombinator.com/'.

### 2. Update or Insert Entry

- **Endpoint:** `/entry/scrap/update`
- **Description:** Scrapes entries and saves them into the database. Updates an entry if it already exists (title is unique).

### 3. Find All Entries

- **Endpoint:** `/entry/findAll`
- **Description:** Retrieves all entries from the database, ordered by `updatedAt` DESC.

### 4. Filter Entries by Title Word Count and Points

- **Endpoint:** `/entry/filter/less/:num/points`
- **Description:** Filters entries with a title containing less than or equal to `:num` words (special characters not counted as words), ordered by `points` DESC.

### 5. Filter Entries by Title Word Count and Comments

- **Endpoint:** `/entry/filter/more/:num/comments`
- **Description:** Filters entries with a title containing more than `:num` words (special characters not counted as words), ordered by `num_comments` DESC.

## Request Tracking

- **Implementation:** Every endpoint logs a tracking entry in the database with fields:
  - `request_timestamp`: Timestamp of the request.
  - `action`: Endpoint URL.
  - `request_status`: Success or failure of the request.
  - `request_message`: Additional message related to the request.

## Database Schema (Entry)
- `id`: Id of each entry.
- `position`: Position of the entry.
- `title`: Title of the entry.
- `points`: Points associated with the entry.
- `num_comments`: Number of comments on the entry.
- `createdAt`: Timestamp of creation.
- `updatedAt`: Timestamp of last update.

## Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- MySQL database (can be AWS RDS or local instance)

### Installation

1. **Clone the repository:**

  ```bash
  $ git clone https://github.com/Balhus/scrap_activity.git
  $ cd scrap_activity
  ```

2. **Install dependencies:**
  ```bash
  $ npm install
  ```

3. **Enviroment Variables:**
  Create a .env file in the root directory with the following variables:

  ```bash
  DB_HOST=your_database_host
  DB_PORT=your_database_port
  DB_USERNAME=your_database_username
  DB_PASSWORD=your_database_password
  DB_DATABASE=your_database_name

  ```

5. **Start the application:**
  ```bash
  $ npm run start 

  # or watch mode
  $ npm run start:dev
  ```

6. **Access de crawler:**
The crawler will be available at http://localhost:3000.



## Usage Example

### Scrap Entries
  ```bash
    # GET 
    http://localhost:3000/scrap
  ```
### Update or Insert Entries
  ```bash
    # POST 
    http://localhost:3000/entry/scrap/update
  ```
### Find All Entries
  ```bash
    # GET 
    http://localhost:3000/entry/findAll
  ```

### Filter Entries by Title Word Count and Points
  ```bash
    # GET 
    http://localhost:3000/entry/filter/less/5/points
  ```

### Filter Entries by Title Word Count and Comments
  ```bash
    # GET 
    http://localhost:3000/entry/filter/more/10/comments
  ```

## Test
  ```bash
  # unit tests
  $ npm run test
  ```

## License
[MIT licensed].
