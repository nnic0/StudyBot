<p align="center">
  <img src="https://i.imgur.com/UhncxoT.png" alt="StudyBot" width="150"/>
  <h1 align = "center">StudyBot</h1>
</p>

### Description
StudyBot is a versatile Discord bot designed to enhance productivity and learning through structured study sessions. Leveraging techniques like the Pomodoro method and active recall, along with a to-do list for task management, StudyBot supports both group and individual study environments. Users can create and manage study groups, receive session notifications, and utilize flashcards for memorization, with all progress and configurations stored persistently in a MySQL database.

---

## Features

### Pomodoro Session Management

- **Start Session:** Begin a Pomodoro session with a predefined or custom duration.
- **Stop Session:** End the current session prematurely.
- **Group Sessions:** Start and manage Pomodoro sessions for study groups.
- **Individual Sessions:** Manage personal Pomodoro sessions.

### Study Groups

- **Create Group:** Form a study group by specifying member names.
- **Manage Group:** Add or remove members from an existing group.
- **Group Notifications:** Notify all group members in the designated Discord channel about session starts and ends.

### Active Recall (Flashcards)

- **Create Deck:** Form new decks of flashcards categorized by topics.
- **Add Flashcards:** Add new flashcards to an existing deck.
- **Remove Flashcards:** Delete specific flashcards from a deck.
- **Rename Decks:** Change the names of existing decks.
- **Review Decks:** Use flashcards in active recall sessions for effective studying.

### To-Do List Management

- **Add Task:** Add new tasks to the to-do list.
- **Remove Task:** Delete tasks from the list.
- **Mark Task as Completed:** Mark tasks as done.
- **List Tasks:** Display all tasks with their statuses.

### Reminders Management

#### Add Reminders

Your bot supports adding reminders that can be set to trigger daily, weekly, or monthly. Below are the commands available to manage reminders:

- **Daily Reminder:**
  - **Command:** `!daily <task> <HH:MM>`
  - **Description:** Sets a daily reminder at the specified time (24-hour format).
  - **Example:** `!daily Study 14:30` — This will remind you to study every day at 2:30 PM.

- **Weekly Reminder:**
  - **Command:** `!weekly <task> <Day> <HH:MM>`
  - **Description:** Sets a weekly reminder on the specified day of the week and time.
  - **Example:** `!weekly Gym Monday 18:00` — This will remind you to go to the gym every Monday at 6:00 PM.

- **Monthly Reminder:**
  - **Command:** `!monthly <task> <Date> <HH:MM>`
  - **Description:** Sets a monthly reminder on the specified date and time.
  - **Example:** `!monthly Pay rent 01 09:00` — This will remind you to pay the rent on the 1st day of every month at 9:00 AM.

#### Remove Reminders

You can remove reminders that you have set previously by using the following command:

- **Remove Reminder:**
  - **Command:** `!removereminder <task>`
  - **Description:** Removes a specific reminder by its task description.
  - **Example:** `!removereminder Study` — This will remove the reminder for "Study".

#### List Active Reminders

To view all the active reminders you have set:

- **List Reminders:**
  - **Command:** `!listreminders`
  - **Description:** Lists all active reminders with their respective time and recurrence.
  - **Example:** `!listreminders` — This will display all your active reminders.

### Data Persistence

- **MySQL Integration:** Store and retrieve user configurations, session progress, and other data.
- **Custom Configurations:** Allow users to set and save custom Pomodoro durations, break times, and other preferences.
- **User Progress Tracking:** Track and display users' study progress over time.

## Useful Commands

- **/pomodoro [duration]:** Start a Pomodoro session with an optional custom duration.
- **/stop-pomo:** Stop the current session.
- **/group-create [name1] [name2] ...:** Create a new study group.
- **/group-remove [name]:** Remove a member from the group.
- **/deck-create [deck_name]:** Create a new flashcard deck.
- **/card-add [deck_name] [question] [answer]:** Add a flashcard to a deck.
- **/card-remove [question]:** Remove a flashcard from a deck.
- **/deck-rename [old_name] [new_name]:** Rename a deck.
- **/deck-review [deck_name]:** Start a review session for a deck.
- **/todo-add [task]:** Add a new task to the to-do list.
- **/todo-remove [task_name]:** Remove a task from the list.
- **/todo-done [task_name]:** Mark a task as completed.
- **/todo-list:** Display all tasks and their statuses.

## Prerequisites

Before setting up StudyBot, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [MySQL](https://dev.mysql.com/downloads/mysql/)

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/StudyBot.git
   cd StudyBot
   ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure Environment Variables:**
    - Create a .env file and add the following configuration:
    ```bash
    BOT_TOKEN=your_discord_token
    CLIENT_ID=your_client_id
    GUILD_ID=your_guild_id
    OWNER_ID=your_owner_id
    MYSQL_HOST=localhost
    MYSQL_USER=your_mysql_username
    MYSQL_PASSWORD=your_mysql_password
    MYSQL_DATABASE=studybot
    ```
    *Replace the placeholders with your actual credentials and information.*

4. **Database Setup**
To set up the MySQL database and tables required for StudyBot, follow these steps:

    - Create the Database
    Run the following SQL command in your MySQL client to create the database:
    ```sql
        CREATE DATABASE studybot;
        USE studybot;
    ```
    - **Execute the SQL Script**
    Use the provided SQL script to create the necessary tables and stored procedures. You can run the script using a MySQL client like MySQL Workbench, or by using the command line:
    ```bash
      mysql -u your_username -p studybot < data/squema.sql
    ```

## Final Steps
After completing the above steps, your StudyBot should be ready to use! Start the bot using the following command:
  ```bash
    node index.js
  ```


---

## License

StudyBot is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---
