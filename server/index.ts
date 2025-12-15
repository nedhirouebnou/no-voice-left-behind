import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const HRFLOW_BASE = "https://api.hrflow.ai/v1";

function hrflowHeaders() {
  const apiKey = process.env.HRFLOW_API_KEY;
  const userEmail = process.env.HRFLOW_USER_EMAIL;
  if (!apiKey || !userEmail)
    throw new Error("Missing HRFLOW_API_KEY or HRFLOW_USER_EMAIL");
  return {
    "X-API-KEY": apiKey,
    "X-USER-EMAIL": userEmail,
  };
}

/**
 * 1) List all profiles in the source (paginated)
 * GET /api/hrflow/profiles
 */
app.get("/api/hrflow/profiles", async (req, res) => {
  try {
    const sourceKey = process.env.HRFLOW_SOURCE_KEY;
    if (!sourceKey)
      return res.status(500).json({ error: "Missing HRFLOW_SOURCE_KEY" });

    let page = 1;
    const profiles = [];

    while (true) {
      const url = new URL(`${HRFLOW_BASE}/storing/profiles`);
      url.searchParams.set("source_keys", JSON.stringify([sourceKey]));
      url.searchParams.set("return_profile", "true");
      url.searchParams.set("limit", "5000");
      url.searchParams.set("page", String(page));

      const r = await fetch(url, { headers: hrflowHeaders() });
      const json = await r.json();

      if (!r.ok || Math.floor(json?.code / 100) !== 2) {
        return res
          .status(502)
          .json({
            error: json?.message ?? "HrFlow list profiles failed",
            raw: json,
          });
      }

      profiles.push(...(json.data ?? []));
      const maxPage = json?.meta?.maxPage ?? page;
      if (page >= maxPage) break;
      page += 1;
    }

    res.json({ profiles, count: profiles.length });
  } catch (e) {
    res.status(500).json({ error: String(e?.message ?? e) });
  }
});

/**
 * 2) Parse resume & store in source
 * POST /api/hrflow/parse (multipart: file)
 *
 * Reference rule: profile#(n+1) where n = current number of profiles in source.
 * (Simple approach: list profiles first; OK for your requirement but not concurrency-safe.)
 */
app.post("/api/hrflow/parse", upload.single("file"), async (req, res) => {
  try {
    const sourceKey = process.env.HRFLOW_SOURCE_KEY;
    if (!sourceKey)
      return res.status(500).json({ error: "Missing HRFLOW_SOURCE_KEY" });
    if (!req.file) return res.status(400).json({ error: "Missing file" });

    // 1) Get current count to build reference
    const listUrl = new URL(`${HRFLOW_BASE}/storing/profiles`);
    listUrl.searchParams.set("source_keys", JSON.stringify([sourceKey]));
    listUrl.searchParams.set("return_profile", "false"); // we only need count-ish; still paginated
    listUrl.searchParams.set("limit", "5000");
    listUrl.searchParams.set("page", "1");

    const listRes = await fetch(listUrl, { headers: hrflowHeaders() });
    const listJson = await listRes.json();
    if (!listRes.ok || Math.floor(listJson?.code / 100) !== 2) {
      return res
        .status(502)
        .json({
          error: listJson?.message ?? "HrFlow list failed",
          raw: listJson,
        });
    }
    const currentCount = listJson?.meta?.total ?? listJson?.data?.length ?? 0;
    const reference = `profile#${currentCount + 1}`;

    // 2) Forward multipart to HrFlow parsing endpoint
    const fd = new FormData();
    fd.append("source_key", sourceKey);
    fd.append("reference", reference);
    fd.append("sync_parsing", "1");
    fd.append(
      "file",
      new Blob([req.file.buffer], {
        type: req.file.mimetype || "application/octet-stream",
      }),
      req.file.originalname || "resume"
    );

    const parseRes = await fetch(`${HRFLOW_BASE}/profile/parsing/file`, {
      method: "POST",
      headers: hrflowHeaders(), // fetch will set the multipart boundary automatically
      body: fd,
    });

    const text = await parseRes.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!parseRes.ok) {
      return res
        .status(502)
        .json({ error: "HrFlow parsing failed", raw: json });
    }

    res.json({ reference, result: json });
  } catch (e) {
    res.status(500).json({ error: String(e?.message ?? e) });
  }
});

/**
 * 3) Get profile by reference
 * GET /api/hrflow/profile/:reference
 */
app.get("/api/hrflow/profile/:reference", async (req, res) => {
  try {
    const sourceKey = process.env.HRFLOW_SOURCE_KEY;
    if (!sourceKey)
      return res.status(500).json({ error: "Missing HRFLOW_SOURCE_KEY" });

    const url = new URL(`${HRFLOW_BASE}/indexing/profile`);
    url.searchParams.set("source_key", sourceKey);
    url.searchParams.set("reference", req.params.reference);

    const r = await fetch(url, { headers: hrflowHeaders(), cache: "no-store" });
    const json = await r.json();

    if (!r.ok)
      return res
        .status(502)
        .json({ error: "HrFlow get profile failed", raw: json });
    res.json(json);
  } catch (e) {
    res.status(500).json({ error: String(e?.message ?? e) });
  }
});

const port = process.env.PORT || 5174;
app.listen(port, () =>
  console.log(`API listening on http://localhost:${port}`)
);
