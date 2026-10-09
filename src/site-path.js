const base = import.meta.env.BASE_URL;

// Content routes stay independent of the deployment directory.
export function contentPath(pathname) {
  if (base !== '/' && pathname.startsWith(base)) return `/${pathname.slice(base.length)}`;
  return pathname;
}

export function sitePath(value) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return value;
  if (base === '/' || value.startsWith(base)) return value;
  return `${base}${value.slice(1)}`;
}

export function rehypeSitePaths() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.properties) {
        for (const key of ['href', 'src', 'poster']) {
          const value = node.properties[key];
          if (typeof value === 'string') node.properties[key] = sitePath(value);
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
