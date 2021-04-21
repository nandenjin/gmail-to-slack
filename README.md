<div align="center">
  <h1>:email: Gmail to Slack Forwarder</h1>
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/nandenjin/gmail-to-slack/CI?style=flat-square">
  <a href="https://codeclimate.com/github/nandenjin/gmail-to-slack">
    <img alt="Code Climate maintainability" src="https://img.shields.io/codeclimate/maintainability/nandenjin/gmail-to-slack?style=flat-square">
   </a>
  <img alt="GitHub" src="https://img.shields.io/github/license/nandenjin/gmail-to-slack?style=flat-square">
</div>

## What's this

Forward emails from Gmail to Slack by using [Google Apps Script](https://developers.google.com/apps-script).

### Features

- Filter by "label" of Gmail (configurable automation by "filters")
- Integrates with any channels in Slack by [Incoming Webhooks](https://slack.com/help/articles/115005265063)
- Web-based configuration UI

| **For users of paid plans:** You can use **channel email address**, which is an official built-in feature of Slack. |
|---|

Actual behavior of this script is very simple:

1. Search threads with specified label from Gmail.
2. Forward it to Slack.
3. Reomve the label from the thread.

for each time it is called.

## How to setup

### 1. Initialization of the package

Clone the repository and install dependencies.

```sh
# Clone repository
git clone https://github.com/nandenjin/gmail-to-slack.git
cd gmail-to-slack

# Install dependencies
yarn install
```

### 2. Create script

Create a new project of Google Apps Script (GAS) by using [clasp](https://npmjs.com/package/@google/clasp)

```sh
# If needed
npx clasp login

# Create a project
npx clasp create --rootDir src
```

...or setup manually with exist project.

```sh
cp .clasp.template.json  .clasp.json
```

```json
{
  "scriptId": "REPLACE_WITH_YOUR_PROJECT_ID",
  "rootDir": "src"
}
```

### 3. Push and deploy

Push codes to project.

```sh
clasp push
```

Open GAS web editor and publish a deployment.

```sh
clasp open
```

**Make sure the script is available only for yourself, or someone can get your configurations: list of your Gmail labels and Slack Webhook URL.**

### 4. Configure with Web UI

Open the URL that be shown at deployment modal. Select a label to use to flag emails to be forwarded, and set Slack Outcoming Webhook URL.

### 4. Configure trigger

Back to GAS web editor and setup time-based trigger to function `main`.

All ready! Test the things by adding the label to some threads manually, and confirm that they will be forwarded to intended channel.

## Contribute

If you have any trouble or question, feel free to ask at discussion of GitHub. Opening issue or submitting PRs are also welcome.
