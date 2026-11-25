const done = new Set<string>();
const listeners = new Set<() => void>();

export function markBaked(id: string) {
  done.add(id);
  for (const l of listeners) l();
}

export const bakedCount = () => done.size;

let layers = 0;

/** One layer finished baking (or was skipped); lets the loader show real progress. */
export function markLayer() {
  layers++;
  for (const l of listeners) l();
}

export const layerCount = () => layers;

export function onBake(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
