import { GitHubActionProvider } from './providers/github-action-provider.service';
import { App } from './services/app';
import { FsStorageProvider } from './providers/storage-provider.service';

const actionProvider = new GitHubActionProvider();
const storageProvider = new FsStorageProvider();
const app = new App(actionProvider, storageProvider);
app.main();
