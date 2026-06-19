const statusPageSummaryURL = "https://status.genisys.com.au/api/v2/summary.json";
const statusPageURL = "https://status.genisys.com.au/";

const preferredComponentNames = [
  "Genisys Support Web Chat",
  "Genisys Phone Support",
  "Network Connectivity (Australia)",
  "Telephony",
  "GoSIP VoIP Services",
  "Genisys Teams Calling",
  "Hosted Infrastructure Services",
  "Backup as a Service (BaaS)",
  "Disaster Recovery as a Service (DRaaS)",
  "Desktop & Applications (DAaaS)",
];

const fallbackRows = preferredComponentNames.slice(0, 6).map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
  name,
  status: "unknown",
}));

type StatusPageComponent = {
  id?: string;
  name?: string;
  position?: number;
  status?: string;
};

type StatusPageSummary = {
  components?: StatusPageComponent[];
  incidents?: unknown[];
  page?: {
    updated_at?: string;
    url?: string;
  };
  scheduled_maintenances?: unknown[];
  status?: {
    description?: string;
    indicator?: string;
  };
};

function normaliseComponent(component: StatusPageComponent) {
  return {
    id: component.id || component.name || "status-component",
    name: component.name || "Status component",
    status: component.status || "unknown",
  };
}

function chooseComponents(components: StatusPageComponent[] = []) {
  const selected = preferredComponentNames
    .map((name) => components.find((component) => component.name === name))
    .filter((component): component is StatusPageComponent => Boolean(component));

  if (selected.length >= 6) {
    return selected.slice(0, 6).map(normaliseComponent);
  }

  const selectedIds = new Set(selected.map((component) => component.id));
  const remaining = components
    .filter((component) => component.name && !selectedIds.has(component.id))
    .sort((a, b) => Number(a.position || 0) - Number(b.position || 0));

  return [...selected, ...remaining].slice(0, 6).map(normaliseComponent);
}

function fallbackPayload() {
  return {
    incidents: 0,
    pageURL: statusPageURL,
    rows: fallbackRows,
    scheduledMaintenances: 0,
    source: "fallback",
    status: {
      description: "Status feed unavailable",
      indicator: "unknown",
    },
    updatedAt: null,
  };
}

export async function GET() {
  try {
    const response = await fetch(statusPageSummaryURL, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error(`Status feed returned ${response.status}`);
    }

    const data = (await response.json()) as StatusPageSummary;
    const rows = chooseComponents(data.components);

    return Response.json(
      {
        incidents: Array.isArray(data.incidents) ? data.incidents.length : 0,
        pageURL: data.page?.url || statusPageURL,
        rows: rows.length ? rows : fallbackRows,
        scheduledMaintenances: Array.isArray(data.scheduled_maintenances)
          ? data.scheduled_maintenances.length
          : 0,
        source: "live",
        status: {
          description: data.status?.description || "Status available",
          indicator: data.status?.indicator || "unknown",
        },
        updatedAt: data.page?.updated_at || null,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return Response.json(fallbackPayload(), {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }
}
