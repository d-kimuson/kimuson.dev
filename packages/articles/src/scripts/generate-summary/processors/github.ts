import * as v from "valibot";
import { configs } from "../../../core/configs";
import { ossSchema } from "../../../core/schema";
import type { Oss } from "../../../core/types";

export async function fetchGitHubProjects(): Promise<Oss[]> {
  const projects = await Promise.all(
    configs.projects.map(async ({ url }) => {
      const [owner, name] = url.replace("https://github.com/", "").split("/");
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${name}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        console.warn(
          `Failed to fetch GitHub repo ${owner}/${name}: ${response.status}`
        );
        return v.parse(ossSchema, {
          owner,
          name,
          repoUrl: url,
          description: "",
          stars: 0,
        });
      }

      const repo: {
        name: string;
        full_name: string;
        description?: string | undefined;
        stargazers_count?: number;
      } = await response.json();

      return v.parse(ossSchema, {
        owner,
        name,
        repoUrl: url,
        description: repo.description ?? "",
        stars: repo.stargazers_count ?? 0,
      });
    })
  );

  return projects;
}
