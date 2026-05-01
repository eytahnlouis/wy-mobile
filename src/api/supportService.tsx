import apiClient from "./client";

type SupportServiceProps = {
  title: string;
  description: string;
};

export const supportService = {
  submitIssue: async ({
    title,
    description,
  }: SupportServiceProps) => {
    const response = await apiClient.post("api/support/create-ticket/", {
      title,
      description,
    });
    return response.data;
  },

  
};
