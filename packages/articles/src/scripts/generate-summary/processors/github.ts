import * as v from "valibot";
import { Octokit } from "octokit";
import { configs } from "../../../core/configs";
import { ossSchema } from "../../../core/schema";
import type { Oss } from "../../../core/types";

export async function fetchGitHubProjects(): Promise<Oss[]> {
  const projects = await Promise.all(
    configs.projects.map(async ({ url }) => {
      const [owner, name] = url.replace("https://github.com/", "").split("/");
      console.log("repo", owner, name, process.env["GITHUB_TOKEN"]);
      const token = v.parse(v.string(), process.env["GITHUB_TOKEN"]);
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const repo: {
        name: string;
        full_name: string;
        description?: string | undefined;
        stargazers_count: number;
      } = await response.json();

      return v.parse(ossSchema, {
        owner,
        name,
        repoUrl: url,
        description: repo.description ?? "",
        stars: repo.stargazers_count,
      });
    })
  );

  return projects;
}
