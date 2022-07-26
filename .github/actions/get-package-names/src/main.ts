import { App } from './services/app';
import { GitHubActionProvider } from './providers/github-action-provider.service';

const actionProvider = new GitHubActionProvider();
const app = new App(actionProvider);
app.main();
