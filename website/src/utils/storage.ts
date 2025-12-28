import { Issue } from '../types';

const STORAGE_KEY = 'campus_issues';

export const storage = {
  getIssues: (): Issue[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveIssues: (issues: Issue[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  addIssue: (issue: Issue): void => {
    const issues = storage.getIssues();
    issues.push(issue);
    storage.saveIssues(issues);
  },

  updateIssue: (id: string, updates: Partial<Issue>): void => {
    const issues = storage.getIssues();
    const index = issues.findIndex(issue => issue.id === id);
    if (index !== -1) {
      issues[index] = { ...issues[index], ...updates, updatedAt: new Date().toISOString() };
      storage.saveIssues(issues);
    }
  },

  checkDuplicate: (location: string, category: string): boolean => {
    const issues = storage.getIssues();
    return issues.some(
      issue =>
        issue.location.toLowerCase() === location.toLowerCase() &&
        issue.category === category &&
        issue.status !== 'Resolved'
    );
  },

  getIssuesByUser: (userId: string): Issue[] => {
    const issues = storage.getIssues();
    return issues.filter(issue => issue.reportedBy === userId);
  }
};
