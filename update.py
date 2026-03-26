import re

with open("components/hackathons/HackathonList.tsx", "r") as f:
    content = f.read()

# 1. Update tagFilter state
content = content.replace(
    'const [tagFilter, setTagFilter] = useState("");',
    'const [tagFilter, setTagFilter] = useState<string[]>([]);'
)

# 2. Add statusCounts calculation
status_counts_code = """  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    hackathons.forEach((h) => h.tags.forEach((t) => tags.add(t)));
    return [...tags].sort((a, b) => a.localeCompare(b, languageTag));
  }, [hackathons, languageTag]);

  const statusCounts = useMemo(() => {
    const counts = { all: 0, upcoming: 0, ongoing: 0, ended: 0 };
    hackathons.forEach((h) => {
      const tagMatches = tagFilter.length === 0 || tagFilter.some((t) => h.tags.includes(t));
      if (tagMatches) {
        counts.all++;
        if (h.status === "upcoming") counts.upcoming++;
        if (h.status === "ongoing") counts.ongoing++;
        if (h.status === "ended") counts.ended++;
      }
    });
    return counts;
  }, [hackathons, tagFilter]);"""

content = content.replace(
    """  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    hackathons.forEach((h) => h.tags.forEach((t) => tags.add(t)));
    return [...tags].sort((a, b) => a.localeCompare(b, languageTag));
  }, [hackathons, languageTag]);""",
    status_counts_code
)

# 3. Update filteredHackathons
content = content.replace(
    'const tagMatches = tagFilter === "" || h.tags.includes(tagFilter);',
    'const tagMatches = tagFilter.length === 0 || tagFilter.some((t) => h.tags.includes(t));'
)

# 4. Update status buttons
status_btn_old = """                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatusFilter(option)}
                    className={cn(
                      "text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 font-medium",
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {label}
                  </button>"""

status_btn_new = """                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatusFilter(option)}
                    className={cn(
                      "flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 font-medium",
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <span>{label}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                      {statusCounts[option]}
                    </span>
                  </button>"""

content = content.replace(status_btn_old, status_btn_new)

# 5. Update tag buttons
tag_btns_old = """            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTagFilter("")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                  tagFilter === "" ? "bg-slate-800 text-white border-slate-800 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {listText?.filters?.allTags || "All tags"}
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                    tagFilter === tag ? "bg-slate-800 text-white border-slate-800 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>"""

tag_btns_new = """            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTagFilter([])}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                  tagFilter.length === 0 ? "bg-slate-800 text-white border-slate-800 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {listText?.filters?.allTags || "All tags"}
              </button>
              {availableTags.map((tag) => {
                const isSelected = tagFilter.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setTagFilter((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      );
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs transition-colors duration-200 border",
                      isSelected ? "bg-slate-800 text-white border-slate-800 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>"""

content = content.replace(tag_btns_old, tag_btns_new)

# 6. Update clear filters
content = content.replace(
    '{(statusFilter !== "all" || tagFilter !== "") && (',
    '{(statusFilter !== "all" || tagFilter.length > 0) && ('
)
content = content.replace(
    'onClick={() => { setStatusFilter("all"); setTagFilter(""); }}',
    'onClick={() => { setStatusFilter("all"); setTagFilter([]); }}'
)

with open("components/hackathons/HackathonList.tsx", "w") as f:
    f.write(content)

print("Done")
