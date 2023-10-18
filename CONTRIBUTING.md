# How to Contribute to Amplication 🚀

Welcome, amazing human! 🎉 We're thrilled that you're considering contributing to Amplication. Join us on this exciting journey to make Amplication even better for everyone. We're committed to ensuring that contributing to Amplication is a delightful and educational experience for all. 💡

## 🙋 Got Questions? Need Help?

Got burning questions? Looking for expert advice? Or just want to chat about Amplication? Join our friendly community in our [Discord channel](https://amplication.com/discord).

## 🐞 Found a Bug? Found Gremlins? 👾

If you've spotted a pesky bug lurking in the code, you can become our hero! Help us out by reporting the issue. Just head over to our [GitHub Repository](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20bug&template=bug_report.md&title=) and submit a detailed bug report. And if you're feeling extra heroic, send us a Pull Request to vanquish that bug! 🦸‍♀️🦸‍♂️

## 🚀 Dreaming of a New Feature? Got Crazy Ideas? 🚁

Dreaming big? Have a fantastic feature in mind? We're all ears! You can request a new feature by creating an issue in our [GitHub Repository](https://github.com/amplication/amplication/issues/new?assignees=&labels=type%3A%20feature%20request&template=feature_request.md&title=). If you're feeling daring and want to implement it yourself, that's even better! Reach out to us, and we'll ensure your dreams align with our project's vision. 🌟

- For Major Features: Start by opening an issue and outlining your proposal. This allows us to coordinate efforts, prevent duplicated work, and help you craft a change that successfully integrates with the project.
- For Smaller Features: Craft the feature and submit it directly as a Pull Request (more details in the "How to Submit a Pull Request" section below).

## Ready to Contribute Code? 💻

Eager to dive into the code? Excellent! To help you navigate the labyrinth of code, here's a map to our tech stack:

### 🏢 Server-side

- [Node.JS](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/docs)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs/) (with [PostgreSQL](https://www.postgresql.org/about/))
- [GraphQL API](https://docs.nestjs.com/graphql/quick-start)
- [Jest](https://docs.nestjs.com/fundamentals/testing) (for testing)

### 🖥️ Client-side

- [React](https://reactjs.org/docs/getting-started.html)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Apollo Client](https://www.apollographql.com/docs/react/)

Feeling excited yet? Let's go!

If you're not quite ready to jump into code just yet, that's completely okay. You can also check out the [documentation issues](https://github.com/amplication/amplication/labels/type%3A%20docs). 📚

# How to Make a Code Contribution 🌟

Ready to dive into the code? Excellent! Here's how you can make a code contribution:

## Issues Open to the Community 🔍

We have a list of issues that are open and ready for community contributions. Check them out [here](https://github.com/amplication/amplication/issues?q=is%3Aopen+is%3Aissue+label%3A%22open+to+community%22).

## Good First Issues 🥇

If you're new to open source contributions or want to understand how contributions work in our project, here's a quick start guide:

1. Find an issue that you'd like to address or a feature you'd like to add. You can use [this view](https://github.com/amplication/amplication/issues?q=is%3Aopen+is%3Aissue+label%3A%22good%20first%20issue%22) to find issues tailored for new contributors. 🌈

## How to Contribute - Step by Step 🚶‍♂️🚶‍♀️

Follow these steps to contribute to Amplication:

### Step 1: Make a Fork 🍴

Fork the Amplication repository to your GitHub organization. This will create a copy of the repository under your GitHub username/repository name. 🚀

> **Note:** Be sure to uncheck "Copy the DEFAULT branch only" for accessibility. ♿

### Step 2: Clone the Repository 📥

Use the following command to clone the repository to your local machine. We recommend cloning the `next` branch:

```bash
git clone -b next https://github.com/{your-GitHub-username}/amplication.git
```

### Step 3: Set Up the Development Environment 💼

Set up and run the development environment on your local machine by following the instructions in the [README](./README.md#Development). 🛠️

### Step 4: Create a Branch 🌿

Create a new branch for your changes. To keep branch names uniform and easy to understand, use the following conventions:

- For documentation changes: `docs/{ISSUE_NUMBER}-{CUSTOM_NAME}` (e.g., `docs/2233-update-contributing-docs`)
- For new features: `feat/{ISSUE_NUMBER}-{CUSTOM_NAME}` (e.g., `feat/1144-add-plugins`)
- For bug fixes: `fix/{ISSUE_NUMBER}-{CUSTOM_NAME}` (e.g., `fix/9878-fix-invite-wrong-url`)
- For anything else: `chore/{ISSUE_NUMBER}-{CUSTOM_NAME}` (e.g., `chore/111-update-ci-url`) 📌

Use this command to create a branch:

```bash
git checkout -b branch-name-here
```

### Step 5: Make Your Changes 🛠️

Update the code with your bug fix or new feature. You're making Amplication better, one line of code at a time! 🧙‍♂️🪄

### Step 6: Stage Changes 🛤️

Stage the changes that are ready to be committed using this command:

```bash
git add .
```

### Step 7: Commit Changes (Git) 📝

Commit the changes with a short message following the structure `<type>(<package>): <subject>`. Here's an example:

```bash
git commit -m "fix(server): missing entity on init"
```

### Step 8: Push Changes to the Remote Repository 🚀

Push your changes to the remote repository:

```bash
git push origin branch-name-here
```

### Step 9: Create a Pull Request 🌈

To submit a pull request to the upstream repository on GitHub:

1. Provide a title and a brief description of your changes using the template. Include the issue or bug number related to your change. Be