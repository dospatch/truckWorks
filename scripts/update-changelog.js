const fs = require("fs");
const { execSync } = require("child_process");

function run(command) {
    return execSync(command, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"]
    }).trim();
}

function escapeMarkdown(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

let commits = [];

try {
    const lastTag = run("git describe --tags --abbrev=0 2>/dev/null");

    const log = run(
        `git log ${lastTag}..HEAD --pretty=format:%s%x09%h`
    );

    commits = log
        ? log.split("\n").map(line => {
            const [subject, hash] = line.split("\t");
            return { subject, hash };
        })
        : [];
} catch {
    try {
        const log = run(
            'git log -30 --pretty=format:%s%x09%h'
        );

        commits = log
            ? log.split("\n").map(line => {
                const [subject, hash] = line.split("\t");
                return { subject, hash };
            })
            : [];
    } catch {
        commits = [];
    }
}

const today = new Date().toISOString().slice(0, 10);

const added = [];
const fixed = [];
const changed = [];
const other = [];

for (const commit of commits) {
    const subject = commit.subject.trim();
    const lower = subject.toLowerCase();

    if (
        lower.startsWith("feat") ||
        lower.startsWith("add") ||
        lower.startsWith("create") ||
        lower.startsWith("new")
    ) {
        added.push(commit);
    } else if (
        lower.startsWith("fix") ||
        lower.startsWith("bug") ||
        lower.startsWith("repair")
    ) {
        fixed.push(commit);
    } else if (
        lower.startsWith("update") ||
        lower.startsWith("change") ||
        lower.startsWith("refactor") ||
        lower.startsWith("improve") ||
        lower.startsWith("remove")
    ) {
        changed.push(commit);
    } else {
        other.push(commit);
    }
}

function section(title, items) {
    if (!items.length) return "";

    return (
        `### ${title}\n\n` +
        items
            .map(item =>
                `- ${escapeMarkdown(item.subject)} (\`${item.hash}\`)`
            )
            .join("\n") +
        "\n\n"
    );
}

let body = "";

body += section("✨ Added", added);
body += section("🐛 Fixed", fixed);
body += section("🔧 Changed", changed);
body += section("📝 Other", other);

if (!body) {
    body = "- No new changes detected.\n\n";
}

const entry =
    `## ${today}\n\n` +
    body +
    "---\n\n";

const file = "CHANGELOG.md";

let existing = "";

if (fs.existsSync(file)) {
    existing = fs.readFileSync(file, "utf8");
}

if (!existing.trim()) {
    existing =
        "# 🚛 BC TruckWorks Changelog\n\n" +
        "All notable changes to BC TruckWorks are documented here.\n\n" +
        "---\n\n";
}

const headerEnd = existing.indexOf("---");

if (headerEnd !== -1) {
    const header = existing.slice(0, headerEnd + 3).trimEnd();
    const rest = existing.slice(headerEnd + 3).trimStart();

    const newContent =
        header +
        "\n\n" +
        entry +
        rest;

    fs.writeFileSync(file, newContent);
} else {
    fs.writeFileSync(
        file,
        existing.trimEnd() +
        "\n\n" +
        entry
    );
}

console.log(`✅ CHANGELOG.md updated for ${today}`);
