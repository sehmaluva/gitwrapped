"use client";

interface Repository {
  name: string;
  owner: string;
  commits: number;
  stars: number;
  language: string | null;
  languageColor: string | null;
  url: string;
}

interface TopReposProps {
  repositories: Repository[];
}

export function TopRepos({ repositories }: TopReposProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-4">Most Active Repositories</h3>
      <div className="space-y-4">
        {repositories.map((repo, index) => (
          <a
            key={`${repo.owner}/${repo.name}`}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-600">
                  #{index + 1}
                </span>
                <div>
                  <h4 className="text-white font-semibold group-hover:text-sky-400 transition-colors">
                    {repo.owner}/{repo.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    {repo.language && (
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: repo.languageColor || "#6366f1" }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {repo.stars}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-400">
                  {repo.commits}
                </span>
                <p className="text-gray-400 text-sm">commits</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
