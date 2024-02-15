export const getServicePullRequestMessage = (
  serviceName: string | undefined,
  serviceLink: string | undefined
) => {
  return `
    If you're looking to bring in a new data model, tweak existing ones, handle APIs, or spice things up with Amplication plugins, just swing by the Amplication platform at [${serviceName}](${serviceLink}). Tell us what you need, and we'll handle all the coding magic for you.
    
    `;
};
