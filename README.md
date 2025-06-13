# Final project - A personal blogging system - Team $GROUPNAME

This repository contains a starting point for your team's final project. We look forward to seeing your progress and your final results this semester!

Your team should update this README to include the information required, as presented in the project handout available on Canvas.

Your team members are:
$TEAMMEMBERS

## Development Environment Setup & Commit Guidelines

It is important each team member has the right development environment setup on their computer.
Please update this with any other processes your group is following.

Extensions to install:

- [VSCode Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [VSCode Svelete](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- _Add other optional extensions here :)_

Commands to run before commits:

- In Backend `npm run format` to double check code is formatted
- In Frontend `npm run format` to double check code is formatted

All commits MUST have a brief descriptive message

## Git

> [!IMPORTANT]
> It is always easier to merge files that are either new files, or files that no one else has changed. Create new modules / components to reduce the chance of Git Conflicts! However expect conflicts to occur as part of normal development.

> [!TIP]
> The below assumes you have experience with GIT Pull requests, if not please address this.

All groups MUST use Pull Requests (PR) with at least 1 peer review for merging code into main, this is to improve code quality and to give team members an opportunity to understand your code in case they need to use it.

If team-members don't need to use PR, then they should be working on feature branches and get latest commits in main by merging main into their feature branch (`git merge main`, or `git rebase main`).

> [!TIP]
> Consider a branch naming convention `feature/<some-meaningful-feature-name>`

Correct and **timely** execution of the PR process with evidence of good code review can contribute **significantly** to a better codebase and team member collaboration.

$IMAGE

----------------------

## 1. Team name: Byte Me Squad (Group 2)

+ Daoli Li
+ Icey Shi
+ Richie Chang
+ Phuong Phan
+ Gamaliel Ginting

Our team rules:
- Commit rules & instructions: https://docs.google.com/document/d/14A3_YaG4vBWSQtjaCEQKFxeWcQmsyX_2VP1TV_brekk/edit?tab=t.0
- Project structure (our plan): https://docs.google.com/document/d/1rSdKtNuxCzUeQRLmSV8eFyRR5pCpoDjwOqh2QZh_E3w/edit?tab=t.0 
## 2. Special setup instructions: 
+ Java SE Development Kit 24.0.1

## 3. One username / password:
+ Username: admin_user 
+ Password: 123

## 4. Other instructions:

A. Writing Articles

This section covers everything you need to know about the “Create/Edit Article” form and how it satisfies the assignment requirements (12–14).

1. TinyMCE API Key

- We store our TinyMCE API key in `.env` under `VITE_TINYMCE_API_KEY`.  
- **Make sure your key is valid and not expired**—if you run into “API key invalid” errors in the console, generate a new key from the TinyMCE dashboard and update `.env`.

2. Title Input

- Single‐line text input with `maxlength="100"`.  
- The browser will prevent typing more than 100 characters and show its built-in “max length” warning if you try.

3. Tags Management

- Tags are entered as space- or full-width-space-delimited tokens.  
- The component parses your input into an array of strings like `["#tag1", "#tag2", …]`.  
- **Validation rules**:  
  - Up to **6** tags total  
  - Each tag ≤ **15** characters  
  - Must match the regex `/^#[A-Za-z0-9]+$/` (start with `#`, only letters & digits)  
  - Case-insensitive de-duplication (`#Foo` and `#foo` count as the same tag)  
- Invalid tags (too many, wrong format, too long, or duplicates) are highlighted and you cannot publish them until they are fixed.

4. Cover Image Upload

- You may upload **one** cover image per article.  
- File size limit: **2 MB**.  
- If no image is selected, a default placeholder image is automatically used.  
- Upon selecting a file, a preview appears immediately; you can change your selection before publishing.

5. WYSIWYG Editor (TinyMCE)

- Integrated via `@tinymce/tinymce-svelte` and bound to our `content` model.  
- **Formatting features** (via the **Format** menu and toolbar):  
  - **Headings** (H1, H2, H3, …)  
  - **Bold**, **Italic**, **Underline**  
  - **Font family** and **font color**  
  - **Bulleted** and **Numbered lists**  
  - **Tables** (insert/manage)  
- Pasting of inline images is disabled; use the cover-upload control above for images.

6. Word Count & Content Validation

- The editor tracks the plain text word count in real time.  
- Maximum allowed: 1500 words.  
- If you exceed 1 500 words, the “Publish” button is disabled and an alert prompts you to shorten your content.

B. Notifications logic:

1. Viewed and Unviewed Notifications
Unviewed notifications are those that were received after the user's last visit to the notifications panel.
The newest notifications will be highlighted. Once the panel is viewed, all notifications will lose their highlight.

2. Read and Unread Notifications
Unread notifications are those the user hasn't clicked on to read the full content (an article or comment section).
All unread notifications are marked with a blue dot.