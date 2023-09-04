# ui-design-system

Amplication component library with storybook support.

## Generating a new story

Once a new component is added, run `nx g @nrwl/react:component-story ...` [usage](https://nx.dev/packages/react/generators/component-story) passing the component path and project. 
More info about how to work with Nx and storybook, such as how to auto-generate stories can be found at https://nx.dev/packages/storybook/documents/overview-react#auto-generate-stories

## Testing

For each component, there must be a story and an e2e test in `ui-design-system-e2e` to cover that the story render properly.