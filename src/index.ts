export type Runtime = "node" | "python" | "go" | "java" | "dotnet" | "ruby" | "rust" | "other";

export interface ServiceManifest {
  id: string;
  runtime: Runtime;
  entrypoint: string;
  requiredEnv: readonly string[];
  capabilities: readonly string[];
}

const ID_RE = /^[A-Za-z0-9._-]{1,96}$/;
const TOKEN_RE = /^[A-Z][A-Z0-9_]{0,63}$/;
const CAP_RE = /^[a-z][a-z0-9.-]{0,63}$/;
const MAX_SERVICES = 1_000;

export class DeveloperCatalog {
  readonly #services = new Map<string, ServiceManifest>();

  register(input: ServiceManifest): ServiceManifest {
    if (!ID_RE.test(input.id)) throw new Error("invalid service id");
    const entrypoint = input.entrypoint.trim();
    if (entrypoint.length < 1 || entrypoint.length > 200 || entrypoint.includes("\0")) throw new Error("invalid entrypoint");
    if (input.requiredEnv.length > 32 || input.requiredEnv.some((key) => !TOKEN_RE.test(key))) throw new Error("invalid environment requirement");
    if (input.capabilities.length > 32 || input.capabilities.some((cap) => !CAP_RE.test(cap))) throw new Error("invalid capability");
    if (!this.#services.has(input.id) && this.#services.size >= MAX_SERVICES) throw new Error("catalog capacity exceeded");

    const normalized: ServiceManifest = Object.freeze({
      id: input.id,
      runtime: input.runtime,
      entrypoint,
      requiredEnv: Object.freeze([...new Set(input.requiredEnv)].sort()),
      capabilities: Object.freeze([...new Set(input.capabilities)].sort())
    });
    this.#services.set(input.id, normalized);
    return normalized;
  }

  get(id: string): ServiceManifest | undefined {
    return this.#services.get(id);
  }

  missingEnvironment(id: string, availableKeys: readonly string[]): string[] {
    const service = this.#services.get(id);
    if (!service) throw new Error("service not found");
    const available = new Set(availableKeys);
    return service.requiredEnv.filter((key) => !available.has(key));
  }

  byCapability(capability: string): ServiceManifest[] {
    if (!CAP_RE.test(capability)) throw new Error("invalid capability");
    return [...this.#services.values()]
      .filter((service) => service.capabilities.includes(capability))
      .sort((a, b) => a.id.localeCompare(b.id));
  }
}
