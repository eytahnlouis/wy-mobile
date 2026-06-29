import apiClient from "./client";

type SupportServiceProps = {
  subject: string;
  description: string;
};

export const supportService = {
  submitIssue: async ({
    subject,
    description,
  }: SupportServiceProps) => {
    const response = await apiClient.post("support/create-ticket/", {
      subject,
      description,
    });
    return response.data;
  },

  
};
