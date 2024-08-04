# StudyBot

### Description
StudyBot is a versatile Discord bot designed to enhance productivity and learning through structured study sessions. Leveraging techniques like the Pomodoro method and active recall, along with a to-do list for task management, StudyBot supports both group and individual study environments. Users can create and manage study groups, receive session notifications, and utilize flashcards for memorization, with all progress and configurations stored persistently in a MySQL database.

### Features

- **Pomodoro Session Management:**
  - **Start Session:** Begin a Pomodoro session with a predefined or custom duration.
  - **Pause Session:** Temporarily halt a running session.
  - **Stop Session:** End the current session prematurely.
  - **Resume Session:** Continue a paused session.
  - **Group Sessions:** Start and manage Pomodoro sessions for study groups.
  - **Individual Sessions:** Manage personal Pomodoro sessions.

- **Study Groups:**
  - **Create Group:** Form a study group by specifying member names.
  - **Manage Group:** Add or remove members from an existing group.
  - **Group Notifications:** Notify all group members in the designated Discord channel about session starts and ends.

- **Active Recall (Flashcards):**
  - **Create Deck:** Form new decks of flashcards categorized by topics.
  - **Add Flashcards:** Add new flashcards to an existing deck.
  - **Remove Flashcards:** Delete specific flashcards from a deck.
  - **Rename Decks:** Change the names of existing decks.
  - **Review Decks:** Use flashcards in active recall sessions for effective studying.

- **To-Do List Management:**
  - **Add Task:** Add new tasks to the to-do list.
  - **Remove Task:** Delete tasks from the list.
  - **Mark Task as Completed:** Mark tasks as done.
  - **List Tasks:** Display all tasks with their statuses.
  - **Task Notifications:** Notify users about pending tasks or deadlines.

- **Notifications:**
  - **Session Start/End:** Inform users when a study session starts or ends.
  - **Break Alerts:** Notify users when it’s time to take a break.
  - **Custom Reminders:** Set and receive reminders for specific tasks or study sessions.

- **Data Persistence:**
  - **MySQL Integration:** Store and retrieve user configurations, session progress, and other data.
  - **Custom Configurations:** Allow users to set and save custom Pomodoro durations, break times, and other preferences.
  - **User Progress Tracking:** Track and display users' study progress over time.

- **Useful Commands:**
  - `/start [duration]`: Start a Pomodoro session with an optional custom duration.
  - `/stop`: Stop the current session.
  - `/group create [name1] [name2] ...`: Create a new study group.
  - `/group add [name]`: Add a member to an existing group.
  - `/group remove [name]`: Remove a member from the group.
  - `/deck create [deck_name]`: Create a new flashcard deck.
  - `/deck add [deck_name] [question] [answer]`: Add a flashcard to a deck.
  - `/deck remove [deck_name] [question]`: Remove a flashcard from a deck.
  - `/deck rename [old_name] [new_name]`: Rename a deck.
  - `/deck review [deck_name]`: Start a review session for a deck.
  - `/todo add [task]`: Add a new task to the to-do list.
  - `/todo remove [task_id]`: Remove a task from the list.
  - `/todo done [task_id]`: Mark a task as completed.
  - `/todo list`: Display all tasks and their statuses.

### License

StudyBot is licensed under the MIT License. See the LICENSE file for more information.
