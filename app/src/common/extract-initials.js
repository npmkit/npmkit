export default function extractInitials(projectName) {
  // Use two letters for namespaced projects
  if (projectName.startsWith('@')) {
    const [namespace, name] = projectName.split('/');
    return namespace.charAt(1) + name.charAt(0);
  }
  // Use just first letter for regular names
  return projectName.charAt(0);
}
