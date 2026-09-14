export type GithubEnv = { token: string | null; apiOrigin: string };

const API_ORIGIN = "https://api.github.com";

function present(value: string | undefined): string | null {
  if (value === undefined) {
    return null;
  }
  if (value === "") {
    return null;
  }
  return value;
}

export function githubEnv(): GithubEnv {
  const token = present(process.env.GITHUB_TOKEN);
  const origin = present(process.env.GITHUB_API_ORIGIN);
  let apiOrigin = API_ORIGIN;
  if (origin !== null) {
    apiOrigin = origin;
  }
  return { token, apiOrigin };
}
