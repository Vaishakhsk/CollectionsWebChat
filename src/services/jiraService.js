import axios from "axios";

const JIRA_API_BASE_URL = process.env.REACT_APP_JIRA_API_URL;
const JIRA_EMAIL = process.env.REACT_APP_JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.REACT_APP_JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.REACT_APP_JIRA_PROJECT_KEY;

const jiraApi = axios.create({
  baseURL: JIRA_API_BASE_URL,
  auth: {
    username: JIRA_EMAIL,
    password: JIRA_API_TOKEN,
  },
});

export const createJiraTicket = async (summary, description, assignee) => {
  try {
    const response = await jiraApi.post("/rest/api/2/issue", {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary,
        description,
        issuetype: { name: "Bug" },
        assignee: { name: assignee },
        customfield_10001:
          "As a support team member,\nI want to track and resolve customer reported issues,\nSo that we can improve customer satisfaction.", // Acceptance Criteria field
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating JIRA ticket:", error);
    throw error;
  }
};
